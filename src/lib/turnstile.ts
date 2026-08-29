/**
 * Cloudflare Turnstile Configuration and Helpers
 * Production Site Key for bvm-ev.de & localhost: 0x4AAAAAAEhQXIY9Ev4n0b6i
 * Cloudflare Test Site Key for preview/dev URLs: 1x00000000000000000000AA (Always passes)
 */

export const PROD_TURNSTILE_SITE_KEY = '0x4AAAAAAEhQXIY9Ev4n0b6i';
export const TEST_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

export function getTurnstileSiteKey(): string {
  try {
    const envKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_TURNSTILE_SITE_KEY : undefined;
    if (envKey) return envKey;

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('bvm-ev.de')) {
        return PROD_TURNSTILE_SITE_KEY;
      }
      // Return the Cloudflare testing pass key on non-whitelisted preview/dev/run.app domains
      return TEST_TURNSTILE_SITE_KEY;
    }
  } catch {
    // Fallback
  }
  return PROD_TURNSTILE_SITE_KEY;
}

export const TURNSTILE_SITE_KEY = getTurnstileSiteKey();

export interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}