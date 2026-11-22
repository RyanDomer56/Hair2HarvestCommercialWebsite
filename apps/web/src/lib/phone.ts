/**
 * Philippine mobile normalization shared by the partner form and the web API.
 *
 * The form shows a fixed "+63" prefix, so the shop owner types the local
 * number. Many people still type the trunk "0" out of habit (0917...), which
 * used to produce "+630917..." in the database. Strip that leading 0 once,
 * here, so the stored phone is always "+63917...".
 */
export function normalizeMobile(raw: unknown): string {
  let digits = String(raw ?? "").replace(/\D/g, "");
  // Accept a full international entry (+63…) by removing the country code.
  if (digits.startsWith("63") && digits.length > 10) digits = digits.slice(2);
  // Drop the trunk 0 (0917… -> 917…). Only one leading zero is ever valid.
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  return digits.slice(0, 10);
}

/** True when the value is a plausible PH mobile after normalization. */
export function isPhilippineMobile(raw: unknown): boolean {
  return /^9\d{9}$/.test(normalizeMobile(raw));
}
