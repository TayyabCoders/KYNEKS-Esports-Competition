"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { joinWaitlist } from "@/services/waitlistService";
import {
  PLAY_FORMATS,
  validateField,
  validateWaitlist,
  type PlayFormat,
  type WaitlistField,
  type WaitlistInput,
} from "@/lib/validation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/common/Icon";

type Status = "idle" | "loading" | "success" | "error";

const FORMAT_LABEL: Record<PlayFormat, string> = { solo: "Solo", duo: "Duo", squad: "Squad" };

const BURST = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 110 + (i % 3) * 38;
  return { tx: `${Math.round(Math.cos(angle) * dist)}px`, ty: `${Math.round(Math.sin(angle) * dist)}px`, lime: i % 2 === 0 };
});

export default function WaitlistForm() {
  const [values, setValues] = useState<WaitlistInput>({ gamerTag: "", email: "", format: "squad" });
  const [touched, setTouched] = useState<Partial<Record<WaitlistField, boolean>>>({});
  const [trap, setTrap] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const error = (field: WaitlistField) => (touched[field] ? validateField(field, values[field]) ?? undefined : undefined);
  const ok = (field: WaitlistField) => (touched[field] && !validateField(field, values[field]) ? "Looks good" : undefined);
  const set = (field: WaitlistField, value: string) => setValues((v) => ({ ...v, [field]: value }));
  const blur = (field: WaitlistField) => () => setTouched((t) => ({ ...t, [field]: true }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ gamerTag: true, email: true, format: true });
    const result = validateWaitlist({ ...values });
    if (!result.ok) return;

    setStatus("loading");
    setServerError("");
    try {
      await joinWaitlist({ ...result.data, website: trap });
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="relative flex min-h-[420px] flex-col items-center justify-center px-2 text-center">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[34%]">
          {BURST.map((b, i) => (
            <span
              key={i}
              className={cn("absolute h-2 w-2 animate-burst", b.lime ? "bg-lime" : "bg-purple")}
              style={{ "--tx": b.tx, "--ty": b.ty, animationDelay: `${(i % 4) * 40}ms` } as CSSProperties}
            />
          ))}
        </div>
        <span className="flex h-20 w-20 items-center justify-center border-2 border-lime bg-lime/10 text-lime shadow-glow-lime">
          <Icon name="check" className="h-10 w-10" />
        </span>
        <h3 ref={successRef} tabIndex={-1} className="mt-6 font-display text-6xl font-extrabold uppercase leading-[0.9] outline-none">
          You&apos;re <span className="text-lime">in.</span>
        </h3>
        <p className="mt-4 max-w-sm text-text-muted">
          Welcome to the arena, <strong className="text-white">{values.gamerTag.trim()}</strong>. We&apos;ll reach out at{" "}
          <strong className="text-white">{values.email.trim()}</strong> the moment registrations open.
        </p>
      </div>
    );
  }

  const busy = status === "loading";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-busy={busy}>
      <Input
        id="gamerTag"
        name="gamerTag"
        label="Gamer tag"
        placeholder="e.g. NovaStrike"
        autoComplete="nickname"
        maxLength={24}
        value={values.gamerTag}
        onChange={(e) => set("gamerTag", e.target.value)}
        onBlur={blur("gamerTag")}
        error={error("gamerTag")}
        success={ok("gamerTag")}
        disabled={busy}
        required
      />
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        inputMode="email"
        value={values.email}
        onChange={(e) => set("email", e.target.value)}
        onBlur={blur("email")}
        error={error("email")}
        success={ok("email")}
        disabled={busy}
        required
      />

      <fieldset disabled={busy}>
        <legend className="mb-2 text-label font-medium text-text-secondary">How will you play?</legend>
        <div className="grid grid-cols-3 gap-2">
          {PLAY_FORMATS.map((format) => (
            <label key={format} className="relative cursor-pointer">
              <input
                type="radio"
                name="format"
                value={format}
                checked={values.format === format}
                onChange={() => set("format", format)}
                className="peer sr-only"
              />
              <span className="flex min-h-[48px] items-center justify-center border border-white/15 bg-surface-200 font-heading text-sm font-semibold uppercase tracking-wider text-text-muted transition-all duration-fast hover:border-white/40 peer-checked:border-lime peer-checked:bg-lime/10 peer-checked:text-lime peer-focus-visible:ring-2 peer-focus-visible:ring-lime peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
                {FORMAT_LABEL[format]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      {status === "error" && (
        <p role="alert" className="flex items-start gap-3 border border-status-danger/40 bg-status-danger/10 p-4 text-sm text-red-200">
          <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-status-danger" />
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" isLoading={busy} className="w-full">
        {status === "error" ? "Try again" : "Get early access"}
        <Icon name="arrowRight" className="h-5 w-5" />
      </Button>
      <p className="text-center text-xs text-text-disabled">No spam. One email when registrations open.</p>
    </form>
  );
}
