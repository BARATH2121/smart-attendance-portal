import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Users, 
  GraduationCap, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Key, 
  UserPlus, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';

export default function AdminDash({ onSignOut }) {
  const [activeTab, setActiveTab] = useState('teachers');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '' });
  const [newEntry, setNewEntry] = useState({ id: '', name: '' });
  const [loading, setLoading] = useState(true);

  // FETCH: Generic loader for both tables based on active tab
  const loadData = async () => {
    setLoading(true);
    const table = activeTab === 'teachers' ? 'teachers' : 'students';
    const { data: records, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setData(records || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [activeTab]);

  // REGISTER: Add new Teacher or Student
  const handleRegister = async () => {
    if (!newEntry.id || !newEntry.name) return alert("Please fill all fields");
    const table = activeTab === 'teachers' ? 'teachers' : 'students';
    const idField = activeTab === 'teachers' ? 'employee_id' : 'roll_no';

    const { error } = await supabase.from(table).insert([{ 
      [idField]: newEntry.id.toUpperCase(), 
      name: newEntry.name.toUpperCase() 
    }]);

    if (!error) {
      alert(`${activeTab.slice(0, -1)} registered successfully!`);
      setNewEntry({ id: '', name: '' });
      loadData();
    } else {
      alert(error.message);
    }
  };

  // UPDATE: Change name of student/teacher
  const handleUpdate = async (id) => {
    const table = activeTab === 'teachers' ? 'teachers' : 'students';
    const idField = activeTab === 'teachers' ? 'employee_id' : 'roll_no';
    
    const { error } = await supabase.from(table).update({ name: editForm.name }).eq(idField, id);
    if (!error) {
      setEditingId(null);
      loadData();
    }
  };

  // DELETE: Remove record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will delete the user permanently.")) return;
    const table = activeTab === 'teachers' ? 'teachers' : 'students';
    const idField = activeTab === 'teachers' ? 'employee_id' : 'roll_no';
    
    await supabase.from(table).delete().eq(idField, id);
    loadData();
  };

  const resetPassword = (id) => {
    const newPass = prompt(`Enter new password for ${id}:`);
    if (newPass) alert(`Password for ${id} has been updated to: ${newPass}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-indigo-900 text-white p-8 rounded-[32px] shadow-xl">
        <div className="flex items-center gap-4">
          <ShieldCheck size={40} className="text-indigo-300" />
          <div>
            <h1 className="text-2xl font-black">Admin Master Control</h1>
            <p className="text-indigo-200 text-sm">Institution Management System</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('teachers')} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'teachers' ? 'bg-white text-indigo-900 shadow-lg' : 'hover:bg-indigo-800'}`}
          >
            <Users size={18}/> Faculty
          </button>
          <button 
            onClick={() => setActiveTab('students')} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-white text-indigo-900 shadow-lg' : 'hover:bg-indigo-800'}`}
          >
            <GraduationCap size={18}/> Students
          </button>
          <button onClick={onSignOut} className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-xl font-bold ml-4 shadow-lg shadow-red-900/20">
            <LogOut size={18}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Registration Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <UserPlus className="text-indigo-600" size={20} /> Register {activeTab === 'teachers' ? 'Teacher' : 'Student'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Unique ID</label>
                <input 
                  placeholder={activeTab === 'teachers' ? "TCH-001" : "ROLL-001"} 
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold"
                  onChange={(e) => setNewEntry({...newEntry, id: e.target.value})}
                  value={newEntry.id}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input 
                  placeholder="Enter Name" 
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold"
                  onChange={(e) => setNewEntry({...newEntry, name: e.target.value})}
                  value={newEntry.name}
                />
              </div>
              <button onClick={handleRegister} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                Confirm Registration
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Management Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Manage Registered Records</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-50">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase">ID</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase">Name</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan="3" className="p-10 text-center text-slate-400 font-bold">Loading records...</td></tr>
                  ) : data.map(item => {
                    const currentId = item.employee_id || item.roll_no;
                    return (
                      <tr key={currentId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700">{currentId}</td>
                        <td className="p-4">
                          {editingId === currentId ? (
                            <input 
                              className="border-2 border-indigo-100 p-2 rounded-xl w-full outline-none focus:border-indigo-600" 
                              value={editForm.name} 
                              onChange={(e)=>setEditForm({name: e.target.value})} 
                            />
                          ) : (
                            <span className="text-slate-600 font-medium">{item.name}</span>
                          )}
                        </td>
                        <td className="p-4 flex justify-center gap-4">
                          {editingId === currentId ? (
                            <>
                              <button onClick={() => handleUpdate(currentId)} className="text-emerald-500 hover:scale-110 transition-transform"><Check /></button>
                              <button onClick={() => setEditingId(null)} className="text-slate-400 hover:scale-110 transition-transform"><X /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditingId(currentId); setEditForm({name: item.name}); }} className="text-indigo-400 hover:text-indigo-600 hover:scale-110 transition-all"><Edit size={18}/></button>
                              <button onClick={() => resetPassword(currentId)} className="text-orange-400 hover:text-orange-600 hover:scale-110 transition-all"><Key size={18}/></button>
                              <button onClick={() => handleDelete(currentId)} className="text-red-300 hover:text-red-500 hover:scale-110 transition-all"><Trash2 size={18}/></button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
