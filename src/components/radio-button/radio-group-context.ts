import { createContext } from "react";
import type { RadioContextValue } from "./radio-button.types";

export const RadioContext = createContext<RadioContextValue | null>(null);
