"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SAVED_KEY = "dashlink:saved-vehicles";
const COMPARE_KEY = "dashlink:compare-vehicles";
export const COMPARE_LIMIT = 4;

type SavedContextValue = {
  saved: string[];
  compare: string[];
  hydrated: boolean;
  isSaved: (slug: string) => boolean;
  isComparing: (slug: string) => boolean;
  toggleSaved: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  removeSaved: (slug: string) => void;
  removeCompare: (slug: string) => void;
  clearCompare: () => void;
  compareLimitReached: boolean;
};

const SavedContext = createContext<SavedContextValue | null>(null);

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(readList(SAVED_KEY));
    setCompare(readList(COMPARE_KEY));
    setHydrated(true);

    const sync = () => {
      setSaved(readList(SAVED_KEY));
      setCompare(readList(COMPARE_KEY));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("dashlink:list-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("dashlink:list-changed", sync);
    };
  }, []);

  const persist = useCallback((key: string, next: string[]) => {
    window.localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event("dashlink:list-changed"));
  }, []);

  const toggleSaved = useCallback(
    (slug: string) => {
      setSaved((current) => {
        const next = current.includes(slug)
          ? current.filter((item) => item !== slug)
          : [slug, ...current];
        persist(SAVED_KEY, next);
        return next;
      });
    },
    [persist],
  );

  const toggleCompare = useCallback(
    (slug: string) => {
      setCompare((current) => {
        if (current.includes(slug)) {
          const next = current.filter((item) => item !== slug);
          persist(COMPARE_KEY, next);
          return next;
        }
        if (current.length >= COMPARE_LIMIT) return current;
        const next = [...current, slug];
        persist(COMPARE_KEY, next);
        return next;
      });
    },
    [persist],
  );

  const value = useMemo<SavedContextValue>(
    () => ({
      saved,
      compare,
      hydrated,
      isSaved: (slug: string) => saved.includes(slug),
      isComparing: (slug: string) => compare.includes(slug),
      toggleSaved,
      toggleCompare,
      removeSaved: (slug: string) => {
        const next = saved.filter((item) => item !== slug);
        setSaved(next);
        persist(SAVED_KEY, next);
      },
      removeCompare: (slug: string) => {
        const next = compare.filter((item) => item !== slug);
        setCompare(next);
        persist(COMPARE_KEY, next);
      },
      clearCompare: () => {
        setCompare([]);
        persist(COMPARE_KEY, []);
      },
      compareLimitReached: compare.length >= COMPARE_LIMIT,
    }),
    [saved, compare, hydrated, toggleSaved, toggleCompare, persist],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSavedVehicles() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error("useSavedVehicles must be used inside SavedProvider");
  }
  return context;
}
