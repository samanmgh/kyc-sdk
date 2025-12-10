# @vero-compliance/kyc-sdk

A KYC SDK for React/Next.js projects. Fully compatible with shadcn/ui design system.

## Installation

```bash
npm install @vero-compliance/kyc-sdk
```

## Quick Start

### 1. Import SDK Styles (Required)

```tsx
// layout.tsx or globals.css
import "@vero-compliance/kyc-sdk/styles";
```

> **Why required?** The SDK uses Tailwind utility classes like `bg-primary`. These class definitions are bundled in SDK styles. Without importing, components won't render properly.

> **Good news:** If your project has shadcn CSS variables (`--primary`, etc.), SDK components will automatically use YOUR colors. SDK styles only provide the utility class definitions, not the color values.

### 2. Add Provider

```tsx
"use client";
import { ThemeProvider } from "@vero-compliance/kyc-sdk";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```

### 3. Use Components

```tsx
import { Button } from "@vero-compliance/kyc-sdk";

<Button onClick={() => alert("Clicked!")}>Start KYC</Button>;
```

---

## How Styling Works

```
SDK CSS provides:     .bg-primary { background-color: var(--primary) }
Parent CSS provides:  :root { --primary: oklch(0.7 0.16 70) }
Result:               Button uses YOUR primary color!
```

**SDK imports = utility class definitions**  
**Parent CSS = actual color values**

---

## Customization

### Override Colors (Recommended)

Just define CSS variables in your `globals.css`:

```css
:root {
  --primary: oklch(0.7 0.2 200); /* Your brand color */
  --radius: 0.75rem;
}
```

SDK components will automatically use your values.

### Override Component Styles

```tsx
<Button className='rounded-full shadow-lg'>Custom</Button>
```

---

## Theme Sync (next-themes)

```tsx
import { useTheme } from "next-themes";
import { ThemeProvider } from "@vero-compliance/kyc-sdk";

function Providers({ children }) {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      {children}
    </ThemeProvider>
  );
}
```

---

## API

| Prop       | Type                  | Description       |
| ---------- | --------------------- | ----------------- |
| `config`   | `{ apiKey?, debug? }` | SDK configuration |
| `theme`    | `'light' \| 'dark'`   | Current theme     |
| `setTheme` | `(theme) => void`     | Theme setter      |
