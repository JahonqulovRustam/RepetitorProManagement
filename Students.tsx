
import React, { useState, useMemo } from 'react';
import { Student, Group } from '../types';

interface StudentsProps {
  students: Student[];
  onDelete: (id: string) => void;
  onUpdate: (student: Student) => void;
  onAdd: (student: Student) => void;
  groups: Group[];
}

const Students: React.FC<StudentsProps> = ({ students, onDelete, onUpdate, onAdd, groups }) => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    groupId: groups[0]?.id || '',
    username: '',
    password: ''
  });

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.phone.includes(search) ||
      (s.username && s.username.toLowerCase().includes(search.toLowerCase()))
    );
  }, [students, search]);

  const resetForm = () => {
    setFormData({ 
      name: '', 
      phone: '', 
      groupId: groups[0]?.id || '',
      username: '',
      password: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingId(s.id);
    setFormData({ 
      name: s.name, 
      phone: s.phone, 
      groupId: s.groupId,
      username: s.username || '',
      password: s.password || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Agar login kiritilmagan bo'lsa ismidan avtomatik yaratish
    const finalUsername = formData.username || formData.name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000);
    const finalPassword = formData.password || '123456'; // Default parol

    if (editingId) {
      const existing = students.find(s => s.id === editingId);
      if (existing) {
        onUpdate({ 
          ...existing, 
          ...formData, 
          username: finalUsername, 
          password: finalPassword 
        });
      }
    } else {
      onAdd({
        ...formData,
        id: 's' + Date.now(),
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'active',
        balance: 0,
        username: finalUsername,
        password: finalPassword
      });
    }
    resetForm();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">O'quvchilar Ro'yxati</h2>
          <p className="text-slate-500 font-medium">O'quvchilar ma'lumotlari va kirish akkauntlari.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3"
        >
          <i className="fas fa-plus-circle text-lg"></i> Yangi O'quvchi Qo'shish
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
           <div className="relative max-w-md">
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Ism, telefon yoki login orqali qidirish..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">O'quvchi</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Akkaunt (Login/Parol)</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guruh</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balans</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="px-10 py-6">
                    <div>
                      <p className="text-sm font-black text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.phone}</p>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 px-3 py-1 rounded-lg">
                        <p className="text-[9px] text-slate-400 font-black uppercase leading-none mb-1">Login</p>
                        <p className="text-xs font-black text-slate-700">{s.username}</p>
                      </div>
                      <div className="bg-indigo-50 px-3 py-1 rounded-lg">
                        <p className="text-[9px] text-indigo-300 font-black uppercase leading-none mb-1">Parol</p>
                        <p className="text-xs font-black text-indigo-600">{s.password}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                      {groups.find(g => g.id === s.groupId)?.name || 'Noma\'lum'}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <p className={`text-sm font-black ${s.balance < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {s.balance.toLocaleString()} UZS
                    </p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(s)} className="w-9 h-9 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center" title="Tahrirlash"><i className="fas fa-pen text-xs"></i></button>
                      <button onClick={() => { if(window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) onDelete(s.id); }} className="w-9 h-9 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center" title="O'chirish"><i className="fas fa-trash-alt text-xs"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center text-slate-400 font-black uppercase text-xs tracking-[0.2em] italic">O'quvchilar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-12">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">{editingId ? 'Ma\'lumotlarni tahrirlash' : 'Yangi O\'quvchi qo\'shish'}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Ism Familiya</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Masalan: Ali Valiyev" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Telefon raqami</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="+998 90..." />
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tizimga kirish akkaunti</p>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Username (Login)</label>
                        <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-3 bg-white border border-slate-100 rounded-xl outline-none font-bold text-xs" placeholder="Masalan: ali_2024" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Parol</label>
                        <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 bg-white border border-slate-100 rounded-xl outline-none font-bold text-xs" placeholder="Masalan: 123456" />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Guruhni tanlang</label>
                  <select value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer">
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name} - {g.subject}</option>)}
                  </select>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  <button type="button" onClick={resetForm} className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Bekor Qilish</button>
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Saqlash</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
