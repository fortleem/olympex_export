"use client";

import { useEffect, useState } from "react";
import { Menu, X, Globe, ChevronRight, Sun, Moon, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/olymp/Logo";
import { ALink, isRouteActive, useHashRoute } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { LOCALES } from "@/i18n/types";
import type { DictKey } from "@/i18n/locales/en";

const navLinks: { to: string; key: DictKey }[] = [
  { to: "/about", key: "nav.about" },
  { to: "/products", key: "nav.products" },
  { to: "/fresh-produce", key: "nav.fresh" },
  { to: "/frozen-produce", key: "nav.frozen" },
  { to: "/quality", key: "nav.quality" },
  { to: "/global-markets", key: "nav.markets" },
  { to: "/sustainability", key: "nav.sustainability" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useHashRoute();
  const { setTheme, resolvedTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever navigation happens (click or history).
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "surface-glass" : "border-b border-transparent bg-background",
      )}
    >
      <div className="container-x">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <ALink to="/" aria-label={t("header.home")} className="shrink-0">
            <Logo size="sm" />
          </ALink>

          <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
            {navLinks.map((l) => {
              const active = isRouteActive(path, l.to);
              return (
                <ALink
                  key={l.to}
                  to={l.to}
                  isActive={active}
                  className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  activeClass="text-foreground"
                >
                  {t(l.key)}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left scale-x-0 transition-transform duration-300 rtl:origin-right",
                      active && "scale-x-100",
                    )}
                    style={{ background: "var(--gradient-accent-line)" }}
                    aria-hidden
                  />
                </ALink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="hidden h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex"
                aria-label={t("header.language")}
              >
                <Globe className="size-3.5" aria-hidden />
                {locale.toUpperCase()}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                {LOCALES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    aria-label={`${l.english} — ${l.native}`}
                    className="gap-2"
                  >
                    <span className="w-8 text-xs font-bold text-muted-foreground">
                      {l.code.toUpperCase()}
                    </span>
                    <span className="flex-1">{l.native}</span>
                    {l.code === locale ? (
                      <Check className="size-4 text-primary" aria-hidden />
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="hidden h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex"
              aria-label={t("header.toggleTheme")}
              title={t("header.toggleTheme")}
            >
              <Sun className="hidden size-4 dark:block" aria-hidden />
              <Moon className="size-4 dark:hidden" aria-hidden />
            </button>

            <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
              <ALink to="/contact">{t("common.requestQuote")}</ALink>
            </Button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-border bg-background xl:hidden"
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-4">
          {navLinks.map((l) => {
            const active = isRouteActive(path, l.to);
            return (
              <ALink
                key={l.to}
                to={l.to}
                isActive={active}
                className="flex items-center justify-between border-b border-border/70 py-3.5 text-base font-medium"
                activeClass="text-primary"
              >
                {t(l.key)}
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
              </ALink>
            );
          })}
          <Button asChild variant="hero" className="mt-5">
            <ALink to="/contact">{t("common.requestQuote")}</ALink>
          </Button>

          {/* Language chips for mobile */}
          <div
            role="group"
            aria-label={t("header.language")}
            className="mt-5 border-t border-border pt-4"
          >
            <p className="mb-2 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              <Globe className="size-3.5" aria-hidden /> {t("header.language")}
            </p>
            <div className="flex flex-wrap gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLocale(l.code)}
                  aria-pressed={l.code === locale}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors",
                    l.code === locale
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
