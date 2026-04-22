import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clipboard as ClipboardIcon, Copy, Check, Share2, RefreshCw } from 'lucide-react';
import { doc, onSnapshot, setDoc, serverTimestamp, collection, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db as fdb } from '../firebase';
import { useAuth } from '../AuthContext';

export default function LiveClipboard() {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [updatedBy, setUpdatedBy] = useState('System');
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [pastingError, setPastingError] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [stream, setStream] = useState<any[]>([]);
  const { user, login } = useAuth();
  const lastLocalValue = React.useRef<string>('');

  // 1. Shared Buffer Listener (Direct Overwrite Mode)
  useEffect(() => {
    const unsub = onSnapshot(doc(fdb, 'clipboard', 'global'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const remoteContent = data.content || '';
        
        // Overwrite local state if server has new data that we didn't just send
        if (remoteContent !== lastLocalValue.current) {
          setContent(remoteContent);
          lastLocalValue.current = remoteContent;
          setLastUpdated(data.lastUpdated || 0);
          setUpdatedBy(data.updatedBy || 'Peer');
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // 2. Global Stream Listener (The "Chat")
  useEffect(() => {
    const q = query(collection(fdb, 'clipboard_stream'), orderBy('timestamp', 'desc'), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      setStream(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleUpdate = async (val: string) => {
    if (!user) return;
    lastLocalValue.current = val;
    setContent(val);
    setIsDirty(true);
    
    try {
      const pushTime = Date.now();
      await setDoc(doc(fdb, 'clipboard', 'global'), {
        content: val,
        lastUpdated: pushTime,
        updatedBy: user.displayName || user.email || 'Anonymous',
        serverTimestamp: serverTimestamp()
      }, { merge: true });
      
      setLastUpdated(pushTime);
      setIsDirty(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const pushToStream = async () => {
    if (!user || !content.trim()) return;
    setSyncing(true);
    try {
      await addDoc(collection(fdb, 'clipboard_stream'), {
        content: content,
        author: user.displayName,
        authorPhoto: user.photoURL,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp()
      });
      // Optionally clear after push to stream? 
      // User said "no locks", so let's just keep it as a history push
    } catch (err) {
      console.error("Stream push failed", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleCopy = (text?: string) => {
    navigator.clipboard.writeText(text || content);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
      setIsDirty(true);
      handleUpdate(text);
    } catch (err) {
      setPastingError(true);
      setTimeout(() => setPastingError(false), 5000);
    }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-6 text-center">
       <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-zinc-500">
         <ClipboardIcon size={48} />
       </div>
       <div className="space-y-2">
         <h3 className="text-xl font-bold italic tracking-tight">Stream Access <span className="font-light not-italic">Restricted</span></h3>
         <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold max-w-xs">Connecting identity is required to interact with the real-time clipboard stream.</p>
       </div>
       <button onClick={() => login()} className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform">Authorize Node</button>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <RefreshCw className="animate-spin text-zinc-600" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
      {/* Live Node (Textarea Section) */}
      <div className="xl:col-span-2 space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-light italic tracking-tight italic">Live <span className="font-bold not-italic font-bold">Node</span></h2>
            <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-medium italic">Shared real-time world buffer.</p>
          </div>
          <div className="flex items-center space-x-2">
             <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 bg-zinc-950 border border-zinc-900 px-4 py-2 rounded flex items-center">
                <span className={`status-dot ${isDirty ? 'animate-pulse bg-blue-500 shadow-blue-500' : 'bg-green-500 shadow-green-500'}`}></span>
                {isDirty ? 'Broadcasting...' : 'Node Synchronized'}
             </div>
          </div>
        </header>

        <div className="theme-card p-0 overflow-hidden border-zinc-800 shadow-2xl">
          <div className="bg-[#151515] border-b border-zinc-900 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Live Stream Buffer</span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={pushToStream}
                className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-bold uppercase rounded-full hover:bg-blue-500 transition-all flex items-center"
              >
                <Share2 size={10} className="mr-2" />
                Push to Stream
              </button>
              <button 
                onClick={() => handleCopy()}
                className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-bold uppercase rounded-full hover:bg-white hover:text-black transition-all"
              >
                {copying ? 'Copied' : 'Copy Node'}
              </button>
            </div>
          </div>
          
          <textarea 
            className="w-full h-[500px] bg-black p-10 text-zinc-200 font-mono text-base focus:outline-none resize-none leading-relaxed custom-scrollbar selection:bg-blue-500/30"
            value={content}
            onChange={(e) => handleUpdate(e.target.value)}
            placeholder="Type anything... anyone can see this LIVE worldwide."
          />

          <div className="bg-[#0a0a0a] border-t border-zinc-900 px-6 py-3 flex justify-between items-center">
            <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
              Last Pulse: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[9px] text-zinc-500 font-mono uppercase">Operator: {updatedBy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Stream (Chat-like Section) */}
      <div className="space-y-6">
        <header>
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500 mb-1">Global Stream</h3>
          <p className="text-[10px] text-zinc-700 italic">Chronological broadcast history</p>
        </header>

        <div className="space-y-4 h-[650px] overflow-y-auto pr-2 custom-scrollbar">
          {stream.length === 0 && (
            <div className="py-10 text-center opacity-20">
               <Share2 size={24} className="mx-auto mb-2" />
               <p className="text-[10px] uppercase font-bold tracking-widest">Stream Empty</p>
            </div>
          )}
          {stream.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={msg.id} 
              className="theme-card p-4 border-zinc-900 bg-[#080808] space-y-3 group hover:border-zinc-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <img src={msg.authorPhoto} alt="" className="w-5 h-5 rounded-full ring-1 ring-zinc-800" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{msg.author}</span>
                </div>
                <span className="text-[8px] font-mono text-zinc-700 uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed break-words whitespace-pre-wrap line-clamp-4 group-hover:line-clamp-none transition-all">
                {msg.content}
              </p>
              <div className="flex justify-end pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => handleCopy(msg.content)}
                  className="text-[8px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white"
                 >
                   Inject to Local
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
