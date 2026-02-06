
import React, { useState } from 'react';
import { Assignment, Group, Role, Submission } from '../types';

interface AssignmentsPageProps {
  role: Role;
  user: any;
  assignments: Assignment[];
  onAdd: (a: Assignment) => void;
  onUpdate: (a: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  groups: Group[];
  onNotify: (notif: any) => void;
}

const CustomDateTimePicker: React.FC<{ value: string, onChange: (val: string) => void }> = ({ value, onChange }) => {
  const parseValue = (val: string) => {
    if (!val) return { day: '', month: '', year: '', hour: '', minute: '' };
    const [datePart, timePart] = val.split('T');
    const [year, month, day] = (datePart || '').split('-');
    const [hour, minute] = (timePart || '').split(':');
    return { day: day || '', month: month || '', year: year || '', hour: hour || '', minute: minute || '' };
  };

  const [parts, setParts] = useState(parseValue(value));

  const updateParent = (newParts: typeof parts) => {
    const { year, month, day, hour, minute } = newParts;
    if (year && month && day && hour && minute) {
      const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      onChange(formatted);
    }
  };

  const handleChange = (field: keyof typeof parts, val: string, maxLen: number, nextId?: string) => {
    const numericVal = val.replace(/\D/g, '').slice(0, maxLen);
    const newParts = { ...parts, [field]: numericVal };
    setParts(newParts);
    updateParent(newParts);

    if (numericVal.length === maxLen && nextId) {
      document.getElementById(nextId)?.focus();
    }
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-center text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-200";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 space-y-1">
        <input id="dt-day" placeholder="DD" value={parts.day} onChange={e => handleChange('day', e.target.value, 2, 'dt-month')} className={inputClass} />
        <p className="text-[8px] font-black text-slate-300 text-center uppercase tracking-widest">Kun</p>
      </div>
      <span className="text-slate-200 font-black mb-4">/</span>
      <div className="flex-1 space-y-1">
        <input id="dt-month" placeholder="MM" value={parts.month} onChange={e => handleChange('month', e.target.value, 2, 'dt-year')} className={inputClass} />
        <p className="text-[8px] font-black text-slate-300 text-center uppercase tracking-widest">Oy</p>
      </div>
      <span className="text-slate-200 font-black mb-4">/</span>
      <div className="flex-[1.5] space-y-1">
        <input id="dt-year" placeholder="YYYY" value={parts.year} onChange={e => handleChange('year', e.target.value, 4, 'dt-hour')} className={inputClass} />
        <p className="text-[8px] font-black text-slate-300 text-center uppercase tracking-widest">Yil</p>
      </div>
      <div className="w-4"></div>
      <div className="flex-1 space-y-1">
        <input id="dt-hour" placeholder="HH" value={parts.hour} onChange={e => handleChange('hour', e.target.value, 2, 'dt-minute')} className={inputClass} />
        <p className="text-[8px] font-black text-slate-300 text-center uppercase tracking-widest">Soat</p>
      </div>
      <span className="text-slate-200 font-black mb-4">:</span>
      <div className="flex-1 space-y-1">
        <input id="dt-minute" placeholder="mm" value={parts.minute} onChange={e => handleChange('minute', e.target.value, 2)} className={inputClass} />
        <p className="text-[8px] font-black text-slate-300 text-center uppercase tracking-widest">Min</p>
      </div>
    </div>
  );
};

const AssignmentsPage: React.FC<AssignmentsPageProps> = ({ role, user, assignments, onAdd, onUpdate, onDeleteAssignment, groups, onNotify }) => {


  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ groupId: groups[0]?.id || '', title: '', description: '', deadline: '' });
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deadline) {
      alert("Iltimos, dedlayn vaqtini to'liq kiriting!");
      return;
    }
    const newAssignment: Assignment = {
      ...formData,
      id: 'asgn-' + Date.now(),
      submissions: []
    };
    onAdd(newAssignment);
    setShowModal(false);
    setFormData({ groupId: groups[0]?.id || '', title: '', description: '', deadline: '' });
  };

  const handleUpload = (assignmentId: string) => {
    // Simulating file upload
    const comment = prompt("Vazifa bo'yicha izoh qoldiring:");
    if (comment === null) return;

    const assignment = assignments.find(a => a.id === assignmentId);

    const newSubmission: Submission = {
      id: 'sub-' + Date.now(),
      studentId: user.id,
      studentName: user.name,
      submittedAt: new Date().toLocaleString(),
      fileUrl: 'dummy_file_path.pdf',
      comment: comment || '',
      status: 'pending'
    };

    onUpdate({ ...assignment, submissions: [...assignment.submissions, newSubmission] } as Assignment);

    onNotify({
      type: 'assignment_submission',
      title: 'Yangi Vazifa Topshirildi',
      message: `${user.name} "${assignment?.title}" vazifasini topshirdi.`,
    });

    alert("Vazifa muvaffaqiyatli yuklandi!");
  };

  const handleReview = (assignmentId: string, submissionId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      const updatedSubmission = assignment.submissions.map(s => s.id === submissionId ? { ...s, status: 'reviewed' as const } : s);
      onUpdate({ ...assignment, submissions: updatedSubmission });
    }

    // Update selectedAssignment locally to reflect change in modal
    if (selectedAssignment) {
      setSelectedAssignment(prev => {
        if (!prev) return null;
        return {
          ...prev,
          submissions: prev.submissions.map(s => s.id === submissionId ? { ...s, status: 'reviewed' } : s)
        };
      });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Uy Vazifalari</h2>
          <p className="text-slate-500 font-medium">Dedlinelarni kuzatib boring va topshiriqlarni yuklang.</p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-3"
          >
            <i className="fas fa-plus-circle"></i> Yangi Vazifa Berish
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assignments.map(a => (
          <div key={a.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                {groups.find(g => g.id === a.groupId)?.name}
              </span>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Dedlayn</p>
                <p className="text-xs font-black text-rose-500">{a.deadline.replace('T', ' ')}</p>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">{a.title}</h3>
            <p className="text-sm text-slate-500 font-medium mb-8 flex-1">{a.description}</p>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex gap-4">
                {isTeacher ? (
                  <>
                    <button
                      onClick={() => setSelectedAssignment(a)}
                      className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                    >
                      Topshirilganlar ({a.submissions.length})
                    </button>
                    <button
                      onClick={() => { if (window.confirm("Vazifani o'chirmoqchimisiz?")) onDeleteAssignment(a.id); }}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                      title="O'chirish"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    {a.submissions.some(s => s.studentId === user.id) ? (
                      <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                        <i className="fas fa-check-circle"></i> {a.submissions.find(s => s.studentId === user.id)?.status === 'reviewed' ? 'Tekshirildi' : 'Topshirildi'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpload(a.id)}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                      >
                        Fayl yuklash
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        ))}
        {assignments.length === 0 && <div className="col-span-full py-24 text-center text-slate-400 font-black uppercase tracking-widest">Hali vazifalar berilmagan</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-xl p-12 shadow-2xl animate-in zoom-in-95 overflow-hidden">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Yangi Vazifa Yaratish</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Guruhni tanlang</label>
                <select required value={formData.groupId} onChange={e => setFormData({ ...formData, groupId: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm">
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name} - {g.subject}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vazifa sarlavhasi</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10" placeholder="Masalan: Essay on Global Warming" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tavsif / Ko'rsatmalar</label>
                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm h-32 focus:ring-4 focus:ring-indigo-500/10" placeholder="Vazifa haqida batafsil ma'lumot..."></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dedlayn (Sana va vaqt)</label>
                <CustomDateTimePicker value={formData.deadline} onChange={val => setFormData({ ...formData, deadline: val })} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Yopish</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">Vazifani Yuborish</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-2xl p-12 shadow-2xl animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Topshirilgan Vazifalar</h3>
              <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-slate-900 transition-colors"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedAssignment.submissions.map(s => (
                <div key={s.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-indigo-100 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-slate-900">{s.studentName}</p>
                      {s.status === 'reviewed' ? (
                        <span className="text-[8px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase">Tekshirildi</span>
                      ) : (
                        <span className="text-[8px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full uppercase">Kutilmoqda</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{s.submittedAt}</p>
                    {s.comment && <p className="text-xs text-slate-500 italic mt-2 font-medium">"{s.comment}"</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="bg-slate-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                      Fayl
                    </button>
                    {s.status === 'pending' && (
                      <button
                        onClick={() => handleReview(selectedAssignment.id, s.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-indigo-100"
                      >
                        Tekshirildi
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {selectedAssignment.submissions.length === 0 && <p className="text-center py-10 text-slate-400 uppercase text-xs font-black tracking-widest">Hozircha hech kim topshirmagan</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
