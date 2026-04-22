import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  unlockAdmin: (pin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db as fdb } from './firebase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('dex_admin_access') === 'true');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (user) {
      try {
        await deleteDoc(doc(fdb, 'admins', user.uid));
      } catch (e) {
        // Might fail if not an admin, that's fine
      }
    }
    await signOut(auth);
    setIsAdmin(false);
    localStorage.removeItem('dex_admin_access');
  };

  const unlockAdmin = async (pin: string) => {
    if (pin === '9763' && user) {
      try {
        await setDoc(doc(fdb, 'admins', user.uid), { 
          pin, 
          unlockedAt: Date.now() 
        });
        setIsAdmin(true);
        localStorage.setItem('dex_admin_access', 'true');
        return true;
      } catch (e) {
        console.error("Admin unlock failed in cloud", e);
        return false;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, unlockAdmin: (pin) => unlockAdmin(pin) as any }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
