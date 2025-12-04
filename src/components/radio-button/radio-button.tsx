import { forwardRef, useContext, useId } from "react";
import { cn } from "../../utils/cn";
import type { RadioButtonProps } from "./radio-button.types";
import { RadioContext } from "./radio-group-context";

const RadioDot = () => (
  <div className='radio-dot w-2.5 h-2.5 rounded-full bg-primary-foreground transition-transform duration-200 ease-out scale-100' />
);

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    { value, label, description, className, disabled: disabledProp, id: providedId, ...props },
    ref
  ) => {
    const context = useContext(RadioContext);
    const generatedId = useId();
    const id = providedId || generatedId;
    const descriptionId = `${id}-description`;

    if (!context) {
      throw new Error("RadioButton must be used within a RadioGroup");
    }

    const { name, value: groupValue, onChange, disabled: groupDisabled } = context;
    const disabled = disabledProp || groupDisabled;
    const checked = groupValue === value;

    const handleChange = () => {
      if (!disabled) {
        onChange(value);
      }
    };

    const radioClasses = cn(
      "component",
      "appearance-none cursor-pointer",
      "w-5 h-5",
      "rounded-full",
      "border-2",
      "transition-all duration-200 ease-out",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      // Unchecked state
      !checked && [
        "border-border bg-background",
        "hover:border-primary/60 hover:bg-primary/5",
        "active:scale-95",
      ],
      // Checked state
      checked && [
        "bg-primary border-primary",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.05)]",
        "hover:bg-primary/90 hover:border-primary/90",
        "active:scale-95",
      ]
    );

    const containerClasses = cn(
      "component flex items-center gap-3",
      !disabled && "cursor-pointer",
      disabled && "opacity-50",
      className
    );

    return (
      <label className={containerClasses} htmlFor={id}>
        <div className='relative shrink-0 flex items-center justify-center'>
          <input
            ref={ref}
            type='radio'
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className={radioClasses}
            aria-describedby={description ? descriptionId : undefined}
            {...props}
          />
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center pointer-events-none",
              "radio-checked transition-all duration-200 ease-out",
              checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
          >
            <RadioDot />
          </div>
        </div>

        {(label || description) && (
          <div className='flex-1'>
            {label && (
              <span
                className={cn(
                  "block text-base font-medium leading-5",
                  "text-foreground",
                  "select-none",
                  "transition-colors duration-150",
                  !disabled && "group-hover:text-foreground/80"
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <p
                id={descriptionId}
                className='mt-1 text-sm text-muted-foreground select-none leading-tight'
              >
                {description}
              </p>
            )}
          </div>
        )}
      </label>
    );
  }
);

RadioButton.displayName = "RadioButton";
