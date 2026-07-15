// Safe storage wrapper to prevent crashes in third-party iframes (e.g., on bvm-ev.de)
// where direct access to localStorage throws a SecurityError/DOMException.

const memoryStorage: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[SafeStorage] Failed to read key "${key}" from localStorage (likely blocked in iframe):`, e);
    }
    return memoryStorage[key] !== undefined ? memoryStorage[key] : null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`[SafeStorage] Failed to write key "${key}" to localStorage (likely blocked in iframe):`, e);
    }
    memoryStorage[key] = String(value);
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`[SafeStorage] Failed to remove key "${key}" from localStorage (likely blocked in iframe):`, e);
    }
    delete memoryStorage[key];
  },

  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
        return;
      }
    } catch (e) {
      console.warn('[SafeStorage] Failed to clear localStorage (likely blocked in iframe):', e);
    }
    for (const key in memoryStorage) {
      delete memoryStorage[key];
    }
  }
};
