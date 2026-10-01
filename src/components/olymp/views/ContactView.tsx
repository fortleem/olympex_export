"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section, SectionHeader, PageHero, Eyebrow } from "@/components/olymp/Section";
import { Reveal } from "@/components/olymp/Reveal";
import { contactDetails, products } from "@/data/products";
import {
  makeQuoteSchema,
  volumeOptions,
  destinationOptions,
  type QuoteInput,
} from "@/lib/quote-schema";
import { useI18n } from "@/i18n";
import { localizedName } from "@/i18n/product-names";
import type { DictKey } from "@/i18n/locales/en";

const volumeKeys: DictKey[] = [
  "contact.vol1",
  "contact.vol2",
  "contact.vol3",
  "contact.vol4",
  "contact.vol5",
  "contact.vol6",
];

const destinationKeys: DictKey[] = [
  "contact.dest1",
  "contact.dest2",
  "contact.dest3",
  "contact.dest4",
  "contact.dest5",
  "contact.dest6",
  "contact.dest7",
];

const formatItems: { value: QuoteInput["format"]; key: DictKey }[] = [
  { value: "fresh", key: "contact.formatFresh" },
  { value: "frozen", key: "contact.formatFrozen" },
  { value: "both", key: "contact.formatBoth" },
];

/** Canonical (submitted) value of the seasonal/other fallback option. */
const SEASONAL_OTHER_VALUE = "Seasonal / other lines";

/**
 * The RFQ form. Remounted when the locale changes (`key={locale}`) because
 * react-hook-form resolvers are not reactive — a fresh mount rebuilds the
 * resolver with the new language's validation messages.
 */
function QuoteForm() {
  const { t, locale } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(
      // Same rules as the API; messages from the active locale.
      makeQuoteSchema({
        company: t("contact.zodCompany"),
        contactName: t("contact.zodContact"),
        email: t("contact.zodEmail"),
        product: t("contact.zodProduct"),
        volume: t("contact.zodVolume"),
        destination: t("contact.zodDestination"),
      }),
    ),
    defaultValues: {
      company: "",
      contactName: "",
      email: "",
      phone: "",
      product: "",
      format: "fresh",
      volume: "",
      destination: "",
      packaging: "",
      shipmentDate: "",
      message: "",
      website: "",
    },
  });

  const product = watch("product");
  const volume = watch("volume");
  const destination = watch("destination");

  const onSubmit = async (data: QuoteInput) => {
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; id?: string; message?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.message ?? "Request failed");
      }
      setSubmitted(true);
      reset();
      toast.success(t("contact.toastTitle"), {
        description: t("contact.toastDesc"),
      });
    } catch {
      toast.error(t("contact.errorTitle"), {
        description: t("contact.errorDesc", { email: contactDetails.email }),
      });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-10">
      <Eyebrow>{t("contact.rfqEyebrow")}</Eyebrow>
      <h2 className="mt-5 text-2xl font-extrabold md:text-3xl">{t("contact.rfqTitle")}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("contact.rfqNote")}</p>

      {submitted ? (
        <div className="mt-10 flex flex-col items-center gap-5 rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
          <CheckCircle2 className="size-10 text-primary" aria-hidden />
          <div>
            <h3 className="text-lg font-bold">{t("contact.successTitle")}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("contact.successText")}
            </p>
          </div>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            {t("contact.another")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
          {/* Honeypot — hidden from humans; bots that fill it are discarded server-side */}
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="website">Website</Label>
            <Input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">{t("contact.fCompany")}</Label>
              <Input
                id="company"
                placeholder={t("contact.companyPlaceholder")}
                autoComplete="organization"
                aria-invalid={!!errors.company}
                {...register("company")}
              />
              {errors.company && (
                <p className="text-xs text-destructive">{errors.company.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">{t("contact.fContactName")}</Label>
              <Input
                id="contactName"
                placeholder={t("contact.namePlaceholder")}
                autoComplete="name"
                aria-invalid={!!errors.contactName}
                {...register("contactName")}
              />
              {errors.contactName && (
                <p className="text-xs text-destructive">{errors.contactName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("contact.fEmail")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("contact.emailPlaceholder")}
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("contact.fPhone")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("contact.phonePlaceholder")}
                autoComplete="tel"
                {...register("phone")}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product">{t("contact.fProduct")}</Label>
              {/* English names are the submitted values; the locale name is display-only. */}
              <Select value={product} onValueChange={(v) => setValue("product", v)}>
                <SelectTrigger id="product" className="w-full" aria-invalid={!!errors.product}>
                  <SelectValue placeholder={t("contact.productPlaceholder")} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {products.map((p) => (
                    <SelectItem key={p.slug} value={p.name}>
                      {localizedName(p.slug, p.name, locale)}
                    </SelectItem>
                  ))}
                  <SelectItem value={SEASONAL_OTHER_VALUE}>
                    {t("contact.seasonalOther")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.product && (
                <p className="text-xs text-destructive">{errors.product.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("contact.fFormat")}</Label>
              <div
                role="radiogroup"
                aria-label={t("contact.formatAria")}
                className="flex flex-wrap gap-2 pt-1"
              >
                {formatItems.map((f) => (
                  <label key={f.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={f.value}
                      className="peer sr-only"
                      {...register("format")}
                    />
                    <span className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
                      {t(f.key)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">{t("contact.fVolume")}</Label>
              <Select value={volume} onValueChange={(v) => setValue("volume", v)}>
                <SelectTrigger id="volume" className="w-full" aria-invalid={!!errors.volume}>
                  <SelectValue placeholder={t("contact.volumePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {volumeOptions.map((v, i) => (
                    <SelectItem key={v} value={v}>
                      {t(volumeKeys[i])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.volume && (
                <p className="text-xs text-destructive">{errors.volume.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">{t("contact.fDestination")}</Label>
              <Select value={destination} onValueChange={(v) => setValue("destination", v)}>
                <SelectTrigger
                  id="destination"
                  className="w-full"
                  aria-invalid={!!errors.destination}
                >
                  <SelectValue placeholder={t("contact.destinationPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {destinationOptions.map((d, i) => (
                    <SelectItem key={d} value={d}>
                      {t(destinationKeys[i])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.destination && (
                <p className="text-xs text-destructive">{errors.destination.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="packaging">{t("contact.fPackaging")}</Label>
              <Input
                id="packaging"
                placeholder={t("contact.packagingPlaceholder")}
                {...register("packaging")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipmentDate">{t("contact.fShipment")}</Label>
              <Input id="shipmentDate" type="date" {...register("shipmentDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("contact.fMessage")}</Label>
            <Textarea
              id="message"
              rows={5}
              placeholder={t("contact.messagePlaceholder")}
              {...register("message")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden /> {t("contact.sending")}
                </>
              ) : (
                <>
                  {t("contact.submit")} <ArrowRight aria-hidden />
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">{t("contact.secureNote")}</p>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ContactView() {
  const { t, locale } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("contact.heroEyebrow")}
        title={t("contact.heroTitle")}
        description={t("contact.heroDesc")}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Contact details */}
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow={t("contact.directEyebrow")}
              title={t("contact.directTitle")}
              description={t("contact.directDesc")}
            />
            <ul className="mt-10 space-y-4">
              {[
                {
                  icon: Mail,
                  label: t("contact.email"),
                  value: contactDetails.email,
                  href: `mailto:${contactDetails.email}`,
                },
                {
                  icon: Phone,
                  label: t("contact.phone"),
                  value: contactDetails.phone,
                  href: `tel:${contactDetails.phone.replace(/\s/g, "")}`,
                },
                {
                  icon: MessageCircle,
                  label: t("contact.whatsapp"),
                  value: contactDetails.whatsapp,
                  href: `https://wa.me/${contactDetails.whatsapp.replace(/[^\d]/g, "")}`,
                },
                {
                  icon: MapPin,
                  label: t("contact.office"),
                  value: contactDetails.address,
                },
              ].map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href ?? "#"}
                    className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/5 text-primary">
                      <c.icon className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="mt-1 block text-sm font-semibold group-hover:text-primary">
                        {c.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted-foreground/80">{contactDetails.note}</p>
          </div>

          {/* RFQ form (remounts per locale so validation messages follow the language) */}
          <Reveal className="lg:col-span-8">
            <QuoteForm key={locale} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
