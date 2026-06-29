interface TrustedTypesWindow {
  trustedTypes?: {
    defaultPolicy: {
      createHTML: (s: string) => unknown;
      createScriptURL: (s: string) => unknown;
      createScript: (s: string) => unknown;
    } | null;
    createPolicy: (
      name: string,
      rules: {
        createHTML?: (s: string) => unknown;
        createScriptURL?: (s: string) => unknown;
        createScript?: (s: string) => unknown;
      },
    ) => {
      createHTML: (s: string) => unknown;
      createScriptURL: (s: string) => unknown;
      createScript: (s: string) => unknown;
    };
  };
}

export function createDefaultPolicy() {
  if (typeof window === "undefined") {
    return null;
  }
  const win = window as unknown as TrustedTypesWindow;
  if (!win.trustedTypes) return null;
  const existing = win.trustedTypes.defaultPolicy;
  if (existing) return existing;
  return win.trustedTypes.createPolicy("default", {
    createHTML: (s: string) => s,
    createScriptURL: (s: string) => s,
    createScript: (s: string) => s,
  });
}
