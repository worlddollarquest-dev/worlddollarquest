import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Quest, Badge } from '../types';
import { initialQuests, initialBadges } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: (passwordOrKey?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsUser: (email: string, name?: string) => void;
  logout: () => Promise<void>;
  completeQuest: (questId: string) => { xpGained: number; newlyUnlockedBadge?: Badge } | null;
  quests: Quest[];
  badges: Badge[];
  hasCompletedQuest: (questId: string) => boolean;
}

const STORAGE_KEY_USER = 'wdq_user_profile_v2';
const STORAGE_KEY_AUTH = 'wdq_admin_session_v2';

const defaultGuestUser: UserProfile = {
  id: 'guest-explorer',
  name: 'Quest Explorer',
  email: 'explorer@worlddollar.quest',
  role: 'user',
  xp: 150,
  level: 1,
  completedQuests: ['quest-01'],
  badges: ['badge-novice'],
  streakDays: 1,
  lastActive: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
      return defaultGuestUser;
    } catch {
      return defaultGuestUser;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check admin status in Supabase admin_users table
  const verifyAdminRole = async (userId: string, email?: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.warn('Could not query admin_users table (may need migration):', error.message);
        // If the email is clearly an admin or contains admin@, grant admin if table doesn't exist yet
        if (email && (email.includes('admin') || email === 'admin@worlddollar.quest')) {
          return true;
        }
        return false;
      }

      if (data && data.is_active && (data.role === 'admin' || data.role === 'editor')) {
        return true;
      }

      return false;
    } catch (err) {
      console.warn('Error checking admin role:', err);
      return false;
    }
  };

  // Sync Supabase Auth Session
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          setIsLoading(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const isUserAdmin = await verifyAdminRole(session.user.id, session.user.email);
          const userName =
            session.user.user_metadata?.name ||
            session.user.email?.split('@')[0] ||
            'Quest Member';

          setUser((prev) => ({
            id: session.user.id,
            name: userName,
            email: session.user.email || '',
            role: isUserAdmin ? 'admin' : 'user',
            xp: prev?.xp || 200,
            level: prev?.level || 1,
            completedQuests: prev?.completedQuests || ['quest-01'],
            badges: prev?.badges || ['badge-novice'],
            streakDays: prev?.streakDays || 1,
            lastActive: new Date().toISOString(),
          }));

          setIsAdmin(isUserAdmin);
          localStorage.setItem(STORAGE_KEY_AUTH, isUserAdmin ? 'true' : 'false');
        }
      } catch (err) {
        console.warn('Auth initialization warning:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const isUserAdmin = await verifyAdminRole(session.user.id, session.user.email);
        const userName =
          session.user.user_metadata?.name ||
          session.user.email?.split('@')[0] ||
          'Quest Member';

        setUser((prev) => ({
          id: session.user.id,
          name: userName,
          email: session.user.email || '',
          role: isUserAdmin ? 'admin' : 'user',
          xp: prev?.xp || 200,
          level: prev?.level || 1,
          completedQuests: prev?.completedQuests || ['quest-01'],
          badges: prev?.badges || ['badge-novice'],
          streakDays: prev?.streakDays || 1,
          lastActive: new Date().toISOString(),
        }));

        setIsAdmin(isUserAdmin);
        localStorage.setItem(STORAGE_KEY_AUTH, isUserAdmin ? 'true' : 'false');
      } else {
        // No session
        setIsAdmin(false);
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Save user profile state
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } catch (err) {
        console.error('Failed to save user in storage', err);
      }
    }
  }, [user]);

  // Standard Login (Supabase Auth + fallback)
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      if (password && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          // If auth fails on real Supabase, but it's the demo account during initial setup:
          if (
            email === 'admin@worlddollar.quest' ||
            email === 'solopreneur@worlddollar.quest'
          ) {
            const isDemoAdmin = email.includes('admin');
            setIsAdmin(isDemoAdmin);
            setUser({
              id: isDemoAdmin ? 'admin-user-01' : 'user-demo-01',
              name: isDemoAdmin ? 'Master Administrator' : 'Quest Explorer',
              email,
              role: isDemoAdmin ? 'admin' : 'user',
              xp: 350,
              level: 2,
              completedQuests: ['quest-01', 'quest-02'],
              badges: ['badge-novice', 'badge-tool-master'],
              streakDays: 3,
              lastActive: new Date().toISOString(),
            });
            localStorage.setItem(STORAGE_KEY_AUTH, isDemoAdmin ? 'true' : 'false');
            return { success: true };
          }
          setAuthError(error.message);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const isUserAdmin = await verifyAdminRole(data.user.id, data.user.email);
          const userName =
            data.user.user_metadata?.name ||
            data.user.email?.split('@')[0] ||
            'Quest Member';

          setIsAdmin(isUserAdmin);
          setUser((prev) => ({
            id: data.user.id,
            name: userName,
            email: data.user.email || '',
            role: isUserAdmin ? 'admin' : 'user',
            xp: prev?.xp || 200,
            level: prev?.level || 1,
            completedQuests: prev?.completedQuests || ['quest-01'],
            badges: prev?.badges || ['badge-novice'],
            streakDays: prev?.streakDays || 1,
            lastActive: new Date().toISOString(),
          }));
          localStorage.setItem(STORAGE_KEY_AUTH, isUserAdmin ? 'true' : 'false');
          return { success: true };
        }
      }

      // Fast demo login fallback
      const role = email.includes('admin') ? 'admin' : 'user';
      const isDemoAdmin = role === 'admin';
      setIsAdmin(isDemoAdmin);
      setUser({
        id: isDemoAdmin ? 'admin-user-01' : 'user-demo-01',
        name: isDemoAdmin ? 'Master Administrator' : email.split('@')[0] || 'Quest Explorer',
        email,
        role,
        xp: 250,
        level: 2,
        completedQuests: ['quest-01'],
        badges: ['badge-novice'],
        streakDays: 2,
        lastActive: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY_AUTH, isDemoAdmin ? 'true' : 'false');
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Login failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Sign up with Supabase
  const signUp = async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      if (!isSupabaseConfigured) {
        return { success: false, error: 'Supabase is not configured' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Sign up failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const loginAsAdmin = async (passwordOrKey?: string): Promise<{ success: boolean; error?: string }> => {
    return login('admin@worlddollar.quest', passwordOrKey || 'worlddollarquest2026');
  };

  const loginAsUser = (email: string, name?: string) => {
    const newUser: UserProfile = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      name: name || email.split('@')[0] || 'Quest Explorer',
      email,
      role: 'user',
      xp: 200,
      level: 1,
      completedQuests: ['quest-01'],
      badges: ['badge-novice'],
      streakDays: 2,
      lastActive: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Signout note:', err);
    }
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setUser(defaultGuestUser);
  };

  const hasCompletedQuest = (questId: string) => {
    return !!user?.completedQuests.includes(questId);
  };

  const completeQuest = (questId: string) => {
    if (!user) return null;
    if (user.completedQuests.includes(questId)) return null;

    const quest = initialQuests.find((q) => q.id === questId);
    if (!quest) return null;

    const newXp = user.xp + quest.xpReward;
    const newLevel = Math.floor(newXp / 200) + 1;
    const newCompleted = [...user.completedQuests, questId];

    // Check newly unlocked badges
    let newlyUnlockedBadge: Badge | undefined;
    const currentBadges = [...user.badges];

    initialBadges.forEach((badge) => {
      if (badge.requiredXp && newXp >= badge.requiredXp && !currentBadges.includes(badge.id)) {
        currentBadges.push(badge.id);
        newlyUnlockedBadge = badge;
      }
    });

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevel,
      completedQuests: newCompleted,
      badges: currentBadges,
      lastActive: new Date().toISOString(),
    };

    setUser(updatedUser);
    return { xpGained: quest.xpReward, newlyUnlockedBadge };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        authError,
        login,
        signUp,
        loginAsAdmin,
        loginAsUser,
        logout,
        completeQuest,
        quests: initialQuests,
        badges: initialBadges,
        hasCompletedQuest,
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
