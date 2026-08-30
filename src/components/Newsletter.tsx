import React, { useState } from 'react';
import { Mail, FileDown, CheckCircle2, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { validateEmail, sanitizeInput } from '../lib/formValidation';

/**
 * Newsletter Component for BVM e.V.
 * Connects to the BVM Newsletter API backend (Render / Custom Domain)
 * Supports DSGVO-compliant Double-Opt-In confirmation and live PDF quarterly report download.
 */
const API_BASE =
  (import.meta.env.VITE_NEWSLETTER_API as string | undefined)?.replace(/\/$/, '') ||
  'https://bvm-newsletter-api.onrender.com';

const SUBSCRIBE_URL = `${API_BASE}/api/newsletter/subscribe`;
const DOWNLOAD_URL = `${API_BASE}/api/newsletter/download`;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = sanitizeInput(email);
    if (!validateEmail(cleanEmail)) {
      setErrorMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (!consent) {
      setErrorMessage('Bitte bestätigen Sie die Einwilligung zum Newsletter-Versand.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(SUBSCRIBE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, source: 'bvm-ev.de' }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMessage(
          data?.message ||
            'Fast fertig! Bitte bestätigen Sie die Anmeldung über den Link in unserer E-Mail.',
        );
        setStatus('success');
        setEmail('');
        setConsent(false);
      } else {
        setErrorMessage(
          data?.detail ||
            data?.message ||
            'Die Anmeldung konnte nicht verarbeitet werden. Bitte versuchen Sie es später erneut.',
        );
        setStatus('error');
      }
    } catch (err) {
      console.error('[Newsletter] Submit error:', err);
      setErrorMessage('Verbindungsfehler beim Übermitteln. Bitte prüfen Sie Ihre Verbindung.');
      setStatus('error');
    }
  };

  return (
    <section id="newsletter" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-2 px-4 bg-brand-teal/10 text-brand-teal font-bold rounded-full mb-6 tracking-wide uppercase text-sm">
            Bleiben Sie informiert
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-6">
            Newsletter &amp; Aktuelles
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Verpassen Sie keine Neuigkeiten! Abonnieren Sie unseren Newsletter — er kommt mit
            Editorial der Redaktion, allen Events und Blogbeiträgen der letzten drei Monate direkt
            in Ihr Postfach. Oder laden Sie die aktuelle Ausgabe sofort als PDF herunter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Email Newsletter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange mb-6">
              <Mail size={28} />
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">Per E-Mail abonnieren</h3>
            <p className="text-slate-600 mb-8 flex-grow">
              Jede neue Ausgabe landet automatisch in Ihrem Postfach — inklusive farbigem PDF im
              Anhang. Einmal anmelden, kurz bestätigen, fertig.
            </p>

            {status === 'success' ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3.5 text-emerald-900">
                <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Bitte bestätigen Sie Ihre Anmeldung</p>
                  <p className="text-xs text-emerald-700 mt-1">{successMessage}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ihre E-Mail-Adresse"
                    required
                    autoComplete="email"
                    disabled={status === 'submitting'}
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none"
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="bg-brand-orange hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Wird gesendet...</span>
                      </>
                    ) : (
                      'Abonnieren'
                    )}
                  </button>
                </div>

                <label className="mt-4 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 shrink-0 w-4 h-4 accent-brand-orange cursor-pointer"
                  />
                  <span>
                    Ja, ich möchte den Newsletter von BVM e.V. erhalten. Die Einwilligung kann ich
                    jederzeit über den Abmeldelink in jeder E-Mail widerrufen.
                  </span>
                </label>

                {errorMessage && (
                  <p className="text-rose-600 text-xs mt-3 flex items-center gap-1.5">
                    <AlertTriangle size={13} /> {errorMessage}
                  </p>
                )}

                <p className="mt-4 text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={13} /> Double-Opt-In · DSGVO-konform · kein Spam
                </p>
              </form>
            )}
          </motion.div>

          {/* PDF Download Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-brand-navy p-8 md:p-10 rounded-3xl shadow-xl shadow-brand-navy/20 border border-brand-navy flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />

            <div className="w-14 h-14 bg-brand-teal/20 rounded-2xl flex items-center justify-center text-brand-teal mb-6">
              <FileDown size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Quartalsbericht herunterladen</h3>
            <p className="text-slate-300 mb-8 flex-grow">
              Alle Events und Blogbeiträge der letzten drei Monate — farbenfroh gestaltet, mit
              Editorial der Redaktion und Vorschau auf die nächsten Termine. Wird bei jedem Abruf
              frisch erzeugt.
            </p>

            <div>
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                <FileDown size={18} />
                Aktuelle Ausgabe als PDF
              </a>
              <p className="text-slate-400 text-xs mt-4">
                A4 in Vollfarbe · automatisch aus events.json und blogs.json erzeugt
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}