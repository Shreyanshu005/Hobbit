export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage: ${key}`, error);
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  }
};

export const STORAGE_KEYS = {
  HOBBIES: 'hobbit_hobbies',
  PROGRESS: 'hobbit_progress',
  SETTINGS: 'hobbit_settings'
} as const;
