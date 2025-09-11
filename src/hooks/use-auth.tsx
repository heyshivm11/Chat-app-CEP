'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const auth = getAuth(firebaseApp);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string, name: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      if (userCredential.user.displayName !== name) {
        await updateProfile(userCredential.user, { displayName: name });
        setUser({ ...userCredential.user, displayName: name });
      }
      return userCredential;
    } catch (error: any) {
      // If sign-in fails, try to sign up the user. This is a simplified flow.
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
        setUser({ ...userCredential.user, displayName: name });
        return userCredential;
      } else {
        throw error;
      }
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
