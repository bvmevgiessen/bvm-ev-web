import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Fingerprint, ShieldCheck, Check, Info, Lock } from 'lucide-react';
import { safeStorage } from '../lib/SafeStorage';

export interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
}

const COOKIE_STORAGE_KEY = 'bvm_cookie_consent_v1';

export function getSavedCookiePreferences(): CookiePreferences {
  try {
    const raw = safeStorage.getItem(COOKIE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        essential: true, // Always true
        functional: parsed.functional ?? true,
        analytics: parsed.analytics ?? false
      };
    }
  } catch (e) {
    console.warn("Fehler beim Lesen der Cookie-Einstellungen:", e);
  }
  return { essential: true, functional: true, analytics: false };
}

export function saveCookiePreferences(prefs: CookiePreferences): void {
  try {
    const dataToSave = {
      essential: true,
      functional: prefs.functional,
      analytics: prefs.analytics,
      timestamp: new Date().toISOString()
    };
    safeStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.warn("Fehler beim Speichern der Cookie-Einstellungen:", e);
  }
}

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export default function CookieSettingsModal({ isOpen, onClose, onOpenPrivacyPolicy }: CookieSettingsModalProps) {
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: false
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPrefs(getSavedCookiePreferences());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const handleSave = (newPrefs: CookiePreferences) => {
    saveCookiePreferences(newPrefs);
    setPrefs(newPrefs);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleAcceptAll = () => {
    const allOn = { essential: true, functional: true, analytics: true };
    handleSave(allOn);
  };

  const handleAcceptEssentialOnly = () => {
    const essentialOnly = { essential: true, functional: false, analytics: false };
    handleSave(essentialOnly);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 my-auto"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy">Cookie-Einstellungen</h2>
                  <p className="text-xs text-slate-500">Datenschutz & Einstellungen nach DSGVO (BVM e.V.)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer"
                aria-label="Schließen"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content Body */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-6 text-slate-600 text-sm">
              <p className="leading-relaxed text-slate-600">
                Wir nutzen Cookies und Web-Technologien auf unserer Website von <strong>Bildung und Verständigung Mittelhessen e.V.</strong>, um Funktionen bereitzustellen und ein optimales Nutzererlebnis zu ermöglichen.
              </p>

              {savedSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-semibold text-xs sm:text-sm"
                >
                  <Check className="text-emerald-600" size={20} />
                  Ihre Cookie-Einstellungen wurden erfolgreich gespeichert!
                </motion.div>
              )}

              {/* Cookie Categories */}
              <div className="space-y-4">

                {/* Category 1: Essential */}
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-extrabold text-brand-navy text-base">
                      <Lock size={18} className="text-brand-teal" />
                      <span>Notwendige Cookies</span>
                    </div>
                    <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                      Immer aktiv
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Diese Cookies sind für das Grundfunktionieren der Website (z. B. Navigation, Sicherheit, Speicherung Ihrer Einwilligung und Server-Routing bei Google Cloud / Firebase) zwingend erforderlich und können nicht deaktiviert werden.
                  </p>
                </div>

                {/* Category 2: Functional */}
                <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl space-y-2 hover:border-brand-teal/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-extrabold text-brand-navy text-base">
                      <ShieldCheck size={18} className="text-brand-teal" />
                      <span>Funktionale Dienste & Formulare</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs.functional}
                        onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ermöglicht die Nutzung von eingebetteten Formularen für <strong>Mitgliedsanträge (Jotform)</strong> sowie <strong>Spenden- und Kontaktanfragen (Formspree)</strong>. Wenn deaktiviert, stehen Ihnen diese Formulare unter Umständen nicht direkt zur Verfügung.
                  </p>
                </div>

                {/* Category 3: Analytics */}
                <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl space-y-2 hover:border-brand-teal/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-extrabold text-brand-navy text-base">
                      <Info size={18} className="text-brand-teal" />
                      <span>Statistik & Optimierung</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs.analytics}
                        onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hilft uns zu verstehen, wie Besucher mit der Website von BVM e.V. interagieren, um Inhalte und Usability kontinuierlich zu verbessern.
                  </p>
                </div>

              </div>

              {onOpenPrivacyPolicy && (
                <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
                  <span>Ausführliche Informationen finden Sie in unserer</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPrivacyPolicy();
                    }}
                    className="text-brand-teal font-bold hover:underline cursor-pointer"
                  >
                    Datenschutzerklärung →
                  </button>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleAcceptEssentialOnly}
                className="w-full sm:w-auto text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer text-center"
              >
                Nur notwendige
              </button>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(prefs)}
                  className="w-full sm:w-auto text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 px-4 py-2.5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Auswahl speichern
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto text-xs font-extrabold text-white bg-brand-teal hover:bg-brand-teal/90 shadow-md shadow-brand-teal/20 px-5 py-2.5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
