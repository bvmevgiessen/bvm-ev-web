import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Fingerprint } from 'lucide-react';
import { Github, Facebook, Instagram, Twitter } from './SocialIcons';
import { useForm, ValidationError } from '@formspree/react';
import { Link } from 'react-router-dom';
import LegalModal from './LegalModal';
import Logo from './Logo';
import CookieFingerprintButton from './CookieFingerprintButton';
import CookieSettingsModal from './CookieSettingsModal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<'none' | 'impressum' | 'privacy' | 'satzung' | 'donation' | 'cookies'>('none');
  const [state, handleSubmit] = useForm('mwvwzkrr');

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
    <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">1. Verantwortliche Stelle & Allgemeine Hinweise</h3>
        <p>
          Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze ist:
        </p>
        <div className="mt-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
          <p className="font-bold text-brand-navy">Bildung und Verständigung Mittelhessen e.V. (BVM e.V.)</p>
          <p>Siemensstraße 18, 35394 Gießen</p>
          <p>Telefon: +49 (0) 641 1234567</p>
          <p>E-Mail: <a href="mailto:bvmevgiessen@gmail.com" className="text-brand-teal hover:underline font-semibold">bvmevgiessen@gmail.com</a></p>
          <p>Vertreten durch den Vorstand</p>
        </div>
        <p className="mt-3">
          Der BVM e.V. nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">2. Haftungsausschluss für externe Links (Haftung für Links)</h3>
        <p>
          Unser Internetangebot enthält Links zu externen Websites Dritter, auf deren Inhalte und Datenschutzstandards wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte und deren Datenverarbeitungen keine Gewähr oder Haftung übernehmen.
        </p>
        <p className="mt-2">
          Für die Inhalte und die Einhaltung der Datenschutzbestimmungen der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">3. Formularanbieter & Dienstleister im Einsatz</h3>
        
        <div className="space-y-4 mt-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">a) Jotform (Mitgliedschaftsformular)</h4>
            <p className="text-xs text-slate-600">
              Für unsere Online-Mitgliedstanträge (Ordentliche Mitgliedschaft & Fördermitgliedschaft) nutzen wir den Formulardienst <strong>Jotform Inc.</strong> (111 Pine St. Suite 1815, San Francisco, CA 94111, USA).
            </p>
            <p className="text-xs text-slate-600">
              <strong>Zweck & Rechtsgrundlage:</strong> Die Verarbeitung Ihrer Daten im Rahmen des Mitgliedsantrags erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung bzw. Erfüllung des Vereinsverhältnisses) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer strukturierten Mitgliederverwaltung).
            </p>
            <p className="text-xs text-slate-600">
              Die in das Formular eingegebenen Daten werden verschlüsselt an Jotform übermittelt und auf sicheren Servern verarbeitet. Jotform garantiert angemessene Datenschutzstandards über Auftragsverarbeitungsverträge (AVV) sowie Standardvertragsklauseln der Europäischen Kommission.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">b) Formspree (Spenden & Webformulare / Kontakt)</h4>
            <p className="text-xs text-slate-600">
              Für allgemeine Kontaktanfragen sowie für Spendenhinweise auf unserer Website nutzen wir den Dienst <strong>Formspree Inc.</strong> (2175 S 5th East, Salt Lake City, UT 84106, USA).
            </p>
            <p className="text-xs text-slate-600">
              <strong>Zweck & Rechtsgrundlage:</strong> Entgegennahme und Bearbeitung Ihrer Anfragen gem. Art. 6 Abs. 1 lit. b DSGVO (Vertrags- und Anfragebearbeitung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer schnellen und zuverlässigen Kontaktaufnahme).
            </p>
            <p className="text-xs text-slate-600">
              Die von Ihnen übermittelten Formulardaten (wie Name, E-Mail-Adresse, Anfragetyp, Betreff, Nachricht) werden verschlüsselt über Server von Formspree geleitet und an unsere Vereins-E-Mail weitergeleitet.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">c) Firebase & Google Cloud Platform (Hosting & Infrastruktur)</h4>
            <p className="text-xs text-slate-600">
              Unsere Website und IT-Infrastruktur werden auf Servern von <strong>Google Cloud Platform & Firebase</strong> (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) gehostet.
            </p>
            <p className="text-xs text-slate-600">
              <strong>Zweck & Rechtsgrundlage:</strong> Technisches Hosting, Bereitstellung der Cloud Run Anwendung und Firestore-Datenbankdienste zur geschützten Datenhaltung gem. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem stabilen, performanten und ausfallsicheren Webauftritt).
            </p>
            <p className="text-xs text-slate-600">
              Beim Aufruf unserer Seiten erfasst die Infrastruktur automatisch technische Server-Log-Files (z. B. IP-Adresse, Datum und Uhrzeit des Zugriffs, Browsertyp, Betriebssystem, Referrer URL).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">4. Rechte der betroffenen Personen (Betroffenenrechte nach DSGVO)</h3>
        <p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-slate-600">
          <li><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie haben das Recht auf Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten.</li>
          <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können unverzüglich die Berichtigung unrichtiger Daten verlangen.</li>
          <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer bei uns gespeicherten Daten verlangen, soweit nicht gesetzliche Aufbewahrungspflichten entgegenstehen.</li>
          <li><strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer Daten zu verlangen.</li>
          <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in einem gängigen, maschinenlesbaren Format anfordern.</li>
          <li><strong>Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Sie können erteilte Einwilligungen jederzeit mit Wirkung für die Zukunft widerrufen.</li>
          <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sofern die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO beruht, können Sie der Verarbeitung aus persönlichen Gründen widersprechen.</li>
        </ul>
        <div className="mt-4 p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs">
          <p className="font-bold text-brand-teal mb-1">Beschwerderecht bei der Aufsichtsbehörde (Art. 77 DSGVO):</p>
          <p className="text-slate-600">
            Im Falle datenschutzrechtlicher Verstöße steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu:
          </p>
          <p className="font-semibold text-slate-800 mt-1">
            Der Hessische Beauftragte für Datenschutz und Informationsfreiheit<br />
            Gustav-Stresemann-Ring 1, 65189 Wiesbaden<br />
            Website: <a href="https://datenschutz.hessen.de" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline font-bold">datenschutz.hessen.de</a>
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">5. Cookies & Cookie-Einstellungen</h3>
        <p>
          Unsere Website nutzt notwendige Cookies sowie lokale Speichertechnologien (`localStorage`), um den Betrieb der Seite und die Speicherung Ihrer Datenschutz-Präferenzen zu gewährleisten.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Sie können Ihre Cookie-Präferenzen jederzeit einsehen und anpassen. Nutzen Sie dafür die Schaltfläche <strong>"Cookie-Einstellungen"</strong> mit dem <strong>Fingerprint-Symbol</strong> in der linken unteren Ecke unserer Website.
        </p>
      </section>
    </div>
  );

  return (
    <footer id="contact" className="bg-brand-navy text-white pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <a href={import.meta.env.BASE_URL} className="flex items-center">
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
            <li><a href={`${import.meta.env.BASE_URL}#home`} className="hover:text-white transition-colors">Startseite</a></li>
            <li><a href={`${import.meta.env.BASE_URL}#about`} className="hover:text-white transition-colors">Über uns</a></li>
            <li><a href={`${import.meta.env.BASE_URL}#impact`} className="hover:text-white transition-colors">Unsere Impact</a></li>
            <li><a href={`${import.meta.env.BASE_URL}#events`} className="hover:text-white transition-colors">Veranstaltungen</a></li>
            <li><Link to="/taetigkeitsbericht" className="hover:text-white transition-colors">Tätigkeitsbericht</Link></li>
            <li><a href={`${import.meta.env.BASE_URL}#contact`} className="hover:text-white transition-colors">Kontakt</a></li>
            <li><Link to="/admin/surveys" className="text-slate-500 hover:text-brand-teal transition-colors font-semibold">🔑 Admin-Dashboard</Link></li>
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
              className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
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
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 text-brand-teal">Rechtliches</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><button onClick={() => setActiveModal('impressum')} className="hover:text-white transition-colors text-left cursor-pointer">Impressum</button></li>
            <li><button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors text-left cursor-pointer">Datenschutzerklärung</button></li>
            <li><button onClick={() => setActiveModal('cookies')} className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium"><Fingerprint size={14} className="text-brand-teal" /> Cookie-Einstellungen</button></li>
            <li><button onClick={() => setActiveModal('satzung')} className="hover:text-white transition-colors text-left cursor-pointer">Satzung</button></li>
            <li><button onClick={() => setActiveModal('donation')} className="hover:text-white transition-colors text-left cursor-pointer">Spendenbescheinigung</button></li>
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
      />

      {/* Floating Fingerprint Button on Bottom Left */}
      <CookieFingerprintButton onOpenPrivacyPolicy={() => setActiveModal('privacy')} />
    </footer>
  );
}


