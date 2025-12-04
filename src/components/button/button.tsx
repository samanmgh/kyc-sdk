import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { ButtonProps } from "./button.types";

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    width='16'
    height='16'
  >
    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      startIcon,
      endIcon,
      className,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      "inline-flex items-center justify-center gap-2",
      "rounded-md",
      "font-medium font-sans",
      "transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      fullWidth && "w-full"
    );

    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    };

    const variantClasses = {
      primary: cn(
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90",
        "active:bg-primary/80",
        "border border-transparent"
      ),
      secondary: cn(
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/80",
        "border border-transparent"
      ),
      outline: cn(
        "bg-transparent text-primary",
        "border border-primary",
        "hover:bg-primary/10",
        "active:bg-primary/20"
      ),
      ghost: cn(
        "bg-transparent text-foreground",
        "border border-transparent",
        "hover:bg-muted",
        "active:bg-muted-foreground/10"
      ),
    };

    const buttonClasses = cn(baseClasses, sizeClasses[size], variantClasses[variant], className);

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <>
            <Spinner />
            <span className='sr-only'>Loading</span>
          </>
        )}
        {!loading && startIcon && <span className='shrink-0'>{startIcon}</span>}
        {children}
        {!loading && endIcon && <span className='shrink-0'>{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
