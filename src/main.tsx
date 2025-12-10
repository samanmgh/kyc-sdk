import {StrictMode, useState} from 'react'
import { createRoot } from 'react-dom/client';
import Widget from './Widget';
import { LanguageProvider, ThemeProvider } from './provider';
import type {SDK_Config, Theme} from "./types";
import themeStyles from './styles/theme.scss?raw';
import componentStyles from './styles/components.scss?raw';
import indexStyles from './styles/index.scss?raw';

export function InitializeWidget(config: SDK_Config) {
    const { apiKey, tenantId } = config;
    const [theme, setTheme] = useState<Theme>("light");

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

        const injectStyle = (css: string) => {
            const style = iframeDoc.createElement('style');
            style.textContent = css;
            iframeDoc.head.appendChild(style);
        };

        iframeDoc.body.style.backgroundColor = 'transparent';
        iframeDoc.documentElement.style.backgroundColor = 'transparent';

        injectStyle('html, body { margin: 0; padding: 0; background: transparent !important; background-color: transparent !important }');

        const combinedStyles = `
            ${themeStyles}
            ${componentStyles}
            ${indexStyles}
        `;

        injectStyle(combinedStyles);

        injectStyle(`
            :root {
                ${themeStyles.match(/:root\s*{([^}]+)}/)?.[1] || ''}
            }
            .dark {
                ${themeStyles.match(/\.dark\s*{([^}]+)}/)?.[1] || ''}
            }
            ${componentStyles}
            ${indexStyles}
        `);

        const container = iframeDoc.createElement('div');
        container.id = 'widget-container';
        iframeDoc.body.appendChild(container);

        const root = createRoot(container);
        root.render(
            <StrictMode>
                <LanguageProvider>
                    <ThemeProvider config={{ debug: true }} theme={theme} setTheme={setTheme}>
                        <Widget />
                    </ThemeProvider>
                </LanguageProvider>
            </StrictMode>
        );
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