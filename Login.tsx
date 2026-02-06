
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (credentials: {username: string, password: string}) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin({ username, password });
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 border border-white/20">
        <div className="p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Repetitor<span className="text-indigo-600">Pro</span></h1>
            <p className="text-slate-400 text-sm mt-3 font-medium tracking-wide">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Foydalanuvchi nomi</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all"
                  placeholder="Loginingizni kiriting"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Parol</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl text-xs font-bold text-center animate-shake border border-rose-100">
                Login yoki parol noto'g'ri. Iltimos, qaytadan urining.
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/10 hover:bg-indigo-600 transition-all active:scale-[0.98] mt-4"
            >
              Tizimga Kirish
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-8">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2024 RepetitorPro Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
