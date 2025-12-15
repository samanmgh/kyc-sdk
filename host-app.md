# Host App Integration Example

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type KYC_SDK from "@vero-compliance/kyc-sdk";
import "@vero-compliance/kyc-sdk/styles";

const Header = () => (
  <header className='border-b border-gray-800 bg-gray-900'>
    <div className='container mx-auto px-4 py-4'>
      <h1 className='text-2xl font-bold text-white'>KYC Verification</h1>
    </div>
  </header>
);

export default function Home() {
  const sdkRef = useRef<KYC_SDK | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<"en" | "de">("en");

  useEffect(() => {
    // Skip if already initialized
    if (sdkRef.current) return;

    const initSDK = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const KYC_SDK = (await import("@vero-compliance/kyc-sdk")).default;

        const sdk = new KYC_SDK({
          apiKey: process.env.NEXT_PUBLIC_KYC_API_KEY || "your-api-key",
          tenantId: parseInt(process.env.NEXT_PUBLIC_KYC_TENANT_ID || "123"),
          theme: theme,
          language: language,
          debug: process.env.NODE_ENV === "development",
          styles: {
            primary: "#3b82f6",
            radius: "0.5rem",
          },
        });

        // Use selector string, not ref
        await sdk.init("#kyc-container");
        sdkRef.current = sdk;
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize KYC SDK:", err);
        setError((err as Error).message);
        setIsLoading(false);
      }
    };

    initSDK();

    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy();
        sdkRef.current = null;
      }
    };
  }, []);

  // Theme change handler - SDK auto-watches document classes
  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    // Update document class - SDK will detect and react
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
    // Or call SDK method directly
    sdkRef.current?.changeTheme(newTheme);
  };

  // Language change handler - SDK auto-watches lang attribute
  const handleLanguageChange = (newLang: "en" | "de") => {
    setLanguage(newLang);
    // Update document lang - SDK will detect and react
    document.documentElement.setAttribute("lang", newLang);
    // Or call SDK method directly
    sdkRef.current?.changeLanguage(newLang);
  };

  return (
    <div className='min-h-screen bg-gray-950'>
      <Header />

      <main className='container mx-auto p-4'>
        {/* Controls */}
        <div className='mb-4 flex gap-4'>
          <div className='flex gap-2'>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`rounded px-4 py-2 text-sm text-white transition-colors ${
                theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Dark Theme
            </button>
            <button
              onClick={() => handleThemeChange("light")}
              className={`rounded px-4 py-2 text-sm text-white transition-colors ${
                theme === "light"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Light Theme
            </button>
          </div>

          <div className='flex gap-2'>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`rounded px-4 py-2 text-sm text-white transition-colors ${
                language === "en"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange("de")}
              className={`rounded px-4 py-2 text-sm text-white transition-colors ${
                language === "de"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              German
            </button>
          </div>
        </div>

        {/* SDK Container */}
        <div className='rounded-lg border border-gray-800 bg-gray-900 p-4'>
          {isLoading && (
            <div className='flex min-h-150 items-center justify-center'>
              <div className='text-center'>
                <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500 mx-auto'></div>
                <p className='text-gray-400'>Loading KYC SDK...</p>
              </div>
            </div>
          )}

          {error && (
            <div className='min-h-150 rounded bg-red-950 p-4 text-red-200'>
              <h3 className='mb-2 font-bold'>Error initializing SDK</h3>
              <p>{error}</p>
              <p className='mt-4 text-sm text-red-300'>
                Make sure the SDK is properly installed and configured.
              </p>
            </div>
          )}

          <div
            id='kyc-container'
            style={{ width: "100%", minHeight: "600px" }}
            className={isLoading || error ? "hidden" : ""}
          />
        </div>
      </main>
    </div>
  );
}
```
