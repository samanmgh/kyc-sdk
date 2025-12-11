import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client';
import Widget from './Widget';
import { LanguageProvider, ThemeProvider } from './provider';
import type {SDK_Config} from "./types";
import themeStyles from './styles/theme.scss?raw';
import './index.css';

export function InitializeWidget(config: SDK_Config, containerSelector?: string) {
    const { apiKey, tenantId } = config;

    if (!localStorage.getItem('apiKey')) {
        localStorage.setItem('apiKey', apiKey);
    }

    if (!localStorage.getItem('tenantId')) {
        sessionStorage.setItem('tenantId', String(tenantId));
    }

    const targetContainer = containerSelector ? document.querySelector(containerSelector) : null;

    if (targetContainer) {
        const inlineContainer = document.createElement('div');
        inlineContainer.id = 'widget-inline-container';
        inlineContainer.style.width = '100%';
        inlineContainer.style.height = '100%';
        inlineContainer.style.minHeight = '600px';

        targetContainer.appendChild(inlineContainer);

        const themeStyle = document.createElement('style');
        themeStyle.textContent = themeStyles;
        document.head.appendChild(themeStyle);

        const root = createRoot(inlineContainer);
        root.render(
            <StrictMode>
                <LanguageProvider>
                    <ThemeProvider config={{ debug: config.debug }}>
                        <Widget />
                    </ThemeProvider>
                </LanguageProvider>
            </StrictMode>
        );
        return;
    }

    let iframe = document.getElementById('widget-iframe') as HTMLIFrameElement;

    const setupIframe = () => {
        const iframeDoc = iframe.contentWindow?.document;
        if (!iframeDoc) return;

        if (!localStorage.getItem('apiKey')) {
            localStorage.setItem('apiKey', apiKey);
        }

        if (localStorage.getItem('tenantId')) {
            sessionStorage.setItem('tenantId', String(tenantId));
        }

        // Set transparent background
        iframeDoc.body.style.backgroundColor = 'transparent';
        iframeDoc.documentElement.style.backgroundColor = 'transparent';

        // Inject theme CSS variables
        const themeStyle = iframeDoc.createElement('style');
        themeStyle.textContent = themeStyles;
        iframeDoc.head.appendChild(themeStyle);

        const container = iframeDoc.createElement('div');
        container.id = 'widget-container';
        iframeDoc.body.appendChild(container);

        const root = createRoot(container);
        root.render(
            <StrictMode>
                <LanguageProvider>
                    <ThemeProvider config={{ debug: config.debug }}>
                        <Widget />
                    </ThemeProvider>
                </LanguageProvider>
            </StrictMode>
        );

        // Show iframe after content is rendered in centered fullscreen mode
        setTimeout(() => {
            iframe.style.display = 'flex';
            iframe.style.justifyContent = 'center';
            iframe.style.alignItems = 'center';
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.right = 'auto';
            iframe.style.bottom = 'auto';
        }, 100);
    };

    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'widget-iframe';
        iframe.src = 'about:blank';
        iframe.style.touchAction = 'none';
        iframe.style.position = 'fixed';
        iframe.style.display = 'none';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.border = 'none';
        iframe.style.zIndex = '2000';
        iframe.style.overflow = 'hidden';
        iframe.style.background = 'none transparent';
        iframe.style.backgroundColor = 'transparent';
        iframe.style.colorScheme = 'none';
        iframe.style.transition = 'all 0.3s ease-in-out';
        iframe.style.willChange = 'width, height, transform';
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('allowtransparency', 'true');
        iframe.setAttribute('allowfullscreen', 'true');

        // Wait for iframe to load before setup
        iframe.addEventListener('load', setupIframe);
        document.body.appendChild(iframe);
    } else {
        // If iframe exists, check if already loaded
        if (iframe.contentDocument?.readyState === 'complete') {
            setupIframe();
        } else {
            iframe.addEventListener('load', setupIframe);
        }
    }
}
