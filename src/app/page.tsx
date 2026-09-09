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

const titles: Record<string, string> = {
  "/": "Olymp Ex — Egypt's Harvest, Delivered to the World",
  "/about": "About Olymp Ex — Egyptian Agritrade Export Company",
  "/products": "Products — Egyptian Fresh & Frozen Produce | Olymp Ex",
  "/fresh-produce": "Fresh Produce Export from Egypt — Olymp Ex",
  "/frozen-produce": "IQF Frozen Produce from Egypt — Olymp Ex",
  "/quality": "Quality & Traceability — Olymp Ex Egypt",
  "/global-markets": "Global Markets & Logistics — Olymp Ex Egypt",
  "/sustainability": "Sustainability & Responsible Sourcing — Olymp Ex",
  "/contact": "Request a Quote — Olymp Ex",
};

function NotFoundView() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Button asChild variant="hero">
            <ALink to="/">Go home</ALink>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const path = useHashRoute();

  // Scroll back to top whenever the route changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);

  // Keep the document title in sync with the active view.
  useEffect(() => {
    const productMatch = path.match(/^\/products\/([^/]+)$/);
    if (productMatch) {
      const product = getProduct(decodeURIComponent(productMatch[1]));
      document.title = product
        ? `${product.name} from Egypt — Olymp Ex`
        : "Product not found — Olymp Ex";
    } else {
      document.title = titles[path] ?? "Olymp Ex — Egyptian Fresh & Frozen Produce Exporter";
    }
  }, [path]);

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {view}
      </main>
      <Footer />
    </div>
  );
}
