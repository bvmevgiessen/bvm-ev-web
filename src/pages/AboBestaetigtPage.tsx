import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  FileDown,
  ArrowLeft,
  Home,
  Check,
  Calendar,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

const API_BASE =
  (import.meta.env.VITE_NEWSLETTER_API as string | undefined)?.replace(/\/$/, '') ||
  'https://bvm-newsletter-api.onrender.com';

const DOWNLOAD_URL = `${API_BASE}/api/newsletter/download`;
const FALLBACK_STATIC_PDF = '/assets/pdf/newsletter-latest.pdf';

export default function AboBestaetigtPage() {
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');
  const emailParam = searchParams.get('email');
  const tokenParam = searchParams.get('token') || searchParams.get('t');

  const [state, setState] = useState<'loading' | 'sent' | 'confirmed' | 'already' | 'unsubscribed' | 'invalid'>('loading');
  const [email, setEmail] = useState<string>(emailParam || '');
  const [customMessage, setCustomMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    // 1. If backend redirected with an explicit status in URL
    if (urlStatus) {
      if (urlStatus === 'sent' || urlStatus === 'confirmed' || urlStatus === 'already' || urlStatus === 'unsubscribed' || urlStatus === 'invalid') {
        setState(urlStatus);
      } else {
        setState('confirmed');
      }
      if (emailParam) setEmail(emailParam);
      return;
    }

    // 2. If token was supplied directly (client-side confirmation flow)
    if (tokenParam) {
      setState('loading');
      fetch(`${API_BASE}/api/newsletter/confirm?token=${encodeURIComponent(tokenParam)}&redirect=false`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      })
        .then(async (res) => {
          if (!isMounted) return;
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            if (data.email) setEmail(data.email);
            if (data.issue_sent) {
              setState('sent');
            } else if (data.status === 'already_confirmed') {
              setState('already');
            } else {
              setState('confirmed');
            }
            if (data.message) setCustomMessage(data.message);
          } else {
            setState('invalid');
            if (data.detail || data.message) {
              setCustomMessage(data.detail || data.message);
            }
          }
        })
        .catch((err) => {
          console.error('[AboBestaetigt] Error confirming token:', err);
          if (!isMounted) return;
          setState('invalid');
          setCustomMessage('Verbindungsfehler beim Bestätigen. Bitte versuchen Sie es erneut.');
        });
      return;
    }

    // 3. Fallback if no params at all
    setState('confirmed');

    return () => {
      isMounted = false;
    };
  }, [urlStatus, emailParam, tokenParam]);

  const handleDownloadClick = async () => {
    try {
      const response = await fetch(DOWNLOAD_URL, { method: 'GET' });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bvm-newsletter-aktuell.pdf';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 200);
        return;
      }
    } catch {
      // ignore, fall through to fallback
    }
    // Fallback
    window.open(FALLBACK_STATIC_PDF, '_blank');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-20 px-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/60 border border-slate-100 relative z-10 text-center"
      >
        {state === 'loading' && (
          <div className="py-12">
            <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal mx-auto mb-6">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-3">
              Anmeldung wird geprüft...
            </h2>
            <p className="text-slate-600 text-sm max-w-sm mx-auto">
              Einen Moment bitte, wir verarbeiten Ihre Newsletter-Bestätigung.
            </p>
          </div>
        )}

        {(state === 'sent' || state === 'confirmed' || state === 'already') && (
          <div>
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <span className="inline-block py-1 px-3.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-xs uppercase tracking-wider mb-3">
              {state === 'already' ? 'Bereits angemeldet' : 'Anmeldung erfolgreich bestätigt'}
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
              {state === 'already' ? 'Schön, dass du weiterhin dabei bist!' : 'Herzlich willkommen beim BVM-Newsletter!'}
            </h2>

            {email && (
              <p className="text-sm font-medium text-brand-teal bg-brand-teal/5 py-1 px-3 rounded-full inline-block mb-4">
                {email}
              </p>
            )}

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {customMessage ||
                (state === 'sent'
                  ? 'Deine E-Mail-Adresse ist erfolgreich bestätigt. Die aktuelle Ausgabe des BVM-Newsletters ist bereits auf dem Weg in dein Postfach!'
                  : state === 'already'
                  ? 'Deine E-Mail-Adresse ist bereits in unserem Verteiler registriert. Du verpasst keine Ausgabe.'
                  : 'Vielen Dank für deine Bestätigung! Ab sofort erhältst du vierteljährlich alle Neuigkeiten, Termine und Berichte direkt per E-Mail.')}
            </p>

            {/* Newsletter PDF Info Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-brand-teal/10 rounded-xl text-brand-teal shrink-0 mt-0.5">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy text-sm">
                    Möchtest du die aktuelle Ausgabe direkt lesen?
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Alle Events, Blogbeiträge und das Editorial der letzten drei Monate stehen dir sofort als A4-PDF zur Verfügung.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 px-5 rounded-xl text-sm transition-all shadow-md shadow-brand-teal/15 cursor-pointer"
                >
                  <FileDown size={17} />
                  Aktuelle Quartalsausgabe herunterladen (PDF)
                </button>
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                <Home size={16} />
                Zur Startseite
              </Link>
              <Link
                to="/#events"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                <Calendar size={16} />
                Kommende Veranstaltungen
              </Link>
            </div>
          </div>
        )}

        {state === 'unsubscribed' && (
          <div>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mx-auto mb-6">
              <Check size={36} />
            </div>

            <span className="inline-block py-1 px-3.5 bg-slate-100 text-slate-700 font-semibold rounded-full text-xs uppercase tracking-wider mb-3">
              Abmeldung bestätigt
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
              Du wurdest erfolgreich abgemeldet
            </h2>

            {email && (
              <p className="text-sm font-medium text-slate-500 mb-4">
                {email}
              </p>
            )}

            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              Schade, dass du gehst! Deine E-Mail-Adresse wurde aus unserem Newsletter-Verteiler ausgetragen und du wirst keine weiteren Ausgaben erhalten. Du kannst dich jederzeit auf unserer Website wieder anmelden.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                <Home size={16} />
                Zur Startseite
              </Link>
              <Link
                to="/#newsletter"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                <Mail size={16} />
                Erneut anmelden
              </Link>
            </div>
          </div>
        )}

        {state === 'invalid' && (
          <div>
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6">
              <AlertCircle size={36} />
            </div>

            <span className="inline-block py-1 px-3.5 bg-rose-50 text-rose-700 font-semibold rounded-full text-xs uppercase tracking-wider mb-3">
              Link ungültig oder abgelaufen
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
              Bestätigung nicht möglich
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              {customMessage ||
                'Dieser Bestätigungs- oder Abmeldelink ist ungültig, wurde bereits genutzt oder ist abgelaufen. Bitte trage deine E-Mail-Adresse auf unserer Website einfach erneut ein.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/#newsletter"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors shadow-md shadow-brand-orange/20"
              >
                <Mail size={16} />
                Neu anmelden
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                <Home size={16} />
                Zur Startseite
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}