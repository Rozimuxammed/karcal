import type { RodEntry, RodResult, Pricing } from "@/types";

/** Number of mounting brackets for a rod of the given length.
 *  Rule: 2 for up to 2 m, then +1 per additional 1.5 m.
 */
export function calcBrackets(length: number): number {
  if (length <= 0) return 0;
  if (length <= 2) return 2;
  return 2 + Math.ceil((length - 2) / 1.5);
}

/** End caps are always 2 per rod (one on each end). */
export function calcEars(_length: number): number {
  return 2;
}

export function calcRodResult(rod: RodEntry, pricing: Pricing): RodResult {
  const ears = calcEars(rod.length);
  const brackets = calcBrackets(rod.length);
  const rodCost = rod.length * pricing.rodPerMeter;
  const earsCost = ears * pricing.earPrice;
  const bracketsCost = brackets * pricing.bracketPrice;
  return {
    id: rod.id,
    length: rod.length,
    ears,
    brackets,
    rodCost,
    earsCost,
    bracketsCost,
    total: rodCost + earsCost + bracketsCost,
  };
}

export function calcSummary(results: RodResult[], pricing: Pricing) {
  const totalEars = results.reduce((s, r) => s + r.ears, 0);
  const totalBrackets = results.reduce((s, r) => s + r.brackets, 0);
  const totalLength = results.reduce((s, r) => s + r.length, 0);
  const totalRodCost = results.reduce((s, r) => s + r.rodCost, 0);
  const totalEarsCost = totalEars * pricing.earPrice;
  const totalBracketsCost = totalBrackets * pricing.bracketPrice;
  const grandTotal = totalRodCost + totalEarsCost + totalBracketsCost;
  return { totalEars, totalBrackets, totalLength, totalRodCost, totalEarsCost, totalBracketsCost, grandTotal };
}
