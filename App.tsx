
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Groups from './pages/Groups';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';
import Materials from './pages/Materials';
import AIAssistant from './pages/AIAssistant';
import Teachers from './pages/Teachers';
import Support from './pages/Support';
import AssignmentsPage from './pages/Assignments';
import Login from './pages/Login';
import { Teacher, Student, Group, AttendanceRecord, Payment, Assignment, Material, AppNotification } from './types';
import { supabase } from './services/supabase';

import { DUMMY_GROUPS, DUMMY_STUDENTS, DUMMY_PAYMENTS } from './constants';

const Sidebar = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const location = useLocation();
  const role = user.role;

  const menuItems = [
    { name: 'Xulosa', path: '/', icon: 'fa-chart-pie', roles: ['superadmin', 'teacher', 'student'] },
    { name: 'Ustozlar', path: '/teachers', icon: 'fa-user-tie', roles: ['superadmin'] },
    { name: 'Guruhlar', path: '/groups', icon: 'fa-users-rectangle', roles: ['teacher'] },
    { name: 'O\'quvchilar', path: '/students', icon: 'fa-user-graduate', roles: ['teacher'] },
    { name: 'To\'lovlar', path: '/payments', icon: 'fa-money-bill-transfer', roles: ['teacher', 'student'] },
    { name: 'Vazifalar', path: '/assignments', icon: 'fa-tasks', roles: ['teacher', 'student'] },
    { name: 'Yo\'qlama', path: '/attendance', icon: 'fa-calendar-check', roles: ['teacher'] },
    { name: 'Resurslar', path: '/materials', icon: 'fa-folder-open', roles: ['teacher', 'student'] },
    { name: 'AI Yordamchi', path: '/ai', icon: 'fa-wand-magic-sparkles', roles: ['teacher'] },
    { name: 'Ma\'lumot', path: '/support', icon: 'fa-circle-info', roles: ['superadmin', 'teacher', 'student'] },
  ];

  return (
    <aside className="w-72 bg-[#020617] text-slate-300 min-h-screen fixed left-0 top-0 z-50 flex flex-col border-r border-slate-800/40">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-rocket text-white"></i>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">Repetitor<span className="text-indigo-500">Pro</span></h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Boshqaruv v3.6</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.filter(item => item.roles.includes(role)).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${location.pathname === item.path
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner'
              : 'hover:bg-white/5 text-slate-400 hover:text-slate-100'
              }`}
          >
            <i className={`fas ${item.icon} w-5 text-center transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'text-indigo-500' : ''}`}></i>
            <span className="font-bold text-sm tracking-tight">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-900/50 rounded-3xl p-5 border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-xs uppercase">
              {user.name[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full py-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <i className="fas fa-power-off"></i> Chiqish
          </button>
        </div>
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('rp_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('rp_teachers');
    return saved ? JSON.parse(saved) : [];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('rp_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('rp_groups');
    return saved ? JSON.parse(saved) : [];
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('rp_assignments');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('rp_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('rp_materials');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      console.log('Fetching data from Supabase...');
      try {
        const results = await Promise.all([
          supabase.from('students').select('*'),
          supabase.from('teachers').select('*'),
          supabase.from('groups').select('*'),
          supabase.from('assignments').select('*'),
          supabase.from('payments').select('*'),
          supabase.from('materials').select('*'),
          supabase.from('notifications').select('*')
        ]);

        const errors = results.filter(r => r.error).map(r => r.error?.message);
        if (errors.length > 0) {
          console.error('Supabase fetch errors:', errors);
          setFetchError(`Ba'zi jadvallarni yuklashda xatolik: ${errors[0]}. Jadvallar yaratilganini tekshiring.`);
        }

        const [st, tc, gr, as, py, mt, nt] = results;

        if (st.data) setStudents(st.data as Student[]);
        if (tc.data) setTeachers(tc.data as Teacher[]);
        if (gr.data) setGroups(gr.data as Group[]);
        if (as.data) setAssignments(as.data as Assignment[]);
        if (py.data) setPayments(py.data as Payment[]);
        if (mt.data) setMaterials(mt.data as Material[]);
        if (nt.data) setNotifications(nt.data as AppNotification[]);

        console.log('Data fetch complete successfully');
      } catch (err: any) {
        console.error('Critical fetching error:', err);
        setFetchError(`Kritik xatolik: ${err.message || 'Supabase bilan bog\'lanib bo\'lmadi'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync auth user separately
  useEffect(() => {
    localStorage.setItem('rp_auth_user', JSON.stringify(user));
  }, [user]);

  const filteredGroups = useMemo(() => {
    if (user?.role === 'superadmin') return groups;
    if (user?.role === 'teacher') return groups.filter(g => g.teacherId === user.id);
    if (user?.role === 'student') {
      const student = students.find(s => s.id === user.id);
      return groups.filter(g => g.id === student?.groupId);
    }
    return [];
  }, [groups, user, students]);

  const filteredStudents = useMemo(() => {
    if (user?.role === 'superadmin') return students;
    if (user?.role === 'teacher') {
      const myGroupIds = filteredGroups.map(g => g.id);
      return students.filter(s => myGroupIds.includes(s.groupId));
    }
    if (user?.role === 'student') return students.filter(s => s.id === user.id);
    return [];
  }, [students, user, filteredGroups]);

  const filteredPayments = useMemo(() => {
    if (user?.role === 'superadmin') return payments;
    const myStudentIds = filteredStudents.map(s => s.id);
    return payments.filter(p => myStudentIds.includes(p.studentId));
  }, [payments, user, filteredStudents]);

  const filteredMaterials = useMemo(() => {
    if (user?.role === 'superadmin') return materials;
    if (user?.role === 'teacher') return materials.filter(m => m.teacherId === user.id);
    if (user?.role === 'student') {
      const student = students.find(s => s.id === user.id);
      return materials.filter(m => m.groupId === student?.groupId);
    }
    return [];
  }, [materials, user, students]);

  const handleLogin = (credentials: { username: string, password: string }) => {
    // ... same logic ...
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const admin = { id: 'admin-id', name: 'Super Admin', role: 'superadmin' };
      setUser(admin);
      localStorage.setItem('rp_auth_user', JSON.stringify(admin));
      return true;
    }
    const foundTeacher = teachers.find(t => t.username === credentials.username && t.password === credentials.password);
    if (foundTeacher) {
      const teacherUser = { id: foundTeacher.id, name: foundTeacher.name, role: 'teacher' };
      setUser(teacherUser);
      localStorage.setItem('rp_auth_user', JSON.stringify(teacherUser));
      return true;
    }
    const foundStudent = students.find(s => s.username === credentials.username && s.password === credentials.password);
    if (foundStudent) {
      const studentUser = { id: foundStudent.id, name: foundStudent.name, role: 'student' };
      setUser(studentUser);
      localStorage.setItem('rp_auth_user', JSON.stringify(studentUser));
      return true;
    }
    return false;
  };

  const handleDeleteStudent = async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (!error) setStudents(prev => prev.filter(s => s.id !== id));
    else alert("O'chirishda xatolik yuz berdi");
  };

  const handleDeleteAssignment = async (id: string) => {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (!error) setAssignments(prev => prev.filter(a => a.id !== id));
    else alert("O'chirishda xatolik yuz berdi");
  };

  const handleDeletePayment = async (id: string) => {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (!error) setPayments(prev => prev.filter(p => p.id !== id));
    else alert("O'chirishda xatolik yuz berdi");
  };

  const handleNotify = async (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      date: new Date().toISOString(),
      read: false
    };
    const { error } = await supabase.from('notifications').insert([newNotif]);
    if (!error) setNotifications(prev => [newNotif, ...prev]);
  };

  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return <Login onLogin={handleLogin} />;

  if (loading || fetchError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-8 max-w-md">
          {fetchError ? (
            <>
              <div className="w-20 h-20 bg-rose-500/10 rounded-[32px] flex items-center justify-center border border-rose-500/20 mb-2">
                <i className="fas fa-exclamation-triangle text-3xl text-rose-500"></i>
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight mb-3">Ulanishda Xatolik</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{fetchError}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-slate-950 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5"
              >
                Qayta urinish
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Ma'lumotlar yuklanmoqda...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
        <Sidebar user={user} onLogout={() => { setUser(null); localStorage.removeItem('rp_auth_user'); }} />
        <div className="flex-1 ml-72 flex flex-col">
          <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 px-10 flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{user.role} Paneli</span>
            <div className="flex items-center gap-6">
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all relative"
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full text-[8px] font-black text-white flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h4 className="font-black text-xs uppercase tracking-widest text-slate-900">Bildirishnomalar</h4>
                      <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} className="text-[9px] font-black text-indigo-600 uppercase">Hammasini o'qish</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 && (
                        <div className="p-10 text-center">
                          <i className="fas fa-bell-slash text-slate-200 text-2xl mb-2"></i>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Yangi xabarlar yo'q</p>
                        </div>
                      )}
                      {notifications.map(n => (
                        <div key={n.id} className={`p-5 border-b border-slate-50 transition-colors hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-indigo-50/30' : ''}`} onClick={() => setNotifications(prev => prev.map(old => old.id === n.id ? { ...old, read: true } : old))}>
                          <div className="flex gap-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'assignment_submission' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              <i className={`fas ${n.type === 'assignment_submission' ? 'fa-file-alt' : 'fa-receipt'} text-xs`}></i>
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 leading-tight">{n.title}</p>
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 font-medium">{n.message}</p>
                              <p className="text-[8px] text-slate-400 mt-2 font-bold uppercase">{n.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="h-8 w-[1px] bg-slate-100"></div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-900">{user.name}</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{new Date().toLocaleDateString('uz-UZ')}</p>
              </div>
            </div>
          </header>
          <main className="p-10 max-w-[1400px]">
            <Routes>
              <Route path="/" element={<Dashboard user={user} teachersCount={teachers.length} studentsCount={filteredStudents.length} groupsCount={filteredGroups.length} payments={filteredPayments} allStudents={students} assignments={assignments} />} />
              <Route path="/teachers" element={user.role === 'superadmin' ? <Teachers teachers={teachers} onAdd={async (t) => {
                const { error } = await supabase.from('teachers').insert([t]);
                if (!error) setTeachers(prev => [...prev, t]);
                else alert("Xatolik yuz berdi");
              }} onUpdate={async (t) => {
                const { error } = await supabase.from('teachers').update(t).eq('id', t.id);
                if (!error) setTeachers(prev => prev.map(old => old.id === t.id ? t : old));
                else alert("Xatolik yuz berdi");
              }} onDelete={async (id) => {
                const { error } = await supabase.from('teachers').delete().eq('id', id);
                if (!error) setTeachers(prev => prev.filter(t => t.id !== id));
                else alert("Xatolik yuz berdi");
              }} /> : <Navigate to="/" />} />

              <Route path="/students" element={user.role === 'teacher' ? <Students students={filteredStudents.filter(s => s.status !== 'deleted')} onDelete={handleDeleteStudent} onUpdate={async (s) => {
                const { error } = await supabase.from('students').update(s).eq('id', s.id);
                if (!error) setStudents(prev => prev.map(old => old.id === s.id ? s : old));
                else alert("Xatolik yuz berdi");
              }} onAdd={async (s) => {
                const { error } = await supabase.from('students').insert([s]);
                if (!error) setStudents(prev => [...prev, s]);
                else alert("Xatolik yuz berdi");
              }} groups={filteredGroups} /> : <Navigate to="/" />} />

              <Route path="/groups" element={<Groups groups={filteredGroups} onAdd={async (g) => {
                const { error } = await supabase.from('groups').insert([g]);
                if (!error) setGroups(prev => [...prev, g]);
                else alert("Xatolik yuz berdi");
              }} onUpdate={async (g) => {
                const { error } = await supabase.from('groups').update(g).eq('id', g.id);
                if (!error) setGroups(prev => prev.map(old => old.id === g.id ? g : old));
                else alert("Xatolik yuz berdi");
              }} onDelete={async (id) => {
                const { error } = await supabase.from('groups').delete().eq('id', id);
                if (!error) setGroups(prev => prev.filter(g => g.id !== id));
                else alert("Xatolik yuz berdi");
              }} role={user.role} teachers={teachers} />} />
              <Route path="/payments" element={<Payments students={filteredStudents} payments={filteredPayments} onAddPayment={async (p) => {
                const { error } = await supabase.from('payments').insert([p]);
                if (error) {
                  alert("To'lovni saqlashda xatolik yuz berdi");
                  return;
                }
                setPayments(prev => [p, ...prev]);
                // Update student balance in DB as well
                const student = students.find(s => s.id === p.studentId);
                if (student) {
                  const newBalance = student.balance + p.amount;
                  await supabase.from('students').update({ balance: newBalance }).eq('id', p.studentId);
                  setStudents(prev => prev.map(s => s.id === p.studentId ? { ...s, balance: newBalance } : s));
                }
                handleNotify({
                  type: 'payment_received',
                  title: 'Yangi To\'lov',
                  message: `${p.studentName} dan ${p.amount.toLocaleString()} UZS qabul qilindi.`,
                });
              }} onDeletePayment={handleDeletePayment} role={user.role} />} />

              <Route path="/assignments" element={<AssignmentsPage role={user.role} user={user} assignments={assignments} onAdd={async (a) => {
                const { error } = await supabase.from('assignments').insert([a]);
                if (!error) setAssignments(prev => [a, ...prev]);
                else alert("Xatolik yuz berdi");
              }} onUpdate={async (a) => {
                const { error } = await supabase.from('assignments').update(a).eq('id', a.id);
                if (!error) setAssignments(prev => prev.map(old => old.id === a.id ? a : old));
                else alert("Xatolik yuz berdi");
              }} onDeleteAssignment={handleDeleteAssignment} groups={filteredGroups} onNotify={handleNotify} />} />
              <Route path="/attendance" element={<Attendance students={filteredStudents} groups={filteredGroups} onSave={async (records) => {
                const { error } = await supabase.from('attendance').insert(records);
                if (error) alert("Yo'qlamani saqlashda xatolik yuz berdi");
              }} />} />
              <Route path="/materials" element={<Materials role={user.role} userId={user.id} materials={filteredMaterials} groups={filteredGroups} onAdd={async (m) => {
                const { error } = await supabase.from('materials').insert([m]);
                if (!error) setMaterials(prev => [...prev, m]);
                else alert("Xatolik yuz berdi");
              }} onDelete={async (id) => {
                const { error } = await supabase.from('materials').delete().eq('id', id);
                if (!error) setMaterials(prev => prev.filter(m => m.id !== id));
                else alert("Xatolik yuz berdi");
              }} />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/support" element={<Support user={user} teachers={teachers} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
