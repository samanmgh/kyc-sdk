import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';

  /** Button size */
  size?: 'sm' | 'md' | 'lg';

  /** Full width flag */
  fullWidth?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Icon to display before children */
  startIcon?: React.ReactNode;

  /** Icon to display after children */
  endIcon?: React.ReactNode;

  /** Custom class name */
  className?: string;
}
