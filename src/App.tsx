import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Dashboard from './components/Dashboard';
import { seedDatabase } from './db.ts';
import { AuthProvider } from './AuthContext';
import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { db as fdb } from './firebase';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDatabase().catch(console.error);
    
    // Validate Connection to Firestore
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(fdb, 'test', 'connection'));
        console.log("Firestore Node: Connection Established");
      } catch (error) {
        console.error("Firestore Node: Connectivity Error", error);
      }
    };
    testConnection();
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

