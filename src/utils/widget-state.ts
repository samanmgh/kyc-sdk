/**
 * Widget initialization state management
 * Separated from main.tsx to avoid React Fast Refresh warnings
 */

// Track initialization state to prevent double rendering
let isInitialized = false;

/**
 * Resets the initialization state (used by SDK.destroy())
 */
export function resetWidgetState(): void {
  isInitialized = false;
}

/**
 * Checks if the widget is already initialized
 */
export function isWidgetInitialized(): boolean {
  return isInitialized;
}

/**
 * Marks the widget as initialized
 */
export function markWidgetInitialized(): void {
  isInitialized = true;
}
