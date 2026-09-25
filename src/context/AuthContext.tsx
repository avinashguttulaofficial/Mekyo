import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { fetchUserProfile, updateUserProfile as apiUpdateUserProfile } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPro: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshUser = async () => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id);
      setUser(profile);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    if (supabase) {
      refreshUser().finally(() => setIsInitializing(false));
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setIsInitializing(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    if (!supabase) return { success: false, error: 'Database connection not configured' };
    const { error, data } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, error: error.message };
    
    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      if (profile?.status === 'suspended') {
        await supabase.auth.signOut();
        return { success: false, error: 'Your account has been suspended by administration.' };
      }
      setUser(profile);
    }
    return { success: true };
  };

  const signup = async (email: string, pass: string, fullName: string) => {
    if (!supabase) return { success: false, error: 'Database connection not configured' };
    const { error, data } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: { full_name: fullName }
      }
    });
    
    if (error) return { success: false, error: error.message };
    
    if (data.session) {
      // If we got a session, email confirmation was off
      const profile = await fetchUserProfile(data.user!.id);
      setUser(profile);
      return { success: true };
    } else if (data.user) {
      // Email confirmation is required
      return { success: true, error: 'confirmation_required' };
    }
    
    return { success: false, error: 'Failed to create account' };
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (!supabase) return { success: false, error: 'Database connection not configured' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const updatePassword = async (password: string) => {
    if (!supabase) return { success: false, error: 'Database connection not configured' };
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !supabase) return;
    const updated = { ...user, ...data, updated_at: new Date().toISOString() };
    await apiUpdateUserProfile(user.id, updated);
    setUser(updated);
  };

  if (isInitializing) {
    // Optionally return a loading spinner here
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isPro: user?.plan === 'pro',
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
