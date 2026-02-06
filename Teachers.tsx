
import React, { useState } from 'react';
import { Teacher } from '../types';

interface TeachersProps {
  teachers: Teacher[];
  onAdd: (t: Teacher) => void;
  onUpdate: (t: Teacher) => void;
  onDelete: (id: string) => void;
}

const Teachers: React.FC<TeachersProps> = ({ teachers, onAdd, onUpdate, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: '', subject: '', email: '', phone: '', username: '', password: ''
  });

  const resetForm = () => {
    setFormData({ name: '', subject: '', email: '', phone: '', username: '', password: '' });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher: Teacher = {
      ...formData,
      id: 't' + Date.now(),
      joinedDate: new Date().toISOString().split('T')[0]
    };
    onAdd(newTeacher);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    onUpdate({ ...editingTeacher, ...formData });
    setEditingTeacher(null);
    resetForm();
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      email: teacher.email,
      phone: teacher.phone,
      username: teacher.username,
      password: teacher.password || ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Haqiqatan ham ushbu o'qituvchini tizimdan o'chirmoqchimisiz? Guruhlar yetim qolishi mumkin.")) {
      onDelete(id);
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">O'qituvchilar Tarkibi</h2>
          <p className="text-slate-500 font-medium">Yangi ustozlarni ishga olish va akkauntlarni boshqarish.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-200 flex items-center gap-3 transition-all active:scale-95"
        >
          <i className="fas fa-plus-circle text-lg"></i> Yangi Ustoz Qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map(t => (
          <div key={t.id} className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all hover:shadow-2xl hover:shadow-indigo-50">
            <div className="p-10">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-black border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg leading-tight">{t.name}</h3>
                  <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block">{t.subject}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-slate-600 font-bold">
                  <i className="fas fa-id-badge text-slate-300 w-4 text-center"></i>
                  <span>@{t.username}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                  <i className="fas fa-envelope text-slate-300 w-4 text-center"></i>
                  <span className="truncate">{t.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                  <i className="fas fa-phone text-slate-300 w-4 text-center"></i>
                  <span>{t.phone}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => handleDelete(t.id)}
                className="text-slate-400 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-trash-alt"></i> O'chirish
              </button>
              <button
                onClick={() => openEditModal(t)}
                className="text-indigo-600 hover:text-indigo-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                Tahrirlash <i className="fas fa-pen"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showAddModal || editingTeacher) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-12">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">{editingTeacher ? 'Ustoz ma\'lumotlarini yangilash' : 'Yangi ustozni ro\'yxatdan o\'tkazish'}</h3>
              <form onSubmit={editingTeacher ? handleEdit : handleAdd} className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">To'liq ismi</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Masalan: Aziz Valiyev" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mutaxassisligi</label>
                    <input required type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Masalan: Matematika" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Elektron pochta</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="email@tizim.uz" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Telefon</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="+998 90..." />
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tizimga kirish ma'lumotlari</p>
                  <div className="grid grid-cols-2 gap-8">
                    <input required type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Login" />
                    <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Parol" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditingTeacher(null); }} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Bekor Qilish</button>
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all">Saqlash</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
