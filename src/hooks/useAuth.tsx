import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
 
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  profile: any | null;
}
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
 
  const fetchProfile = async (userId: string): Promise<void> => {
    try {
      const startTime = performance.now();
      console.log(`Fetching profile for user: ${userId}`);
      
      // Add a timeout to prevent hanging forever
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
      );

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
 
      const endTime = performance.now();
      console.log(`Profile fetch took ${(endTime - startTime).toFixed(2)}ms`);

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        console.log('Profile loaded:', data);
        setProfile(data);
      }
    } catch (err: any) {
      console.error('Profile fetch error (continuing anyway):', err.message);
      // Don't block loading even if profile fetch fails
      setProfile(null);
    }
  };
 
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const startTime = performance.now();
    console.log('Initializing auth...');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      const endTime = performance.now();
      console.log(`Auth getSession took ${(endTime - startTime).toFixed(2)}ms`);
      
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log(`User logged in: ${session.user.id}`);
        fetchProfile(session.user.id).finally(() => {
          if (mounted) {
            console.log('Setting loading to false after profile fetch');
            setLoading(false);
          }
        });
      } else {
        console.log('No active session');
        setLoading(false);
      }
    }).catch(err => {
      console.error('Failed to get session:', err);
      if (mounted) {
        console.log('Setting loading to false due to error');
        setLoading(false);
      }
    });
 
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event);
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
 
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
 
  const signOut = async () => {
    // FIX: Clear local state immediately so UI responds without waiting for listener
    setUser(null);
    setSession(null);
    setProfile(null);
 
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signOut error:', error);
    }
  };
 
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };
 
  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, profile, refreshProfile }}>
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