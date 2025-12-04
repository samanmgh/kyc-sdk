import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../hooks/useControllableState";
import type { MultiSelectProps } from "./multi-select.types";

const ChevronDownIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='6 9 12 15 18 9' />
  </svg>
);

const XIcon = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
);

export function MultiSelect<T = string>({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  label,
  error,
  placeholder = "Select options...",
  disabled = false,
  maxSelections,
  searchable = true,
  className,
  required,
  name,
}: MultiSelectProps<T>) {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const errorId = `${generatedId}-error`;
  const listboxId = `${generatedId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [selectedValues, setSelectedValues] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? ([] as T[]),
    onChange,
  });

  // Filter options based on search
  const filteredOptions =
    searchable && searchQuery
      ? options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const toggleOption = (optionValue: T) => {
    const isSelected = selectedValues.includes(optionValue);

    if (isSelected) {
      setSelectedValues(selectedValues.filter(v => v !== optionValue));
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      setSelectedValues([...selectedValues, optionValue]);
    }
  };

  const removeValue = (valueToRemove: T, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues(selectedValues.filter(v => v !== valueToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (filteredOptions[activeIndex]) {
          toggleOption(filteredOptions[activeIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
    }
  };

  const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));

  const triggerClasses = cn(
    "component focus-visible",
    "w-full min-h-[2.5rem]",
    "px-3 py-2",
    "flex items-center gap-2 flex-wrap",
    "rounded-md",
    "border border-border",
    "bg-background text-foreground",
    "font-sans text-base",
    "cursor-pointer",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2",
    !disabled && "hover:border-primary/60 hover:bg-muted/30",
    disabled && "opacity-50 cursor-not-allowed bg-muted",
    error && "border-destructive focus:border-destructive hover:border-destructive/80",
    isOpen && "border-primary shadow-sm"
  );

  const dropdownClasses = cn(
    "component dropdown-enter",
    "absolute z-50 w-full mt-1",
    "max-h-60 overflow-auto",
    "rounded-md",
    "border border-border",
    "bg-popover",
    "shadow-lg shadow-black/10",
    "backdrop-blur-sm",
    "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
  );

  return (
    <div className={cn("component", className)}>
      {label && (
        <label
          id={labelId}
          className={cn(
            "block mb-1.5 text-sm font-medium",
            "text-foreground",
            disabled && "opacity-50"
          )}
        >
          {label}
          {required && (
            <span className='ml-1 text-destructive' aria-label='required'>
              *
            </span>
          )}
        </label>
      )}

      <div ref={containerRef} className='relative'>
        <div
          role='combobox'
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-labelledby={label ? labelId : undefined}
          aria-controls={listboxId}
          aria-disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          tabIndex={disabled ? -1 : 0}
          className={triggerClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <span
                key={String(option.value)}
                className={cn(
                  "inline-flex items-center gap-1.5",
                  "px-2.5 py-1",
                  "rounded-md",
                  "bg-primary/10 border border-primary/20",
                  "text-sm font-medium",
                  "text-primary",
                  "transition-all duration-150",
                  "hover:bg-primary/15 hover:border-primary/30",
                  "animate-in fade-in-0 zoom-in-95 duration-150"
                )}
              >
                {option.label}
                <button
                  type='button'
                  onClick={e => removeValue(option.value, e)}
                  className={cn(
                    "hover:text-primary/80 hover:bg-primary/20",
                    "rounded-sm p-0.5",
                    "transition-colors duration-150",
                    "focus:outline-none focus:ring-1 focus:ring-primary"
                  )}
                  aria-label={`Remove ${option.label}`}
                  tabIndex={-1}
                >
                  <XIcon />
                </button>
              </span>
            ))
          ) : (
            <span className='text-muted-foreground text-sm'>{placeholder}</span>
          )}

          <span className={cn(
            "ml-auto text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}>
            <ChevronDownIcon />
          </span>
        </div>

        {isOpen && !disabled && (
          <div className={dropdownClasses}>
            {searchable && (
              <div className='p-2 border-b border-border bg-muted/30'>
                <input
                  ref={searchInputRef}
                  type='text'
                  className={cn(
                    "w-full px-3 py-2",
                    "rounded-md",
                    "border border-border",
                    "bg-background",
                    "text-sm",
                    "placeholder:text-muted-foreground",
                    "transition-colors duration-150",
                    "focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring"
                  )}
                  placeholder='Search options...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}

            <div id={listboxId} role='listbox' aria-multiselectable='true' className='py-1'>
              {filteredOptions.length === 0 ? (
                <div className='px-3 py-2 text-sm text-muted-foreground'>
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isActive = index === activeIndex;
                  const isMaxReached = maxSelections && selectedValues.length >= maxSelections && !isSelected;

                  return (
                    <div
                      key={String(option.value)}
                      role='option'
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || isMaxReached || undefined}
                      className={cn(
                        "px-3 py-2.5",
                        "cursor-pointer",
                        "text-sm",
                        "transition-all duration-150 ease-out",
                        "select-none",
                        isActive && "bg-muted",
                        isSelected && "bg-primary/5",
                        option.disabled && "opacity-50 cursor-not-allowed",
                        isMaxReached && "opacity-40 cursor-not-allowed",
                        !option.disabled && !isActive && !isMaxReached && "hover:bg-muted"
                      )}
                      onClick={() => !option.disabled && !isMaxReached && toggleOption(option.value)}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            "w-4 h-4 rounded",
                            "border-2",
                            "flex items-center justify-center shrink-0",
                            "transition-all duration-150 ease-out",
                            !isSelected && "border-border",
                            isSelected && "bg-primary border-primary scale-100",
                            !isSelected && !option.disabled && "group-hover:border-primary/60"
                          )}
                        >
                          {isSelected && (
                            <svg
                              width='12'
                              height='12'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='white'
                              strokeWidth='3'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='animate-in zoom-in-50 duration-150'
                            >
                              <polyline points='20 6 9 17 4 12' />
                            </svg>
                          )}
                        </div>
                        <span className={cn(
                          "flex-1",
                          isSelected && "text-primary font-medium"
                        )}>
                          {option.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Hidden input for form submission */}
        {name &&
          selectedValues.map(val => (
            <input key={String(val)} type='hidden' name={name} value={String(val)} />
          ))}
      </div>

      {error && (
        <p
          id={errorId}
          className='mt-1.5 text-sm text-destructive'
          role='alert'
        >
          {error}
        </p>
      )}
    </div>
  );
}

MultiSelect.displayName = "MultiSelect";
