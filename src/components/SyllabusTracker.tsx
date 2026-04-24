import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Subject, SyllabusTopic, seedDatabase } from '../db';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown,
  Edit2,
  Save,
  Plus,
  Trophy,
  Target,
  RefreshCw,
  GraduationCap
} from 'lucide-react';

import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, getDocs } from 'firebase/firestore';
import { db as fdb } from '../firebase';
import { useAuth } from '../AuthContext';

export default function SyllabusTracker() {
  const { user, login } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronize Syllabus from Firestore
  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(fdb, 'userSubjects'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, async (snap) => {
      if (!snap.empty) {
        const cloudSubs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        setSubjects(cloudSubs);
      } else {
        setSubjects([]);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Node: Syllabus read failed", err);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  // Overall Progress Calculation
  const totalTopics = subjects.reduce((acc, s) => acc + (s.syllabus?.length || 0), 0);
  const completedTopics = subjects.reduce((acc, s) => acc + (s.syllabus?.filter(t => t.isCompleted).length || 0), 0);
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const toggleTopic = async (subjectId: string, topicName: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    const newSyllabus = subject.syllabus.map(t => 
      t.name === topicName ? { ...t, isCompleted: !t.isCompleted } : t
    );
    
    try {
      await updateDoc(doc(fdb, 'userSubjects', subjectId), { syllabus: newSyllabus });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const syncCurriculum = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Ensure local DB is seeded if empty
      const localCount = await db.subjects.count();
      if (localCount === 0) {
        await seedDatabase();
      }
      
      const localSubs = await db.subjects.toArray();
      const syncPromises = localSubs.map(s => 
        setDoc(doc(fdb, 'userSubjects', `${user.uid}_${s.code}`), {
          ...s,
          id: undefined, 
          userId: user.uid,
          originalId: s.id
        })
      );

      await Promise.all(syncPromises);
      console.log("Firestore Node: Syllabus Synchronized");
    } catch (err) {
      console.error("Syllabus sync failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-6 text-center">
       <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-zinc-500">
         <Trophy size={48} />
       </div>
       <div className="space-y-2">
         <h3 className="text-xl font-bold italic tracking-tight">Sync <span className="font-light not-italic">Required</span></h3>
         <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold max-w-xs">Connecting identity is required to track and synchronize syllabus coverage across nodes.</p>
       </div>
       <button onClick={() => login()} className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform">Authorize Node</button>
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light italic tracking-tight italic">Syllabus <span className="font-bold not-italic font-bold">Tracker</span></h2>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">B.Tech Sem 4 • Coverage Analysis</p>
            <button 
              onClick={syncCurriculum}
              className="flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[8px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-white hover:text-black transition-all"
            >
              <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
              <span>Update Content</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-6">
           <div className="text-right">
              <span className="text-[10px] text-zinc-600 block uppercase font-bold tracking-widest leading-none mb-1">Global Coverage</span>
              <span className="text-2xl font-bold font-mono tracking-tighter">{overallPercentage}%</span>
           </div>
           <ProgressRing size={80} stroke={6} progress={overallPercentage} color="white" />
        </div>
      </header>

      {/* Subject Grid or Empty State */}
      {subjects.length === 0 ? (
        <div className="theme-card p-12 text-center border-dashed border-zinc-800 space-y-6">
           <div className="p-4 bg-zinc-900 w-16 h-16 rounded-2xl mx-auto text-zinc-600 flex items-center justify-center">
             <GraduationCap size={32} />
           </div>
           <div className="space-y-2">
             <h3 className="text-xl font-bold tracking-tight italic">Academic Vault <span className="font-light not-italic text-zinc-600 underline decoration-zinc-800">Empty</span></h3>
             <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold max-w-sm mx-auto">Your cloud identity has no active curriculum data. Initialize your local node with the official 2025 DBATU syllabus extraction.</p>
           </div>
           <button 
            onClick={syncCurriculum}
            disabled={loading}
            className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform disabled:opacity-50 flex items-center mx-auto space-x-2"
           >
             {loading && <RefreshCw size={12} className="animate-spin mr-2" />}
             <span>{loading ? 'Booting Node...' : 'Initialize Modules'}</span>
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjects.map(subject => {
            const completed = subject.syllabus?.filter(t => t.isCompleted).length || 0;
            const total = subject.syllabus?.length || 0;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            return (
              <motion.button
                layout
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id || null)}
                className={`theme-card p-4 transition-all text-left relative overflow-hidden group ${
                  selectedSubjectId === subject.id ? 'border-white bg-[#111]' : 'hover:border-zinc-700'
                }`}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-1 opacity-20"
                  style={{ backgroundColor: subject.color }}
                />
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-10 h-10 rounded flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: `${subject.color}22`, color: subject.color, border: `1px solid ${subject.color}44` }}
                  >
                    {subject.code.slice(-3)}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600">{completed}/{total}</span>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-tight line-clamp-2 h-8 mb-4 leading-tight group-hover:text-white transition-colors">
                  {subject.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-mono">{pct}%</span>
                  <ProgressRing size={24} stroke={3} progress={pct} color={subject.color} />
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Detailed Syllabus View */}
      <AnimatePresence mode="wait">
        {selectedSubject ? (
          <motion.div
            key={selectedSubject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="theme-card p-0 border-zinc-800 overflow-hidden"
          >
            <div className="bg-[#111] p-8 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: selectedSubject.color }}>{selectedSubject.code}</span>
                <h3 className="text-2xl font-bold tracking-tight mt-1 italic">{selectedSubject.name}</h3>
              </div>
              <div className="flex space-x-12">
                 <div className="text-center">
                    <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-[0.2em] mb-1">Time Remaining</span>
                    <span className="text-xl font-bold font-mono">
                      {(selectedSubject.syllabus || []).filter(t => !t.isCompleted).reduce((acc, t) => acc + t.timeEst, 0)} HR
                    </span>
                 </div>
                 <div className="text-center">
                    <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-[0.2em] mb-1">High Focus</span>
                    <span className="text-xl font-bold font-mono text-red-500">
                      {(selectedSubject.syllabus || []).filter(t => !t.isCompleted && t.priority === 'High').length}
                    </span>
                 </div>
              </div>
            </div>

            <div className="p-0">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-black text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                        <th className="p-6 w-16 text-center border-b border-zinc-900">Status</th>
                        <th className="p-6 border-b border-zinc-900">Topic Title & Predicted Questions</th>
                        <th className="p-6 w-32 border-b border-zinc-900">Priority</th>
                        <th className="p-6 w-32 border-b border-zinc-900">Time Est</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {(selectedSubject.syllabus || []).map((topic, index) => (
                      <tr 
                        key={index} 
                        className={`group transition-colors ${topic.isCompleted ? 'bg-zinc-950/20 opacity-60' : 'hover:bg-[#0a0a0a]'}`}
                      >
                         <td className="p-6 text-center">
                            <button 
                              onClick={() => toggleTopic(selectedSubject.id!, topic.name)}
                              className={`transition-all ${topic.isCompleted ? 'text-emerald-500' : 'text-zinc-800 hover:text-zinc-600'}`}
                            >
                               {topic.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>
                         </td>
                         <td className="p-6">
                            <div className="flex flex-col space-y-2">
                               <span className={`text-sm tracking-tight ${topic.isCompleted ? 'line-through decoration-zinc-800 text-zinc-600' : 'font-medium text-zinc-300 group-hover:text-white transition-colors'}`}>
                                 {topic.name}
                               </span>
                               <div className="flex items-center space-x-2">
                                  {topic.predictedQuestions.map(q => (
                                    <span key={q} className="text-[8px] bg-zinc-900 text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded font-mono uppercase">
                                      Predicted: {q}
                                    </span>
                                  ))}
                                  {topic.priority === 'High' && !topic.isCompleted && (
                                    <span className="text-[8px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                                      High Yield
                                    </span>
                                  )}
                               </div>
                            </div>
                         </td>
                         <td className="p-6">
                            <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${
                               topic.priority === 'High' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                               topic.priority === 'Medium' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                               'border-zinc-800 text-zinc-600'
                            }`}>
                               {topic.priority}
                            </span>
                         </td>
                         <td className="p-6">
                            <div className="flex items-center space-x-2 font-mono text-xs text-zinc-400 group-hover:text-white transition-colors">
                               <Clock size={12} className="opacity-50" />
                               <span>{topic.timeEst}H</span>
                            </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        ) : (
          <div className="theme-card p-20 flex flex-col items-center justify-center border-dashed opacity-20 text-center space-y-4">
             <Target size={48} className="text-zinc-600" />
             <div>
               <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Offspin Tracker Inactive</p>
               <p className="text-[9px] mt-2 text-zinc-500">Select a subject to analyze coverage gaps and predicted question banks</p>
             </div>
          </div>
        )}
      </AnimatePresence>

      {/* Key Legend / Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="theme-card p-8 border-zinc-900 bg-[#060606] flex items-center space-x-6">
            <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded">
               <AlertCircle size={20} className="text-red-500" />
            </div>
            <div>
               <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Priority Debt</h4>
               <p className="text-xl font-bold font-mono">
                 {subjects.reduce((acc, s) => acc + s.syllabus.filter(t => !t.isCompleted && t.priority === 'High').length, 0)} UNITS
               </p>
            </div>
         </div>
         <div className="theme-card p-8 border-zinc-900 bg-[#060606] flex items-center space-x-6">
            <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded">
               <Clock size={20} className="text-amber-500" />
            </div>
            <div>
               <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Est. Run Time</h4>
               <p className="text-xl font-bold font-mono text-white">
                 {subjects.reduce((acc, s) => acc + s.syllabus.filter(t => !t.isCompleted).reduce((a, t) => a + t.timeEst, 0), 0)} HOURS
               </p>
            </div>
         </div>
         <div className="theme-card p-8 border-zinc-900 bg-[#060606] flex items-center space-x-6">
            <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded">
               <Trophy size={20} className="text-emerald-500" />
            </div>
            <div>
               <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Peak Mastery</h4>
               <p className="text-xl font-bold font-mono">
                 {subjects.filter(s => s.syllabus.every(t => t.isCompleted)).length} MODULES
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function ProgressRing({ size, stroke, progress, color }: { size: number, stroke: number, progress: number, color: string }) {
  const radius = (size / 2) - (stroke / 2);
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        stroke="currentColor"
        strokeWidth={stroke}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        className="text-zinc-900"
      />
      <motion.circle
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
}
