import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { contactDetails, products } from "@/data/products";

const company = [
  { to: "/about", label: "About Olymp Ex" },
  { to: "/quality", label: "Quality & Traceability" },
  { to: "/global-markets", label: "Global Markets" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/contact", label: "Request a Quote" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Olymp Ex is an Egyptian agritrade export company connecting disciplined sourcing and
              cold-chain execution with importers, distributors and food-service partners worldwide.
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
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase">Company</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {company.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase">Products</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm lg:grid-cols-1">
              {products.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase">Contact</h2>
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
          <p>© {new Date().getFullYear()} Olymp Ex. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Proudly sourced and shipped from Egypt.
          </p>
          <ul className="flex gap-5">
            <li>
              <a href="#" className="hover:text-primary">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
