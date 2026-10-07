// Run: node scripts/check-logic.ts   (Node 22.6+ strips types natively)
import assert from "node:assert/strict";
import { getTimeLeft } from "../src/lib/countdown.ts";
import { validateWaitlist } from "../src/lib/validation.ts";

const t = getTimeLeft(2 * 86400_000 + 3 * 3600_000 + 4 * 60_000 + 5_000, 0);
assert.deepEqual([t.days, t.hours, t.minutes, t.seconds, t.done], [2, 3, 4, 5, false]);
assert.equal(getTimeLeft(0, 5_000).done, true); // past target never goes negative

assert.equal(validateWaitlist({ gamerTag: "Nova", email: "a@b.co", format: "squad" }).ok, true);
assert.equal(validateWaitlist({ gamerTag: "x", email: "nope", format: "bad" }).ok, false);
console.log("logic checks passed");
