import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Dashboard from './components/Dashboard';
import Gatekeeper from './components/Gatekeeper';
import { seedDatabase } from './db.ts';
import { AuthProvider } from './AuthContext';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('dex_unlocked') === 'true');

  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('dex_unlocked', 'true');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black transition-colors duration-500">
        {loading ? (
          <Splash onComplete={() => setLoading(false)} />
        ) : !isUnlocked ? (
          <Gatekeeper onUnlock={handleUnlock} />
        ) : (
          <Dashboard />
        )}
      </div>
    </AuthProvider>
  );
}

