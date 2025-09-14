'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithMicrosoft,
  signUpWithEmail,
  signUpWithGoogle,
  signUpWithMicrosoft,
} from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Mail, Chrome, Building2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  console.log('LoginPage component rendered');
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('requester');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Role definitions with descriptions
  const roles: {
    value: UserRole;
    label: string;
    description: string;
    icon: string;
  }[] = [
    {
      value: 'requester',
      label: 'Requester',
      description: 'Submit purchase requests for approval',
      icon: '📝',
    },
    {
      value: 'approver',
      label: 'Approving Official',
      description: 'Review and approve purchase requests',
      icon: '✅',
    },
    {
      value: 'cardholder',
      label: 'Purchase Card Holder',
      description: 'Make purchases and manage purchase orders',
      icon: '💳',
    },
    {
      value: 'auditor',
      label: 'Auditor',
      description: 'Review transactions and compliance',
      icon: '🔍',
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Manage users and system settings',
      icon: '⚙️',
    },
  ];

  // Clear form when switching modes
  const handleModeToggle = (signUp: boolean) => {
    setIsSignUp(signUp);
    setEmail('');
    setPassword('');
    setName('');
    setSelectedRole('requester');
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      // Use original user role for routing, not debug role
      const actualRole = user.role; // Login page doesn't have debug role override
      
      // Debug logging
      console.log('LoginPage routing - User:', user.email, 'Role:', actualRole);
      
      // Route users to role-specific pages instead of generic dashboard
      switch (actualRole) {
        case 'requester':
          router.push('/requests');
          break;
        case 'approver':
          router.push('/approvals');
          break;
        case 'cardholder':
          router.push('/purchases');
          break;
        case 'auditor':
          router.push('/audit-packages');
          break;
        case 'admin':
          router.push('/admin');
          break;
        default:
          console.log('LoginPage routing default to /dashboard, role was:', actualRole);
          router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Close role dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setShowRoleDropdown(false);
      }
    };

    if (showRoleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRoleDropdown]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    if (isSignUp && !name) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
        // Note: Role will be assigned by admin after account creation
        toast.success('Account created successfully');
      } else {
        await signInWithEmail(email, password);
        toast.success('Signed in successfully');
      }
      // Redirect will be handled by the useEffect above based on user role
    } catch (error: any) {
      console.error('Auth error:', error);
      const errorMessage =
        error.message ||
        (isSignUp ? 'Failed to create account' : 'Failed to sign in');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithGoogle();
        toast.success('Account created with Google');
      } else {
        await signInWithGoogle();
        toast.success('Signed in with Google');
      }
      // Redirect will be handled by the useEffect above based on user role
    } catch (error: any) {
      console.error('Google auth error:', error);
      const errorMessage =
        error.message ||
        (isSignUp
          ? 'Failed to create account with Google'
          : 'Failed to sign in with Google');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftAuth = async () => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithMicrosoft();
        toast.success('Account created with Microsoft');
      } else {
        await signInWithMicrosoft();
        toast.success('Signed in with Microsoft');
      }
      // Redirect will be handled by the useEffect above based on user role
    } catch (error: any) {
      console.error('Microsoft auth error:', error);
      const errorMessage =
        error.message ||
        (isSignUp
          ? 'Failed to create account with Microsoft'
          : 'Failed to sign in with Microsoft');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to ProcureFlow
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            From request to receipt—audited, automated, on time.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          {/* Toggle between Sign In and Sign Up */}
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => handleModeToggle(false)}
              className={cn(
                'flex-1 py-2 px-4 text-sm font-medium rounded-l-md border',
                !isSignUp
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeToggle(true)}
              className={cn(
                'flex-1 py-2 px-4 text-sm font-medium rounded-r-md border-t border-r border-b',
                isSignUp
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              Create Account
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleEmailAuth}>
            {isSignUp && (
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={isSignUp}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-sm text-gray-500">
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="form-label">
                Select Your Role
              </label>
              <div className="mt-1 relative" ref={roleDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full form-input text-left flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {roles.find(r => r.value === selectedRole)?.icon}
                    </span>
                    <div>
                      <div className="font-medium">
                        {roles.find(r => r.value === selectedRole)?.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {roles.find(r => r.value === selectedRole)?.description}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {roles.map(role => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.value);
                          setShowRoleDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <span className="text-lg">{role.icon}</span>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-gray-500">
                            {role.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {isSignUp && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Note:</span> Your role will be
                  verified and assigned by an administrator after account
                  creation.
                </p>
              )}
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    {isSignUp
                      ? 'Create Account with Email'
                      : 'Sign in with Email'}
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full"
              >
                <Chrome className="h-4 w-4 mr-2" />
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleMicrosoftAuth}
                disabled={isLoading}
                className="w-full"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Microsoft
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This is a demonstration system. Not for production use.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            © 2024 Bradley Virtual Solutions, LLC
          </p>
        </div>
      </div>
    </div>
  );
}
