'use client';

import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/lib/types';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles: UserRole[];
  fallback?: ReactNode;
  requireAll?: boolean;
}

export function RoleGuard({
  children,
  requiredRoles,
  fallback = null,
  requireAll = false,
}: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <>{fallback}</>;
  }

  const hasRequiredRole = requireAll
    ? requiredRoles.every(role => user.role === role)
    : requiredRoles.includes(user.role);

  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function ApproverOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRoles={['approver', 'admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function CardholderOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRoles={['cardholder', 'admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AuditorOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRoles={['auditor', 'admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function RequesterOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard
      requiredRoles={[
        'requester',
        'approver',
        'cardholder',
        'auditor',
        'admin',
      ]}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
