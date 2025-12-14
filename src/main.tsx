import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { LanguageProvider, ThemeProvider } from "./provider";
import type { SDK_Config } from "./types";
import themeStyles from "./styles/theme.scss?raw";
import { injectCustomStyles, injectCustomCSS } from "./utils/style-injection";
import { isWidgetInitialized, markWidgetInitialized } from "./utils/widget-state";
import "./index.css";
import Widget from "./widget";

export function InitializeWidget(config: SDK_Config, containerSelector?: string) {
  if (isWidgetInitialized()) {
    console.warn("[KYC_SDK] Widget already initialized. Skipping duplicate initialization.");
    return;
  }

  markWidgetInitialized();

  const { apiKey, tenantId, style, translation } = config;

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

    if (style) {
      injectCustomStyles(style, document);
    }

    if (config.customCSS) {
      injectCustomCSS(config.customCSS, document);
    }

    const handleStyleChange = (event: Event) => {
      const { styles } = (event as CustomEvent).detail;
      injectCustomStyles(styles, document);
    };
    window.addEventListener("widget-style-change", handleStyleChange);

    const handleCustomCSSChange = (event: Event) => {
      const { css } = (event as CustomEvent).detail;
      injectCustomCSS(css, document);
    };
    window.addEventListener("widget-custom-css-change", handleCustomCSSChange);

    const root = createRoot(inlineContainer);
    root.render(
      <StrictMode>
        <LanguageProvider
          translationConfig={translation}
          initialLanguage={translation?.defaultLanguage || "en"}
        >
          <ThemeProvider config={{ debug: config.debug }}>
            <Widget />
          </ThemeProvider>
        </LanguageProvider>
      </StrictMode>
    );
    return;
  }

  let iframe = document.getElementById("widget-iframe") as HTMLIFrameElement;

  const setupIframe = () => {
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    if (!localStorage.getItem("apiKey")) {
      localStorage.setItem("apiKey", apiKey);
    }

    if (localStorage.getItem("tenantId")) {
      sessionStorage.setItem("tenantId", String(tenantId));
    }

    iframeDoc.body.style.backgroundColor = "transparent";
    iframeDoc.documentElement.style.backgroundColor = "transparent";

    const themeStyle = iframeDoc.createElement("style");
    themeStyle.textContent = themeStyles;
    iframeDoc.head.appendChild(themeStyle);

    if (style) {
      injectCustomStyles(style, iframeDoc);
    }

    if (config.customCSS) {
      injectCustomCSS(config.customCSS, iframeDoc);
    }

    const BRIDGED_EVENTS = [
      "widget-theme-change",
      "widget-language-change",
      "widget-style-change",
      "widget-custom-css-change",
      "widget-debug-change",
      "widget-user-data",
    ];

    BRIDGED_EVENTS.forEach(eventName => {
      window.addEventListener(eventName, (event: Event) => {
        iframe.contentWindow?.dispatchEvent(
          new CustomEvent(eventName, { detail: (event as CustomEvent).detail })
        );
      });
    });

    const handleStyleChange = (event: Event) => {
      const { styles } = (event as CustomEvent).detail;
      injectCustomStyles(styles, iframeDoc);
    };
    iframe.contentWindow?.addEventListener("widget-style-change", handleStyleChange);

    const handleCustomCSSChange = (event: Event) => {
      const { css } = (event as CustomEvent).detail;
      injectCustomCSS(css, iframeDoc);
    };
    iframe.contentWindow?.addEventListener("widget-custom-css-change", handleCustomCSSChange);

    const container = iframeDoc.createElement("div");
    container.id = "widget-container";
    iframeDoc.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      <StrictMode>
        <LanguageProvider
          translationConfig={translation}
          initialLanguage={translation?.defaultLanguage || "en"}
        >
          <ThemeProvider config={{ debug: config.debug }}>
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
