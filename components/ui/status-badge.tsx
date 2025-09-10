'use client';

import { cn } from '@/lib/utils';
import { RequestStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  Draft: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'Draft',
  },
  Submitted: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'Submitted',
  },
  'AO Review': {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'AO Review',
  },
  Approved: {
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Approved',
  },
  'Cardholder Purchasing': {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    label: 'Purchasing',
  },
  Purchased: {
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    label: 'Purchased',
  },
  Reconciled: {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    label: 'Reconciled',
  },
  Closed: {
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Closed',
  },
  Returned: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    label: 'Returned',
  },
  Denied: {
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'Denied',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = sizeConfig[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.color,
        sizeClasses,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// Status badge with icon
interface StatusBadgeWithIconProps extends StatusBadgeProps {
  showIcon?: boolean;
}

export function StatusBadgeWithIcon({ 
  status, 
  className, 
  size = 'md', 
  showIcon = false 
}: StatusBadgeWithIconProps) {
  const config = statusConfig[status];
  const sizeClasses = sizeConfig[size];

  const getIcon = () => {
    switch (status) {
      case 'Draft':
        return '📝';
      case 'Submitted':
        return '📤';
      case 'AO Review':
        return '👀';
      case 'Approved':
        return '✅';
      case 'Cardholder Purchasing':
        return '🛒';
      case 'Purchased':
        return '💳';
      case 'Reconciled':
        return '📊';
      case 'Closed':
        return '🔒';
      case 'Returned':
        return '↩️';
      case 'Denied':
        return '❌';
      default:
        return '';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.color,
        sizeClasses,
        className
      )}
    >
      {showIcon && (
        <span className="mr-1" aria-hidden="true">
          {getIcon()}
        </span>
      )}
      {config.label}
    </span>
  );
}

// Status progress indicator
interface StatusProgressProps {
  currentStatus: RequestStatus;
  className?: string;
}

const statusOrder: RequestStatus[] = [
  'Draft',
  'Submitted',
  'AO Review',
  'Approved',
  'Cardholder Purchasing',
  'Purchased',
  'Reconciled',
  'Closed',
];

export function StatusProgress({ currentStatus, className }: StatusProgressProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isTerminal = ['Denied', 'Returned'].includes(currentStatus);

  if (isTerminal) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <StatusBadge status={currentStatus} size="sm" />
        <span className="text-sm text-muted-foreground">
          {currentStatus === 'Denied' ? 'Request was denied' : 'Request was returned for revision'}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        {statusOrder.map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = status === currentStatus;
          
          return (
            <div key={status} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-muted',
                  isCurrent && 'ring-2 ring-primary ring-offset-2'
                )}
              >
                {index + 1}
              </div>
              {index < statusOrder.length - 1 && (
                <div
                  className={cn(
                    'w-12 h-0.5 mx-2',
                    isActive ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <StatusBadge status={currentStatus} size="sm" />
      </div>
    </div>
  );
}
