import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Fingerprint } from 'lucide-react';
import { Github, Facebook, Instagram, Twitter } from './SocialIcons';
import { useForm, ValidationError } from '@formspree/react';
import { Link } from 'react-router-dom';
import LegalModal from './LegalModal';
import Logo from './Logo';
import CookieFingerprintButton from './CookieFingerprintButton';
import CookieSettingsModal from './CookieSettingsModal';
import FormShield from './FormShield';

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
    <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Angaben gemäß § 5 TMG</h3>
        <p className="font-bold text-brand-navy">Bildung und Verständigung Mittelhessen e.V.</p>
        <p>Siemensstraße 18<br />35394 Gießen<br />Deutschland</p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Vertretungsberechtigter Vorstand (§ 26 BGB)</h3>
        <p>[Name des Vorsitzenden], Vorsitzende(r)</p>
        <p>[Vorname Nachname], Stellvertretende(r) Vorsitzende(r)</p>
        <p>[Vorname Nachname], Kassenwart(in)</p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Kontakt</h3>
        <p>E-Mail: <a href="mailto:bvmevgiessen@gmail.com" className="text-brand-teal font-semibold hover:underline">bvmevgiessen@gmail.com</a></p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Registereintrag</h3>
        <p>Eingetragen im Vereinsregister.<br />Registergericht: Amtsgericht Gießen<br />Registernummer: VR-4953</p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Gemeinnützigkeit</h3>
        <p>Als gemeinnütziger, eingetragener Verein sind wir nach § 5 Abs. 1 Nr. 9 KStG von der Körperschaftsteuer befreit.</p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
        <p>[Name des Verantwortlichen]<br />Siemensstraße 18, 35394 Gießen</p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Streitschlichtung</h3>
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand-teal font-semibold hover:underline">https://ec.europa.eu/consumers/odr</a>. Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        <p className="mt-2">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Haftung für Inhalte</h3>
        <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Haftung für Links</h3>
        <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">Urheberrecht</h3>
        <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.</p>
      </section>
    </div>
  );

  const privacyContent = (
    <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Stand: 29. August 2026</p>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">1. Verantwortliche Stelle</h3>
        <p>
          Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze ist:
        </p>
        <div className="mt-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
          <p className="font-bold text-brand-navy">Bildung und Verständigung Mittelhessen e.V. (BVM e.V.)</p>
          <p>Siemensstraße 18, 35394 Gießen, Deutschland</p>
          <p>E-Mail: <a href="mailto:bvmevgiessen@gmail.com" className="text-brand-teal hover:underline font-semibold">bvmevgiessen@gmail.com</a></p>
          <p>Vertreten durch den Vorstand</p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">2. Hosting</h3>
        <p>
          Diese Website wird von <strong>GitHub, Inc.</strong> (88 Colin P Kelly Jr Street, San Francisco, CA 94107, USA) über den Dienst „GitHub Pages“ gehostet. Beim Aufruf werden technische Verbindungsdaten (u. a. IP-Adresse, User-Agent, Zeitstempel, Referrer) an GitHub übertragen.
        </p>
        <p className="mt-2">
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und performanten Webauftritt). Die Datenübermittlung in die USA erfolgt auf Grundlage von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) sowie – soweit anwendbar – im Rahmen des EU-US Data Privacy Framework.
        </p>
        <p className="mt-2 text-xs">
          Weitere Informationen finden Sie in der Datenschutzerklärung von GitHub: <a href="https://docs.github.com/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">github.com/site-policy/privacy-policies/github-privacy-statement</a>
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">3. Content Delivery Network (CDN) & Domain-Sicherheit (Cloudflare)</h3>
        <p>
          Wir nutzen zur Absicherung unserer Domain und zur Abwehr schädlicher Zugriffe (z. B. DDoS-Attacken) den Dienst von <strong>Cloudflare, Inc.</strong> (101 Townsend St., San Francisco, CA 94107, USA).
        </p>
        <p className="mt-2">
          Cloudflare agiert als Reverse-Proxy und Sicherheits-Gateway. Beim Aufruf unserer Website wird der Datenverkehr über die globale Serverinfrastruktur von Cloudflare geleitet, um Sicherheitsrisiken zu analysieren und Angriffe zu blockieren. Hierbei werden technische Verbindungsdaten (u. a. IP-Adresse, Sicherheits-Header) verarbeitet.
        </p>
        <p className="mt-2">
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der IT-Sicherheit, Verfügbarkeit und Abwehr von Cyberangriffen). Die Datenübermittlung in die USA erfolgt auf Grundlage von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) sowie der Zertifizierung von Cloudflare unter dem EU-US Data Privacy Framework (DPF). Weitere Informationen: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline font-semibold">Datenschutzerklärung Cloudflare</a>
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">4. SSL-/TLS-Verschlüsselung</h3>
        <p>
          Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL-/TLS-Verschlüsselung. Sie erkennen eine verschlüsselte Verbindung an der Adresszeile des Browsers („https://“) und dem Schloss-Symbol.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">5. Server-Log-Dateien</h3>
        <p>
          Der Hosting-Provider erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt: Browsertyp und -version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse (gekürzt/anonymisiert soweit möglich).
        </p>
        <p className="mt-2">
          <strong>Speicherdauer:</strong> Maximal 14 Tage, danach erfolgt eine automatische Löschung.<br />
          <strong>Zweck & Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (technischer Betrieb, IT-Sicherheit, Fehleranalyse). Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">6. Kontaktaufnahme (E-Mail & Kontaktformular)</h3>
        <p>
          Bei Kontaktaufnahme per E-Mail oder über unser Kontaktformular werden Ihre Angaben (Name, E-Mail-Adresse, Anfragetyp, Betreff, Nachricht) zur Bearbeitung der Anfrage verarbeitet.
        </p>
        <p className="mt-2">
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche/vertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an effizienter Bearbeitung). Speicherung bis zur abschließenden Bearbeitung bzw. für die Dauer gesetzlicher Aufbewahrungspflichten.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">7. Eingesetzte Dienstleister</h3>

        <div className="space-y-4 mt-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">7a. Jotform Inc. (Mitgliedschaftsformular)</h4>
            <p className="text-xs text-slate-600">
              Anbieter: Jotform Inc., 111 Pine Street, Suite 1815, San Francisco, CA 94111, USA.<br />
              Zweck: Bearbeitung von Mitgliedsanträgen (Ordentliche und Fördermitgliedschaft).<br />
              Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.<br />
              Datenübermittlung in die USA: Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO. Auftragsverarbeitungsvertrag (AVV) abgeschlossen. <a href="https://www.jotform.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline font-semibold">Datenschutzerklärung Jotform</a>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">7b. Formspree, Inc. (Kontakt- und Spendenformulare)</h4>
            <p className="text-xs text-slate-600">
              Anbieter: Formspree, Inc., 2261 Market Street #4272, San Francisco, CA 94114, USA.<br />
              Zweck: Weiterleitung von Formulardaten an die Vereins-E-Mail.<br />
              Rechtsgrundlage: Art. 6 Abs. 1 lit. b / lit. f DSGVO.<br />
              Datenübermittlung in die USA: Standardvertragsklauseln (SCC) und EU-US Data Privacy Framework (DPF). <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline font-semibold">Datenschutzerklärung Formspree</a>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">7c. Google Firebase / Firestore (Google Ireland Ltd.)</h4>
            <p className="text-xs text-slate-600">
              Anbieter: Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland.<br />
              Zweck: Speicherung von Formularsubmittals, Umfragen und Datenschutz-Einwilligungen.<br />
              Server-Standort: EU (mit Sub-Processing durch Google LLC in den USA via Standardvertragsklauseln).<br />
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline font-semibold">Datenschutzerklärung Firebase</a>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">7d. Google Apps Script / Google Sheets / Google Drive</h4>
            <p className="text-xs text-slate-600">
              Formulareinreichungen werden ggf. per Google Apps Script an Google Sheets / Drive zur sicheren Archivierung weitergeleitet.<br />
              Anbieter: Google Ireland Ltd. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Google Workspace Data Processing Addendum (DPA).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">7e. Newsletter</h4>
            <p className="text-xs text-slate-600">
              Für den Versand unseres Newsletters verarbeiten wir Ihre E-Mail-Adresse auf Grundlage Ihrer ausdrücklichen Einwilligung (Double-Opt-In-Verfahren, Art. 6 Abs. 1 lit. a DSGVO). Sie können die Einwilligung jederzeit über den Abmeldelink im Newsletter oder per E-Mail widerrufen.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-brand-navy">7f. Cloudflare Turnstile (Spam- & Bot-Abwehr)</h4>
            <p className="text-xs text-slate-600">
              Wir setzen zur Absicherung unserer Formulare gegen Missbrauch (Spam, Bots) den Dienst <strong>Cloudflare Turnstile</strong> der <strong>Cloudflare, Inc.</strong> (101 Townsend Street, San Francisco, CA 94107, USA) ein. Turnstile erhebt technische Merkmale Ihres Browsers (u. a. IP-Adresse, User-Agent, Interaktions-Signale) und übermittelt diese an Cloudflare. Es werden keine Cookies gesetzt und kein Tracking über Webseiten hinweg durchgeführt.<br />
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Spam- und Missbrauchsabwehr sowie IT-Sicherheit). Weitere Informationen finden Sie in der <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline font-semibold">Datenschutzerklärung von Cloudflare</a>.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">8. Cookies & lokale Speicher (localStorage)</h3>
        <p>
          Wir nutzen ausschließlich technisch notwendige bzw. funktionale Cookies und `localStorage`-Einträge:
        </p>
        
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-brand-navy font-bold">
                <th className="border border-slate-200 p-2">Name</th>
                <th className="border border-slate-200 p-2">Zweck</th>
                <th className="border border-slate-200 p-2">Speicherdauer</th>
                <th className="border border-slate-200 p-2">Kategorie</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 p-2 font-mono">bvm_cookie_consent_v1</td>
                <td className="border border-slate-200 p-2">Speicherung Ihrer Cookie-Einwilligung und -Präferenzen</td>
                <td className="border border-slate-200 p-2">12 Monate</td>
                <td className="border border-slate-200 p-2 font-semibold text-brand-teal">Notwendig</td>
              </tr>
              <tr>
                <td className="border border-slate-200 p-2 font-mono">bvm_consent_time</td>
                <td className="border border-slate-200 p-2">Zeitstempel der Cookie-Einwilligung</td>
                <td className="border border-slate-200 p-2">12 Monate</td>
                <td className="border border-slate-200 p-2 font-semibold text-brand-teal">Notwendig</td>
              </tr>
              <tr>
                <td className="border border-slate-200 p-2 font-mono">__cf_bm / cf_clearance</td>
                <td className="border border-slate-200 p-2">Cloudflare-Sicherheits-Cookies zur Bot-Erkennung und Abwehr von Cyberangriffen</td>
                <td className="border border-slate-200 p-2">Session / 30 Tage</td>
                <td className="border border-slate-200 p-2 font-semibold text-brand-teal">Notwendig</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-600">
          <strong>Rechtsgrundlage:</strong> Für technisch notwendige Cookies § 25 Abs. 2 Nr. 2 TDDDG (vormals TTDSG). Für funktionale Dienste § 25 Abs. 1 TDDDG i.V.m. Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung, jederzeit widerruflich über die Schaltfläche „Cookie-Einstellungen“ unten links).
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">9. Blog / Latest Updates (RSS-Aggregation)</h3>
        <p>
          Unser Blog aggregiert öffentlich zugängliche RSS-Feeds unserer Partnerorganisationen (u. a. Stiftung Dialog und Bildung, FID, BDDI, Time to Help, AFSV, JWF, House of One). Beim reinen Ansehen der Blog-Seite werden von uns keine personenbezogenen Daten der Partner verarbeitet. Beim Klick auf einen Beitrag werden Sie zur externen Quelle weitergeleitet.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">10. Social-Media-Verlinkungen</h3>
        <p>
          Wir verlinken auf unsere Profile bei Facebook (Meta Platforms Ireland Ltd.), Instagram (Meta) und X (Twitter International Unlimited Company). Es handelt sich um einfache HTML-Links – erst mit dem Klick werden Daten an den jeweiligen Anbieter übertragen.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">11. Rechte der betroffenen Personen</h3>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
          <li><strong>Auskunft (Art. 15 DSGVO):</strong> Recht auf Auskunft über gespeicherte Daten.</li>
          <li><strong>Berichtigung (Art. 16 DSGVO):</strong> Recht auf Korrektur unrichtiger Daten.</li>
          <li><strong>Löschung (Art. 17 DSGVO):</strong> Recht auf Löschung („Recht auf Vergessenwerden“).</li>
          <li><strong>Einschränkung (Art. 18 DSGVO):</strong> Recht auf Einschränkung der Verarbeitung.</li>
          <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Recht auf Übertragung Ihrer Daten.</li>
          <li><strong>Widerruf (Art. 7 Abs. 3 DSGVO):</strong> Recht auf jederzeitigen Widerruf erteilter Einwilligungen.</li>
          <li><strong>Widerspruch (Art. 21 DSGVO):</strong> Recht auf Widerspruch gegen verarbeitete Daten.</li>
        </ul>
        <div className="mt-4 p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs">
          <p className="font-bold text-brand-teal mb-1">Aufsichtsbehörde (Art. 77 DSGVO):</p>
          <p className="text-slate-600">
            Der Hessische Beauftragte für Datenschutz und Informationsfreiheit<br />
            Gustav-Stresemann-Ring 1, 65189 Wiesbaden<br />
            Website: <a href="https://datenschutz.hessen.de" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline font-bold">datenschutz.hessen.de</a>
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-extrabold text-brand-navy mb-2">11. Änderungen dieser Datenschutzerklärung</h3>
        <p>
          Wir passen diese Datenschutzerklärung an, sobald Änderungen unserer Datenverarbeitung dies erforderlich machen. Die jeweils aktuelle Version ist stets auf dieser Website abrufbar.
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
          </FormShield>
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