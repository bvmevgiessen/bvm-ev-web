import React, { useState } from 'react';
import { Github, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import LegalModal from './LegalModal';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeModal, setActiveModal] = useState<'none' | 'impressum' | 'privacy' | 'satzung' | 'donation'>('none');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Using Formspree for a functional static contact form
      const response = await fetch('https://formspree.io/f/bvmevgiessen@gmail.com', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const satzungContent = (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">§ 1 Name, Sitz und Geschäftsjahr</h3>
        <p>Der Verein führt den Namen „Bildung und Verständigung Mittelhessen e.V.“ (BVM e.V.). Der Verein hat seinen Sitz in Gießen. Das Geschäftsjahr ist das Kalenderjahr.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">§ 2 Gemeinnützigkeit</h3>
        <p>Der Verein verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke im Sinne des Abschnitts „Steuerbegünstigte Zwecke“ der Abgabenordnung. Er ist selbstlos tätig und verfolgt nicht in erster Linie eigenwirtschaftliche Zwecke.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">§ 3 Zweck und Ziele des Vereins</h3>
        <p>Ziele des Vereins sind:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Die Förderung der Erziehungs- und Bildungshilfe.</li>
          <li>Die Förderung der Jugendhilfe.</li>
          <li>Die Förderung internationaler Gesinnung, der Toleranz auf allen Gebieten der Kultur und des Völkerverständigungsgedankens.</li>
        </ul>
        <p className="mt-2">Der Satzungszweck wird insbesondere verwirklicht durch schulische Bildung (Nachhilfe, Sprachkurse), Organisation von AGs, Lesesitzungen und Ferienangeboten.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">§ 4 Mitgliedschaft</h3>
        <p>Mitglied können natürliche und juristische Personen werden, die die gemeinnützigen Zwecke des Vereins fördern wollen. Es gibt ordentliche Mitglieder und Fördermitglieder.</p>
      </section>
    </div>
  );

  const donationContent = (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">Bestätigung über Geldzuwendungen</h3>
        <p>Der BVM e.V. ist wegen Förderung gemeinnütziger Zwecke (Förderung des Volkes und Berufsbildung, Jugend- und Altenhilfe sowie internationaler Gesinnung und Völkerverständigung) nach dem Freistellungsbescheid des <strong>Finanzamtes Gießen (St.Nr. 2025069893) vom 11.05.2018</strong> von der Körperschaftsteuer und Gewerbesteuer befreit.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">Spendenbescheinigung erhalten</h3>
        <p>Wir bestätigen, dass Zuwendungen nur zur Förderung der oben genannten begünstigten Zwecke verwendet werden. Es handelt sich nicht um einen Mitgliedsbeitrag, dessen Abzug nach § 10b Abs. 1 EStG ausgeschlossen ist.</p>
        <p className="mt-2">Für Spenden bis 300 € reicht dem Finanzamt oft der vereinfachte Nachweis (Kontoauszug). Für höhere Beträge stellen wir Ihnen gerne eine formelle Bescheinigung aus.</p>
      </section>
      <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
        <h4 className="font-bold text-brand-navy italic">Vereinsdaten für Überweisungen:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-500">Bank:</p>
            <p className="font-medium">Sparkasse Gießen</p>
          </div>
          <div>
            <p className="text-slate-500">IBAN:</p>
            <p className="font-medium">DE67 5135 0025 0205 0833 07</p>
          </div>
          <div>
            <p className="text-slate-500">BIC:</p>
            <p className="font-medium">SKGIDE5FXXX</p>
          </div>
          <div>
            <p className="text-slate-500">Registernummer:</p>
            <p className="font-medium">VR-4953 (AG Gießen)</p>
          </div>
        </div>
      </section>
      <p className="text-xs text-slate-400 italic">Hinweis: Bitte geben Sie bei Ihrer Überweisung Ihren Namen und Ihre Anschrift im Verwendungszweck an, damit wir Ihnen die Bescheinigung zusenden können.</p>
    </div>
  );

  const impressumContent = (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">Angaben gemäß § 5 TMG</h3>
        <p>Bildung und Verständigung Mittelhessen e.V.<br />Siemensstr. 18<br />35394 Gießen</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">Vertreten durch</h3>
        <p>Der Vorstand (Vorsitzende: [Name des Vorsitzenden])</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">Kontakt</h3>
        <p>Telefon: +49 (0) 641 1234567<br />E-Mail: bvmevgiessen@gmail.com</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">Registereintrag</h3>
        <p>Eintragung im Vereinsregister.<br />Registergericht: Amtsgericht Gießen<br />Registernummer: VR [Nummer]</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
        <p>[Name des Verantwortlichen]<br />Siemensstr. 18<br />35394 Gießen</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">Streitschlichtung</h3>
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">https://ec.europa.eu/consumers/odr</a>. Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        <p className="mt-2">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </section>
    </div>
  );

  const privacyContent = (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">1. Datenschutz auf einen Blick</h3>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">2. Datenerfassung auf unserer Website</h3>
        <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
        <p className="mt-2">Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-brand-navy mb-2">3. Kontaktformular</h3>
        <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
      </section>
    </div>
  );

  return (
    <footer id="contact" className="bg-brand-navy text-white pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <a href="#home" className="flex items-center">
            <Logo light className="scale-90 origin-left" />
          </a>
          <p className="text-slate-400 leading-relaxed text-sm">
            Brücken bauen, Integration fördern und die Jugend stärken. Wir sind Ihr Partner für eine vielfältige Gemeinschaft in Mittelhessen.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-teal transition-all">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com/bvmev_giessen" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-teal transition-all">
              <Instagram size={18} />
            </a>
            <a href="https://x.com/bvmev_giessen" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-teal transition-all">
              <Twitter size={18} />
            </a>
          </div>
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-start gap-3 text-slate-400 text-sm">
              <MapPin size={18} className="text-brand-teal shrink-0 mt-0.5" />
              <span>Siemensstr. 18, <br />35394 Gießen</span>
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
            <li><a href="#home" className="hover:text-white transition-colors">Startseite</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">Über uns</a></li>
            <li><a href="#impact" className="hover:text-white transition-colors">Unsere Impact</a></li>
            <li><a href="#events" className="hover:text-white transition-colors">Veranstaltungen</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Kontakt</a></li>
          </ul>
        </div>

        <div className="lg:col-span-1">
          <h4 className="text-lg font-bold mb-8 text-brand-teal">Kontaktformular</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors"
            />
            <input
              type="email"
              name="email"
              placeholder="E-Mail"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors"
            />
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
            <input
              type="text"
              name="subject"
              placeholder="Betreff"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors"
            />
            <textarea
              name="message"
              placeholder="Ihre Nachricht"
              required
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'loading' ? 'Wird gesendet...' : (
                <>Nachricht senden <Send size={16} /></>
              )}
            </button>
            
            {status === 'success' && (
              <p className="text-xs text-green-400 flex items-center gap-1 mt-2">
                <CheckCircle2 size={14} /> Nachricht erfolgreich gesendet!
              </p>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
                <AlertCircle size={14} /> Fehler beim Senden. Bitte versuchen Sie es erneut.
              </p>
            )}
          </form>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 text-brand-teal">Rechtliches</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><button onClick={() => setActiveModal('impressum')} className="hover:text-white transition-colors text-left">Impressum</button></li>
            <li><button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors text-left">Datenschutzerklärung</button></li>
            <li><button onClick={() => setActiveModal('satzung')} className="hover:text-white transition-colors text-left">Satzung</button></li>
            <li><button onClick={() => setActiveModal('donation')} className="hover:text-white transition-colors text-left">Spendenbescheinigung</button></li>
          </ul>
          
          <div className="mt-10 pt-10 border-t border-white/10">
            <a 
              href="https://github.com/bvmevgiessen/website-bvm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <Github size={20} />
              <span>GitHub Repository</span>
            </a>
          </div>
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
    </footer>
  );
}


