'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from './button';
import { BarChart3, Users, Settings, Shield, ArrowLeft } from 'lucide-react';

const adminNavItems = [
  {
    id: 'overview',
    name: 'Overview',
    icon: BarChart3,
    path: '/admin',
  },
  {
    id: 'users',
    name: 'User Management',
    icon: Users,
    path: '/admin/users',
  },
  {
    id: 'settings',
    name: 'System Settings',
    icon: Settings,
    path: '/admin/settings',
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    path: '/admin/security',
  },
];

export function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          </div>

          <nav className="flex space-x-1">
            {adminNavItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  onClick={() => router.push(item.path)}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
