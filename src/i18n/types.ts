/** Locale identifiers supported by the site. */
export type Locale = "en" | "ar" | "fr" | "de" | "es" | "zh";

export interface LocaleMeta {
  code: Locale;
  /** ISO code set on <html lang>. */
  htmlLang: string;
  /** Native name shown in the switcher. */
  native: string;
  /** English name (a11y / tooltips). */
  english: string;
  dir: "ltr" | "rtl";
}

export const LOCALES: LocaleMeta[] = [
  { code: "en", htmlLang: "en", native: "English", english: "English", dir: "ltr" },
  { code: "ar", htmlLang: "ar", native: "العربية", english: "Arabic", dir: "rtl" },
  { code: "fr", htmlLang: "fr", native: "Français", english: "French", dir: "ltr" },
  { code: "de", htmlLang: "de", native: "Deutsch", english: "German", dir: "ltr" },
  { code: "es", htmlLang: "es", native: "Español", english: "Spanish", dir: "ltr" },
  { code: "zh", htmlLang: "zh-CN", native: "中文", english: "Chinese", dir: "ltr" },
];

export const DEFAULT_LOCALE: Locale = "en";

export function localeMeta(locale: Locale): LocaleMeta {
  return LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
}

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && LOCALES.some((l) => l.code === value);
}
