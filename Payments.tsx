
import React, { useState } from 'react';
import { Student, Payment, Role } from '../types';

interface PaymentsProps {
  students: Student[];
  payments: Payment[];
  onAddPayment: (payment: Payment) => void;
  // Fix: Added role property to PaymentsProps to match its usage in App.tsx
  role: Role;
  onDeletePayment: (id: string) => void;
}

const Payments: React.FC<PaymentsProps> = ({ students, payments, onAddPayment, role, onDeletePayment }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{ studentId: string, amount: string | number, month: string }>({
    studentId: '',
    amount: '',
    month: new Date().toLocaleString('uz-UZ', { month: 'long' })
  });

  const activeStudents = students.filter(s => s.status !== 'deleted');
  const deletedDebtors = students.filter(s => s.status === 'deleted');

  const totalDebt = students.reduce((acc, s) => s.balance < 0 ? acc + Math.abs(s.balance) : acc, 0);
  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.amount) return;

    const selected = students.find(s => s.id === form.studentId);
    if (!selected) return;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      studentId: form.studentId,
      studentName: selected.name,
      amount: Number(form.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      month: form.month
    };
    onAddPayment(newPayment);
    setShowModal(false);
    setForm({ studentId: '', amount: '', month: form.month });
  };

  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-indigo-600 p-10 rounded-[48px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Umumiy Tushum</p>
          <h3 className="text-4xl font-black">{totalCollected.toLocaleString()} <span className="text-xl font-normal opacity-60 italic">UZS</span></h3>
          <div className="mt-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Jami kiritilgan mablag'lar</p>
          </div>
        </div>

        <div className="bg-rose-500 p-10 rounded-[48px] text-white shadow-2xl shadow-rose-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          <p className="text-rose-100 text-[10px] font-black uppercase tracking-[0.2em] mb-4">O'quvchilar Qarzi</p>
          <h3 className="text-4xl font-black">{totalDebt.toLocaleString()} <span className="text-xl font-normal opacity-60 italic">UZS</span></h3>
          <div className="mt-8 flex items-center gap-2">
            <i className="fas fa-warning text-xs text-amber-300"></i>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-100">Kutilayotgan to'lovlar</p>
          </div>
        </div>

        <button
          onClick={() => {
            const firstId = activeStudents[0]?.id || deletedDebtors[0]?.id || '';
            setForm(prev => ({ ...prev, studentId: firstId }));
            setShowModal(true);
          }}
          className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl shadow-slate-200 text-left group hover:bg-indigo-700 transition-all outline-none"
        >
          <p className="text-slate-400 group-hover:text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Tezkor Amal</p>
          <h3 className="text-2xl font-black leading-tight">To'lov Qabul Qilish</h3>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
              <i className="fas fa-plus text-[10px]"></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">Yangi tranzaksiya</p>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-[48px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Tranzaksiyalar Tarixi</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Barcha moliyaviy amallar jurnali</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">O'quvchi</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">To'lov Oyi</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Summa</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Holati</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sana</th>
                <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map(payment => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-6">
                    <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{payment.studentName}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      ID: {payment.studentId}
                      {students.find(s => s.id === payment.studentId)?.status === 'deleted' &&
                        <span className="text-rose-500 ml-2 italic font-black"> (QARZDOR/OCHIRILGAN)</span>
                      }
                    </p>
                  </td>
                  <td className="px-10 py-6 text-sm font-bold text-slate-600 uppercase tracking-tighter">{payment.month}</td>
                  <td className="px-10 py-6 text-sm font-black text-slate-900">{payment.amount.toLocaleString()} UZS</td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                      Muvaffaqiyatli
                    </span>
                  </td>
                  <td className="px-10 py-6 text-sm text-slate-400 font-bold">{payment.date}</td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => { if (window.confirm("To'lovni o'chirmoqchimisiz?")) onDeletePayment(payment.id); }}
                      className="w-8 h-8 bg-slate-50 rounded-lg text-slate-300 hover:text-rose-500 transition-all flex items-center justify-center ml-auto"
                      title="O'chirish"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center text-slate-400 font-black uppercase text-xs tracking-[0.2em] italic">Hozircha to'lovlar kiritilmagan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-12">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">To'lov Qabul Qilish</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">O'quvchini tanlang</label>
                  <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 appearance-none transition-all cursor-pointer">
                    <option value="" disabled>Ro'yxatdan tanlang...</option>
                    <optgroup label="Faol O'quvchilar">
                      {activeStudents.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (Balans: {s.balance.toLocaleString()})</option>
                      ))}
                    </optgroup>
                    {deletedDebtors.length > 0 && (
                      <optgroup label="Sobiq Qarzdorlar (O'chirilgan)">
                        {deletedDebtors.map(s => (
                          <option key={s.id} value={s.id}>{s.name} (Qarzi: {Math.abs(s.balance).toLocaleString()})</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">To'lov Oyi</label>
                  <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 appearance-none transition-all cursor-pointer">
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Summa (UZS)</label>
                  <div className="relative">
                    <input required type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="To'lov miqdorini kiriting..." />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">SO'M</span>
                  </div>
                </div>
                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Yopish</button>
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Tasdiqlash</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
