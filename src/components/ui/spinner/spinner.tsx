import { cn } from "../../../utils";
import { SpinnerIcon } from "../../../assets/icons";
import type { SpinnerProps } from "./spinner.types.ts";

export const Spinner = ({ className, size = "md" }: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <SpinnerIcon
      className={cn("animate-spin", sizeClasses[size], className)}
    />
  );
};

Spinner.displayName = "Spinner";
