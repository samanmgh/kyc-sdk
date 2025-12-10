import type { InputHTMLAttributes } from "react";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input label text */
  label?: string;

  /** Helper text displayed below input */
  helperText?: string;

  /** Error message (displays in error state) */
  error?: string;

  /** Input size variant */
  size?: "sm" | "md" | "lg";

  /** Full width flag */
  fullWidth?: boolean;

  /** Start adornment (icon/text) */
  startAdornment?: React.ReactNode;

  /** End adornment (icon/text) */
  endAdornment?: React.ReactNode;

  /** Custom class name */
  className?: string;
}
