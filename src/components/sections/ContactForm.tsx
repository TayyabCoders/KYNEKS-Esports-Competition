"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT_FIELDS, validateContact, validateContactField, type ContactField, type ContactInput } from "@/lib/contact";
import { sendContact } from "@/services/contactService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Icon from "@/components/common/Icon";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY: ContactInput = { name: "", email: "", phone: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [trap, setTrap] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const error = (field: ContactField) => (touched[field] ? validateContactField(field, values[field]) ?? undefined : undefined);
  const bind = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    error: error(field),
    onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [field]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [field]: true })),
    disabled: status === "loading",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(CONTACT_FIELDS.map((f) => [f, true])));
    if (!validateContact(values).ok) return;

    setStatus("loading");
    setServerError("");
    try {
      await sendContact({ ...values, website: trap });
      setValues(EMPTY);
      setTouched({});
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="flex min-h-[320px] flex-col items-center justify-center px-2 text-center">
        <span className="flex h-16 w-16 items-center justify-center border-2 border-lime bg-lime/10 text-lime shadow-glow-lime">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h3 ref={successRef} tabIndex={-1} className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.9] outline-none">
          Message <span className="text-lime">sent.</span>
        </h3>
        <p className="mt-3 max-w-xs text-text-muted">Thanks for reaching out. We&apos;ll get back to you soon.</p>
        <Button type="button" variant="outline" size="md" className="mt-6" onClick={() => setStatus("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-busy={status === "loading"}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Name" placeholder="Your name" autoComplete="name" maxLength={60} required {...bind("name")} />
        <Input label="Email" type="email" inputMode="email" placeholder="you@example.com" autoComplete="email" required {...bind("email")} />
      </div>
      <Input label="Phone (optional)" type="tel" inputMode="tel" placeholder="+92 300 1234567" autoComplete="tel" maxLength={20} {...bind("phone")} />
      <Textarea label="Message" placeholder="How can we help?" maxLength={1000} required {...bind("message")} />

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      {status === "error" && (
        <p role="alert" className="flex items-start gap-3 border border-status-danger/40 bg-status-danger/10 p-4 text-sm text-red-200">
          <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-status-danger" />
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" isLoading={status === "loading"} className="w-full">
        {status === "error" ? "Try again" : "Send message"}
        <Icon name="arrowRight" className="h-5 w-5" />
      </Button>
    </form>
  );
}
