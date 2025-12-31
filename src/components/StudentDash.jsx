import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, Upload, Eye, TrendingUp } from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function StudentDash({ user, onSignOut }) {
  const [studentData, setStudentData] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // FETCH: Get student's attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get student profile
        const { data: student } = await supabase
          .from('students')
          .select('*')
          .eq('roll_no', user.id)
          .single();

        if (student) setStudentData(student);

        // Get all attendance records for this student
        const { data: logs } = await supabase
          .from('attendance_logs')
          .select('*')
          .eq('student_roll', user.id)
          .order('date', { ascending: false });

        setAttendanceHistory(logs || []);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  // UPLOAD: Submit document to Supabase Storage
  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    setUploading(true);

    const { error } = await supabase.storage
      .from('student-docs')
      .upload(`${user.id}-certificate.pdf`, file, { upsert: true });

    if (!error) alert('Document uploaded successfully!');
    else alert('Upload failed: ' + error.message);
    setUploading(false);
    setFile(null);
  };

  // VIEW: Open uploaded document
  const viewDocument = () => {
    const { data } = supabase.storage.from('student-docs').getPublicUrl(`${user.id}-certificate.pdf`);
    if (data?.publicUrl) window.open(data.publicUrl, '_blank');
  };

  // CALCULATE: Stats for display
  const stats = {
    present: attendanceHistory.filter(a => a.status === 'Present').length,
    absent: attendanceHistory.filter(a => a.status === 'Absent').length,
    total: attendanceHistory.length,
    percentage: attendanceHistory.length ? Math.round((attendanceHistory.filter(a => a.status === 'Present').length / attendanceHistory.length) * 100) : 0,
  };

  if (loading) return <div className="flex items-center justify-center h-screen font-bold text-slate-500">Loading your dashboard...</div>;

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [stats.present, stats.absent],
      backgroundColor: ['#10b981', '#ef4444'],
      borderColor: ['#059669', '#dc2626'],
      borderWidth: 2,
    }],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Student Portal</h1>
          <p className="text-slate-500 font-medium">Roll No: {user.id}</p>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all">
          <LogOut size={20} /> Sign Out
        </button>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Classes" value={stats.total} color="text-blue-600" />
        <StatCard label="Present" value={stats.present} color="text-emerald-600" />
        <StatCard label="Absent" value={stats.absent} color="text-red-600" />
        <StatCard label="Attendance %" value={`${stats.percentage}%`} color="text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upload Documents */}
        <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <Upload className="text-indigo-600" size={20} /> Upload Documents
          </h2>
          <div className="space-y-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              className="w-full p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
            >
              {uploading ? 'Uploading...' : 'Upload Certificate'}
            </button>
            <button
              onClick={viewDocument}
              className="w-full bg-slate-100 text-slate-700 p-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Eye size={18} /> View Uploaded
            </button>
          </div>
        </div>

        {/* Right: Attendance Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pie Chart */}
          <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} /> Attendance Overview
            </h3>
            <div className="h-64">
              <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>

          {/* Recent Attendance Log */}
          <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Attendance</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {attendanceHistory.slice(0, 10).map((log) => (
                <div key={log.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">{log.date}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 text-center">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">{label}</h3>
      <p className={`text-4xl font-black ${color}`}>{value}</p>
    </div>
  );
}
