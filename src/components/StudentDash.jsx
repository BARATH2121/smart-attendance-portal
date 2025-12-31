import { useState } from 'react';
import { LogOut, Upload, FileCheck, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';

export default function StudentDash({ user, onSignOut }) {
  const [files, setFiles] = useState({ marksheet: null, certificate: null });
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpload = (type, file) => {
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file.name }));
      setUploadStatus(`Successfully uploaded: ${file.name}`);
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };
  // Inside StudentDash.jsx
const attendanceHistoryData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [{
    label: 'Attendance %',
    data: [85, 92, 88, 95],
    borderColor: '#4361ee',
    tension: 0.4,
    fill: true,
    backgroundColor: 'rgba(67, 97, 238, 0.1)'
  }]
};

// Add the Line chart to your UI:
<div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
    <TrendingUp size={24} className="text-indigo-600" /> Attendance Trends
  </h3>
  <div className="h-64">
    <Line data={attendanceHistoryData} options={{ responsive: true, maintainAspectRatio: false }} />
  </div>
</div>


  const chartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [{
      label: 'Marks %',
      data: [82, 90, 75, 88],
      backgroundColor: '#6366f1',
      borderRadius: 8
    }]
  };

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome, {user.name}</h1>
          <p className="text-slate-500">Roll No: {user.id}</p>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-all">
          <LogOut size={20} /> Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="My Attendance" value="92%" color="text-indigo-600" />
        <StatCard label="Present Days" value="25" color="text-emerald-500" />
        <StatCard label="Absent Days" value="2" color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Upload size={24} className="text-indigo-600" /> Academic Uploads
          </h3>
          
          <div className="space-y-6">
            <UploadField 
              label="Semester Marksheet" 
              onFileChange={(e) => handleUpload('marksheet', e.target.files[0])}
              isUploaded={!!files.marksheet}
            />
            <UploadField 
              label="Achievement Certificate" 
              onFileChange={(e) => handleUpload('certificate', e.target.files[0])}
              isUploaded={!!files.certificate}
            />
          </div>

          {uploadStatus && (
            <div className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium animate-pulse">
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-indigo-600" /> Academic Performance
          </h3>
          <div className="h-64">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100 text-center">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">{label}</h3>
      <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

function UploadField({ label, onFileChange, isUploaded }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-2">{label}</label>
      <div className="relative group">
        <input 
          type="file" 
          onChange={onFileChange}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
        />
        {isUploaded && <FileCheck className="absolute right-3 top-2 text-emerald-500" size={20} />}
      </div>
    </div>
  );
}
