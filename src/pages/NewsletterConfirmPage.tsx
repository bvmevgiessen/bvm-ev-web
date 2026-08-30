import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { CheckCircle2, AlertCircle, Loader2, Mail, FileDown, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'motion/react';

const API_BASE =
  (import.meta.env.VITE_NEWSLETTER_API as string | undefined)?.replace(/\/$/, '') ||
  'https://bvm-newsletter-api.onrender.com';

const DOWNLOAD_URL = `${API_BASE}/api/newsletter/download`;

export default function NewsletterConfirmPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || searchParams.get('t');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function confirmSubscription() {
      if (!token) {
        setStatus('error');
        setErrorDetails('Kein Bestätigungstoken in der URL gefunden. Bitte prüfen Sie den Link in Ihrer E-Mail.');
        return;
      }

      try {
        // Try GET confirmation on backend
        const confirmUrl = `${API_BASE}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
        const res = await fetch(confirmUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/html'
          }
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          setMessage(
            data?.message || 
            'Ihre E-Mail-Adresse wurde erfolgreich bestätigt! Vielen Dank für Ihr Interesse an der Arbeit des BVM e.V.'
          );
          setStatus('success');
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus('error');
          setErrorDetails(
            data?.detail || 
            data?.message || 
            'Der Bestätigungslink ist ungültig oder bereits abgelaufen. Bitte abonnieren Sie den Newsletter erneut.'
          );
        }
      } catch (err) {
        console.error('[NewsletterConfirm] Error:', err);
        if (!isMounted) return;
        setStatus('error');
        setErrorDetails('Verbindungsfehler zum Newsletter-Server. Bitte prüfen Sie Ihre Verbindung oder versuchen Sie es in wenigen Augenblicken erneut.');
      }
    }

    confirmSubscription();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/60 border border-slate-100 relative z-10 text-center"
      >
        {status === 'loading' && (
          <div className="py-12">
            <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal mx-auto mb-6 animate-pulse">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-3">
              Anmeldung wird bestätigt...
            </h2>
            <p className="text-slate-600 text-sm max-w-sm mx-auto">
              Einen Moment bitte, wir aktivieren Ihr Newsletter-Abonnement auf unserem Server.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
              <CheckCircle2 size={36} />
            </div>
            <span className="inline-block py-1 px-3 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-xs uppercase tracking-wider mb-3">
              Erfolgreich bestätigt
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">
              Willkommen beim BVM-Newsletter!
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              {message}
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-orange/10 rounded-xl text-brand-orange shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-bold text-brand-navy text-sm">Was passiert als Nächstes?</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Die aktuelle Ausgabe mit allen Events, Blogbeiträgen und redaktionellem Editorial wird Ihnen automatisch zugeschickt. Sie können die aktuelle Ausgabe auch sofort hier als PDF herunterladen:
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-teal hover:bg-teal-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors w-full justify-center"
                >
                  <FileDown size={15} />
                  Aktuelle Quartalsausgabe (PDF) öffnen
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                <Home size={16} />
                Zur Startseite
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6">
              <AlertCircle size={36} />
            </div>
            <span className="inline-block py-1 px-3 bg-rose-50 text-rose-700 font-semibold rounded-full text-xs uppercase tracking-wider mb-3">
              Bestätigung fehlgeschlagen
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">
              Link ungültig oder abgelaufen
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              {errorDetails}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/#newsletter"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                <Mail size={16} />
                Erneut abonnieren
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                <ArrowLeft size={16} />
                Zur Startseite
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}