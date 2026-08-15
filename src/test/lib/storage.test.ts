import { test, expect } from 'bun:test';
import { readPreference, writePreference, removePreference } from '../../lib/storage';

function installLocalStorage(storage: unknown): () => void {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
  return () => {
    if (original) {
      Object.defineProperty(globalThis, 'localStorage', original);
    } else {
      delete (globalThis as { localStorage?: unknown }).localStorage;
    }
  };
}

function installMemoryStorage(): { restore: () => void; store: Map<string, string> } {
  const store = new Map<string, string>();
  const restore = installLocalStorage({
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  });
  return { restore, store };
}

function installThrowingStorage(): () => void {
  return installLocalStorage({
    getItem() {
      throw new Error('storage unavailable');
    },
    setItem() {
      throw new Error('storage unavailable');
    },
    removeItem() {
      throw new Error('storage unavailable');
    },
  });
}

test('readPreference: returns stored value', () => {
  const { restore, store } = installMemoryStorage();
  try {
    store.set('sound', 'on');
    expect(readPreference('sound')).toBe('on');
  } finally {
    restore();
  }
});

test('readPreference: returns null when unset', () => {
  const { restore } = installMemoryStorage();
  try {
    expect(readPreference('sound')).toBeNull();
  } finally {
    restore();
  }
});

test('readPreference: returns null when localStorage throws', () => {
  const restore = installThrowingStorage();
  try {
    expect(readPreference('sound')).toBeNull();
  } finally {
    restore();
  }
});

test('writePreference: does not throw when localStorage throws', () => {
  const restore = installThrowingStorage();
  try {
    expect(() => writePreference('sound', 'on')).not.toThrow();
  } finally {
    restore();
  }
});

test('removePreference: does not throw when localStorage throws', () => {
  const restore = installThrowingStorage();
  try {
    expect(() => removePreference('sound')).not.toThrow();
  } finally {
    restore();
  }
});
