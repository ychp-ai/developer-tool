/** Storage is optional: restricted browsers and malformed saved data must not break tools. */
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Keep the current session usable when persistence is unavailable.
  }
}

export function readStringList(key: string): string[] {
  try {
    const value: unknown = JSON.parse(readStorage(key) ?? '[]')
    return Array.isArray(value)
      ? [...new Set(value.filter((item): item is string => typeof item === 'string'))]
      : []
  } catch {
    return []
  }
}
