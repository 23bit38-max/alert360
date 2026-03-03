import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { getUserProfile, syncUserProfile, fetchUsers, updateUserDoc } from '@/services/firebase.service';
import { type User, MOCK_USERS } from '@/data/data';
import type { UserRole } from '@/shared/utils/rbac';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  allUsers: User[];
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<boolean>;
  mockLogin: (mockUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync current user auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile: any = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser({
              ...profile,
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              // Hydrate dates if they are Firestore Timestamps
              createdAt: profile.createdAt?.toDate?.() || new Date(),
              lastModified: profile.lastModified?.toDate?.() || new Date(),
            } as User);
          } else {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: 'New User',
              role: 'general_user',
              department: 'public',
              assignedZones: [],
              status: 'pending',
              profileCompleted: false,
              createdAt: new Date(),
              lastModified: new Date()
            } as User);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback if we fail to fetch user profile (e.g., due to Firestore permissions)
          const fallbackUser = Object.values(MOCK_USERS).find(u => u.email === firebaseUser.email);
          if (fallbackUser) {
            setUser({
              ...fallbackUser,
              id: firebaseUser.uid
            } as User);
          } else {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: 'Guest User',
              role: 'general_user',
              department: 'public',
              assignedZones: [],
              status: 'pending',
              profileCompleted: false,
              createdAt: new Date(),
              lastModified: new Date()
            } as User);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch all users for management
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const users = await fetchUsers();
        setAllUsers(users.map(u => ({
          ...u,
          createdAt: u.createdAt?.toDate?.() || new Date(),
          lastModified: u.lastModified?.toDate?.() || new Date(),
        })) as User[]);
      } catch (error) {
        console.error("Error loading all users:", error);
      }
    };

    if (user?.role === 'super_admin' || user?.role === 'police_admin') {
      loadAllUsers();
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const initialProfile = {
        uid: result.user.uid,
        email,
        name,
        role: 'general_user' as UserRole,
        department: 'public',
        assignedZones: [],
        status: 'pending' as const,
        profileCompleted: false,
        createdAt: new Date(),
        lastModified: new Date(),
        permissionToggles: {}
      };
      await syncUserProfile(result.user.uid, initialProfile);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (updatedUser: User): Promise<boolean> => {
    try {
      await updateUserDoc(updatedUser.id, updatedUser);
      setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      if (user?.id === updatedUser.id) {
        setUser(updatedUser);
      }
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  const mockLogin = (mockUser: User) => {
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, allUsers, login, logout, register, updateUser, mockLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};