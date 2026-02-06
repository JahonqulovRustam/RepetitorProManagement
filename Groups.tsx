
import React, { useState } from 'react';
import { Group, Teacher, Role } from '../types';

interface GroupsProps {
  groups: Group[];
  onAdd: (g: Group) => void;
  onUpdate: (g: Group) => void;
  onDelete: (id: string) => void;
  role: Role;
  teachers: Teacher[];
}

const Groups: React.FC<GroupsProps> = ({ groups, onAdd, onUpdate, onDelete, role, teachers }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({ name: '', subject: '', schedule: '', teacherId: teachers[0]?.id || '' });

  const resetForm = () => {
    setFormData({ name: '', subject: '', schedule: '', teacherId: teachers[0]?.id || '' });
    setEditingGroup(null);
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      onUpdate({ ...editingGroup, ...formData });
    } else {
      const newGroup: Group = {
        ...formData,
        id: 'g' + Date.now(),
      };
      onAdd(newGroup);
    }
    resetForm();
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({ name: group.name, subject: group.subject, schedule: group.schedule, teacherId: group.teacherId });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Haqiqatan ham ushbu guruhni o'chirib tashlamoqchimisiz?")) {
      onDelete(id);
    }
  };


  const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'Noma\'lum';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">O'quv Guruhlari</h2>
          <p className="text-slate-500 font-medium">Barcha faol dars guruhlari monitoringi.</p>
        </div>
        {(role === 'teacher' || role === 'superadmin') && (
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> Yangi Guruh Ochish
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map(group => (
          <div key={group.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black">
                {group.subject.charAt(0)}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(group)} className="w-9 h-9 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all" title="Tahrirlash"><i className="fas fa-pen text-xs"></i></button>
                <button onClick={() => handleDelete(group.id)} className="w-9 h-9 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all" title="O'chirish"><i className="fas fa-trash-alt text-xs"></i></button>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">{group.name}</h3>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">{group.subject}</p>

            <div className="space-y-3 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <i className="fas fa-clock text-slate-300 w-4"></i>
                <span>{group.schedule}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <i className="fas fa-chalkboard-teacher text-slate-300 w-4"></i>
                <span>Ustoz: {getTeacherName(group.teacherId)}</span>
              </div>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-black uppercase text-xs tracking-[0.2em] italic">Guruhlar mavjud emas</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10">
              <h3 className="text-2xl font-black text-slate-900 mb-8">{editingGroup ? 'Guruhni Tahrirlash' : 'Yangi Guruh Qo\'shish'}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guruh Nomi</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Masalan: IELTS 9.0" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fan</label>
                    <input required type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Masalan: Ingliz tili" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dars Vaqti</label>
                  <input required type="text" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Dush-Chor-Jum 10:00" />
                </div>
                {role === 'superadmin' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O'qituvchini Biriktirish</label>
                    <select
                      value={formData.teacherId}
                      onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm appearance-none"
                    >
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={resetForm} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Bekor Qilish</button>
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">Tasdiqlash</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
