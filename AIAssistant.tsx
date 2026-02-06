
import React, { useState } from 'react';
import { generateTestQuestions, getStudentPerformanceFeedback } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [mode, setMode] = useState<'test' | 'feedback'>('test');
  const [subject, setSubject] = useState('Ingliz tili');
  const [topic, setTopic] = useState('Passive Voice');
  const [studentName, setStudentName] = useState('Alisher');
  // Fix: Properly quote "A'lo" to avoid syntax error from the single quote.
  const [attendance, setAttendance] = useState("A'lo");
  const [homework, setHomework] = useState('Bajarilgan');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (mode === 'test') {
        const data = await generateTestQuestions(subject, topic);
        setResult(data);
      } else {
        const feedback = await getStudentPerformanceFeedback(studentName, attendance, homework);
        setResult(feedback);
      }
    } catch (error) {
      console.error(error);
      alert("AI kontent yaratishda xatolik yuz berdi. API kalitni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold border border-indigo-100">
          <i className="fas fa-sparkles"></i>
          AI INTELLIGENCE ASSISTANT
        </div>
        <h2 className="text-3xl font-black tracking-tight">Bugun sizga qanday yordam bera olaman?</h2>
        <p className="text-slate-500 font-medium">Gemini AI orqali ishingizni avtomatlashtiring.</p>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={() => { setMode('test'); setResult(null); }}
          className={`flex-1 max-w-[200px] p-6 rounded-3xl border-2 transition-all text-center ${mode === 'test' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-100' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
        >
          <i className="fas fa-file-signature text-2xl mb-3"></i>
          <p className="font-black text-xs uppercase tracking-widest">Test yaratish</p>
        </button>
        <button 
          onClick={() => { setMode('feedback'); setResult(null); }}
          className={`flex-1 max-w-[200px] p-6 rounded-3xl border-2 transition-all text-center ${mode === 'feedback' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-100' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
        >
          <i className="fas fa-comment-alt text-2xl mb-3"></i>
          <p className="font-black text-xs uppercase tracking-widest">Xarakteristika</p>
        </button>
      </div>

      <div className="bg-white p-10 rounded-[48px] shadow-xl shadow-indigo-100 border border-indigo-50">
        <div className="space-y-8">
          {mode === 'test' ? (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fan nomi</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Masalan: Matematika"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mavzu</label>
                <input 
                  type="text" 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Masalan: Logarifm"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">O'quvchi ismi</label>
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Davomat</label>
                <select 
                  value={attendance} 
                  onChange={e => setAttendance(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm cursor-pointer"
                >
                  <option>A'lo</option>
                  <option>Yomon</option>
                  <option>O'rtacha</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vazifalar</label>
                <select 
                   value={homework} 
                   onChange={e => setHomework(e.target.value)}
                   className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm cursor-pointer"
                >
                  <option>Bajarilgan</option>
                  <option>Qisman bajarilgan</option>
                  <option>Bajarilmagan</option>
                </select>
              </div>
            </div>
          )}

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <i className="fas fa-magic"></i>
            )}
            {loading ? 'AI ishlamoqda...' : 'AI orqali yaratish'}
          </button>
        </div>

        {result && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[40px] border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <i className="fas fa-check-circle text-emerald-500"></i> AI Natijasi
            </h4>
            
            {mode === 'test' ? (
              <div className="space-y-6">
                {result.map((q: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="font-black text-slate-800 mb-4">{i+1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((opt: string, j: number) => (
                        <div key={j} className={`p-3 rounded-xl text-sm border font-bold ${opt === q.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-100 text-slate-500'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 italic text-slate-700 leading-relaxed shadow-sm font-medium">
                "{result}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
