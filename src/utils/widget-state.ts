let isInitialized = false;

export function resetWidgetState(): void {
  isInitialized = false;
}

export function isWidgetInitialized(): boolean {
  return isInitialized;
}

export function markWidgetInitialized(): void {
  isInitialized = true;
}
