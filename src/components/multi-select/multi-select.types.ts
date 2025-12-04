export interface MultiSelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

export interface MultiSelectProps<T = string> {
  /** Options array */
  options: MultiSelectOption<T>[]

  /** Selected values (controlled) */
  value?: T[]

  /** Default selected values (uncontrolled) */
  defaultValue?: T[]

  /** Change handler */
  onChange?: (value: T[]) => void

  /** Label text */
  label?: string

  /** Error message */
  error?: string

  /** Placeholder text */
  placeholder?: string

  /** Disabled state */
  disabled?: boolean

  /** Maximum selections allowed */
  maxSelections?: number

  /** Searchable flag */
  searchable?: boolean

  /** Custom class name */
  className?: string

  /** Required field */
  required?: boolean

  /** Name attribute */
  name?: string
}
