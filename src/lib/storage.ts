export function readPreference(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePreference(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Persistence is best-effort; in-memory state stays authoritative.
  }
}

export function removePreference(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Same best-effort contract as writePreference.
  }
}
