"use client";

import { useEffect } from "react";
import { Header } from "@/components/olymp/Header";
import { Footer } from "@/components/olymp/Footer";
import HomeView from "@/components/olymp/views/HomeView";
import AboutView from "@/components/olymp/views/AboutView";
import ProductsView from "@/components/olymp/views/ProductsView";
import ProductDetailView from "@/components/olymp/views/ProductDetailView";
import FreshView from "@/components/olymp/views/FreshView";
import FrozenView from "@/components/olymp/views/FrozenView";
import QualityView from "@/components/olymp/views/QualityView";
import GlobalMarketsView from "@/components/olymp/views/GlobalMarketsView";
import SustainabilityView from "@/components/olymp/views/SustainabilityView";
import ContactView from "@/components/olymp/views/ContactView";
import { ALink, useHashRoute } from "@/lib/router";
import { getProduct } from "@/data/products";
import { Button } from "@/components/ui/button";
import { LocaleProvider, useI18n } from "@/i18n";
import { localizedName } from "@/i18n/product-names";
import type { DictKey } from "@/i18n/locales/en";

const titleKeys: Record<string, DictKey> = {
  "/": "title.home",
  "/about": "title.about",
  "/products": "title.products",
  "/fresh-produce": "title.fresh",
  "/frozen-produce": "title.frozen",
  "/quality": "title.quality",
  "/global-markets": "title.markets",
  "/sustainability": "title.sustainability",
  "/contact": "title.contact",
};

function NotFoundView() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("nf.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("nf.text")}</p>
        <div className="mt-6">
          <Button asChild variant="hero">
            <ALink to="/">{t("nf.cta")}</ALink>
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Resolve the localized document title for a hash path. */
function useTitleFor(path: string): string {
  const { t, locale } = useI18n();
  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const product = getProduct(decodeURIComponent(productMatch[1]));
    if (!product) return t("title.productMissing");
    return t("title.product", {
      name: localizedName(product.slug, product.name, locale),
    });
  }
  const key = titleKeys[path];
  return key ? t(key) : t("title.default");
}

function Site() {
  const path = useHashRoute();
  const { t } = useI18n();
  const pageTitle = useTitleFor(path);

  // Scroll back to top whenever the route changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);

  // Keep the document title in sync with the active view and locale. The
  // write is re-applied once after a short delay because Next.js applies
  // the root layout's static metadata <title> right after hydration
  // (~100 ms), which otherwise overwrites the hand-set title.
  useEffect(() => {
    const apply = () => {
      document.title = pageTitle;
    };
    apply();
    const to = setTimeout(apply, 400);
    return () => clearTimeout(to);
  }, [pageTitle]);

  let view: React.ReactNode;
  switch (true) {
    case path === "/":
      view = <HomeView />;
      break;
    case path === "/about":
      view = <AboutView />;
      break;
    case path === "/products":
      view = <ProductsView />;
      break;
    case path.startsWith("/products/"):
      view = <ProductDetailView slug={decodeURIComponent(path.slice("/products/".length))} />;
      break;
    case path === "/fresh-produce":
      view = <FreshView />;
      break;
    case path === "/frozen-produce":
      view = <FrozenView />;
      break;
    case path === "/quality":
      view = <QualityView />;
      break;
    case path === "/global-markets":
      view = <GlobalMarketsView />;
      break;
    case path === "/sustainability":
      view = <SustainabilityView />;
      break;
    case path === "/contact":
      view = <ContactView />;
      break;
    default:
      view = <NotFoundView />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        {t("a11y.skipToContent")}
      </a>
      <Header />
      <main id="main" className="flex-1">
        {view}
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <Site />
    </LocaleProvider>
  );
}
