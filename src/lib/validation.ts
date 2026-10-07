// Shared by the early-access form (instant feedback) and /api/waitlist (the real trust boundary).

export const PLAY_FORMATS = ["solo", "duo", "squad"] as const;
export type PlayFormat = (typeof PLAY_FORMATS)[number];

export interface WaitlistInput {
  gamerTag: string;
  email: string;
  format: PlayFormat;
}

export type WaitlistField = keyof WaitlistInput;
export type WaitlistErrors = Partial<Record<WaitlistField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TAG_RE = /^[\w .\-]+$/;

export function validateField(field: WaitlistField, raw: unknown): string | null {
  const value = typeof raw === "string" ? raw.trim() : "";
  switch (field) {
    case "gamerTag":
      if (value.length < 3) return "Gamer tag must be at least 3 characters.";
      if (value.length > 24) return "Gamer tag can be 24 characters at most.";
      if (!TAG_RE.test(value)) return "Use letters, numbers, spaces, dots, dashes or underscores.";
      return null;
    case "email":
      if (!value) return "Enter your email so we can reach you.";
      if (value.length > 254 || !EMAIL_RE.test(value)) return "That email doesn't look right.";
      return null;
    case "format":
      return (PLAY_FORMATS as readonly string[]).includes(value) ? null : "Pick how you'll play.";
    default: {
      const unreachable: never = field;
      return unreachable;
    }
  }
}

const FIELDS: readonly WaitlistField[] = ["gamerTag", "email", "format"];

export function validateWaitlist(
  input: Record<string, unknown>
): { ok: true; data: WaitlistInput } | { ok: false; errors: WaitlistErrors } {
  const errors: WaitlistErrors = {};
  for (const field of FIELDS) {
    const message = validateField(field, input[field]);
    if (message) errors[field] = message;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: {
      gamerTag: String(input.gamerTag).trim(),
      email: String(input.email).trim().toLowerCase(),
      format: input.format as PlayFormat,
    },
  };
}
