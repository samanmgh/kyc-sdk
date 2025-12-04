import type { InputHTMLAttributes } from 'react'

export interface RadioGroupProps {
  /** Controlled value */
  value?: string

  /** Default value (uncontrolled) */
  defaultValue?: string

  /** Change handler */
  onChange?: (value: string) => void

  /** Radio group name (required) */
  name: string

  /** Orientation */
  orientation?: 'horizontal' | 'vertical'

  /** Group label */
  label?: string

  /** Error message */
  error?: string

  /** Disabled state */
  disabled?: boolean

  /** Required field */
  required?: boolean

  /** Children (RadioButton components) */
  children: React.ReactNode

  /** Custom class name */
  className?: string
}

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Radio button value */
  value: string

  /** Label text */
  label?: string

  /** Description text */
  description?: string

  /** Custom class name */
  className?: string
}

export interface RadioContextValue {
  name: string
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}
