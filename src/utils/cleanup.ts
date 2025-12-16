/**
 * Cleanup utilities for SDK
 * Separated from main.tsx to avoid React Fast Refresh warnings
 */

// Store cleanup function globally for destroy()
let eventBridgeCleanup: (() => void) | null = null;

export function setEventBridgeCleanup(cleanup: () => void): void {
  eventBridgeCleanup = cleanup;
}

export function cleanupEventBridge(): void {
  if (eventBridgeCleanup) {
    eventBridgeCleanup();
    eventBridgeCleanup = null;
  }
}
