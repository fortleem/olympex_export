"use client";

/**
 * Locale context for the Olymp Ex site.
 *
 * The active locale lives in a tiny module-level external store backed by
 * localStorage and read via useSyncExternalStore. SSR and the hydration
 * render always use English (getServerSnapshot); React then swaps in the
 * persisted preference right after hydration — no state-in-effect, no
 * hydration mismatch, same pattern as useCurrentMonth(). `dir`/`lang` are
 * pushed onto <html> so Arabic gets full RTL layout.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE, isLocale, localeMeta, type Locale } from "./types";
import { en, type Dictionary, type DictKey } from "./locales/en";
import { ar } from "./locales/ar";
import { fr } from "./locales/fr";
import { de } from "./locales/de";
import { es } from "./locales/es";
import { zh } from "./locales/zh";

export const LOCALE_STORAGE_KEY = "olympex-locale";

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar, fr, de, es, zh };

/* ------------------------------------------------------------------ */
/* External locale store                                               */
/* ------------------------------------------------------------------ */

/** Cached current locale; null until first client read. */
let cachedLocale: Locale | null = null;

function readLocale(): Locale {
  if (cachedLocale === null) {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      cachedLocale = isLocale(stored) ? stored : DEFAULT_LOCALE;
    } catch {
      cachedLocale = DEFAULT_LOCALE;
    }
  }
  return cachedLocale;
}

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  // Keep tabs in sync: another tab switching language updates this one.
  const onStorage = (e: StorageEvent) => {
    if (e.key === LOCALE_STORAGE_KEY) {
      cachedLocale = null;
      onStoreChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function writeLocale(next: Locale) {
  cachedLocale = next;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    /* storage unavailable — preference just won't persist */
  }
  listeners.forEach((l) => l());
}

type Vars = Record<string, string | number>;

export interface I18n {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  /** Translate a key, interpolating {placeholders}. */
  t: (key: DictKey, vars?: Vars) => string;
  /** Localized short month labels, index 0 = January. */
  monthShort: readonly string[];
  /** Human label for a month list, e.g. [11,12,1,2] → "Nov – Dec, Jan – Feb". */
  monthsLabel: (months: number[]) => string;
}

const I18nContext = createContext<I18n | null>(null);

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{${key}}`).join(String(value));
  }
  return out;
}

/** Localized sibling of monthsLabel() from data/products.ts (which stays EN for the CSV). */
function makeMonthsLabel(months: readonly string[], onRequest: string, yearRound: string) {
  return (list: number[]): string => {
    if (list.length === 0) return onRequest;
    if (list.length === 12) return yearRound;
    const sorted = [...list].sort((a, b) => a - b);
    const runs: string[] = [];
    const push = (s: number, e: number) =>
      runs.push(s === e ? months[s - 1] : `${months[s - 1]} – ${months[e - 1]}`);
    let start = sorted[0];
    let prev = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
      const m = sorted[i];
      if (m === prev + 1) {
        prev = m;
        continue;
      }
      push(start, prev);
      start = m;
      prev = m;
    }
    push(start, prev);
    return runs.join(", ");
  };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // English during SSR and hydration; the stored preference takes over
  // right after hydration via the snapshot swap.
  const locale = useSyncExternalStore(
    subscribe,
    readLocale,
    () => DEFAULT_LOCALE,
  );

  const setLocale = useCallback((next: Locale) => writeLocale(next), []);

  // Keep <html lang> and <html dir> in sync (Arabic → RTL document).
  useEffect(() => {
    const meta = localeMeta(locale);
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dir = meta.dir;
  }, [locale]);

  const value = useMemo<I18n>(() => {
    const dict = DICTIONARIES[locale];
    const t = (key: DictKey, vars?: Vars) => interpolate(dict[key] ?? en[key], vars);
    const monthShort = Array.from({ length: 12 }, (_, i) => t(`explorer.month${i + 1}` as DictKey));
    return {
      locale,
      dir: localeMeta(locale).dir,
      setLocale,
      t,
      monthShort,
      monthsLabel: makeMonthsLabel(monthShort, t("cal.onRequest"), t("cal.yearRound")),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LocaleProvider>");
  return ctx;
}
