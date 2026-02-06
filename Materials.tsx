
import React, { useState, useRef } from 'react';
import { Role, Material, Group } from '../types';

interface MaterialsProps {
  role: Role;
  userId: string;
  materials: Material[];
  groups: Group[];
  onAdd: (m: Material) => void;
  onDelete: (id: string) => void;
}

const Materials: React.FC<MaterialsProps> = ({ role, userId, materials, groups, onAdd, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: '', groupId: groups[0]?.id || '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTeacher = role === 'teacher' || role === 'superadmin';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Agar ism berilmagan bo'lsa, fayl nomini avtomatik qo'yish
      if (!formData.name) {
        setFormData(prev => ({ ...prev, name: file.name.split('.')[0] }));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.groupId) {
      alert("Iltimos, faylni tanlang va guruhni belgilang!");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;

        const newMaterial: Material = {
          id: 'mat-' + Date.now(),
          name: formData.name || selectedFile.name,
          type: selectedFile.type.includes('pdf') ? 'PDF' :
            selectedFile.type.includes('word') || selectedFile.name.endsWith('.docx') ? 'DOCX' :
              selectedFile.type.includes('video') ? 'MP4' : 'FILE',
          size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
          groupId: formData.groupId,
          teacherId: userId,
          uploadDate: new Date().toISOString().split('T')[0],
          fileData: base64Data,
          fileName: selectedFile.name
        };

        onAdd(newMaterial);
        setIsUploading(false);
        setShowModal(false);
        setSelectedFile(null);
        setFormData({ name: '', groupId: groups[0]?.id || '' });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Fayl o'qishda xatolik:", error);
      setIsUploading(false);
      alert("Faylni yuklashda xatolik yuz berdi.");
    }
  };

  const handleDownload = (material: Material) => {
    if (!material.fileData) {
      alert("Fayl ma'lumotlari topilmadi!");
      return;
    }
    const link = document.createElement('a');
    link.href = material.fileData;
    link.download = material.fileName || `${material.name}.${material.type.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Haqiqatan ham ushbu materialni butunlay o'chirib tashlamoqchimisiz?")) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">O'quv Resurslari</h2>
          <p className="text-slate-500 font-medium">Fayllar, kitoblar va o'quv qo'llanmalari bazasi.</p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-3 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <i className="fas fa-cloud-upload-alt text-lg"></i> Yangi Yuklash
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
          <i className="fas fa-folder-open text-amber-500"></i> Mavjud Resurslar ({materials.length})
        </h3>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
          {materials.map((file) => (
            <div key={file.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${file.type === 'PDF' ? 'bg-rose-50 text-rose-500' :
                    file.type === 'MP4' ? 'bg-indigo-50 text-indigo-500' :
                      file.type === 'DOCX' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-500'
                  }`}>
                  <i className={`fas ${file.type === 'PDF' ? 'fa-file-pdf' : file.type === 'MP4' ? 'fa-file-video' : file.type === 'DOCX' ? 'fa-file-word' : 'fa-file'} text-xl`}></i>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{file.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {file.size} • {groups.find(g => g.id === file.groupId)?.name} • {file.uploadDate}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="w-10 h-10 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center"
                  title="Yuklab olish"
                >
                  <i className="fas fa-download text-sm"></i>
                </button>
                {isTeacher && (
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="w-10 h-10 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center"
                    title="O'chirish"
                  >
                    <i className="fas fa-trash-alt text-sm"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
          {materials.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-inbox text-slate-300 text-3xl"></i>
              </div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Hozircha hech qanday resurs yuklanmagan</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-12">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Yangi Material Yuklash</h3>
              <form onSubmit={handleUpload} className="space-y-6">

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Faylni tanlang</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-8 border-2 border-dashed rounded-[32px] text-center cursor-pointer transition-all ${selectedFile ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-indigo-200'}`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <i className={`fas ${selectedFile ? 'fa-check-circle text-emerald-500' : 'fa-file-upload text-indigo-200'} text-4xl mb-4`}></i>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">
                      {selectedFile ? selectedFile.name : 'Kompyuterdan fayl tanlash'}
                    </p>
                    {selectedFile && <p className="text-[10px] text-slate-400 mt-1">{(selectedFile.size / 1024).toFixed(0)} KB</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Material nomi (Ixtiyoriy)</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Masalan: 1-dars darsligi" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Qaysi guruh uchun?</label>
                  <select required value={formData.groupId} onChange={e => setFormData({ ...formData, groupId: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm">
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    {groups.length === 0 && <option disabled>Guruhlar topilmadi</option>}
                  </select>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Yopish</button>
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {isUploading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Yuklanmoqda...</> : 'Tizimga Qo\'shish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
