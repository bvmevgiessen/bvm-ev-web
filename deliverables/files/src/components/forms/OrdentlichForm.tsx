import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from '@formspree/react';
import { CheckCircle2, Download, Loader2 } from 'lucide-react';
import { Checkbox, Field, SelectInput, TextInput } from './fields';
import { isValidIban, isValidBic, formatIban } from '../../lib/iban';
import { downloadMembershipPdf, MembershipData } from '../../lib/membershipPdf';

interface FormState {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  strasse: string;
  plz: string;
  ort: string;
  email: string;
  telefon: string;
  beitragsfrei: boolean;
  beitragMonatlich: string;
  abbuchungstag: '1' | '15';
  kontoinhaber: string;
  kreditinstitut: string;
  iban: string;
  bic: string;
  satzung: boolean;
  sepaMandat: boolean;
  datenschutz: boolean;
}

const INITIAL: FormState = {
  vorname: '',
  nachname: '',
  geburtsdatum: '',
  strasse: '',
  plz: '',
  ort: '',
  email: '',
  telefon: '',
  beitragsfrei: false,
  beitragMonatlich: '2,50',
  abbuchungstag: '1',
  kontoinhaber: '',
  kreditinstitut: '',
  iban: '',
  bic: '',
  satzung: false,
  sepaMandat: false,
  datenschutz: false,
};

export default function OrdentlichForm() {
  const [state, handleSubmit] = useForm('maqvgbak');
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.vorname.trim()) e.vorname = 'Bitte Vornamen angeben.';
    if (!form.nachname.trim()) e.nachname = 'Bitte Namen angeben.';
    if (!form.geburtsdatum) e.geburtsdatum = 'Bitte Geburtsdatum angeben.';
    if (!form.strasse.trim()) e.strasse = 'Bitte Straße angeben.';
    if (!/^\d{4,5}$/.test(form.plz.trim())) e.plz = 'Gültige PLZ erforderlich.';
    if (!form.ort.trim()) e.ort = 'Bitte Ort angeben.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Gültige E-Mail erforderlich.';
    if (!form.telefon.trim()) e.telefon = 'Bitte Telefonnummer angeben.';

    if (!form.beitragsfrei) {
      if (!form.kreditinstitut.trim()) e.kreditinstitut = 'Bitte Bank angeben.';
      if (!isValidIban(form.iban)) e.iban = 'IBAN ist ungültig.';
      if (!isValidBic(form.bic)) e.bic = 'BIC-Format ist ungültig.';
      if (!form.sepaMandat) e.sepaMandat = 'SEPA-Mandat muss bestätigt werden.';
    }
    if (!form.satzung) e.satzung = 'Bitte die Satzung anerkennen.';
    if (!form.datenschutz) e.datenschutz = 'Datenschutz-Zustimmung erforderlich.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      // Scroll to first error
      const first = document.querySelector('[data-testid$="-error"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Build PDF + Formspree payload in parallel
    const data: MembershipData = { kind: 'ordentlich', ...form };
    downloadMembershipPdf(data);
    await handleSubmit(event);
  };

  if (state.succeeded) return <SuccessPanel />;

  return (
    <form onSubmit={onSubmit} className="space-y-10" noValidate data-testid="ordentlich-form">
      {/* Mandatory hidden _subject for nicer email subject */}
      <input
        type="hidden"
        name="_subject"
        value={`Neuer Antrag Ordentliche Mitgliedschaft – ${form.vorname} ${form.nachname}`}
      />
      <input type="hidden" name="form_type" value="Ordentliche Mitgliedschaft" />

      <Fieldset title="Persönliche Daten">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field id="vorname" label="Vorname" required error={errors.vorname}>
            <TextInput
              id="vorname"
              name="vorname"
              value={form.vorname}
              onChange={(e) => update('vorname', e.target.value)}
              invalid={!!errors.vorname}
              autoComplete="given-name"
              data-testid="vorname-input"
            />
          </Field>
          <Field id="nachname" label="Name" required error={errors.nachname}>
            <TextInput
              id="nachname"
              name="nachname"
              value={form.nachname}
              onChange={(e) => update('nachname', e.target.value)}
              invalid={!!errors.nachname}
              autoComplete="family-name"
              data-testid="nachname-input"
            />
          </Field>
          <Field id="geburtsdatum" label="Geburtsdatum" required error={errors.geburtsdatum}>
            <TextInput
              id="geburtsdatum"
              name="geburtsdatum"
              type="date"
              value={form.geburtsdatum}
              onChange={(e) => update('geburtsdatum', e.target.value)}
              invalid={!!errors.geburtsdatum}
              max={new Date().toISOString().slice(0, 10)}
              data-testid="geburtsdatum-input"
            />
          </Field>
          <Field id="telefon" label="Telefon" required error={errors.telefon}>
            <TextInput
              id="telefon"
              name="telefon"
              type="tel"
              value={form.telefon}
              onChange={(e) => update('telefon', e.target.value)}
              invalid={!!errors.telefon}
              autoComplete="tel"
              data-testid="telefon-input"
            />
          </Field>
          <Field id="strasse" label="Straße, Hausnr." required error={errors.strasse}>
            <TextInput
              id="strasse"
              name="strasse"
              value={form.strasse}
              onChange={(e) => update('strasse', e.target.value)}
              invalid={!!errors.strasse}
              autoComplete="street-address"
              data-testid="strasse-input"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field id="plz" label="PLZ" required error={errors.plz}>
              <TextInput
                id="plz"
                name="plz"
                inputMode="numeric"
                pattern="\d{4,5}"
                value={form.plz}
                onChange={(e) => update('plz', e.target.value)}
                invalid={!!errors.plz}
                autoComplete="postal-code"
                data-testid="plz-input"
              />
            </Field>
            <div className="col-span-2">
              <Field id="ort" label="Ort" required error={errors.ort}>
                <TextInput
                  id="ort"
                  name="ort"
                  value={form.ort}
                  onChange={(e) => update('ort', e.target.value)}
                  invalid={!!errors.ort}
                  autoComplete="address-level2"
                  data-testid="ort-input"
                />
              </Field>
            </div>
          </div>
          <div className="md:col-span-2">
            <Field id="email" label="E-Mail" required error={errors.email}>
              <TextInput
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                invalid={!!errors.email}
                autoComplete="email"
                data-testid="email-input"
              />
            </Field>
          </div>
        </div>
      </Fieldset>

      <Fieldset title="Mitgliedsbeitrag">
        <p className="text-sm text-slate-600 mb-4">
          Der reguläre Beitrag liegt bei <strong>2,50 € monatlich</strong>. Eine
          beitragsfreie Mitgliedschaft ist auf Antrag möglich.
        </p>
        <Checkbox
          id="beitragsfrei"
          checked={form.beitragsfrei}
          onChange={(v) => update('beitragsfrei', v)}
          label="Ich beantrage eine beitragsfreie Mitgliedschaft (z.B. Schüler / Studierende / Härtefall)."
          testId="beitragsfrei-checkbox"
        />
        {!form.beitragsfrei && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <Field id="beitragMonatlich" label="Beitragshöhe (€ / Monat)">
              <TextInput
                id="beitragMonatlich"
                name="beitragMonatlich"
                value={form.beitragMonatlich}
                onChange={(e) => update('beitragMonatlich', e.target.value)}
                inputMode="decimal"
                data-testid="beitrag-input"
              />
            </Field>
            <Field id="abbuchungstag" label="Abbuchungstag">
              <SelectInput
                id="abbuchungstag"
                name="abbuchungstag"
                value={form.abbuchungstag}
                onChange={(e) => update('abbuchungstag', e.target.value as '1' | '15')}
              >
                <option value="1">1. des Monats</option>
                <option value="15">15. des Monats</option>
              </SelectInput>
            </Field>
          </div>
        )}
      </Fieldset>

      {!form.beitragsfrei && (
        <Fieldset title="SEPA-Lastschriftmandat">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Field
                id="kontoinhaber"
                label="Kontoinhaber (falls abweichend vom Antragsteller)"
              >
                <TextInput
                  id="kontoinhaber"
                  name="kontoinhaber"
                  value={form.kontoinhaber}
                  onChange={(e) => update('kontoinhaber', e.target.value)}
                  placeholder={`${form.vorname} ${form.nachname}`.trim() || 'Vor- und Nachname'}
                />
              </Field>
            </div>
            <Field id="kreditinstitut" label="Kreditinstitut" required error={errors.kreditinstitut}>
              <TextInput
                id="kreditinstitut"
                name="kreditinstitut"
                value={form.kreditinstitut}
                onChange={(e) => update('kreditinstitut', e.target.value)}
                invalid={!!errors.kreditinstitut}
                data-testid="kreditinstitut-input"
              />
            </Field>
            <Field id="iban" label="IBAN" required error={errors.iban} hint="z.B. DE89 3704 0044 0532 0130 00">
              <TextInput
                id="iban"
                name="iban"
                value={formatIban(form.iban)}
                onChange={(e) => update('iban', e.target.value)}
                invalid={!!errors.iban}
                data-testid="iban-input"
              />
            </Field>
            <Field id="bic" label="BIC (optional bei deutscher IBAN)" error={errors.bic}>
              <TextInput
                id="bic"
                name="bic"
                value={form.bic}
                onChange={(e) => update('bic', e.target.value.toUpperCase())}
                invalid={!!errors.bic}
                data-testid="bic-input"
              />
            </Field>
          </div>
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-700 leading-relaxed">
              Ich ermächtige den Verein <strong>Bildung und Verständigung Mittelhessen e.V.</strong>{' '}
              Zahlungen von meinem Konto mittels Lastschrift einzuziehen. Zugleich weise ich mein
              Kreditinstitut an, die vom Verein auf mein Konto gezogenen Lastschriften einzulösen.
              Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung
              des Betrages verlangen.
            </p>
          </div>
          <div className="mt-4">
            <Checkbox
              id="sepaMandat"
              checked={form.sepaMandat}
              onChange={(v) => update('sepaMandat', v)}
              label="Ich erteile dem BVM e.V. das oben stehende SEPA-Lastschriftmandat."
              required
              error={errors.sepaMandat}
              testId="sepa-checkbox"
            />
          </div>
        </Fieldset>
      )}

      <Fieldset title="Bestätigungen">
        <div className="space-y-4">
          <Checkbox
            id="satzung"
            checked={form.satzung}
            onChange={(v) => update('satzung', v)}
            label={
              <>
                Ich erkenne die <strong>Satzung des BVM e.V.</strong> in der aktuell gültigen
                Fassung an. Mir ist bekannt, dass die Mitgliedschaft fortlaufend ist und ein Austritt
                nur zum Ende des Kalenderjahres unter Einhaltung einer Kündigungsfrist von 3 Monaten
                erfolgen kann.
              </>
            }
            required
            error={errors.satzung}
            testId="satzung-checkbox"
          />
          <Checkbox
            id="datenschutz"
            checked={form.datenschutz}
            onChange={(v) => update('datenschutz', v)}
            label={
              <>
                Ich willige in die Erhebung, Verarbeitung und Nutzung meiner personenbezogenen Daten
                im Rahmen der satzungsgemäßen Aufgaben des Vereins gemäß <strong>DSGVO</strong> ein.
                Eine Weitergabe an Dritte erfolgt nicht.
              </>
            }
            required
            error={errors.datenschutz}
            testId="datenschutz-checkbox"
          />
        </div>
      </Fieldset>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <Download size={14} />
          Eine PDF-Kopie deines Antrags wird automatisch heruntergeladen.
        </p>
        <button
          type="submit"
          disabled={state.submitting}
          data-testid="submit-ordentlich"
          className="btn-primary px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {state.submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Wird gesendet …
            </>
          ) : (
            'Antrag absenden'
          )}
        </button>
      </div>
    </form>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <h3 className="text-lg font-extrabold text-brand-navy border-l-4 border-brand-teal pl-3">
        {title}
      </h3>
      {children}
    </section>
  );
}

function SuccessPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
      data-testid="success-panel"
    >
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
        <CheckCircle2 className="text-emerald-600" size={42} />
      </div>
      <h2 className="text-3xl font-extrabold text-brand-navy mb-3">Antrag eingegangen!</h2>
      <p className="text-slate-600 max-w-xl mx-auto">
        Vielen Dank für Ihren Antrag! Wir werden Ihre Unterlagen prüfen und uns innerhalb weniger
        Tage bei Ihnen melden.
      </p>
    </motion.div>
  );
}

export { SuccessPanel };
