'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: (value: number) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value = 0, onChange, onBlur, error, label, required, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(
      value > 0 ? value.toFixed(2) : ''
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow empty string, numbers, and one decimal point
      if (inputValue === '' || /^\d*\.?\d{0,2}$/.test(inputValue)) {
        setDisplayValue(inputValue);
        
        // Convert to number for onChange callback
        const numericValue = inputValue === '' ? 0 : parseFloat(inputValue);
        if (!isNaN(numericValue)) {
          onChange?.(numericValue);
        }
      }
    };

    const handleBlur = () => {
      // Format to 2 decimal places on blur
      const numericValue = parseFloat(displayValue);
      if (!isNaN(numericValue)) {
        const formattedValue = numericValue.toFixed(2);
        setDisplayValue(formattedValue);
        onBlur?.(numericValue);
      } else {
        setDisplayValue('0.00');
        onBlur?.(0);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Select all text on focus for easy editing
      e.target.select();
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
            $
          </span>
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={cn(
              'form-input pl-8 pr-3',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            placeholder="0.00"
            {...props}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

MoneyInput.displayName = 'MoneyInput';
