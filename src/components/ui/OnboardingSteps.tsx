"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { bankDetails, confirmationMessage, tournamentRules } from "@/config/registration";
import {
  MAX_SLIP_BYTES,
  PLAYER_COUNT,
  SLIP_TYPES,
  validateSlip,
  type FormErrors,
  type IglDetails,
  type PlayerDetails,
  type TeamDetails,
} from "@/lib/registration";
import type { ReceiptUpload } from "@/hooks/useReceiptUpload";
import Icon from "@/components/common/Icon";
import Input from "./Input";

// ---------- shared field ----------

const FIELD_PROPS = {
  fullName: { label: "Full name", placeholder: "e.g. Ali Khan", maxLength: 60 },
  whatsapp: { label: "WhatsApp number", placeholder: "+92 300 1234567", type: "tel", inputMode: "tel", maxLength: 20 },
  email: { label: "Email", placeholder: "you@example.com", type: "email", inputMode: "email", maxLength: 254 },
  age: { label: "Age", placeholder: "e.g. 19", inputMode: "numeric", maxLength: 2 },
  area: { label: "Area", placeholder: "e.g. Gulshan-e-Iqbal, Karachi", maxLength: 80 },
  pubgName: { label: "PUBG name", placeholder: "In-game name", maxLength: 32 },
} satisfies Record<string, ComponentProps<typeof Input>>;

type FieldKind = keyof typeof FIELD_PROPS;

interface FieldProps {
  kind: FieldKind;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  /** Browser autofill hint; only set for the signed-in person's own details. */
  autoComplete?: string;
  className?: string;
}

function Field({ kind, id, value, error, onChange, autoComplete, className }: FieldProps) {
  return (
    <div className={className}>
      <Input
        id={id}
        name={id}
        value={value}
        error={error}
        autoComplete={autoComplete ?? "off"}
        onChange={(e) => onChange(e.target.value)}
        required
        {...FIELD_PROPS[kind]}
      />
    </div>
  );
}

const grid = "grid gap-4 sm:grid-cols-2";

// ---------- Step 1: IGL ----------

interface IglStepProps {
  value: IglDetails;
  errors: FormErrors;
  onChange: (field: keyof IglDetails, value: string) => void;
}

export function IglStep({ value, errors, onChange }: IglStepProps) {
  const field = (kind: keyof IglDetails, autoComplete: string, className?: string) => (
    <Field kind={kind} id={`igl-${kind}`} value={value[kind]} error={errors[`igl.${kind}`]} onChange={(v) => onChange(kind, v)} autoComplete={autoComplete} className={className} />
  );
  return (
    <div className={grid}>
      {field("fullName", "name", "sm:col-span-2")}
      {field("whatsapp", "tel")}
      {field("age", "off")}
      {field("email", "email", "sm:col-span-2")}
      {field("area", "off", "sm:col-span-2")}
    </div>
  );
}

// ---------- Step 2: team & players ----------

interface TeamStepProps {
  value: TeamDetails;
  errors: FormErrors;
  onTeamName: (value: string) => void;
  onPlayer: (index: number, field: keyof PlayerDetails, value: string) => void;
}

export function TeamStep({ value, errors, onTeamName, onPlayer }: TeamStepProps) {
  return (
    <div className="space-y-6">
      <Input
        id="teamName"
        name="teamName"
        label="Team name"
        placeholder="e.g. Karachi Kings"
        maxLength={40}
        autoComplete="off"
        value={value.teamName}
        error={errors.teamName}
        onChange={(e) => onTeamName(e.target.value)}
        required
      />
      {value.players.slice(0, PLAYER_COUNT).map((player, i) => (
        <fieldset key={i} className="border border-white/10 bg-surface-200/60 p-4">
          <legend className="flex items-center gap-2 px-2 font-heading text-xs font-semibold uppercase tracking-[0.25em] text-lime">
            Player {i + 1}
            {i === 0 && <span className="border border-lime/40 bg-lime/10 px-1.5 py-0.5 text-[10px] tracking-widest">IGL</span>}
          </legend>
          <div className={grid}>
            {(["fullName", "pubgName", "whatsapp", "age", "area"] as const).map((kind) => (
              <Field
                key={kind}
                kind={kind}
                id={`p${i + 1}-${kind}`}
                value={player[kind]}
                error={errors[`players.${i}.${kind}`]}
                onChange={(v) => onPlayer(i, kind, v)}
                className={kind === "area" ? "sm:col-span-2" : undefined}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

// ---------- Step 3: payment ----------

interface PaymentStepProps {
  receipt: ReceiptUpload;
  /** Step-level message (e.g. "Upload your payment slip") shown after a Continue attempt. */
  error?: string;
}

const bankRows = [
  ["Account title", bankDetails.accountTitle],
  ["Bank name", bankDetails.bankName],
  ["Account number", bankDetails.accountNumber],
  ["IBAN", bankDetails.iban],
] as const;

export function PaymentStep({ receipt, error }: PaymentStepProps) {
  const { file: slip, status, progress, choose, retry } = receipt;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!slip?.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(slip);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [slip]);

  const problem = (slip ? receipt.error : undefined) ?? error;
  const canRetry = status === "error" && !!slip && !validateSlip(slip); // not worth retrying a wrong type or size

  return (
    <div className="space-y-5">
      <dl className="divide-y divide-white/10 border border-white/10 bg-surface-200/60">
        {bankRows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <dt className="font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">{label}</dt>
            <dd className="break-all font-heading text-sm font-semibold text-white sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>

      <div>
        <p className="mb-2 text-label font-medium text-text-secondary">Payment slip</p>
        <label
          htmlFor="slip"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            choose(e.dataTransfer.files[0] ?? null);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 border border-dashed px-4 py-6 text-center transition-colors duration-fast focus-within:border-lime focus-within:ring-2 focus-within:ring-lime hover:border-lime hover:bg-lime/5",
            dragging ? "border-lime bg-lime/10" : problem ? "border-status-danger/60" : "border-white/20 bg-surface-200/60"
          )}
        >
          <input
            id="slip"
            type="file"
            accept={SLIP_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => {
              choose(e.target.files?.[0] ?? null);
              e.target.value = ""; // lets the same file be picked again
            }}
          />
          {slip ? (
            <span className="flex w-full items-center gap-3 text-left">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview, nothing for next/image to optimise
                <img src={previewUrl} alt="Payment slip preview" className="h-16 w-16 shrink-0 border border-white/10 object-cover" />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/10 bg-surface-300 text-lime">
                  <Icon name="file" className="h-7 w-7" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-heading text-sm font-semibold text-white">{slip.name}</span>
                <span className={cn("block text-xs", status === "done" ? "text-lime" : status === "error" ? "text-status-danger" : "text-text-muted")}>
                  {(slip.size / 1024).toFixed(0)} KB
                  {status === "uploading" && ` · ${progress < 100 ? `Uploading ${progress}%` : "Saving…"}`}
                  {status === "done" && " · Uploaded"}
                  {status === "error" && " · Not uploaded"}
                </span>
                {status === "uploading" && (
                  <span
                    role="progressbar"
                    aria-label="Upload progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    className="mt-1.5 block h-1 w-full bg-white/10"
                  >
                    <span className="block h-full bg-lime transition-[width] duration-fast ease-smooth" style={{ width: `${progress}%` }} />
                  </span>
                )}
              </span>
              <span className="shrink-0 font-heading text-xs font-semibold uppercase tracking-wider text-lime">Replace</span>
            </span>
          ) : (
            <>
              <span className="flex h-11 w-11 items-center justify-center border border-lime/40 bg-lime/10 text-lime">
                <Icon name="upload" className="h-5 w-5" />
              </span>
              <span className="font-heading text-sm font-semibold uppercase tracking-wider text-white">Upload payment slip</span>
              <span className="text-xs text-text-muted">JPG, PNG, WebP or PDF, up to {MAX_SLIP_BYTES / 1024 / 1024} MB</span>
            </>
          )}
        </label>
        {problem && (
          <p role="alert" className="mt-2 flex flex-wrap items-center gap-x-3 text-caption text-status-danger">
            {problem}
            {canRetry && (
              <button type="button" onClick={retry} className="font-heading font-semibold uppercase tracking-wider text-lime hover:underline">
                Retry upload
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------- Step 4: agreements ----------

interface AgreementsStepProps {
  accepted: boolean[];
  error?: string;
  onToggle: (index: number) => void;
}

export function AgreementsStep({ accepted, error, onToggle }: AgreementsStepProps) {
  return (
    <div className="space-y-3">
      {tournamentRules.map((rule, i) => (
        <label
          key={rule}
          className="flex cursor-pointer items-start gap-3 border border-white/10 bg-surface-200/60 p-3 transition-colors duration-fast hover:border-white/30 has-[:checked]:border-lime/50 has-[:checked]:bg-lime/[0.06]"
        >
          <input type="checkbox" checked={accepted[i] ?? false} onChange={() => onToggle(i)} className="peer sr-only" />
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-white/30 text-transparent transition-colors duration-fast peer-checked:border-lime peer-checked:bg-lime peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-lime peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
            <Icon name="check" className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm text-text-secondary">{rule}</span>
        </label>
      ))}
      {error && (
        <p role="alert" className="text-caption text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------- Step 5: confirmation ----------

export function ConfirmationStep({ teamName }: { teamName: string }) {
  return (
    <div role="status" className="flex flex-col items-center px-2 py-6 text-center">
      <span className="flex h-20 w-20 items-center justify-center border-2 border-lime bg-lime/10 text-lime shadow-glow-lime">
        <Icon name="check" className="h-10 w-10" />
      </span>
      <h3 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.9]">
        Squad <span className="text-lime">locked.</span>
      </h3>
      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-text-muted">{teamName.trim()}</p>
      <p className="mt-3 max-w-sm text-text-muted">{confirmationMessage}</p>
    </div>
  );
}
