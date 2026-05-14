// Lightweight client-side IBAN / BIC validation.
//
// Reference: ISO 13616 – mod-97 checksum.
// We intentionally avoid huge IBAN-data libraries; this is enough for a
// membership form and runs in <1ms.

const IBAN_LENGTH_BY_COUNTRY: Record<string, number> = {
  AD: 24, AT: 20, BE: 16, CH: 21, CY: 28, CZ: 24, DE: 22, DK: 18,
  EE: 20, ES: 24, FI: 18, FR: 27, GB: 22, GR: 27, HR: 21, HU: 28,
  IE: 22, IS: 26, IT: 27, LI: 21, LT: 20, LU: 20, LV: 21, MT: 31,
  NL: 18, NO: 15, PL: 28, PT: 25, RO: 24, SE: 24, SI: 19, SK: 24,
};

export function normalizeIban(raw: string): string {
  return (raw || '').replace(/\s+/g, '').toUpperCase();
}

export function formatIban(raw: string): string {
  const v = normalizeIban(raw);
  return v.replace(/(.{4})/g, '$1 ').trim();
}

export function isValidIban(raw: string): boolean {
  const iban = normalizeIban(raw);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return false;

  const expected = IBAN_LENGTH_BY_COUNTRY[iban.slice(0, 2)];
  if (expected && iban.length !== expected) return false;

  // Move first 4 chars to the end, then convert letters to digits.
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));

  // mod-97 in chunks (numeric can be > Number.MAX_SAFE_INTEGER).
  let remainder = 0;
  for (let i = 0; i < numeric.length; i += 7) {
    remainder = Number(String(remainder) + numeric.slice(i, i + 7)) % 97;
  }
  return remainder === 1;
}

export function isValidBic(raw: string): boolean {
  const bic = (raw || '').replace(/\s+/g, '').toUpperCase();
  // BIC is optional in SEPA since 2016 — accept empty.
  if (!bic) return true;
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic);
}
