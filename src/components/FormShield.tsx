import React, { useState, useEffect, useRef } from 'react';
import TurnstileWidget from './TurnstileWidget';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { getTurnstileSiteKey } from '../lib/turnstile';
import {
  checkClientRateLimit,
  recordClientSubmission,
  logFormAbuse,
  containsSuspiciousContent,
  containsUrl
} from '../lib/formValidation';

export interface FormShieldProps {
  formKey: string;
  children: React.ReactNode | ((props: FormShieldRenderProps) => React.ReactNode);
  className?: string;
  minTimeSeconds?: number;
  maxSubmissions?: number;
  windowMinutes?: number;
  showBadge?: boolean;
  onValidationFailed?: (reason: string) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>, turnstileToken: string) => boolean | Promise<boolean | void> | void;
}

export interface FormShieldRenderProps {
  turnstileToken: string;
  isReady: boolean;
  rateLimitExceeded: boolean;
  remainingSeconds: number;
  honeypotRef: React.RefObject<HTMLInputElement | null>;
}

export default function FormShield({
  formKey,
  children,
  className = '',
  minTimeSeconds = 3,
  maxSubmissions = 3,
  windowMinutes = 10,
  showBadge = true,
  onValidationFailed,
  onSubmit
}: FormShieldProps) {
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const mountTimeRef = useRef<number>(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const siteKey = getTurnstileSiteKey();

  // Check rate limit on mount and periodic tick if locked
  useEffect(() => {
    mountTimeRef.current = Date.now();
    const status = checkClientRateLimit(formKey, maxSubmissions, windowMinutes);
    if (!status.allowed) {
      setRateLimitExceeded(true);
      setRemainingSeconds(status.remainingSec);
    }
  }, [formKey, maxSubmissions, windowMinutes]);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (!rateLimitExceeded || remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setRateLimitExceeded(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitExceeded, remainingSeconds]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage(null);

    // 1. Honeypot check: If the hidden input is filled, it's a bot!
    const honeypotVal = honeypotRef.current?.value || '';
    if (honeypotVal.trim() !== '') {
      e.preventDefault();
      e.stopPropagation();
      console.warn('[FormShield] Honeypot triggered.');
      await logFormAbuse(formKey, 'honeypot_triggered', { honeypot: honeypotVal });
      // Silently pretend success or stop execution
      return;
    }

    // 2. Time-trap check: Submitted too fast (< minTimeSeconds)
    const elapsedSeconds = (Date.now() - mountTimeRef.current) / 1000;
    if (elapsedSeconds < minTimeSeconds) {
      e.preventDefault();
      e.stopPropagation();
      const reason = 'Formular wurde zu schnell ausgefüllt (Spam-Schutz).';
      console.warn('[FormShield] Time-trap triggered. Elapsed:', elapsedSeconds);
      await logFormAbuse(formKey, 'time_trap_triggered', { elapsedSeconds });
      setErrorMessage('Bitte nehmen Sie sich einen Moment Zeit beim Ausfüllen des Formulars.');
      onValidationFailed?.(reason);
      return;
    }

    // 3. Client Rate Limit check
    const rateLimit = checkClientRateLimit(formKey, maxSubmissions, windowMinutes);
    if (!rateLimit.allowed) {
      e.preventDefault();
      e.stopPropagation();
      setRateLimitExceeded(true);
      setRemainingSeconds(rateLimit.remainingSec);
      setErrorMessage(`Zu viele Anfragen. Bitte warten Sie ${Math.ceil(rateLimit.remainingSec / 60)} Minuten.`);
      onValidationFailed?.('rate_limit_exceeded');
      return;
    }

    // 4. Form payload inspection for suspicious scripts / attack patterns
    if (e.target && e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);
      let hasSuspiciousData = false;
      let suspiciousField = '';

      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          if (containsSuspiciousContent(value)) {
            hasSuspiciousData = true;
            suspiciousField = key;
            break;
          }
          // If field name is 'name' or 'vorname' or 'nachname', check for URLs
          if (/name/i.test(key) && containsUrl(value)) {
            hasSuspiciousData = true;
            suspiciousField = `${key} contains URL`;
            break;
          }
        }
      }

      if (hasSuspiciousData) {
        e.preventDefault();
        e.stopPropagation();
        await logFormAbuse(formKey, 'suspicious_payload', { field: suspiciousField });
        setErrorMessage('Ungültige Eingabe oder unzulässige Sonderzeichen/Links festgestellt.');
        onValidationFailed?.('suspicious_payload');
        return;
      }
    }

    // 5. If custom onSubmit is provided, execute it
    if (onSubmit) {
      const result = await onSubmit(e, turnstileToken);
      if (result !== false) {
        recordClientSubmission(formKey, windowMinutes);
      }
    } else {
      recordClientSubmission(formKey, windowMinutes);
    }
  };

  const renderProps: FormShieldRenderProps = {
    turnstileToken,
    isReady: true,
    rateLimitExceeded,
    remainingSeconds,
    honeypotRef
  };

  return (
    <div
      className={`form-shield-container relative ${className}`}
      onSubmitCapture={handleFormSubmit}
    >
      {/* Rate limit warning banner */}
      {rateLimitExceeded && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Anfragelimit erreicht</p>
            <p className="text-amber-800 mt-0.5">
              Aus Sicherheitsgründen sind maximal {maxSubmissions} Übermittlungen alle {windowMinutes} Minuten erlaubt.
              Bitte warten Sie noch {remainingSeconds} Sekunden.
            </p>
          </div>
        </div>
      )}

      {/* Validation error message */}
      {errorMessage && (
        <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Form or children */}
      {typeof children === 'function' ? children(renderProps) : children}

      {/* Hidden Honeypot Input (Off-screen, invisible to users, attractive to spam bots) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          top: 0,
          left: '-9999px',
          height: 0,
          width: 0,
          zIndex: -1,
          overflow: 'hidden'
        }}
      >
        <label htmlFor={`bvm_hp_${formKey}`}>Website (Do not fill)</label>
        <input
          ref={honeypotRef}
          id={`bvm_hp_${formKey}`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
        <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />
      </div>

      {/* Cloudflare Turnstile Invisible Widget */}
      {siteKey && !turnstileError && (
        <div className="turnstile-wrapper my-2 flex justify-center">
          <TurnstileWidget
            id={`turnstile-widget-${formKey}`}
            siteKey={siteKey}
            size="invisible"
            theme="auto"
            action={formKey}
            onSuccess={(token) => {
              setTurnstileToken(token);
            }}
            onExpire={() => {
              setTurnstileToken('');
            }}
            onError={() => {
              console.info(`[Turnstile] Notice: Widget for ${formKey} running with standard verification.`);
              setTurnstileError(true);
            }}
          />
        </div>
      )}

      {/* Security Info Badge */}
      {showBadge && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-brand-teal" />
          <span>Geschützt durch Cloudflare Turnstile & Spam-Schutz</span>
        </div>
      )}
    </div>
  );
}