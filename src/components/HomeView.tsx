import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ArrowRight, Calendar, CheckCircle, GraduationCap } from 'lucide-react';

export default function HomeView({ setActiveView }: { setActiveView: (v: any) => void }) {
  const subjects = useLiveQuery(() => db.subjects.toArray()) || [];
  const tasks = useLiveQuery(() => db.tasks.limit(3).toArray()) || [];
  
  const totalESEProgress = subjects.length > 0 
    ? Math.round(subjects.reduce((acc, curr) => acc + (curr.ese > 0 ? 1 : 0), 0) / subjects.length * 100)
    : 0;

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-light tracking-tight italic">System <span className="font-bold not-italic">Dashboard</span></h2>
        <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-medium">B.Tech 4th Semester • DBATU Lonere</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="theme-card p-6 border-zinc-800">
          <GraduationCap size={18} className="mb-4 text-white opacity-50" />
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">CA 1 Average</h3>
          <p className="text-3xl font-bold mt-1 tracking-tighter">18.4 <span className="text-xs font-normal opacity-20">/ 20</span></p>
          <div className="mt-6 w-full h-[1px] bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `92%` }} />
          </div>
        </div>

        <div className="theme-card p-6 border-zinc-800">
          <Calendar size={18} className="mb-4 text-white opacity-50" />
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">CA 2 Average</h3>
          <p className="text-3xl font-bold mt-1 tracking-tighter">17.2 <span className="text-xs font-normal opacity-20">/ 20</span></p>
          <button onClick={() => setActiveView('tasks')} className="mt-6 text-[9px] uppercase tracking-widest font-bold text-zinc-400 hover:text-white flex items-center group transition-colors">
            Manage Portfolio <ArrowRight size={10} className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="theme-card p-6 border-zinc-800">
          <CheckCircle size={18} className="mb-4 text-white opacity-50" />
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">ESE Confidence</h3>
          <p className="text-3xl font-bold mt-1 tracking-tighter">84%</p>
          <p className="mt-6 text-[10px] text-zinc-600 italic">Analytical forecast based on CA performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center">
            Subject Performance
          </h3>
          <div className="space-y-4">
            {subjects.slice(0, 4).map(sub => (
              <div key={sub.id} className="p-5 bg-[#111111] border border-[#222222] rounded-lg hover:border-zinc-700 transition-all cursor-default group">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">{sub.name}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-medium">Focus: {sub.topics[0]}</p>
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono bg-black px-2 py-1 rounded">
                    CA1: {sub.ca1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">Upcoming Milestones</h3>
          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map(task => (
              <div key={task.id} className="p-5 bg-[#111111] border border-[#222222] rounded-lg flex items-center space-x-6">
                <div className="w-10 text-[10px] text-zinc-600 font-mono text-center leading-tight">
                   {task.date.split('-').slice(1).join('/')}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold tracking-tight">{task.title.toUpperCase()}</h4>
                  <div className="flex items-center mt-1">
                    <span className="status-dot scale-75 opacity-50"></span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{task.priority} Priority</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 border border-zinc-900 bg-[#050505] rounded-xl flex flex-col items-center justify-center text-center">
                <p className="text-zinc-600 text-xs uppercase tracking-widest">Repository Empty</p>
                <button onClick={() => setActiveView('tasks')} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors underline underline-offset-8">Schedule System</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
