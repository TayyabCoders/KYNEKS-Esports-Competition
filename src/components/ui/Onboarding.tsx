"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { tournamentRules } from "@/config/registration";
import {
  PLAYER_COUNT,
  emptyIgl,
  emptyPlayer,
  validateIgl,
  validateTeam,
  type FormErrors,
  type IglDetails,
  type PlayerDetails,
  type TeamDetails,
} from "@/lib/registration";
import { useReceiptUpload } from "@/hooks/useReceiptUpload";
import { registerSquad } from "@/services/registrationService";
import Button from "./Button";
import Icon from "@/components/common/Icon";
import { AgreementsStep, ConfirmationStep, IglStep, PaymentStep, TeamStep } from "./OnboardingSteps";

const STEPS = [
  { title: "Squad leader", subtitle: "Your IGL is the main contact for the squad." },
  { title: "Team & players", subtitle: "Add all four players. Player 1 is the IGL." },
  { title: "Payment", subtitle: "Pay the entry fee, then upload your slip." },
  { title: "Tournament rules", subtitle: "Accept every rule to complete registration." },
  { title: "All set", subtitle: "Your registration is in." },
] as const;

const LAST = STEPS.length - 1;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const newTeam = (): TeamDetails => ({ teamName: "", players: Array.from({ length: PLAYER_COUNT }, emptyPlayer) });
const noRulesAccepted = () => tournamentRules.map(() => false);

interface OnboardingProps {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "error";

/** Multi-step squad registration card. Stays mounted so a half-filled form survives an accidental close. */
export default function Onboarding({ open, onClose }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [igl, setIgl] = useState<IglDetails>(emptyIgl);
  const [team, setTeam] = useState<TeamDetails>(newTeam);
  const receipt = useReceiptUpload();
  const [accepted, setAccepted] = useState<boolean[]>(noRulesAccepted);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const p1Edited = useRef(false); // once the user edits Player 1, stop copying Step 1 over it
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const busy = status === "loading";
  const allAccepted = accepted.every(Boolean);

  const slipError =
    receipt.status === "done"
      ? null
      : receipt.status === "uploading"
        ? "Wait for the upload to finish."
        : receipt.error ?? "Upload your payment slip.";
  const errorsByStep: Record<number, FormErrors> = {
    0: validateIgl(igl),
    1: validateTeam(team),
    2: slipError ? { slip: slipError } : {},
    3: allAccepted ? {} : { agreements: "Accept every rule to continue." },
    4: {},
  };
  const errors = errorsByStep[step] ?? {};
  const visible: FormErrors = showErrors ? errors : {};

  const reset = () => {
    setStep(0);
    setIgl(emptyIgl());
    setTeam(newTeam());
    receipt.choose(null);
    setAccepted(noRulesAccepted());
    setShowErrors(false);
    setStatus("idle");
    setServerError("");
    p1Edited.current = false;
  };

  const close = () => {
    if (busy) return;
    if (step === LAST) reset(); // finished: next open starts a fresh registration
    onClose();
  };

  // Always call the latest close() from the keydown listener
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeRef.current();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const nodes = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    setShowErrors(false);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const submit = async () => {
    setStatus("loading");
    setServerError("");
    try {
      await registerSquad({ igl, ...team, agreementsAccepted: true, receiptKey: receipt.key });
      setStatus("idle");
      go(LAST);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  const next = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    if (step === 0 && !p1Edited.current) {
      const { fullName, age, whatsapp, area } = igl;
      setTeam((t) => ({ ...t, players: t.players.map((p, i) => (i === 0 ? { ...p, fullName, age, whatsapp, area } : p)) }));
    }
    if (step === LAST - 1) return void submit();
    go(step + 1);
  };

  const setPlayer = (index: number, field: keyof PlayerDetails, value: string) => {
    if (index === 0) p1Edited.current = true;
    setTeam((t) => ({ ...t, players: t.players.map((p, i) => (i === index ? { ...p, [field]: value } : p)) }));
  };

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
      <div aria-hidden="true" onClick={close} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        tabIndex={-1}
        className="chamfer relative w-full max-w-xl animate-rise bg-gradient-to-br from-lime/70 via-purple/60 to-purple/40 p-px outline-none"
      >
        <div className="chamfer relative flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden bg-surface-100 sm:max-h-[calc(100dvh-3rem)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 100% 0%, rgba(192,254,0,0.1), transparent 45%), radial-gradient(circle at 0% 100%, rgba(108,19,236,0.3), transparent 55%)",
            }}
          />

          <header className="relative flex items-start justify-between gap-4 px-5 pb-4 pt-6 sm:px-8">
            <div>
              <p className="mb-2 flex items-center gap-3 font-heading text-[11px] font-semibold uppercase tracking-[0.3em] text-lime">
                <span className="h-px w-6 bg-lime" aria-hidden="true" />
                Pre Registration
              </p>
              <h2 id="onboarding-title" className="font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">
                {STEPS[step]?.title}
              </h2>
              <p className="mt-2 text-sm text-text-muted">{STEPS[step]?.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={close}
              disabled={busy}
              aria-label="Close"
              className="-mr-2 -mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center text-text-muted transition-colors hover:text-lime disabled:opacity-50"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </header>

          <div ref={bodyRef} className="custom-scrollbar relative flex-1 overflow-y-auto px-5 py-2 sm:px-8">
            <div key={step} className="animate-step-in pb-4" style={{ "--dir": `${dir * 24}px` } as CSSProperties}>
              {step === 0 && <IglStep value={igl} errors={visible} onChange={(field, value) => setIgl((v) => ({ ...v, [field]: value }))} />}
              {step === 1 && <TeamStep value={team} errors={visible} onTeamName={(teamName) => setTeam((t) => ({ ...t, teamName }))} onPlayer={setPlayer} />}
              {step === 2 && <PaymentStep receipt={receipt} error={visible.slip} />}
              {step === 3 && (
                <AgreementsStep
                  accepted={accepted}
                  error={visible.agreements}
                  onToggle={(i) => setAccepted((a) => a.map((v, j) => (j === i ? !v : v)))}
                />
              )}
              {step === LAST && <ConfirmationStep teamName={team.teamName} />}
            </div>
          </div>

          <footer className="relative border-t border-white/10 px-5 pb-5 pt-4 sm:px-8">
            {status === "error" && (
              <p role="alert" className="mb-4 flex items-start gap-3 border border-status-danger/40 bg-status-danger/10 p-3 text-sm text-red-200">
                <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-status-danger" />
                {serverError}
              </p>
            )}

            <div className="flex justify-center gap-2" aria-hidden="true">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={cn("h-1.5 rounded-full transition-all duration-normal", i === step ? "w-5 bg-lime" : i < step ? "w-1.5 bg-lime/50" : "w-1.5 bg-white/20")}
                />
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              Step {step + 1} of {STEPS.length}
            </p>

            <div className="mt-4 flex gap-3">
              {step > 0 && step < LAST && (
                <Button type="button" variant="ghost" size="lg" onClick={() => go(step - 1)} disabled={busy}>
                  <Icon name="arrowLeft" className="h-5 w-5" />
                  Back
                </Button>
              )}
              {step < LAST ? (
                <Button type="button" size="lg" className="flex-1" onClick={next} isLoading={busy} disabled={(step === LAST - 1 && !allAccepted) || (step === 2 && receipt.status === "uploading")}>
                  {step < LAST - 1 ? "Continue" : status === "error" ? "Try again" : "Submit"}
                  <Icon name="arrowRight" className="h-5 w-5" />
                </Button>
              ) : (
                <Button type="button" size="lg" className="flex-1" onClick={close}>
                  Finish
                  <Icon name="check" className="h-5 w-5" />
                </Button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
