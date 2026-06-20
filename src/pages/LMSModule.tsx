import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserProfile {
  completedModules: string[];
  completedItems: string[]; // Added this to track sub-items
  status?: 'pending' | 'approved' | 'rejected';
  role?: 'user' | 'admin';
  email?: string;
  name?: string;
  createdAt?: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  markModuleCompleted: (moduleId: string) => Promise<void>;
  markItemCompleted: (itemId: string) => Promise<void>; // Added this
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  markModuleCompleted: async () => {},
  markItemCompleted: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or create profile
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (firebaseUser.email === 'bvmevgiessen@gmail.com' && (data.role !== 'admin' || data.status !== 'approved')) {
              const updatedProfile = { ...data, role: 'admin', status: 'approved', completedModules: data.completedModules || [], completedItems: data.completedItems || [] } as UserProfile;
              await setDoc(docRef, { role: 'admin', status: 'approved' }, { merge: true });
              setProfile(updatedProfile);
            } else {
              setProfile({ ...data, completedModules: data.completedModules || [], completedItems: data.completedItems || [] });
            }
          } else {
            const isAdmin = firebaseUser.email === 'bvmevgiessen@gmail.com';
            const newProfile: UserProfile = { 
              completedModules: [],
              completedItems: [],
              status: isAdmin ? 'approved' : 'pending',
              role: isAdmin ? 'admin' : 'user',
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              createdAt: Date.now()
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching/creating profile:", error);
          setProfile({ completedModules: [], completedItems: [] } as any); // default fallback
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const markModuleCompleted = async (moduleId: string) => {
    if (!user || !profile) return;
    if (profile.completedModules?.includes(moduleId)) return;

    const newCompleted = [...(profile.completedModules || []), moduleId];
    setProfile({ ...profile, completedModules: newCompleted });
    
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { completedModules: newCompleted }, { merge: true });
    } catch (error) {
      console.error("Error marking module completed:", error);
    }
  };

  const markItemCompleted = async (itemId: string) => {
    if (!user || !profile) return;
    if (profile.completedItems?.includes(itemId)) return;

    const newCompleted = [...(profile.completedItems || []), itemId];
    setProfile({ ...profile, completedItems: newCompleted });
    
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { completedItems: newCompleted }, { merge: true });
    } catch (error) {
      console.error("Error marking item completed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, markModuleCompleted, markItemCompleted }}>
      {children}
    </AuthContext.Provider>
  );
}
