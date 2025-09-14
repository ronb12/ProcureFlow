'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  console.log('HomePage component rendered');
  const { user, loading, originalUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Use original user role for routing, not debug role
        const actualRole = originalUser?.role || user.role;
        
        // Debug logging
        console.log('HomePage routing - User:', user.email, 'Actual Role:', actualRole, 'Effective Role:', user.role);
        
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
