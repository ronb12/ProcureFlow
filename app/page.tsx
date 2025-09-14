'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  console.log('HomePage component rendered');
  const { user, loading, originalUser, switchRole } = useAuth();
  const router = useRouter();

  // Force clear any debug role when home page loads
  useEffect(() => {
    switchRole(null);
  }, [switchRole]);

  useEffect(() => {
    console.log('HomePage useEffect - loading:', loading, 'user:', !!user);
    if (!loading) {
      if (user) {
        // Always use original user role for routing, never debug role
        const actualRole = originalUser?.role || user?.role;
        
        // Comprehensive debug logging
        console.log('=== HOMEPAGE ROUTING DEBUG ===');
        console.log('User email:', user.email);
        console.log('User role (effective):', user.role);
        console.log('Original user role:', originalUser?.role);
        console.log('Actual role (for routing):', actualRole);
        console.log('Original user object:', originalUser);
        console.log('User object:', user);
        console.log('================================');
        
        // Route users to role-specific pages instead of generic dashboard
        switch (actualRole) {
          case 'requester':
            console.log('Routing requester to /requests');
            router.push('/requests');
            break;
          case 'approver':
            console.log('Routing approver to /approvals');
            router.push('/approvals');
            break;
          case 'cardholder':
            console.log('Routing cardholder to /purchases');
            router.push('/purchases');
            break;
          case 'auditor':
            console.log('Routing auditor to /audit-packages');
            router.push('/audit-packages');
            break;
          case 'admin':
            console.log('Routing admin to /admin');
            router.push('/admin');
            break;
          default:
            console.log('Routing default to /dashboard, role was:', actualRole);
            router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
}
