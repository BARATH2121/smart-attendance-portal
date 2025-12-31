import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, FileDown, Search, Eye, UserPlus } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TeacherDash({ user, onSignOut }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newStudent, setNewStudent] = useState({ roll: '', name: '' });

  // FETCH: Get all students and merge today's status from Supabase
  const fetchClassData = async () => {
    try {
      const { data: stdData, error: stdError } = await supabase.from('students').select('*');
      if (stdError) throw stdError;

      const today = new Date().toISOString().split('T')[0];
      const { data: logData, error: logError } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('date', today);
      if (logError) throw logError;

      const merged = stdData.map(s => {
        const log = logData?.find(l => l.student_roll === s.roll_no);
        return { ...s, today: log ? log.status : '-' };
      });

      setStudents(merged);
    } catch (error) {
      console.error("Error fetching class data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, []);

  // ADD STUDENT: Insert new student into database
  const addNewStudent = async () => {
    if (!newStudent.roll || !newStudent.name) return alert("Please fill both fields.");
    
    const { error } = await supabase
      .from('students')
      .insert([{ roll_no: newStudent.roll.toUpperCase(), name: newStudent.name.toUpperCase() }]);
    
    if (!error) {
      alert("Student added successfully!");
      setNewStudent({ roll: '', name: '' });
      fetchClassData(); // Refresh list
    } else {
      alert("Error: " + error.message);
    }
  };

  // STATS: Dynamic calculation for cards and chart
  const stats = useMemo(() => {
    const present = students.filter(s => s.today === 'Present').length;
    const absent = students.filter(s => s.today === 'Absent').length;
    const percentage = students.length ? Math.round((present / students.length) * 100) : 0;
    return { present, absent, percentage };
  }, [students]);

  // MARK: Update attendance record in Supabase
  const markAttendance = async (roll, status) => {
    const today = new Date().toISOString().split('T')[0];
    const newStatus = status === 'P' ? 'Present' : 'Absent';

    const { error } = await supabase
      .from('attendance_logs')
      .upsert({ 
        student_roll: roll, 
        status: newStatus,
        date: today 
      }, { onConflict: 'student_roll, date' });

    if (!error) {
      setStudents(prev => prev.map(s => 
        s.roll_no === roll ? { ...s, today: newStatus } : s
      ));
    }
  };

  const viewDocument = (roll_no) => {
    const { data } = supabase.storage.from('student-docs').getPublicUrl(`${roll_no}-certificate.pdf`);
    if (data?.publicUrl) window.open(data.publicUrl, '_blank');
  };

  const downloadCSV = () => {
    let csv = "Roll No,Name,Today Status\n";
    students.forEach(s => csv += `${s.roll_no},${s.name},${s.today}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const chartData = {
    labels: ['Present Today', 'Absent Today'],
    datasets: [{
      data: [stats.present, stats.absent],
      backgroundColor: ['#10b981', '#ef4444'],
      borderRadius: 12
    }]
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Class Data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Attendance</h1>
          <p className="text-slate-500 font-medium">{new Date().toDateString()}</p>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all shadow-sm">
          <LogOut size={20} /> Sign Out
        </button>
      </header>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatBox label="Present Today" value={stats.present} color="text-indigo-600" />
        <StatBox label="Absent Today" value={stats.absent} color="text-red-500" />
        <StatBox label="Class Percentage" value={`${stats.percentage}%`} color="text-emerald-500" />
      </div>

      {/* ADD NEW STUDENT SECTION */}
      <div className="bg-indigo-50 p-6 rounded-[24px] mb-8 border border-indigo-100">
        <h3 className="text-sm font-black text-indigo-700 uppercase mb-4 flex items-center gap-2">
          <UserPlus size={18} /> Register New Student
        </h3>
        <div className="flex flex-wrap gap-4">
          <input 
            placeholder="Roll No (e.g. 231CG099)" 
            className="flex-1 p-3 rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            onChange={(e) => setNewStudent({...newStudent, roll: e.target.value})}
            value={newStudent.roll}
          />
          <input 
            placeholder="Full Name" 
            className="flex-1 p-3 rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
            value={newStudent.name}
          />
          <button 
            onClick={addNewStudent}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Add to Roster
          </button>
        </div>
      </div>

      {/* Roster Table Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Name or Roll..." 
              className="pl-12 pr-6 py-3 border-2 border-slate-50 bg-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none w-72 transition-all font-medium"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
          <button onClick={downloadCSV} className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">
            <FileDown size={20} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Roll No</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Docs</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students
                .filter(s => s.name.toLowerCase().includes(searchTerm) || s.roll_no.includes(searchTerm.toUpperCase()))
                .map(s => (
                <tr key={s.roll_no} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-5 font-bold text-slate-700">{s.roll_no}</td>
                  <td className="p-5 text-slate-600 font-medium">{s.name}</td>
                  <td className="p-5 flex justify-center gap-3">
                    <button onClick={() => markAttendance(s.roll_no, 'P')} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all">P</button>
                    <button onClick={() => markAttendance(s.roll_no, 'A')} className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">A</button>
                  </td>
                  <td className="p-5">
                    <button onClick={() => viewDocument(s.roll_no)} className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                      <Eye size={18} /> View Docs
                    </button>
                  </td>
                  <td className="p-5">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${
                      s.today === 'Present' ? 'bg-emerald-100 text-emerald-700' : 
                      s.today === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {s.today}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
          Class Attendance Insights
        </h3>
        <div className="h-72">
          <Bar 
            data={chartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false, 
              plugins: { legend: { display: false } },
              scales: { 
                y: { beginAtZero: true, grid: { display: false }, ticks: { stepSize: 1, color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { weight: 'bold' } } }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100 text-center hover:scale-[1.02] transition-transform cursor-default">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{label}</h3>
      <p className={`text-5xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}
