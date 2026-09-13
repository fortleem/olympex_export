"use client";

import { useEffect, useState } from "react";
import { Menu, X, Globe, ChevronRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/olymp/Logo";
import { ALink, isRouteActive, useHashRoute } from "@/lib/router";
import { cn } from "@/lib/utils";

export const navLinks = [
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/fresh-produce", label: "Fresh" },
  { to: "/frozen-produce", label: "Frozen" },
  { to: "/quality", label: "Quality" },
  { to: "/global-markets", label: "Global Markets" },
  { to: "/sustainability", label: "Sustainability" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useHashRoute();
  const { setTheme, resolvedTheme } = useTheme();

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
          <ALink to="/" aria-label="Olymp Ex home" className="shrink-0">
            <Logo />
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
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left scale-x-0 transition-transform duration-300",
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
            <div
              className="hidden items-center rounded-md border border-border p-0.5 md:flex"
              role="group"
              aria-label="Language selector"
            >
              <Globe className="mx-1.5 size-3.5 text-muted-foreground" aria-hidden />
              <button
                type="button"
                aria-pressed="true"
                className="rounded-[4px] bg-secondary px-2 py-1 text-xs font-semibold text-foreground"
              >
                EN
              </button>
              <span
                className="rounded-[4px] px-2 py-1 text-xs font-semibold text-muted-foreground/50"
                title="Arabic — coming soon"
                aria-label="Arabic — coming soon"
              >
                AR
              </span>
            </div>

            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="hidden h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex"
              aria-label="Toggle color theme"
              title="Toggle color theme"
            >
              <Sun className="hidden size-4 dark:block" aria-hidden />
              <Moon className="size-4 dark:hidden" aria-hidden />
            </button>

            <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
              <ALink to="/contact">Request a Quote</ALink>
            </Button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
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
                {l.label}
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
              </ALink>
            );
          })}
          <Button asChild variant="hero" className="mt-5">
            <ALink to="/contact">Request a Quote</ALink>
          </Button>
        </nav>
      </div>
    </header>
  );
}
