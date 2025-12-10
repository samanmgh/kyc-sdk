import type { InputHTMLAttributes } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /** Controlled checked state */
  checked?: boolean

  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean

  /** Change handler */
  onChange?: (checked: boolean) => void

  /** Indeterminate state */
  indeterminate?: boolean

  /** Label text */
  label?: string

  /** Description text */
  description?: string

  /** Error message */
  error?: string

  /** Size variant */
  size?: 'sm' | 'md' | 'lg'

  /** Custom class name */
  className?: string
}
