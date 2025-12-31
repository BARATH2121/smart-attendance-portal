import { useState } from 'react';
import { School } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Ensure this import is here

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(false);
    setLoading(true);

    try {
      // 1. CHECK TEACHERS TABLE (Includes Admin)
      const { data: teacher, error: tError } = await supabase
        .from('teachers')
        .select('*')
        .eq('employee_id', username)
        .single();

      if (teacher && password === 'admin123') {
        // If ID is ADMIN001, give Admin role, otherwise Teacher role
        const role = teacher.employee_id === 'ADMIN001' ? 'admin' : 'teacher';
        onLogin({ id: teacher.employee_id, name: teacher.name }, role);
        return;
      }

      // 2. CHECK STUDENTS TABLE
      const { data: student, error: sError } = await supabase
        .from('students')
        .select('*')
        .eq('roll_no', username)
        .single();

      if (student && password === 'pass123') {
        onLogin({ id: student.roll_no, name: student.name }, 'student');
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white/95 p-10 rounded-[28px] shadow-2xl w-full max-w-md text-center backdrop-blur-md animate-in fade-in zoom-in duration-500">
        <School className="mx-auto text-indigo-600 mb-6" size={64} />
        <h2 className="text-3xl font-black text-slate-800 mb-2">Portal Login</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">Smart Attendance & Academic Portal</p>
        
        <div className="text-left space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Employee ID / Roll Number</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
              placeholder="e.g. ADMIN001 or 231CG001"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full mt-10 bg-indigo-600 text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
        >
          {loading ? 'Verifying...' : 'Sign In to Portal'}
        </button>

        {error && (
          <div className="mt-6 p-3 bg-red-50 rounded-xl border border-red-100 animate-bounce">
            <p className="text-red-500 text-sm font-bold">❌ Invalid Credentials</p>
          </div>
        )}

        <p className="mt-8 text-slate-400 text-xs font-medium">
          Default Passwords: <span className="text-slate-500">admin123</span> (Staff) | <span className="text-slate-500">pass123</span> (Students)
        </p>
      </div>
    </div>
  );
}
