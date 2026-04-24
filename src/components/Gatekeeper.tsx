import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface GatekeeperProps {
  onUnlock: () => void;
}

export default function Gatekeeper({ onUnlock }: GatekeeperProps) {
  const { unlockAdmin, user } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleInput = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    
    const newPin = [...pin];
    newPin[index] = val.slice(-1);
    setPin(newPin);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  useEffect(() => {
    const verify = async () => {
      if (pin.every(digit => digit !== '')) {
        const entry = pin.join('');
        setIsVerifying(true);
        
        try {
          // If user is logged in, try elevating to Admin in Cloud
          if (user) {
            const success = await unlockAdmin(entry);
            if (success) {
              onUnlock();
              return;
            }
          } else if (entry === '9763') {
            // Local fallback if no user node yet
            onUnlock();
            return;
          }

          // Error state
          setError(true);
          setAttempts(prev => prev + 1);
          setTimeout(() => {
            setPin(['', '', '', '']);
            setError(false);
            document.getElementById('pin-0')?.focus();
          }, 1000);
        } catch (err) {
          setError(true);
        } finally {
          setIsVerifying(false);
        }
      }
    };
    
    verify();
  }, [pin, onUnlock, unlockAdmin, user]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100] px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12 relative"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-8 relative">
             {isVerifying ? (
               <Loader2 className="animate-spin text-white" size={24} />
             ) : (
               <Shield className={`text-white transition-colors duration-300 ${error ? 'text-red-500' : ''}`} size={24} />
             )}
             {error && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1"
               >
                 <AlertTriangle size={12} className="text-white" />
               </motion.div>
             )}
          </div>
          <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Identity <span className="font-light not-italic">Required</span></h2>
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">Secure Node Access Protocol [STRICT]</p>
        </div>

        <div className="flex justify-center space-x-4">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="password"
              inputMode="numeric"
              value={digit}
              autoFocus={i === 0}
              onChange={(e) => handleInput(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`w-14 h-18 bg-zinc-950 border-2 rounded-xl text-center text-2xl font-bold transition-all duration-300 focus:outline-none ${
                error 
                  ? 'border-red-900 bg-red-900/10 text-red-500' 
                  : (digit ? 'border-white bg-zinc-900' : 'border-zinc-900 focus:border-zinc-700')
              }`}
            />
          ))}
        </div>

        <div className="space-y-6 pt-10">
          <div className="flex items-center justify-between text-[8px] uppercase font-bold tracking-[0.2em] text-zinc-700 px-2">
             <span>Attempts: {attempts}</span>
             <span>Status: {error ? 'Denied' : 'Awaiting Entry'}</span>
          </div>
          <div className="w-full h-[1px] bg-zinc-900 relative">
             <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: pin.filter(d => d).length / 4 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
             />
          </div>
        </div>

        <div className="text-center">
           <p className="text-[10px] text-zinc-800 font-mono italic">
             Restricted to registered B.Tech 4th Sem Node Operators
           </p>
        </div>
      </motion.div>
    </div>
  );
}
