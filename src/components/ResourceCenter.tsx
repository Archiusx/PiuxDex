import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { 
  FileText, 
  FileCode, 
  Terminal, 
  Library, 
  Plus, 
  ExternalLink,
  Code2,
  Cpu,
  FolderRoot
} from 'lucide-react';
import { motion } from 'motion/react';

const RESOURCE_TYPES = [
  { id: 'pdf', name: 'PDF Document', icon: FileText, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'pptx', name: 'Presentation', icon: Library, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'c', name: 'C Source', icon: FileCode, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'algo', name: 'Algorithm', icon: Cpu, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'other', name: 'Other Ref', icon: FolderRoot, color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' },
];

export default function ResourceCenter() {
  const resources = useLiveQuery(() => db.resources.toArray()) || [];
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('pdf');

  const addResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await db.resources.add({
      name,
      type: type as any,
      url: '#',
      addedAt: Date.now()
    });
    setName('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light italic tracking-tight italic">Resource <span className="font-bold not-italic font-bold">Vault</span></h2>
          <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-medium">B.Tech Course Repository • Semester 4</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          Inject Material
        </button>
      </header>

      {showAdd && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 theme-card border-zinc-800 bg-[#0a0a0a]"
        >
          <form onSubmit={addResource} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Material Label</label>
              <input 
                type="text" 
                placeholder="Database_Management_Schema.pdf..."
                className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {RESOURCE_TYPES.map(rt => (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => setType(rt.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded border transition-all ${
                    type === rt.id 
                      ? 'bg-white border-white text-black' 
                      : 'bg-black border-zinc-900 text-zinc-600 hover:border-zinc-700'
                  }`}
                >
                  <rt.icon size={18} className="mb-2" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">{rt.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
            <button className="w-full py-4 bg-zinc-100 text-black font-bold text-[10px] uppercase tracking-[0.2em] rounded hover:bg-white transition-colors">
              Synchronize to Vault
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res) => {
          const typeInfo = RESOURCE_TYPES.find(rt => rt.id === res.type) || RESOURCE_TYPES[4];
          const Icon = typeInfo.icon;
          
          return (
            <motion.div
              layout
              key={res.id}
              className="theme-card p-6 py-8 hover:bg-[#151515] hover:border-zinc-700 transition-all cursor-pointer group flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 opacity-20 bg-current overflow-hidden">
                <div className={`h-full w-full ${typeInfo.color.replace('text-', 'bg-')}`} />
              </div>

              <div className={`w-16 h-20 border border-zinc-800 rounded-lg relative flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-zinc-600 ${typeInfo.bg}`}>
                 <Icon size={32} className={`${typeInfo.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                 <div className={`absolute top-2 right-2 w-3 h-3 rounded-sm border border-black/50 ${typeInfo.color.replace('text-', 'bg-')}`}></div>
                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0a0a0a] rounded flex items-center justify-center border border-zinc-800 group-hover:border-zinc-600">
                    <Icon size={12} className={typeInfo.color} />
                 </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-[11px] tracking-tight text-zinc-300 group-hover:text-white transition-colors uppercase leading-tight line-clamp-2 max-w-[140px] h-[32px]">
                  {res.name}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-[8px] text-zinc-600 font-mono tracking-widest group-hover:text-zinc-500 transition-colors">
                   <span className="px-1.5 py-0.5 rounded border border-zinc-900 bg-black">{res.type.toUpperCase()}</span>
                   <span>•</span>
                   <span>ID: {res.id?.toString().padStart(3, '0')}</span>
                </div>
              </div>
            </motion.div>
          );
        })}


        {resources.length === 0 && (
          <div className="col-span-full py-20 theme-card flex flex-col items-center justify-center border-dashed text-center opacity-30">
             <Library size={40} className="mb-4 text-zinc-700" />
             <p className="text-[10px] uppercase tracking-widest font-bold">Vault Locked • Inject Materials to Initiate</p>
          </div>
        )}
      </div>

      <section className="theme-card p-10 bg-[#080808]">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
               <div className="w-10 h-10 bg-white/5 border border-zinc-900 flex items-center justify-center rounded">
                 <Code2 size={20} className="text-white" />
               </div>
               <div>
                 <h3 className="text-xl font-bold italic tracking-tight">Collaborative <span className="font-light not-italic">Ref</span></h3>
                 <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Networked Project Environment</p>
               </div>
            </div>
            <div className="flex items-center">
              <span className="status-dot bg-zinc-800 shadow-none"></span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-700 font-bold">Protocol Inactive</span>
            </div>
         </div>
         <div className="loading-line">
            <div className="loading-line-active scale-x-50 opacity-10"></div>
         </div>
         <p className="mt-8 text-[11px] text-center text-zinc-700 tracking-widest uppercase font-bold italic">
           Waiting for peer synchronization...
         </p>
      </section>
    </div>

  );
}

function QuickLinkCard({ title, type }: { title: string, type: string }) {
  const typeInfo = RESOURCE_TYPES.find(rt => rt.id === type) || RESOURCE_TYPES[4];
  const Icon = typeInfo.icon;
  return (
    <div className="bg-neutral-900/30 border border-neutral-900 p-6 rounded-2xl opacity-60 flex flex-col h-full grayscale">
      <div className={`p-4 rounded-2xl bg-black border border-neutral-800 w-fit mb-4 ${typeInfo.color}`}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-sm mb-2 text-neutral-500">{title}</h3>
      <div className="mt-auto text-[10px] text-neutral-700 font-mono uppercase">
        Pre-installed Resource
      </div>
    </div>
  );
}
