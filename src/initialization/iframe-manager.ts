interface IframeConfig {
  id: string;
  onLoad: () => void;
}

export function createIframe(config: IframeConfig): HTMLIFrameElement {
  const existing = document.getElementById(config.id) as HTMLIFrameElement;
  if (existing) {
    return existing;
  }

  const iframe = document.createElement('iframe');
  iframe.id = config.id;
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

  iframe.addEventListener('load', config.onLoad);
  document.body.appendChild(iframe);

  return iframe;
}

export function getIframeDocument(iframe: HTMLIFrameElement): Document | null {
  return iframe.contentWindow?.document || null;
}

export function showIframe(iframe: HTMLIFrameElement): void {
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
}
