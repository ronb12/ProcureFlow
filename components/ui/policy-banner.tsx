'use client';

import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PolicyCheck } from '@/lib/types';

interface PolicyBannerProps {
  checks: PolicyCheck[];
  className?: string;
}

export function PolicyBanner({ checks, className }: PolicyBannerProps) {
  if (checks.length === 0) return null;

  const errorChecks = checks.filter(check => check.severity === 'error');
  const warningChecks = checks.filter(check => check.severity === 'warning');

  return (
    <div className={cn('space-y-2', className)}>
      {/* Error checks */}
      {errorChecks.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-destructive">
                Action Required
              </h4>
              <div className="space-y-1">
                {errorChecks.map((check, index) => (
                  <p key={index} className="text-sm text-destructive">
                    {check.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning checks */}
      {warningChecks.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
              <div className="space-y-1">
                {warningChecks.map((check, index) => (
                  <p key={index} className="text-sm text-yellow-700">
                    {check.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual policy check component
interface PolicyCheckItemProps {
  check: PolicyCheck;
  className?: string;
}

export function PolicyCheckItem({ check, className }: PolicyCheckItemProps) {
  const Icon = check.severity === 'error' ? XCircle : AlertTriangle;
  const bgColor =
    check.severity === 'error' ? 'bg-destructive/10' : 'bg-yellow-50';
  const borderColor =
    check.severity === 'error' ? 'border-destructive/20' : 'border-yellow-200';
  const textColor =
    check.severity === 'error' ? 'text-destructive' : 'text-yellow-800';
  const iconColor =
    check.severity === 'error' ? 'text-destructive' : 'text-yellow-600';

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-3 rounded-lg border',
        bgColor,
        borderColor,
        className
      )}
    >
      <Icon className={cn('h-4 w-4 flex-shrink-0 mt-0.5', iconColor)} />
      <div className="flex-1">
        <p className={cn('text-sm font-medium', textColor)}>{check.message}</p>
        {check.details && (
          <div className="mt-1 text-xs text-muted-foreground">
            {Object.entries(check.details).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium">{key}:</span> {String(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Policy check summary component
interface PolicyCheckSummaryProps {
  checks: PolicyCheck[];
  className?: string;
}

export function PolicyCheckSummary({
  checks,
  className,
}: PolicyCheckSummaryProps) {
  const errorCount = checks.filter(check => check.severity === 'error').length;
  const warningCount = checks.filter(
    check => check.severity === 'warning'
  ).length;

  if (checks.length === 0) return null;

  return (
    <div className={cn('flex items-center space-x-4 text-sm', className)}>
      {errorCount > 0 && (
        <div className="flex items-center space-x-1 text-destructive">
          <XCircle className="h-4 w-4" />
          <span>
            {errorCount} error{errorCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      {warningCount > 0 && (
        <div className="flex items-center space-x-1 text-yellow-600">
          <AlertTriangle className="h-4 w-4" />
          <span>
            {warningCount} warning{warningCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
