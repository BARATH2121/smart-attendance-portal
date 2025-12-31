import { useState } from 'react'
import Login from './components/Login'
import TeacherDash from './components/TeacherDash'
import StudentDash from './components/StudentDash'
import AdminDash from './components/AdminDash' // Ensure you create this file next

function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData, role) => {
    setUser(userData); // Stores the user object (id, name, etc.)
    
    // Role-based routing logic
    if (userData.id === 'ADMIN001') {
      setView('admin');
    } else if (role === 'teacher') {
      setView('teacher');
    } else {
      setView('student');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Login Screen */}
      {view === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {/* Admin Dashboard: To manage Teachers */}
      {view === 'admin' && (
        <AdminDash user={user} onSignOut={handleSignOut} />
      )}

      {/* Teacher Dashboard: To manage Student Attendance & Roster */}
      {view === 'teacher' && (
        <TeacherDash user={user} onSignOut={handleSignOut} />
      )}

      {/* Student Dashboard: To view personal stats & upload docs */}
      {view === 'student' && (
        <StudentDash user={user} onSignOut={handleSignOut} />
      )}
    </div>
  )
}

export default App
