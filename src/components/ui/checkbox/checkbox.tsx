import type { CheckboxProps } from '@/components/ui';

import { cn } from '@/utils';
import { useControllableState } from '@/hooks';
import { CheckIcon, MinusIcon } from '@/assets/icons';
import { useId, useRef, useEffect, forwardRef } from 'react';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked: checkedProp,
      defaultChecked,
      onChange,
      indeterminate = false,
      label,
      description,
      error,
      size = 'md',
      className,
      disabled,
      required,
      id: providedId,
      name,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const descriptionId = `${id}-description`;
    const inputRef = useRef<HTMLInputElement>(null);

    const [checked, setChecked] = useControllableState({
      value: checkedProp,
      defaultValue: defaultChecked ?? false,
      onChange,
    });

    // Handle indeterminate state
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
    };

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const checkboxClasses = cn(
      'component',
      'appearance-none cursor-pointer',
      'rounded',
      'border-2',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Unchecked state
      !(checked || indeterminate) && [
        'border-border bg-background',
        'hover:border-primary/60 hover:bg-primary/5',
        'active:scale-95',
      ],
      // Checked/Indeterminate state
      (checked || indeterminate) && [
        'bg-primary border-primary',
        'shadow-[0_0_0_1px_rgba(0,0,0,0.05)]',
        'hover:bg-primary/90 hover:border-primary/90',
        'active:scale-95',
      ],
      error && !checked && !indeterminate && 'border-destructive hover:border-destructive/80',
      sizeClasses[size]
    );

    const containerClasses = cn(
      'component flex items-start gap-2',
      disabled && 'opacity-50',
      className
    );

    return (
      <div className={containerClasses}>
        <div className="relative shrink-0 pt-0.5">
          <input
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              inputRef.current = node;
            }}
            type="checkbox"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className={checkboxClasses}
            aria-checked={indeterminate ? 'mixed' : checked}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : description ? descriptionId : undefined}
            {...props}
          />
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center pointer-events-none',
              'text-primary-foreground',
              'transition-all duration-200 ease-out',
              checked || indeterminate ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
              checked && 'checkbox-checked'
            )}
          >
            {indeterminate ? (
              <MinusIcon className="w-3.5 h-3.5 animate-in zoom-in-50 duration-150" />
            ) : (
              <CheckIcon className="checkmark w-3.5 h-3.5 animate-in zoom-in-50 duration-150" />
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'block text-base font-medium',
                  'text-foreground',
                  'cursor-pointer select-none',
                  'transition-colors duration-150',
                  !disabled && 'hover:text-foreground/80',
                  disabled && 'cursor-not-allowed'
                )}
              >
                {label}
                {required && (
                  <span className="ml-1 text-destructive" aria-label="required">
                    *
                  </span>
                )}
              </label>
            )}
            {description && (
              <p id={descriptionId} className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {error && (
              <p id={errorId} className="mt-1 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
