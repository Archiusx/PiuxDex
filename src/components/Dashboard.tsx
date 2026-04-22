import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  FolderRoot, 
  GraduationCap,
  Settings,
  Menu,
  X,
  Clipboard as ClipboardIcon
} from 'lucide-react';
import HomeView from './HomeView';
import AcademicVault from './AcademicVault';
import TaskManager from './TaskManager';
import ResourceCenter from './ResourceCenter';
import LiveClipboard from './LiveClipboard';
import SyllabusTracker from './SyllabusTracker';

type View = 'dashboard' | 'academic' | 'tasks' | 'resources' | 'clipboard' | 'syllabus';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
    { id: 'academic', name: 'Academic Vault', icon: GraduationCap },
    { id: 'tasks', name: 'Task Manager', icon: Calendar },
    { id: 'syllabus', name: 'Syllabus Tracker', icon: BookOpen },
    { id: 'resources', name: 'Resource Center', icon: FolderRoot },
    { id: 'clipboard', name: 'Live Clipboard', icon: ClipboardIcon },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <HomeView setActiveView={setActiveView} />;
      case 'academic': return <AcademicVault />;
      case 'tasks': return <TaskManager />;
      case 'resources': return <ResourceCenter />;
      case 'clipboard': return <LiveClipboard />;
      case 'syllabus': return <SyllabusTracker />;
      default: return <HomeView setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 bg-black border-r border-zinc-800 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
              <span className="text-black font-bold uppercase text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold tracking-tighter uppercase">PIUX DEX</h1>
          </div>
          
          <nav className="space-y-4 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as View);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-2 py-1 transition-all duration-200 group ${
                    activeView === item.id 
                      ? 'text-white' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={activeView === item.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'} />
                  <span className="font-medium text-sm tracking-tight">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-zinc-800 mt-auto">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">BTECH SEM 4 • DBATU</p>
            <div className="flex items-center justify-between text-[9px] text-zinc-400">
               <span>V 1.0.4-STABLE</span>
               <div className="flex items-center">
                 <span className="status-dot"></span>
                 IDB ACTIVE
               </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black text-white">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 lg:hidden">
          <h1 className="text-lg font-bold tracking-tighter uppercase">Piux Dex</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-400 hover:text-white">
            <Menu size={24} />
          </button>
        </header>

        {/* Global Desktop Header Info */}
        <header className="hidden lg:flex h-20 items-center justify-between px-10 border-b border-zinc-900">
           <div className="flex items-center space-x-4">
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-600 font-bold">System Status</span>
              <div className="flex items-center space-x-6 text-[10px] uppercase tracking-widest text-zinc-400">
                <span className="flex items-center"><span className="status-dot"></span> IDB Online</span>
                <span className="flex items-center opacity-50"><span className="status-dot bg-zinc-600 shadow-none"></span> Syncing...</span>
              </div>
           </div>
           <div className="text-[10px] uppercase tracking-widest text-zinc-600 border border-zinc-900 px-3 py-1.5 rounded">
              DBATU LONERE • CSE DEPT
           </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 custom-scrollbar">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto w-full"
          >
            {renderView()}
          </motion.div>
        </div>
      </main>

    </div>
  );
}
