
import React from 'react';
import { User, Teacher } from '../types';

interface SupportProps {
  user: any;
  teachers: Teacher[];
}

const Support: React.FC<SupportProps> = ({ user, teachers }) => {
  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';
  const isAdmin = user.role === 'superadmin';

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="bg-white rounded-[48px] shadow-xl shadow-indigo-50 border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
            <i className="fas fa-headset"></i>
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Ma'lumot va Qo'llab-quvvatlash</h2>
          <p className="text-indigo-100 font-medium">Tizim bo'yicha savollaringiz bormi? Biz bilan bog'laning.</p>
        </div>

        <div className="p-12 space-y-10">
          {(isTeacher || isAdmin) && (
            <div className="space-y-6">
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-4">Texnik Yordam (O'qituvchilar uchun)</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  Ilovani ishlatish, guruhlar qo'shish yoki boshqa texnik masalalar bo'yicha savollaringiz bo'lsa, iltimos, 
                  tizim administratoriga murojaat qiling.
                </p>
                <a 
                  href="https://t.me/JH_Rustam" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#0088cc] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#0077b3] transition-all shadow-lg shadow-sky-100"
                >
                  <i className="fab fa-telegram text-lg"></i>
                  @JH_Rustam bilan bog'lanish
                </a>
              </div>
            </div>
          )}

          {isStudent && (
            <div className="space-y-6">
              <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100">
                <h3 className="text-lg font-black text-emerald-900 mb-4">O'quv masalalari (O'quvchilar uchun)</h3>
                <p className="text-emerald-700 font-medium leading-relaxed mb-6">
                  Dars jadvali, to'lovlar yoki o'quv materiallari bo'yicha savollaringiz bo'lsa, bevosita o'z o'qituvchingiz bilan 
                  bog'laning. 
                </p>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sizning ustozingiz:</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 font-black border border-emerald-100">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Markaz O'qituvchilari</p>
                      <p className="text-xs text-slate-500 font-medium italic">Guruh bo'yicha ustozga murojaat qiling.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Repetitor Pro Management System v3.6</p>
            <p className="text-[9px] text-slate-300 font-bold mt-2">Barcha huquqlar himoyalangan © 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
