import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { LanguageProvider, ThemeProvider } from "./provider";
import type { SDK_Config } from "./types";
import themeStyles from "./styles/theme.scss?raw";
import { injectCustomStyles } from "./utils/style-injection";
import { injectFallbackCSS } from "./utils/css-detection";
import { isWidgetInitialized, markWidgetInitialized } from "./utils/widget-state";
import "./index.css";
import Widget from "./widget";

declare global {
  interface Window {
    __KYC_SDK_CSS__?: string;
  }
}

function getCompiledCSS(): string {
  if (typeof window !== "undefined" && window.__KYC_SDK_CSS__) {
    return window.__KYC_SDK_CSS__;
  }
  return "";
}

function copyStylesToIframe(iframeDoc: Document): void {
  const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
  parentStyles.forEach(style => {
    if (style.tagName === "STYLE") {
      const newStyle = iframeDoc.createElement("style");
      newStyle.textContent = style.textContent;
      iframeDoc.head.appendChild(newStyle);
    } else if (style.tagName === "LINK") {
      const link = style as HTMLLinkElement;
      const newLink = iframeDoc.createElement("link");
      newLink.rel = "stylesheet";
      newLink.href = link.href;
      iframeDoc.head.appendChild(newLink);
    }
  });
}

export function InitializeWidget(config: SDK_Config, containerSelector?: string) {
  if (isWidgetInitialized()) {
    console.warn("[KYC_SDK] Widget already initialized. Skipping duplicate initialization.");
    return;
  }

  markWidgetInitialized();

  const { apiKey, tenantId, styles, theme, language } = config;

  if (!localStorage.getItem("apiKey")) {
    localStorage.setItem("apiKey", apiKey);
  }

  if (!localStorage.getItem("tenantId")) {
    sessionStorage.setItem("tenantId", String(tenantId));
  }

  const targetContainer = containerSelector ? document.querySelector(containerSelector) : null;

  if (targetContainer) {
    const inlineContainer = document.createElement("div");
    inlineContainer.id = "widget-inline-container";
    inlineContainer.style.width = "100%";
    inlineContainer.style.height = "100%";
    inlineContainer.style.minHeight = "600px";

    targetContainer.appendChild(inlineContainer);

    const themeStyle = document.createElement("style");
    themeStyle.textContent = themeStyles;
    document.head.appendChild(themeStyle);

    if (styles) {
      injectCustomStyles(styles, document);
    }

    const handleStyleChange = (event: Event) => {
      const { styles: newStyles } = (event as CustomEvent).detail;
      injectCustomStyles(newStyles, document);
    };
    window.addEventListener("widget-style-change", handleStyleChange);

    const root = createRoot(inlineContainer);
    root.render(
      <StrictMode>
        <LanguageProvider initialLanguage={language || "en"}>
          <ThemeProvider config={{ debug: config.debug }} initialTheme={theme || "dark"}>
            <Widget />
          </ThemeProvider>
        </LanguageProvider>
      </StrictMode>
    );
    return;
  }

  let iframe = document.getElementById("widget-iframe") as HTMLIFrameElement;
  const initialTheme = theme || "dark";

  const setupIframe = () => {
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    if (!localStorage.getItem("apiKey")) {
      localStorage.setItem("apiKey", apiKey);
    }

    if (localStorage.getItem("tenantId")) {
      sessionStorage.setItem("tenantId", String(tenantId));
    }

    const compiledCSS = getCompiledCSS();
    if (compiledCSS) {
      const mainStyle = iframeDoc.createElement("style");
      mainStyle.id = "kyc-sdk-main-styles";
      mainStyle.textContent = compiledCSS;
      iframeDoc.head.appendChild(mainStyle);
    } else {
      copyStylesToIframe(iframeDoc);
    }

    const themeStyle = iframeDoc.createElement("style");
    themeStyle.textContent = themeStyles;
    iframeDoc.head.appendChild(themeStyle);

    injectFallbackCSS(initialTheme, iframeDoc);

    if (initialTheme === "dark") {
      iframeDoc.documentElement.classList.add("dark");
    }

    if (styles) {
      injectCustomStyles(styles, iframeDoc);
    }

    const BRIDGED_EVENTS = ["widget-theme-change", "widget-language-change", "widget-style-change"];

    BRIDGED_EVENTS.forEach(eventName => {
      window.addEventListener(eventName, (event: Event) => {
        iframe.contentWindow?.dispatchEvent(
          new CustomEvent(eventName, { detail: (event as CustomEvent).detail })
        );
      });
    });

    const handleStyleChange = (event: Event) => {
      const { styles: newStyles } = (event as CustomEvent).detail;
      injectCustomStyles(newStyles, iframeDoc);
    };
    iframe.contentWindow?.addEventListener("widget-style-change", handleStyleChange);

    const handleThemeChange = (event: Event) => {
      const { theme: newTheme } = (event as CustomEvent).detail;
      injectFallbackCSS(newTheme, iframeDoc);

      if (newTheme === "dark") {
        iframeDoc.documentElement.classList.add("dark");
      } else {
        iframeDoc.documentElement.classList.remove("dark");
      }
    };
    iframe.contentWindow?.addEventListener("widget-theme-change", handleThemeChange);

    const container = iframeDoc.createElement("div");
    container.id = "widget-container";
    iframeDoc.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      <StrictMode>
        <LanguageProvider initialLanguage={language || "en"}>
          <ThemeProvider config={{ debug: config.debug }} initialTheme={initialTheme}>
            <Widget />
          </ThemeProvider>
        </LanguageProvider>
      </StrictMode>
    );

    setTimeout(() => {
      iframe.style.display = "flex";
      iframe.style.justifyContent = "center";
      iframe.style.alignItems = "center";
      iframe.style.width = "100vw";
      iframe.style.height = "100vh";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.right = "auto";
      iframe.style.bottom = "auto";
    }, 100);
  };

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "widget-iframe";
    iframe.src = "about:blank";
    iframe.style.touchAction = "none";
    iframe.style.position = "fixed";
    iframe.style.display = "none";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.border = "none";
    iframe.style.zIndex = "2000";
    iframe.style.overflow = "hidden";
    iframe.style.background = "none transparent";
    iframe.style.backgroundColor = "transparent";
    iframe.style.colorScheme = "none";
    iframe.style.transition = "all 0.3s ease-in-out";
    iframe.style.willChange = "width, height, transform";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("allowfullscreen", "true");

    iframe.addEventListener("load", setupIframe);
    document.body.appendChild(iframe);
  } else {
    if (iframe.contentDocument?.readyState === "complete") {
      setupIframe();
    } else {
      iframe.addEventListener("load", setupIframe);
    }
  }
}
