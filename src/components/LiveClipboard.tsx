import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clipboard as ClipboardIcon, Copy, Check, Share2, RefreshCw } from 'lucide-react';

export default function LiveClipboard() {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [updatedBy, setUpdatedBy] = useState('System');
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [pastingError, setPastingError] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const fetchClipboard = async (silent = false) => {
    // BLOCK overwriting if user has unsaved changes or is focused
    if ((isFocused || isDirty) && silent) return; 
    
    if (!silent) setLoading(true);
    else setSyncing(true);
    
    try {
      const res = await fetch('/api/clipboard');
      const data = await res.json();
      
      // Only update if something actually changed on server
      if (data.lastUpdated > lastUpdated) {
        setContent(data.content);
        setLastUpdated(data.lastUpdated);
        setUpdatedBy(data.updatedBy);
      }
    } catch (err) {
      console.error("Clipboard fetch failed", err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchClipboard();
    // Poll every 5 seconds for sync to reduce race conditions
    const interval = setInterval(() => fetchClipboard(true), 5000);
    return () => clearInterval(interval);
  }, [lastUpdated]); // Dependency on lastUpdated to ensure fresh checks

  const handleUpdate = async () => {
    setSyncing(true);
    try {
      await fetch('/api/clipboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, user: "Piux User" })
      });
      setIsDirty(false);
      // Immediately fetch back to sync timestamps
      const res = await fetch('/api/clipboard');
      const data = await res.json();
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
      setIsDirty(true);
      // Auto-upload on paste
      await fetch('/api/clipboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, user: "Piux User" })
      });
      setIsDirty(false);
    } catch (err) {
      console.error("Paste failed", err);
      setPastingError(true);
      setTimeout(() => setPastingError(false), 5000);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="animate-spin text-zinc-600" />
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light italic tracking-tight italic">Live <span className="font-bold not-italic font-bold">Clipboard</span></h2>
          <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-medium">Synced across all devices instantly.</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
           {pastingError && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-[9px] text-red-500 font-bold uppercase tracking-tighter bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded"
             >
               Use Ctrl+V to paste manually
             </motion.div>
           )}
           <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 bg-zinc-950 border border-zinc-900 px-4 py-2 rounded flex items-center">
              <span className={`status-dot ${syncing ? 'animate-pulse' : ''}`}></span>
              {syncing ? 'Syncing...' : 'Encrypted & Shared'}
           </div>
        </div>
      </header>

      <div className="theme-card p-0 overflow-hidden border-zinc-800">
        <div className="bg-[#151515] border-b border-zinc-900 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Share2 size={14} className="text-zinc-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Global Space</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleUpdate}
              disabled={!isDirty}
              className={`px-3 py-1 text-[9px] font-bold uppercase rounded flex items-center transition-all ${
                isDirty 
                  ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                  : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              }`}
            >
              Push to Live
            </button>
            <button 
              onClick={handleCopy}
              className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-bold uppercase rounded flex items-center hover:bg-white hover:text-black transition-all"
            >
              {copying ? <Check size={10} className="mr-1" /> : <Copy size={10} className="mr-1" />}
              {copying ? 'Copied' : 'Copy'}
            </button>
            <button 
              onClick={handlePaste}
              className="px-3 py-1 bg-white text-black text-[9px] font-bold uppercase rounded hover:bg-zinc-200 transition-all"
            >
              Paste & Sync
            </button>
          </div>
        </div>
        
        <textarea 
          className="w-full h-96 bg-black p-8 text-zinc-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsDirty(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholder="Type or paste here..."
        />

        <div className="bg-[#0a0a0a] border-t border-zinc-900 px-6 py-2 flex justify-between items-center">
          <div className="text-[9px] text-zinc-600 font-mono uppercase">
            Updated: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
          <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
            Source: {updatedBy}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
        <div className="theme-card p-6 border-zinc-900 flex items-start space-x-4">
           <div className="p-3 bg-zinc-900 rounded-lg text-zinc-500">
             <RefreshCw size={18} />
           </div>
           <div>
             <h4 className="text-xs font-bold uppercase text-zinc-400 mb-1">Live Polling</h4>
             <p className="text-[10px] text-zinc-600">The clipboard syncs every 3 seconds across all browser sessions automatically.</p>
           </div>
        </div>
        <div className="theme-card p-6 border-zinc-900 flex items-start space-x-4">
           <div className="p-3 bg-zinc-900 rounded-lg text-zinc-500">
             <ClipboardIcon size={18} />
           </div>
           <div>
             <h4 className="text-xs font-bold uppercase text-zinc-400 mb-1">Device Agnostic</h4>
             <p className="text-[10px] text-zinc-600">Copy code on your PC, and it's instantly available on your phone via the same URL.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
