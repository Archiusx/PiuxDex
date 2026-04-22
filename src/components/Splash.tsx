import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LOADING_STEPS = [
  "setting up your workspace",
  "Setting Device performance",
  "setting up environment",
  "connecting to Piyush Deshkar World"
];

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex < LOADING_STEPS.length) {
      const timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 z-50 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-lg space-y-12"
      >
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-12 h-12 bg-white flex items-center justify-center rounded"
          >
            <span className="text-black font-bold text-xl uppercase">P</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold tracking-tighter text-white uppercase text-center"
          >
            PIUX Dex
          </motion.h1>
        </div>

        <div className="pt-12 mt-12 border-t border-zinc-900 w-full">
           <div className="loading-line">
             <div className="loading-line-active" />
           </div>

          <div className="mt-4 flex justify-between items-start">
            <div className="space-y-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[10px] sm:text-xs tracking-widest uppercase text-white font-medium"
                >
                  {LOADING_STEPS[stepIndex] || "System Ready"}...
                </motion.p>
              </AnimatePresence>
              <p className="text-[9px] text-zinc-500 font-light">Connecting to Piyush Deshkar World</p>
            </div>
            
            <div className="hidden sm:flex space-x-6">
               <div className="flex flex-col items-end space-y-1">
                 <span className="text-[9px] uppercase tracking-widest text-zinc-600">Performance</span>
                 <span className="text-[9px] uppercase tracking-widest text-zinc-400">Optimized</span>
               </div>
               <div className="flex flex-col items-end space-y-1">
                 <span className="text-[9px] uppercase tracking-widest text-zinc-600">Environment</span>
                 <span className="text-[9px] uppercase tracking-widest text-zinc-400">Ready</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
