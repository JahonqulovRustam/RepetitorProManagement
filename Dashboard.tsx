
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Payment, Student, Assignment } from '../types';

interface DashboardProps {
  user: any;
  teachersCount: number;
  studentsCount: number;
  groupsCount: number;
  payments: Payment[];
  allStudents: Student[];
  assignments: Assignment[];
}

const StatCard = ({ title, value, icon, color, subtitle }: any) => (
  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-2">{subtitle}</p>
      </div>
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-xl text-white`}>
        <i className={`fas ${icon}`}></i>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, teachersCount, studentsCount, groupsCount, payments, allStudents, assignments }) => {
  const isAdmin = user.role === 'superadmin';
  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';

  const myStudent = allStudents.find(s => s.id === user.id);
  const myUpcomingAssignments = assignments.filter(a => a.groupId === myStudent?.groupId).slice(0, 3);

  if (isStudent) {
    return (
      <div className="space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Salom, {user.name}!</h2>
            <p className="text-slate-500 font-medium mt-1">O'quv jarayoni va darslaringiz holati.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Balans" value={`${myStudent?.balance.toLocaleString()} UZS`} icon="fa-wallet" color="bg-indigo-600" subtitle="To'lov holati" />
          <StatCard title="Guruh" value={groupsCount} icon="fa-users" color="bg-emerald-600" subtitle="Faol darslarim" />
          <StatCard title="Vazifalar" value={myUpcomingAssignments.length} icon="fa-tasks" color="bg-amber-600" subtitle="Topshirilishi kerak" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <i className="fas fa-clock text-amber-500"></i> Yaqinlashayotgan Vazifalar
            </h3>
            <div className="space-y-4">
              {myUpcomingAssignments.map(a => (
                <div key={a.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-xl transition-all">
                  <div>
                    <h4 className="font-black text-slate-900">{a.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Muddati: {a.deadline}</p>
                  </div>
                  <i className="fas fa-chevron-right text-slate-300 group-hover:translate-x-1 transition-transform"></i>
                </div>
              ))}
              {myUpcomingAssignments.length === 0 && <p className="text-center py-10 text-slate-400 font-medium uppercase text-xs">Hozircha vazifalar yo'q</p>}
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black mb-8">To'lovlar Tarixi</h3>
            <div className="space-y-6">
              {payments.map((p, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/5">
                      <i className="fas fa-check text-xs"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{p.month} oyi uchun</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black">{p.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-emerald-400">+{p.amount.toLocaleString()}</p>
                </div>
              ))}
              {payments.length === 0 && <p className="text-center py-10 text-slate-600 font-bold uppercase text-xs">To'lovlar topilmadi</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalTushum = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalQarz = allStudents.reduce((acc, s) => s.balance < 0 ? acc + Math.abs(s.balance) : acc, 0);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{isAdmin ? "Global Analitika" : "O'qituvchi Paneli"}</h2>
          <p className="text-slate-500 font-medium mt-1">Tizimdagi barcha moliyaviy va akademik ko'rsatkichlar.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="O'quvchilar" value={studentsCount} icon="fa-user-graduate" color="bg-indigo-600" subtitle="Jami kontingent" />
        <StatCard title="Guruhlar" value={groupsCount} icon="fa-layer-group" color="bg-emerald-600" subtitle="Faol kurslar" />
        <StatCard title="Tushumlar" value={`${totalTushum.toLocaleString()} UZS`} icon="fa-sack-dollar" color="bg-emerald-600" subtitle="Jami tushum" />
        <StatCard title="Qarzlar" value={`${totalQarz.toLocaleString()} UZS`} icon="fa-hand-holding-dollar" color="bg-rose-600" subtitle="Kutilayotgan" />
      </div>
    </div>
  );

};

export default Dashboard;
