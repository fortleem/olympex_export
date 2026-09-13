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
import { quoteSchema, formatLabels, volumeOptions, destinationOptions, type QuoteInput } from "@/lib/quote-schema";

const productOptions = [...products.map((p) => p.name), "Seasonal / other lines"];

export default function ContactView() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
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
      toast.success("Enquiry received", {
        description: "Our commercial team will respond within one business day.",
      });
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again, or email us directly at " + contactDetails.email,
      });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title="Tell us the specification. We'll come back with a position."
        description="Share your product, format, volume, packaging and destination — our commercial team responds with an availability position and an indicative offer."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Contact details */}
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="Direct contact"
              title="Talk to the commercial team"
              description="One point of contact across sourcing, quality, logistics and documentation."
            />
            <ul className="mt-10 space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: contactDetails.email,
                  href: `mailto:${contactDetails.email}`,
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: contactDetails.phone,
                  href: `tel:${contactDetails.phone.replace(/\s/g, "")}`,
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: contactDetails.whatsapp,
                  href: `https://wa.me/${contactDetails.whatsapp.replace(/[^\d]/g, "")}`,
                },
                {
                  icon: MapPin,
                  label: "Office",
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

          {/* RFQ form */}
          <Reveal className="lg:col-span-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-10">
              <Eyebrow>RFQ form</Eyebrow>
              <h2 className="mt-5 text-2xl font-extrabold md:text-3xl">
                Request a quote
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Fields marked with an asterisk are required. The more detail you share, the more
                precise our first answer will be.
              </p>

              {submitted ? (
                <div className="mt-10 flex flex-col items-center gap-5 rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
                  <CheckCircle2 className="size-10 text-primary" aria-hidden />
                  <div>
                    <h3 className="text-lg font-bold">Enquiry received</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                      Thank you — your request has been logged with reference and routed to the
                      commercial team. Expect a response within one business day.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Submit another enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        placeholder="e.g. Nordfrucht Import GmbH"
                        autoComplete="organization"
                        aria-invalid={!!errors.company}
                        {...register("company")}
                      />
                      {errors.company && (
                        <p className="text-xs text-destructive">{errors.company.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact name *</Label>
                      <Input
                        id="contactName"
                        placeholder="e.g. Sarah Chen"
                        autoComplete="name"
                        aria-invalid={!!errors.contactName}
                        {...register("contactName")}
                      />
                      {errors.contactName && (
                        <p className="text-xs text-destructive">{errors.contactName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone / WhatsApp</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+00 000 000 0000"
                        autoComplete="tel"
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="product">Product / category *</Label>
                      <Select value={product} onValueChange={(v) => setValue("product", v)}>
                        <SelectTrigger id="product" className="w-full" aria-invalid={!!errors.product}>
                          <SelectValue placeholder="Select a product or line" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {productOptions.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.product && (
                        <p className="text-xs text-destructive">{errors.product.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Format *</Label>
                      <div
                        role="radiogroup"
                        aria-label="Format"
                        className="flex flex-wrap gap-2 pt-1"
                      >
                        {(Object.keys(formatLabels) as QuoteInput["format"][]).map((f) => (
                          <label
                            key={f}
                            className="cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={f}
                              className="peer sr-only"
                              {...register("format")}
                            />
                            <span className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
                              {formatLabels[f]}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volume">Estimated volume *</Label>
                      <Select value={volume} onValueChange={(v) => setValue("volume", v)}>
                        <SelectTrigger id="volume" className="w-full" aria-invalid={!!errors.volume}>
                          <SelectValue placeholder="Select an indicative volume" />
                        </SelectTrigger>
                        <SelectContent>
                          {volumeOptions.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.volume && (
                        <p className="text-xs text-destructive">{errors.volume.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination market *</Label>
                      <Select value={destination} onValueChange={(v) => setValue("destination", v)}>
                        <SelectTrigger
                          id="destination"
                          className="w-full"
                          aria-invalid={!!errors.destination}
                        >
                          <SelectValue placeholder="Select destination region" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinationOptions.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.destination && (
                        <p className="text-xs text-destructive">{errors.destination.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packaging">Packaging preference</Label>
                      <Input
                        id="packaging"
                        placeholder="e.g. 10kg cartons, private-label punnets"
                        {...register("packaging")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipmentDate">Target shipment date</Label>
                      <Input id="shipmentDate" type="date" {...register("shipmentDate")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message / specification notes</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Varieties, calibres, labelling, certification requirements, incoterms…"
                      {...register("message")}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" aria-hidden /> Sending…
                        </>
                      ) : (
                        <>
                          Submit enquiry <ArrowRight aria-hidden />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Your enquiry is stored securely and answered by our commercial team.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
