'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import {
  LogOut,
  User,
  Settings,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function AppHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleProfile = () => {
    setShowUserMenu(false);
    // TODO: Navigate to profile page
    toast('Profile page coming soon');
  };

  const handleSettings = () => {
    setShowUserMenu(false);
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      toast('Settings page coming soon');
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PF</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ProcureFlow
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/requests')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Requests
            </button>
            {['approver', 'admin'].includes(user.role) && (
              <button
                onClick={() => router.push('/approvals')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Approvals
              </button>
            )}
            {['cardholder', 'admin'].includes(user.role) && (
              <button
                onClick={() => router.push('/purchases')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Purchases
              </button>
            )}
            {user.role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Admin
              </button>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  
                  <button
                    onClick={handleProfile}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                  
                  <button
                    onClick={handleSettings}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="px-4 py-2 space-y-1">
          <button
            onClick={() => router.push('/dashboard')}
            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push('/requests')}
            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
          >
            Requests
          </button>
          {['approver', 'admin'].includes(user.role) && (
            <button
              onClick={() => router.push('/approvals')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
            >
              Approvals
            </button>
          )}
          {['cardholder', 'admin'].includes(user.role) && (
            <button
              onClick={() => router.push('/purchases')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
            >
              Purchases
            </button>
          )}
          {user.role === 'admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
