import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, Upload, FileCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function StudentDash({ user, onSignOut }) {
  const [files, setFiles] = useState({ marksheet: null, certificate: null });
  const [uploadStatus, setUploadStatus] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // FETCH: Get student data from Supabase
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

        // Get attendance history
        const { data: logs } = await supabase
          .from('attendance_logs')
          .select('*')
          .eq('student_roll', user.id)
          .order('date', { ascending: false });

        setAttendanceHistory(logs || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  // UPLOAD: Actually upload file to Supabase Storage
  const handleUpload = async (type, file) => {
    if (!file) return alert('Please select a file');
    
    setUploading(true);
    setUploadStatus('');

    try {
      // Create file name based on student roll and file type
      const fileName = type === 'marksheet' 
        ? `${user.id}-marksheet.pdf` 
        : `${user.id}-certificate.pdf`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('student-docs')
        .upload(fileName, file, { upsert: true });

      if (error) {
        setUploadStatus(`❌ Upload failed: ${error.message}`);
      } else {
        setFiles(prev => ({ ...prev, [type]: file.name }));
        setUploadStatus(`✓ Successfully uploaded: ${file.name}`);
        setTimeout(() => setUploadStatus(''), 3000);
      }
    } catch (error) {
      setUploadStatus(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Calculate attendance stats
  const stats = {
    present: attendanceHistory.filter(a => a.status === 'Present').length,
    absent: attendanceHistory.filter(a => a.status === 'Absent').length,
    total: attendanceHistory.length,
    percentage: attendanceHistory.length ? Math.round((attendanceHistory.filter(a => a.status === 'Present').length / attendanceHistory.length) * 100) : 0,
  };

  // Attendance Trends Chart Data
  const attendanceTrendsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Attendance %',
      data: [85, 92, 88, 95],
      borderColor: '#4361ee',
      backgroundColor: 'rgba(67, 97, 238, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#4361ee',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6
    }]
  };

  // Performance Chart Data
  const performanceData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [{
      label: 'Marks %',
      data: [82, 90, 75, 88],
      backgroundColor: '#6366f1',
      borderRadius: 8,
      borderSkipped: false
    }]
  };

  if (loading) return <div className="flex items-center justify-center h-screen font-bold text-slate-500">Loading your dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Welcome, {user.name || 'Student'}</h1>
          <p className="text-slate-500 font-medium">Roll No: {user.id}</p>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all">
          <LogOut size={20} /> Sign Out
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="My Attendance" value={`${stats.percentage}%`} color="text-indigo-600" />
        <StatCard label="Total Classes" value={stats.total} color="text-blue-600" />
        <StatCard label="Present Days" value={stats.present} color="text-emerald-500" />
        <StatCard label="Absent Days" value={stats.absent} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Upload Section */}
        <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Upload size={24} className="text-indigo-600" /> Upload Academic Documents
          </h3>
          
          <div className="space-y-6">
            <UploadField 
              label="Semester Marksheet" 
              onFileChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload('marksheet', file);
              }}
              isUploaded={!!files.marksheet}
              isLoading={uploading}
            />
            <UploadField 
              label="Achievement Certificate" 
              onFileChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload('certificate', file);
              }}
              isUploaded={!!files.certificate}
              isLoading={uploading}
            />
          </div>

          {uploadStatus && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-medium border animate-pulse ${
              uploadStatus.includes('✓') 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-indigo-600" /> Academic Performance
          </h3>
          <div className="h-64">
            <Bar 
              data={performanceData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { display: false } } }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Attendance Trends Chart */}
      <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp size={24} className="text-indigo-600" /> Attendance Trends
        </h3>
        <div className="h-64">
          <Line 
            data={attendanceTrendsData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: true, position: 'top' } },
              scales: { y: { beginAtZero: true, max: 100 } }
            }} 
          />
        </div>
      </div>

      {/* Recent Attendance Log */}
      <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Attendance Records</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {attendanceHistory.slice(0, 15).map((log) => (
            <div key={log.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-600">{log.date}</span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight ${
                log.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 text-center hover:scale-105 transition-transform cursor-default">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</h3>
      <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

function UploadField({ label, onFileChange, isUploaded, isLoading }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-2">{label}</label>
      <div className="relative group">
        <input 
          type="file" 
          onChange={onFileChange}
          disabled={isLoading}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer disabled:opacity-50"
        />
        {isUploaded && <FileCheck className="absolute right-3 top-2 text-emerald-500" size={20} />}
      </div>
    </div>
  );
}
