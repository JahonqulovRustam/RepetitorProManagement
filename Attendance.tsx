
import React, { useState, useEffect } from 'react';
import { Student, Group, AttendanceRecord } from '../types';

interface AttendanceProps {
  students: Student[];
  groups: Group[];
  onSave: (records: AttendanceRecord[]) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ students, groups, onSave }) => {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [marking, setMarking] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedGroup && groups.length > 0) {
      setSelectedGroup(groups[0].id);
    }
  }, [groups]);

  const groupStudents = students.filter(s => s.groupId === selectedGroup);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setMarking(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (groupStudents.length === 0) {
      alert("Tanlangan guruhda o'quvchilar mavjud emas.");
      return;
    }
    
    setLoading(true);
    const records: AttendanceRecord[] = groupStudents.map(s => ({
      id: `att-${Date.now()}-${s.id}`,
      studentId: s.id,
      groupId: selectedGroup,
      date,
      status: marking[s.id] || 'present'
    }));
    
    setTimeout(() => {
      onSave(records);
      setLoading(false);
      alert(`${date} sanasi uchun yo'qlama muvaffaqiyatli saqlandi!`);
      setMarking({});
    }, 600);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-wrap gap-8 items-center justify-between">
        <div className="flex gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Guruhni Tanlang</label>
            <select 
              value={selectedGroup} 
              onChange={e => { setSelectedGroup(e.target.value); setMarking({}); }}
              className="block w-64 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
            >
              {groups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.subject})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Dars Sanasi</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="block w-48 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            />
          </div>
        </div>
        <button 
          disabled={loading || groupStudents.length === 0}
          onClick={handleSave}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
          Yo'qlamani Saqlash
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">O'quvchi</th>
              <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Keldi</th>
              <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Kelmadi</th>
              <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Kechikdi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {groupStudents.map(student => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-10 py-6">
                  <p className="text-sm font-black text-slate-900">{student.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.phone}</p>
                </td>
                <td className="px-10 py-6 text-center">
                  <input 
                    type="radio" 
                    name={`status-${student.id}`} 
                    checked={(marking[student.id] || 'present') === 'present'}
                    onChange={() => handleStatusChange(student.id, 'present')}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer" 
                  />
                </td>
                <td className="px-10 py-6 text-center">
                  <input 
                    type="radio" 
                    name={`status-${student.id}`} 
                    checked={marking[student.id] === 'absent'}
                    onChange={() => handleStatusChange(student.id, 'absent')}
                    className="w-5 h-5 accent-rose-500 cursor-pointer" 
                  />
                </td>
                <td className="px-10 py-6 text-center">
                  <input 
                    type="radio" 
                    name={`status-${student.id}`} 
                    checked={marking[student.id] === 'late'}
                    onChange={() => handleStatusChange(student.id, 'late')}
                    className="w-5 h-5 accent-amber-500 cursor-pointer" 
                  />
                </td>
              </tr>
            ))}
            {groupStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-10 py-24 text-center text-slate-400 font-black uppercase text-xs tracking-[0.2em] italic">Bu guruhda o'quvchilar yo'q</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
