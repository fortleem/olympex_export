"use client";

import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";
import { Logo } from "@/components/olymp/Logo";
import { contactDetails } from "@/data/products";
import { ALink } from "@/lib/router";
import { useI18n } from "@/i18n";

/**
 * Site footer. Product *listings* deliberately do not appear here — the
 * footer links to the catalogue sections instead of re-listing individual
 * products (they already live on the homepage and products pages).
 */
export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            {/* Official stacked composition — OLYMPEX wordmark under the
                mark (footer only; the header keeps the horizontal lock-up). */}
            <Logo stacked size="md" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`${label} (placeholder)`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase">
              {t("footer.colCompany")}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {(
                [
                  { to: "/about", key: "footer.about" },
                  { to: "/quality", key: "footer.quality" },
                  { to: "/global-markets", key: "footer.markets" },
                  { to: "/sustainability", key: "footer.sustainability" },
                ] as const
              ).map((l) => (
                <li key={l.to}>
                  <ALink
                    to={l.to}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(l.key)}
                  </ALink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase">
              {t("footer.colProducts")}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {(
                [
                  { to: "/products", key: "footer.allProducts" },
                  { to: "/fresh-produce", key: "footer.fresh" },
                  { to: "/frozen-produce", key: "footer.frozen" },
                  { to: "/contact", key: "footer.requestQuote" },
                ] as const
              ).map((l) => (
                <li key={l.to + l.key}>
                  <ALink
                    to={l.to}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(l.key)}
                  </ALink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase">
              {t("footer.colContact")}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-primary" aria-hidden />
                <a href={`mailto:${contactDetails.email}`} className="hover:text-primary">
                  {contactDetails.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-primary" aria-hidden />
                <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                  {contactDetails.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-primary" aria-hidden />
                <span>{contactDetails.address}</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground/80">{contactDetails.note}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{t("footer.rights", { year })}</p>
          <p className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            {t("footer.sourced")}
          </p>
          <ul className="flex gap-5">
            <li>
              <a href="#" className="hover:text-primary">
                {t("footer.privacy")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                {t("footer.terms")}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
