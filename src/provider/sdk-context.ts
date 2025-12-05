import { createContext } from "react";
import type { SDKContextValue } from "./provider-types";

export const SDKContext = createContext<SDKContextValue | null>(null);
SDKContext.displayName = "SDKContext";
