import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Task } from '../db';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db as fdb } from '../firebase';
import { useAuth } from '../AuthContext';

export default function TaskManager() {
  const [firestoreTasks, setFirestoreTasks] = useState<any[]>([]);
  const { user, login } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(fdb, 'tasks'), 
      where('ownerId', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      // Client-side sorting to avoid index requirement
      tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setFirestoreTasks(tasks);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !user) return;
    await addDoc(collection(fdb, 'tasks'), {
      title: newTitle,
      date: newDate,
      completed: false,
      priority,
      description: '',
      ownerId: user.uid
    });
    setNewTitle('');
    setNewDate('');
    setShowAdd(false);
  };

  const toggleTask = async (id: string, current: boolean) => {
    await updateDoc(doc(fdb, 'tasks', id), { completed: !current });
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(fdb, 'tasks', id));
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-6 text-center">
       <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-zinc-500">
         <Calendar size={48} />
       </div>
       <div className="space-y-2">
         <h3 className="text-xl font-bold italic tracking-tight">Milestone Sync <span className="font-light not-italic">Inactive</span></h3>
         <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold max-w-xs">Connecting identity is required to persist and synchronize your schedule across nodes.</p>
       </div>
       <button onClick={() => login()} className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform">Authorize Node</button>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light italic tracking-tight">Time <span className="font-bold not-italic">Table</span></h2>
          <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-medium">Daily scheduling & optimization.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-zinc-200 transition-colors"
        >
          Initialize Task
        </button>
      </header>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={addTask} className="p-8 bg-[#111111] border border-[#222222] rounded-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Label</label>
                   <input 
                    type="text" 
                    placeholder="Enter process name..."
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Timestamp</label>
                   <input 
                    type="date" 
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Severity:</span>
                {(['low', 'medium', 'high'] as const).map(p => (
                   <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-4 py-1.5 rounded text-[9px] uppercase font-bold tracking-widest transition-all ${
                      priority === p 
                        ? 'bg-white text-black' 
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-white'
                    }`}
                   >
                     {p}
                   </button>
                ))}
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-zinc-100 text-black font-bold text-[10px] uppercase tracking-widest rounded hover:bg-white"
              >
                Register Entry
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {firestoreTasks.map((task) => (
          <motion.div 
            layout
            key={task.id} 
            className={`p-5 rounded-lg border transition-all flex items-center group ${
              task.completed 
                ? 'bg-black border-zinc-900 opacity-40' 
                : 'bg-[#111111] border-[#222222] hover:border-zinc-700'
            }`}
          >
            <div className="w-16 text-[10px] text-zinc-600 font-mono italic">
               {task.date.split('-').slice(1).join('/')}
            </div>
            
            <div className="w-[1px] h-8 bg-zinc-900 mx-4" />

            <div className="flex-1 min-w-0">
               <h4 className={`text-sm font-bold tracking-tight uppercase ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                 {task.title}
               </h4>
               <div className="flex items-center space-x-4 mt-2">
                 <div className="flex items-center">
                    <span className={`status-dot ${task.priority === 'high' ? 'bg-red-500 shadow-red-500' : task.priority === 'medium' ? 'bg-yellow-500 shadow-yellow-500' : 'bg-green-500 shadow-green-500'}`} />
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">{task.priority}</span>
                 </div>
                 {task.completed && <span className="text-[9px] uppercase tracking-widest text-zinc-700 font-bold italic">Resolved</span>}
               </div>
            </div>

            <div className="flex items-center space-x-2">
               <button 
                onClick={() => toggleTask(task.id!, task.completed)}
                className="p-2 border border-zinc-900 rounded hover:border-white transition-colors text-zinc-500 hover:text-white"
              >
                <CheckCircle2 size={16} />
              </button>
              <button 
                onClick={() => deleteTask(task.id!)}
                className="p-2 border border-zinc-900 rounded hover:border-red-900 transition-colors text-zinc-800 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}


        {firestoreTasks.length === 0 && !showAdd && !loading && (
          <div className="p-20 text-center space-y-4 border-2 border-dashed border-neutral-900 rounded-3xl">
             <div className="p-4 bg-neutral-900/50 rounded-full w-fit mx-auto text-neutral-500">
               <Calendar size={32} />
             </div>
             <div>
               <h3 className="font-bold">No tasks found</h3>
               <p className="text-neutral-500 text-sm mt-1">Start by adding your study schedule.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
