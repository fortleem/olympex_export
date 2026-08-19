import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
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
  const [lang, setLang] = useState<"EN" | "AR">("EN");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          <Link to="/" aria-label="Olymp Ex home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left scale-x-0 transition-transform duration-300",
                        isActive && "scale-x-100",
                      )}
                      style={{ background: "var(--gradient-accent-line)" }}
                      aria-hidden
                    />
                  </>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className="hidden items-center rounded-md border border-border p-0.5 md:flex"
              role="group"
              aria-label="Language selector"
            >
              <Globe className="mx-1.5 size-3.5 text-muted-foreground" aria-hidden />
              {(["EN", "AR"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={cn(
                    "rounded-[4px] px-2 py-1 text-xs font-semibold transition-colors",
                    lang === code
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {code}
                </button>
              ))}
            </div>

            <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
              <Link to="/contact">Request a Quote</Link>
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
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center justify-between border-b border-border/70 py-3.5 text-base font-medium"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
            </Link>
          ))}
          <Button asChild variant="hero" className="mt-5">
            <Link to="/contact">Request a Quote</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
