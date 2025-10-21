import { createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

const createMemoryStorage = (): StateStorage => {
  let store: Record<string, string> = {};

  return {
    getItem: (name: string) => (name in store ? store[name] : null),
    setItem: (name: string, value: string) => {
      store[name] = value;
    },
    removeItem: (name: string) => {
      delete store[name];
    }
  };
};

type StorageType = 'local' | 'session';

export const createPersistStorage = (type: StorageType) =>
  createJSONStorage(() => {
    if (typeof window === 'undefined') {
      return createMemoryStorage();
    }
    return type === 'local' ? window.localStorage : window.sessionStorage;
  });

