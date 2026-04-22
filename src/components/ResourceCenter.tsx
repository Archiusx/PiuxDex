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
  FolderRoot,
  X,
  Eye,
  Maximize2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RESOURCE_TYPES = [
  { id: 'pdf', name: 'PDF Document', icon: FileText, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'pptx', name: 'Presentation', icon: Library, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'c', name: 'C Source', icon: FileCode, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'algo', name: 'Algorithm', icon: Cpu, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'other', name: 'Other Ref', icon: FolderRoot, color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' },
];

export default function ResourceCenter() {
  const resources = useLiveQuery(() => db.resources.toArray()) || [];
  const subjects = useLiveQuery(() => db.subjects.toArray()) || [];
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('pdf');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(undefined);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const [viewingResource, setViewingResource] = useState<any>(null);

  const addResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await db.resources.add({
      name,
      type: type as any,
      url: url || '#',
      subjectId: selectedSubjectId,
      topicName: selectedTopic,
      addedAt: Date.now()
    });
    setName('');
    setUrl('');
    setSelectedSubjectId(undefined);
    setSelectedTopic(undefined);
    setShowAdd(false);
  };

  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Direct URL / Cloud Link</label>
                <input 
                  type="text" 
                  placeholder="https://drive.google.com/your-file..."
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Subject Association</label>
                  <select 
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white appearance-none"
                    value={selectedSubjectId || ''}
                    onChange={e => setSelectedSubjectId(Number(e.target.value) || undefined)}
                  >
                    <option value="">General / None</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Concept Linkage</label>
                  <select 
                    disabled={!activeSubject}
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white appearance-none disabled:opacity-30 disabled:cursor-not-allowed"
                    value={selectedTopic || ''}
                    onChange={e => setSelectedTopic(e.target.value)}
                  >
                    <option value="">Select Priority Topic</option>
                    {activeSubject?.syllabus.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
               </div>
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
              onClick={() => {
                if (res.type === 'pdf' || res.type === 'pptx') {
                  setViewingResource(res);
                } else if (res.url && res.url !== '#') {
                  window.open(res.url, '_blank');
                }
              }}
              className="theme-card p-6 py-8 hover:bg-[#151515] hover:border-zinc-700 transition-all cursor-pointer group flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 opacity-20 bg-current overflow-hidden">
                <div className={`h-full w-full ${typeInfo.color.replace('text-', 'bg-')}`} />
              </div>

              <div className={`w-16 h-20 border border-zinc-800 rounded-lg relative flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-zinc-600 ${typeInfo.bg}`}>
                 <Icon size={32} className={`${typeInfo.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                 <AnimatePresence>
                   {(res.type === 'pdf' || res.type === 'pptx') && (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       whileHover={{ opacity: 1 }}
                       className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm transition-opacity"
                     >
                        <Eye size={20} className="text-white" />
                     </motion.div>
                   )}
                 </AnimatePresence>
                 <div className={`absolute top-2 right-2 w-3 h-3 rounded-sm border border-black/50 ${typeInfo.color.replace('text-', 'bg-')}`}></div>
                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0a0a0a] rounded flex items-center justify-center border border-zinc-800 group-hover:border-zinc-600">
                    <Icon size={12} className={typeInfo.color} />
                 </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-[11px] tracking-tight text-zinc-300 group-hover:text-white transition-colors uppercase leading-tight line-clamp-2 max-w-[140px] h-[32px]">
                  {res.name}
                </h3>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-center space-x-2 text-[8px] text-zinc-600 font-mono tracking-widest group-hover:text-zinc-500 transition-colors">
                     <span className="px-1.5 py-0.5 rounded border border-zinc-900 bg-black">{res.type.toUpperCase()}</span>
                     <span>•</span>
                     <span>ID: {res.id?.toString().padStart(3, '0')}</span>
                  </div>
                  {res.topicName && (
                    <div className="text-[7px] text-zinc-700 uppercase font-bold tracking-[0.2em] group-hover:text-zinc-400 transition-colors">
                      {res.topicName}
                    </div>
                  )}
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

      {/* Resource Viewer Modal */}
      <AnimatePresence>
        {viewingResource && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-black/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-full theme-card overflow-hidden flex flex-col border-zinc-800"
            >
              <div className="bg-[#111] p-4 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${RESOURCE_TYPES.find(t => t.id === viewingResource.type)?.bg}`}>
                    {React.createElement(RESOURCE_TYPES.find(t => t.id === viewingResource.type)?.icon || FileText, { 
                      size: 20, 
                      className: RESOURCE_TYPES.find(t => t.id === viewingResource.type)?.color 
                    })}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white uppercase">{viewingResource.name}</h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Viewing Global Research Material</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {viewingResource.url !== '#' && (
                    <button 
                      onClick={() => window.open(viewingResource.url, '_blank')}
                      className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded"
                      title="Open in new window"
                    >
                      <ExternalLink size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => setViewingResource(null)}
                    className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black relative flex flex-col">
                <div className="flex-1 relative">
                  {viewingResource.url && viewingResource.url !== '#' ? (
                    <div className="w-full h-full">
                      {viewingResource.type === 'pdf' ? (
                        <iframe 
                          src={viewingResource.url}
                          className="w-full h-full border-none bg-zinc-900"
                          title="PDF Viewer"
                        />
                      ) : (
                        <iframe 
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewingResource.url)}`}
                          className="w-full h-full border-none"
                          title="Office Viewer"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-zinc-700">
                      <Maximize2 size={48} className="opacity-10" />
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Offline Reference • Manual URL Required</p>
                    </div>
                  )}
                </div>
                
                {viewingResource.url && viewingResource.url !== '#' && (
                  <div className="p-4 bg-[#0a0a0a] border-t border-zinc-900 flex justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                       <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest leading-none">External Link Gateway:</span>
                       <a 
                         href={viewingResource.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-[10px] underline text-zinc-400 hover:text-white transition-colors flex items-center"
                       >
                         Open Original <ExternalLink size={10} className="ml-1" />
                       </a>
                    </div>
                    {viewingResource.type === 'pdf' && (
                       <div className="flex items-center space-x-2">
                          <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest leading-none">Native Viewer:</span>
                          <a 
                            href={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingResource.url)}&embedded=true`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] underline text-zinc-400 hover:text-white transition-colors flex items-center"
                          >
                            Web Alternate <Eye size={10} className="ml-1" />
                          </a>
                       </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
