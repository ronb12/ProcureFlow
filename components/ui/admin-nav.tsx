'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { signOutUser } from '@/lib/auth';
import { Button } from './button';
import { BarChart3, Users, Settings, Shield, ArrowLeft, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

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
    id: 'vendors',
    name: 'Vendor Management',
    icon: Shield,
    path: '/admin/vendors',
  },
  {
    id: 'settings',
    name: 'System Settings',
    icon: Settings,
    path: '/admin/system-settings',
  },
];

export function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 relative z-40">
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

          <div className="flex items-center space-x-4">
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
            
            <div className="h-6 w-px bg-gray-300" />
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
