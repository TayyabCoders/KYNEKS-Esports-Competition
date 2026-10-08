// Run: node scripts/check-logic.ts   (Node 22.6+ strips types natively)
import assert from "node:assert/strict";
import { getTimeLeft } from "../src/lib/countdown.ts";
import { validateWaitlist } from "../src/lib/validation.ts";
import { validateContact } from "../src/lib/contact.ts";
import { detectSlipType, validateRegistration, validateSlip } from "../src/lib/registration.ts";
import { buildReceiptKey, parseReceiptKey } from "../src/lib/receipt.ts";

const t = getTimeLeft(2 * 86400_000 + 3 * 3600_000 + 4 * 60_000 + 5_000, 0);
assert.deepEqual([t.days, t.hours, t.minutes, t.seconds, t.done], [2, 3, 4, 5, false]);
assert.equal(getTimeLeft(0, 5_000).done, true); // past target never goes negative

assert.equal(validateWaitlist({ gamerTag: "Nova", email: "a@b.co", format: "squad" }).ok, true);
assert.equal(validateWaitlist({ gamerTag: "x", email: "nope", format: "bad" }).ok, false);
const player = (n: number) => ({ fullName: `Player ${n}`, age: "20", pubgName: `Tag${n}`, whatsapp: "+92 300 1234567", area: "Clifton" });
const squad = {
  igl: { fullName: "Ali Khan", whatsapp: "0300-1234567", email: "Ali@Test.co", age: "21", area: "DHA" },
  teamName: "Karachi Kings",
  players: [1, 2, 3, 4].map(player),
  agreementsAccepted: true,
  receiptKey: buildReceiptKey("123e4567-e89b-12d3-a456-426614174000", "My slip (1).png", 1_700_000_000_000),
};
const ok = validateRegistration(squad);
assert.ok(ok.ok && ok.data.registrationId === "123e4567-e89b-12d3-a456-426614174000" && ok.data.receiptFileName === "My_slip_1_.png" && ok.data.igl.email === "ali@test.co" && ok.data.igl.whatsapp === "03001234567" && ok.data.players[0]?.isIgl);
const bad = validateRegistration({ ...squad, players: squad.players.slice(0, 3), agreementsAccepted: false });
assert.ok(!bad.ok && "players.3.pubgName" in bad.errors && "agreementsAccepted" in bad.errors);
assert.equal(parseReceiptKey("receipts/../etc/passwd"), null); // keys we did not mint are rejected
assert.ok(!validateRegistration({ ...squad, receiptKey: "receipts/other/x.png" }).ok);
assert.equal(validateSlip({ type: "image/png", size: 5 * 1024 * 1024 + 1 }) !== null, true);
assert.equal(validateSlip({ type: "text/html", size: 10 }) !== null, true);
assert.equal(validateSlip({ type: "image/png", size: 10 }), null);
assert.equal(detectSlipType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0])), "image/png");
assert.equal(detectSlipType(new TextEncoder().encode("<html>")), null); // fake extension, real content wins

assert.equal(validateContact({ name: "Ali", email: "a@b.co", message: "Hello there, a question" }).ok, true);
assert.equal(validateContact({ name: "Ali", email: "a@b.co", phone: "12", message: "short" }).ok, false);
console.log("logic checks passed");

