import { useId } from "react";
import { cn } from "../../../utils";
import { useControllableState } from "../../../hooks";
import type { RadioGroupProps, RadioContextValue } from "./radio-button.types";

import { RadioContext } from "./radio-group-context";

export { RadioContext };

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value: valueProp,
  defaultValue,
  onChange,
  name,
  orientation = "vertical",
  label,
  error,
  disabled = false,
  required = false,
  children,
  className,
}) => {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const errorId = `${generatedId}-error`;

  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? "",
    onChange,
  });

  const containerClasses = cn("component", className);

  const groupClasses = cn(
    "flex gap-4",
    orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
  );

  const contextValue: RadioContextValue = {
    name,
    value,
    onChange: setValue,
    disabled,
  };

  return (
    <div className={containerClasses}>
      {label && (
        <div
          id={labelId}
          className={cn("mb-2 text-sm font-medium", "text-foreground", disabled && "opacity-50")}
        >
          {label}
          {required && (
            <span className='ml-1 text-destructive' aria-label='required'>
              *
            </span>
          )}
        </div>
      )}

      <div
        role='radiogroup'
        aria-labelledby={label ? labelId : undefined}
        aria-required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className={groupClasses}
      >
        <RadioContext.Provider value={contextValue}>{children}</RadioContext.Provider>
      </div>

      {error && (
        <p id={errorId} className='mt-2 text-sm text-destructive' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
};

RadioGroup.displayName = "RadioGroup";
