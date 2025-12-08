import "./styles/index.scss";

export type SDKOptions = {
  apiKey?: string;
  debug?: boolean;
};

export class KYC_SDK {
  private apiKey?: string;
  private debug: boolean;

  static version = "0.1.0";

  constructor(options: SDKOptions = {}) {
    this.apiKey = options.apiKey;
    this.debug = !!options.debug;
    if (this.debug) this.log("KYC_SDK constructed", options);
  }

  init() {
    this.log("KYC_SDK initialized", this.apiKey);
    return Promise.resolve({ ok: true });
  }

  identify(id: string, meta: Record<string, unknown> = {}) {
    this.log("identify", id, meta);
    return Promise.resolve({ id, received: meta });
  }

  track(event: string, props: Record<string, unknown> = {}) {
    this.log("track", event, props);
    return Promise.resolve({ event, props });
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log("[KYC_SDK]", ...args);
    }
  }
}

export default KYC_SDK;

export { TextInput } from "./components/text-input";
export type { TextInputProps } from "./components/text-input";
export { Button } from "./components/button";
export type { ButtonProps } from "./components/button";
export { Checkbox } from "./components/checkbox";
export type { CheckboxProps } from "./components/checkbox";
export { RadioButton, RadioGroup } from "./components/radio-button";
export type { RadioButtonProps, RadioGroupProps } from "./components/radio-button";
export { MultiSelect } from "./components/multi-select";
export type { MultiSelectProps, MultiSelectOption } from "./components/multi-select";
export { KYCSDKProvider, useSDKConfig, useSDKTheme } from "./provider";
export type { KYCSDKProviderProps, SDKConfig, Theme, SDKContextValue } from "./provider";
export { useControllableState } from "./hooks/useControllableState";
export type { UseControllableStateParams } from "./hooks/useControllableState";
