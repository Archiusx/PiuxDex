import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Dashboard from './components/Dashboard';
import { seedDatabase } from './db.ts';
import { AuthProvider } from './AuthContext';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black transition-colors duration-500">
        {loading ? (
          <Splash onComplete={() => setLoading(false)} />
        ) : (
          <Dashboard />
        )}
      </div>
    </AuthProvider>
  );
}

