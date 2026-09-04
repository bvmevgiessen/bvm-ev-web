import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Fingerprint } from 'lucide-react';
import { Github, Facebook, Instagram, Twitter } from './SocialIcons';
import { useForm, ValidationError } from '@formspree/react';
import { Link } from 'react-router';
import LegalModal from './LegalModal';
import Logo from './Logo';
import CookieFingerprintButton from './CookieFingerprintButton';
import CookieSettingsModal from './CookieSettingsModal';
import FormShield from './FormShield';
import { satzungContent, donationContent, impressumContent, privacyContent } from '../data/legalContents';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<'none' | 'impressum' | 'privacy' | 'satzung' | 'donation' | 'cookies'>('none');
  const [state, handleSubmit] = useForm('mwvwzkrr');

  return (
    <footer id="contact" className="bg-brand-navy text-white pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <Link to="/" className="flex items-center" aria-label="Zur Startseite von BVM e.V.">
            <Logo light className="scale-90 origin-left" />
          </Link>
          <p className="text-slate-400 leading-relaxed text-sm">
            Brücken bauen, Integration fördern und die Jugend stärken. Wir sind Ihr Partner für eine vielfältige Gemeinschaft in Mittelhessen.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Besuchen Sie BVM e.V. auf Facebook" 
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-teal transition-all text-white"
            >
              <Facebook size={18} />
              <span className="sr-only">Facebook</span>
            </a>
            <a 
              href="https://instagram.com/bvmev_giessen" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Besuchen Sie BVM e.V. auf Instagram" 
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-teal transition-all text-white"
            >
              <Instagram size={18} />
              <span className="sr-only">Instagram</span>
            </a>
            <a 
              href="https://x.com/bvmev_giessen" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Besuchen Sie BVM e.V. auf X (Twitter)" 
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-teal transition-all text-white"
            >
              <Twitter size={18} />
              <span className="sr-only">X (Twitter)</span>
            </a>
          </div>
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-start gap-3 text-slate-400 text-sm">
              <MapPin size={18} className="text-brand-teal shrink-0 mt-0.5" />
              <span>Siemensstr. 18, <br />35394 Gießen</span>
            </div>
            <div className="flex items-start gap-3 text-slate-400 text-sm">
              <MapPin size={18} className="text-brand-teal shrink-0 mt-0.5" />
              <span>Bahnhofstr. 22, <br />35576 Wetzlar</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <Mail size={18} className="text-brand-teal shrink-0" />
              <a href="mailto:bvmevgiessen@gmail.com" className="hover:text-white transition-colors">bvmevgiessen@gmail.com</a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 text-brand-teal">Schnellzugriff</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link to="/#home" className="hover:text-white transition-colors">Startseite</Link></li>
            <li><Link to="/#about" className="hover:text-white transition-colors">Über uns</Link></li>
            <li><Link to="/#impact" className="hover:text-white transition-colors">Unsere Impact</Link></li>
            <li><Link to="/#events" className="hover:text-white transition-colors">Veranstaltungen</Link></li>
            <li><Link to="/karriere" className="hover:text-white transition-colors">Karriere</Link></li>
            <li><Link to="/taetigkeitsbericht" className="hover:text-white transition-colors">Tätigkeitsbericht</Link></li>
            <li><Link to="/#contact" className="hover:text-white transition-colors">Kontakt</Link></li>
            <li><Link to="/admin/surveys" className="text-slate-500 hover:text-brand-teal transition-colors font-semibold">🔑 Admin-Dashboard</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-1">
          <h4 className="text-lg font-bold mb-8 text-brand-teal">Kontaktformular</h4>
          <FormShield formKey="footer_contact">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                autoComplete="name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors"
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} className="text-xs text-red-400" />
              
              <input
                type="email"
                name="email"
                placeholder="E-Mail"
                required
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-red-400" />

              <select
                name="inquiryType"
                required
                defaultValue=""
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors text-slate-400 appearance-none cursor-pointer"
              >
                <option value="" disabled>Anfragetyp auswählen</option>
                <option value="general">Allgemeine Frage</option>
                <option value="membership">Mitgliedschaft</option>
                <option value="support">Unterstützung</option>
                <option value="event">Veranstaltungsanfrage</option>
              </select>
              <ValidationError prefix="Inquiry Type" field="inquiryType" errors={state.errors} className="text-xs text-red-400" />

              <input
                type="text"
                name="subject"
                placeholder="Betreff"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors"
              />
              <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-xs text-red-400" />

              <textarea
                name="message"
                placeholder="Ihre Nachricht"
                required
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors resize-none"
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-red-400" />

              <button
                type="submit"
                disabled={state.submitting}
                aria-label="Nachricht jetzt senden"
                className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {state.submitting ? 'Wird gesendet...' : (
                  <>Nachricht senden <Send size={16} /></>
                )}
              </button>
              
              {state.succeeded && (
                <p className="text-xs text-green-400 flex items-center gap-1 mt-2">
                  <CheckCircle2 size={14} /> Nachricht erfolgreich gesendet!
                </p>
              )}
              {state.errors && !state.succeeded && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
                  <AlertCircle size={14} /> Fehler beim Senden. Bitte versuchen Sie es erneut.
                </p>
              )}
            </form>
          </FormShield>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 text-brand-teal">Rechtliches</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li>
              <Link to="/impressum" className="hover:text-white transition-colors text-left inline-block">
                Impressum
              </Link>
            </li>
            <li>
              <Link to="/datenschutz" className="hover:text-white transition-colors text-left inline-block">
                Datenschutzerklärung
              </Link>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => setActiveModal('cookies')} 
                aria-haspopup="dialog"
                className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium"
              >
                <Fingerprint size={14} className="text-brand-teal" /> Cookie-Einstellungen
              </button>
            </li>
            <li>
              <Link to="/satzung" className="hover:text-white transition-colors text-left inline-block">
                Satzung
              </Link>
            </li>
            <li>
              <Link to="/spendenbescheinigung" className="hover:text-white transition-colors text-left inline-block">
                Spendenbescheinigung
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-0 border-t border-white/5 pt-8 text-center text-slate-500 text-xs">
        <p>© {currentYear} Bildung und Verständigung Mittelhessen e.V. Alle Rechte vorbehalten.</p>
        <p className="mt-2">Made with ❤️ for the community.</p>
      </div>

      <LegalModal 
        isOpen={activeModal === 'impressum'} 
        onClose={() => setActiveModal('none')} 
        title="Impressum" 
        content={impressumContent} 
      />
      <LegalModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal('none')} 
        title="Datenschutzerklärung" 
        content={privacyContent} 
      />
      <LegalModal 
        isOpen={activeModal === 'satzung'} 
        onClose={() => setActiveModal('none')} 
        title="Satzung" 
        content={satzungContent} 
      />
      <LegalModal 
        isOpen={activeModal === 'donation'} 
        onClose={() => setActiveModal('none')} 
        title="Spendenbescheinigung" 
        content={donationContent} 
      />

      <CookieSettingsModal
        isOpen={activeModal === 'cookies'}
        onClose={() => setActiveModal('none')}
        onOpenPrivacyPolicy={() => setActiveModal('privacy')}
        onOpenImpressum={() => setActiveModal('impressum')}
      />

      {/* Floating Fingerprint Button on Bottom Left */}
      <CookieFingerprintButton
        onOpenPrivacyPolicy={() => setActiveModal('privacy')}
        onOpenImpressum={() => setActiveModal('impressum')}
      />
    </footer>
  );
}