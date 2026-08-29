import DOMPurify from 'dompurify';
import { safeStorage } from './SafeStorage';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Standard Email Regex Validation (RFC 5322 simplified)
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

/**
 * Sanitize plain text string using DOMPurify (stripping all HTML tags)
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  // Strip all HTML tags
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  return sanitized.trim();
}

/**
 * Validate maximum string length
 */
export function validateLength(text: string, max: number): boolean {
  if (!text) return true;
  return text.trim().length <= max;
}

/**
 * Checks if a string contains URLs (useful for name fields where URLs indicate spam)
 */
export function containsUrl(text: string): boolean {
  if (!text) return false;
  const urlPattern = /(https?:\/\/|www\.|\.[\w-]+\/(?:[^\s]*)|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|ru|top|biz|info|cc|online|site|fun|vip|click))\b/i;
  return urlPattern.test(text);
}

/**
 * Detect suspicious / attack payload patterns (<script, javascript:, excessive URLs)
 */
export function containsSuspiciousContent(text: string): boolean {
  if (!text) return false;
  const suspicious = /<script|<iframe|javascript:|onerror\s*=|onload\s*=/i;
  if (suspicious.test(text)) return true;

  // Check URL count (flag if more than 5 URLs in single field)
  const matches = text.match(/(https?:\/\/|www\.)/gi);
  if (matches && matches.length > 5) return true;

  return false;
}

/**
 * Per-form + per-browser rate limit helper using localStorage
 * Default: Cap 3 submissions per 10 minutes per form
 */
export function checkClientRateLimit(
  formKey: string,
  maxSubmissions = 3,
  windowMinutes = 10
): { allowed: boolean; remainingSec: number } {
  try {
    const storageKey = `bvm_form_submits_${formKey}`;
    const raw = safeStorage.getItem(storageKey);
    const windowMs = windowMinutes * 60 * 1000;
    const now = Date.now();

    let timestamps: number[] = [];
    if (raw) {
      timestamps = JSON.parse(raw);
    }

    // Keep only timestamps within the active sliding window
    timestamps = timestamps.filter((ts) => typeof ts === 'number' && now - ts < windowMs);

    if (timestamps.length >= maxSubmissions) {
      const oldest = Math.min(...timestamps);
      const remainingSec = Math.ceil((oldest + windowMs - now) / 1000);
      return { allowed: false, remainingSec: Math.max(1, remainingSec) };
    }

    return { allowed: true, remainingSec: 0 };
  } catch (err) {
    console.warn('[FormValidation] Error checking rate limit:', err);
    return { allowed: true, remainingSec: 0 };
  }
}

/**
 * Record a successful form submission for local client rate-limiting
 */
export function recordClientSubmission(formKey: string, windowMinutes = 10): void {
  try {
    const storageKey = `bvm_form_submits_${formKey}`;
    const raw = safeStorage.getItem(storageKey);
    const windowMs = windowMinutes * 60 * 1000;
    const now = Date.now();

    let timestamps: number[] = [];
    if (raw) {
      timestamps = JSON.parse(raw);
    }
    timestamps = timestamps.filter((ts) => typeof ts === 'number' && now - ts < windowMs);
    timestamps.push(now);

    safeStorage.setItem(storageKey, JSON.stringify(timestamps));
  } catch (err) {
    console.warn('[FormValidation] Error recording submission:', err);
  }
}

/**
 * Log potential abuse attempt to Firestore collection 'form_abuse_log'
 */
export async function logFormAbuse(
  formKey: string,
  reason: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const userAgent = (typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown').slice(0, 500);
    const payloadSnippet = details ? JSON.stringify(details).slice(0, 500) : '';

    await addDoc(collection(db, 'form_abuse_log'), {
      formKey: formKey.slice(0, 50),
      reason: reason.slice(0, 100),
      payloadSnippet,
      userAgent,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.info('[FormShield] Abuse log recorded locally (Firestore fallback):', err);
  }
}