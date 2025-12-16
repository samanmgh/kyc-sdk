# Host App Integration Example

## React/Next.js

### Fullscreen Modal Mode

> **Note**: The SDK renders in a fullscreen iframe overlay for complete style isolation. This prevents any CSS conflicts between the host page and the SDK's styles.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import KYC_SDK from "@vero-compliance/kyc-sdk";

export default function Home() {
  const sdkRef = useRef<KYC_SDK | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<"en" | "de">("en");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (sdkRef.current) return;

    const initSDK = async () => {
      const sdk = new KYC_SDK({
        apiKey: "your-api-key",
        tenantId: 123,
        theme: theme,
        language: language,
        debug: true,
        styles: {
          primary: "#3b82f6",
          radius: "0.5rem",
        },
      });

      // Initialize fullscreen iframe
      await sdk.init();
      sdkRef.current = sdk;
    };

    initSDK();

    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy();
        sdkRef.current = null;
      }
    };
  }, [isOpen, theme, language]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    sdkRef.current?.changeTheme(newTheme);
  };

  const handleLanguageChange = (newLang: "en" | "de") => {
    setLanguage(newLang);
    sdkRef.current?.changeLanguage(newLang);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open KYC Modal</button>
      <button onClick={() => handleThemeChange("dark")}>Dark</button>
      <button onClick={() => handleThemeChange("light")}>Light</button>
      <button onClick={() => handleLanguageChange("en")}>English</button>
      <button onClick={() => handleLanguageChange("de")}>German</button>
    </div>
  );
}
```

## API Reference

```javascript
// Constructor
const sdk = new KYC_SDK({
  apiKey: string,              // Required
  tenantId: number,            // Required
  theme?: "light" | "dark",    // Optional (default: "dark")
  language?: "en" | "de",      // Optional (default: "en")
  debug?: boolean,             // Optional (default: false)
  styles?: {
    primary?: string,
    radius?: string,
    background?: string,
    foreground?: string,
    border?: string,
    secondary?: string,
    muted?: string,
    destructive?: string
  }
});

// Methods
await sdk.init();  // Initializes fullscreen iframe
sdk.destroy();
await sdk.changeTheme(theme: "light" | "dark");
await sdk.changeLanguage(lang: "en" | "de");
await sdk.changeStyles(styles: StyleConfig);

// Static
KYC_SDK.version; // "0.0.1"
```
