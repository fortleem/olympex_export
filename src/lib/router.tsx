"use client";

import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal hash-based router for the single-page Olymp Ex site.
 * Routes mirror the original TanStack file routes:
 *   #/  #/about  #/products  #/products/<slug>  #/fresh-produce
 *   #/frozen-produce  #/quality  #/global-markets  #/sustainability  #/contact
 */

export type RoutePath =
  | "/"
  | "/about"
  | "/products"
  | "/fresh-produce"
  | "/frozen-produce"
  | "/quality"
  | "/global-markets"
  | "/sustainability"
  | "/contact";

/** Parse the raw hash into a normalized path like "/products/strawberries". */
export function parseHash(hash: string): string {
  const raw = hash.replace(/^#/, "");
  if (!raw || raw === "/") return "/";
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  // Guard against "#main" style in-page anchors.
  if (path.startsWith("/main")) return "/";
  return path.replace(/\/+$/, "") || "/";
}

/** React hook: current hash path, kept in sync with the browser. */
export function useHashRoute(): string {
  // Start from "/" so SSR markup and the first client render always match
  // (the server cannot see the hash). The real hash — if any — is picked up
  // in the mount effect below, right after hydration.
  const [path, setPath] = useState<string>("/");

  useEffect(() => {
    const onChange = () => setPath(parseHash(window.location.hash));
    onChange(); // sync the initial hash (deep links) after hydration
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return path;
}

/** Programmatic navigation. */
export function navigate(to: string) {
  const target = `#${to.startsWith("/") ? to : `/${to}`}`;
  if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = target;
  }
}

/** True when `path` corresponds to the nav target `to`. */
export function isRouteActive(path: string, to: string): boolean {
  if (to === "/") return path === "/";
  const clean = to.replace(/\/$/, "");
  return path === clean || path.startsWith(`${clean}/`);
}

interface ALinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  params?: Record<string, string>;
  activeClass?: string;
  isActive?: boolean;
  children?: ReactNode;
}

/**
 * Anchor-based link. Uses a real href so middle-click, cmd-click and
 * browser history keep working; hash changes are handled by useHashRoute.
 */
export function ALink({ to, params, className, activeClass, isActive, children, ...rest }: ALinkProps) {
  let href = to;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      href = href.replace(`$${key}`, encodeURIComponent(value));
    }
  }
  return (
    <a href={`#${href}`} className={cn(className, isActive && activeClass)} {...rest}>
      {children}
    </a>
  );
}
