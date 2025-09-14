'use client';

import { useAuth } from '@/hooks/use-auth';
import { signOutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { NotificationDropdown } from './notification-dropdown';
import { LogOut, User, Settings, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export function AppHeader() {
  const { user, loading, debugRole, originalUser } = useAuth();
  const router = useRouter();
  
  // Use original user role for navigation, not debug role
  const actualRole = originalUser?.role || user?.role;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleProfile = () => {
    setShowUserMenu(false);
    router.push('/profile');
  };

  const handleSettings = () => {
    setShowUserMenu(false);
    router.push('/settings');
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">ProcureFlow</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

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
            {/* Only show Requests tab for requesters and admins */}
            {actualRole && ['requester', 'admin'].includes(actualRole) && (
              <button
                onClick={() => router.push('/requests')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Requests
              </button>
            )}
            {actualRole && ['approver', 'admin'].includes(actualRole) && (
              <button
                onClick={() => router.push('/approvals')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Approvals
              </button>
            )}
            {actualRole && ['cardholder', 'admin'].includes(actualRole) && (
              <button
                onClick={() => router.push('/purchases')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Purchases
              </button>
            )}
            {actualRole && ['auditor', 'admin'].includes(actualRole) && (
              <button
                onClick={() => router.push('/audit-packages')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Audit Packages
              </button>
            )}
            {actualRole === 'admin' && (
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
            <NotificationDropdown />

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
                    {user.name || user.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {actualRole || 'requester'}
                    {debugRole && (
                      <span className="ml-1 text-blue-600 font-semibold">
                        (Debug: {debugRole})
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || user.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.email || 'No email'}
                    </div>
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
            <button
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden border-t border-gray-200 bg-gray-50"
        >
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => {
                router.push('/dashboard');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
            >
              Dashboard
            </button>
            {/* Only show Requests tab for requesters and admins */}
            {actualRole && ['requester', 'admin'].includes(actualRole) && (
              <button
                onClick={() => {
                  router.push('/requests');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              >
                Requests
              </button>
            )}
            {actualRole && ['approver', 'admin'].includes(actualRole) && (
              <button
                onClick={() => {
                  router.push('/approvals');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              >
                Approvals
              </button>
            )}
            {actualRole && ['cardholder', 'admin'].includes(actualRole) && (
              <button
                onClick={() => {
                  router.push('/purchases');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              >
                Purchases
              </button>
            )}
            {actualRole && ['auditor', 'admin'].includes(actualRole) && (
              <button
                onClick={() => {
                  router.push('/audit-packages');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              >
                Audit Packages
              </button>
            )}
            {actualRole === 'admin' && (
              <button
                onClick={() => {
                  router.push('/admin');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
