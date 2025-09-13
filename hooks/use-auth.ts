'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser } from '@/lib/auth';
import { User, UserRole } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugRole, setDebugRole] = useState<UserRole | null>(null);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const switchRole = (role: UserRole) => {
    setDebugRole(role);
  };

  const getEffectiveUser = (): User | null => {
    if (!user) return null;
    
    // If debug role is set, return user with switched role
    if (debugRole) {
      return {
        ...user,
        role: debugRole
      };
    }
    
    return user;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(user => {
      setUser(user);
      setLoading(false);
      // Reset debug role when user changes
      setDebugRole(null);
    });

    return unsubscribe;
  }, []);

  return {
    user: getEffectiveUser(),
    originalUser: user,
    loading,
    isAuthenticated: !!user,
    refreshUser,
    switchRole,
    debugRole,
  };
}
