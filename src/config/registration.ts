// Everything an organiser may want to edit before launch lives here.

/** Shown on the Payment step. Replace the placeholders with the real account. */
export const bankDetails = {
  accountTitle: "KYNEKS Esports (Pvt) Ltd",
  bankName: "Your Bank Name",
  accountNumber: "0000-0000000000",
  iban: "PK00 XXXX 0000 0000 0000 0000",
} as const;

/** Every rule must be ticked before a squad can submit. 5-7 short rules works best. */
export const tournamentRules = [
  "I will play fair. No cheating, hacks, scripts or teaming with other squads.",
  "No emulators. Every player competes on a real mobile device.",
  "My squad will be on time for every match and check-in.",
  "All players will use the PUBG names registered in this form.",
  "I will keep my squad's WhatsApp number reachable for match updates.",
  "All the details I provided are true, and my payment slip is genuine.",
  "The organiser's decisions are final.",
] as const;

export const confirmationMessage =
  "We have received your details. Your pass will be sent to your WhatsApp number or email within 6-8 hours.";
