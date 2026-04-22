import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Subject } from '../db';
import { Edit2, Check, X, ShieldAlert } from 'lucide-react';

export default function AcademicVault() {
  const subjects = useLiveQuery(() => db.subjects.toArray());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Subject>>({});

  const handleEdit = (sub: Subject) => {
    setEditingId(sub.id!);
    setFormData(sub);
  };

  const handleSave = async () => {
    if (editingId) {
      await db.subjects.update(editingId, formData);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light tracking-tight italic italic">Performance <span className="font-bold not-italic font-bold">Metrics</span></h2>
          <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-medium">B.Tech Course Repository • Semester 4</p>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 bg-zinc-950 border border-zinc-900 px-4 py-2 rounded">
           CA-AVERAGE: 17.8
        </div>
      </header>

      <div className="theme-card border-zinc-800 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-900 bg-[#151515]">
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Subject Repository</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-center">CA 1</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-center">CA 2</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-center">ESE</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects?.map((sub) => (
              <tr key={sub.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-colors group">
                <td className="p-5">
                  <div className="font-bold text-sm text-zinc-200 tracking-tight">{sub.name.toUpperCase()}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 italic">
                    Focus: {sub.topics.join(' • ')}
                  </div>
                </td>
                <td className="p-5 text-center">
                  {editingId === sub.id ? (
                    <input 
                      type="number" 
                      className="w-16 bg-black border border-zinc-800 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-white"
                      value={formData.ca1}
                      onChange={e => setFormData({...formData, ca1: parseInt(e.target.value) || 0})}
                    />
                  ) : (
                    <span className="text-sm font-mono text-zinc-400">{sub.ca1}</span>
                  )}
                </td>
                <td className="p-5 text-center">
                  {editingId === sub.id ? (
                    <input 
                      type="number" 
                      className="w-16 bg-black border border-zinc-800 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-white"
                      value={formData.ca2}
                      onChange={e => setFormData({...formData, ca2: parseInt(e.target.value) || 0})}
                    />
                  ) : (
                    <span className="text-sm font-mono text-zinc-400">{sub.ca2}</span>
                  )}
                </td>
                <td className="p-5 text-center">
                  {editingId === sub.id ? (
                    <input 
                      type="number" 
                      className="w-16 bg-black border border-zinc-800 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-white"
                      value={formData.ese}
                      onChange={e => setFormData({...formData, ese: parseInt(e.target.value) || 0})}
                    />
                  ) : (
                    <span className={`text-sm font-bold font-mono ${sub.ese < 20 ? 'text-red-900' : 'text-zinc-200'}`}>
                      {sub.ese || '--'}
                    </span>
                  )}
                </td>
                <td className="p-5 text-right">
                  {editingId === sub.id ? (
                    <div className="flex justify-end space-x-2">
                       <button onClick={handleSave} className="px-3 py-1 bg-white text-black text-[10px] font-bold rounded uppercase tracking-widest"><Check size={12} /></button>
                       <button onClick={() => setEditingId(null)} className="px-3 py-1 border border-zinc-800 text-zinc-500 text-[10px] font-bold rounded uppercase tracking-widest"><X size={12} /></button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEdit(sub)}
                      className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 rounded font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Refactor
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subjects?.map(sub => (
          <div key={sub.id} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-sm">{sub.name}</h4>
              {sub.ese < 20 && sub.ese > 0 && <ShieldAlert size={16} className="text-red-500" />}
            </div>
            <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs text-neutral-500 mb-2">
                   <span>Topics Mastery</span>
                   <span>60%</span>
                 </div>
                 <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                   <div className="h-full bg-neutral-400" style={{ width: '60%' }} />
                 </div>
               </div>
               <div className="flex flex-wrap gap-2">
                 {sub.topics.map((topic, i) => (
                   <span key={i} className="text-[10px] px-2 py-1 bg-neutral-950 border border-neutral-800 rounded uppercase text-neutral-500">
                     {topic}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
