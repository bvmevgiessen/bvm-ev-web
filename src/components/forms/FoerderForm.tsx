import React, { useState } from 'react';
import { useForm } from '@formspree/react';
import { Download, Loader2 } from 'lucide-react';
import { Checkbox, Field, RadioCard, SelectInput, TextInput } from './fields';
import { isValidIban, isValidBic, formatIban } from '../../lib/iban';
import { downloadMembershipPdf, MembershipData } from '../../lib/membershipPdf';
import { SuccessPanel } from './OrdentlichForm';

interface FormState {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  strasse: string;
  plz: string;
  ort: string;
  email: string;
  telefon: string;
  beitragHoehe: string;
  intervall: 'monatlich' | 'jaehrlich';
  beginn: string;
  kontoinhaber: string;
  kreditinstitut: string;
  iban: string;
  bic: string;
  spendenquittung: 'ja' | 'nein';
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
  beitragHoehe: '',
  intervall: 'monatlich',
  beginn: new Date().toISOString().slice(0, 10),
  kontoinhaber: '',
  kreditinstitut: '',
  iban: '',
  bic: '',
  spendenquittung: 'nein',
  sepaMandat: false,
  datenschutz: false,
};

export default function FoerderForm() {
  const [state, handleSubmit] = useForm('xpqbglbp');
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.vorname.trim()) e.vorname = 'Bitte Vornamen angeben.';
    if (!form.nachname.trim()) e.nachname = 'Bitte Nachnamen angeben.';
    if (!form.geburtsdatum) e.geburtsdatum = 'Bitte Geburtsdatum angeben.';
    if (!form.strasse.trim()) e.strasse = 'Bitte Straße angeben.';
    if (!/^\d{4,5}$/.test(form.plz.trim())) e.plz = 'Gültige PLZ erforderlich.';
    if (!form.ort.trim()) e.ort = 'Bitte Ort angeben.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Gültige E-Mail erforderlich.';
    if (!form.telefon.trim()) e.telefon = 'Bitte Telefonnummer angeben.';

    const betrag = parseFloat(form.beitragHoehe.replace(',', '.'));
    if (!isFinite(betrag) || betrag <= 0) e.beitragHoehe = 'Bitte gültigen Betrag angeben.';

    if (!form.kreditinstitut.trim()) e.kreditinstitut = 'Bitte Bank angeben.';
    if (!isValidIban(form.iban)) e.iban = 'IBAN ist ungültig.';
    if (!isValidBic(form.bic)) e.bic = 'BIC-Format ist ungültig.';
    if (!form.sepaMandat) e.sepaMandat = 'SEPA-Einzugsermächtigung erforderlich.';
    if (!form.datenschutz) e.datenschutz = 'Datenschutz-Zustimmung erforderlich.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      const first = document.querySelector('[data-testid$="-error"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const data: MembershipData = { kind: 'foerder', ...form };
    downloadMembershipPdf(data);
    await handleSubmit(event);
  };

  if (state.succeeded) return <SuccessPanel />;

  return (
    <form onSubmit={onSubmit} className="space-y-10" noValidate data-testid="foerder-form">
      <input
        type="hidden"
        name="_subject"
        value={`Neuer Antrag Fördermitgliedschaft – ${form.vorname} ${form.nachname}`}
      />
      <input type="hidden" name="form_type" value="Fördermitgliedschaft" />

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
          <Field id="nachname" label="Nachname" required error={errors.nachname}>
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

      <Fieldset title="Förderbeitrag">
        <p className="text-sm text-slate-600 mb-4">
          Ich unterstütze den Verein <strong>Bildung und Verständigung Mittelhessen e.V.</strong>
          {' '}als Fördermitglied und verpflichte mich, den unten genannten Beitrag zu zahlen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field
            id="beitragHoehe"
            label="Höhe des Beitrages (€)"
            required
            error={errors.beitragHoehe}
          >
            <TextInput
              id="beitragHoehe"
              name="beitragHoehe"
              inputMode="decimal"
              value={form.beitragHoehe}
              onChange={(e) => update('beitragHoehe', e.target.value)}
              invalid={!!errors.beitragHoehe}
              placeholder="z.B. 10"
              data-testid="betrag-input"
            />
          </Field>
          <Field id="intervall" label="Zahlungsintervall" required>
            <div className="flex gap-3" role="radiogroup" aria-label="Zahlungsintervall">
              <RadioCard
                id="intervall-mtl"
                name="intervall"
                value="monatlich"
                checked={form.intervall === 'monatlich'}
                onChange={(v) => update('intervall', v as 'monatlich')}
                title="Monatlich"
              />
              <RadioCard
                id="intervall-jhr"
                name="intervall"
                value="jaehrlich"
                checked={form.intervall === 'jaehrlich'}
                onChange={(v) => update('intervall', v as 'jaehrlich')}
                title="Jährlich"
              />
            </div>
          </Field>
          <Field id="beginn" label="Beginn der Fördermitgliedschaft">
            <TextInput
              id="beginn"
              name="beginn"
              type="date"
              value={form.beginn}
              onChange={(e) => update('beginn', e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </Field>
        </div>
      </Fieldset>

      <Fieldset title="SEPA-Einzugsermächtigung">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Field id="kontoinhaber" label="Kontoinhaber (falls abweichend)">
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
          <Field id="iban" label="IBAN" required error={errors.iban}>
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
            Das Fördermitglied erteilt dem Verein <strong>Bildung und Verständigung Mittelhessen
            e.V.</strong> hiermit eine Einzugsermächtigung für den Fördermitgliedsbeitrag, durch
            welche dieser Betrag bis auf Widerruf vom oben angegebenen Konto eingezogen werden darf.
          </p>
        </div>
        <div className="mt-4">
          <Checkbox
            id="sepaMandat"
            checked={form.sepaMandat}
            onChange={(v) => update('sepaMandat', v)}
            label="Ich erteile dem BVM e.V. die SEPA-Einzugsermächtigung."
            required
            error={errors.sepaMandat}
            testId="sepa-checkbox"
          />
        </div>
      </Fieldset>

      <Fieldset title="Spendenquittung">
        <Field id="spendenquittung" label="Ausstellung einer Spendenquittung">
          <div className="flex gap-3" role="radiogroup">
            <RadioCard
              id="spende-ja"
              name="spendenquittung"
              value="ja"
              checked={form.spendenquittung === 'ja'}
              onChange={(v) => update('spendenquittung', v as 'ja')}
              title="Ja, bitte ausstellen"
              description="Wir senden eine Bescheinigung per E-Mail / Post."
            />
            <RadioCard
              id="spende-nein"
              name="spendenquittung"
              value="nein"
              checked={form.spendenquittung === 'nein'}
              onChange={(v) => update('spendenquittung', v as 'nein')}
              title="Nein"
              description="Keine Bescheinigung notwendig."
            />
          </div>
        </Field>
      </Fieldset>

      <Fieldset title="Datenschutz">
        <Checkbox
          id="datenschutz"
          checked={form.datenschutz}
          onChange={(v) => update('datenschutz', v)}
          label={
            <>
              Ich bin mit der Speicherung, Übermittlung und Verarbeitung meiner personenbezogenen
              Daten zu Vereinszwecken gemäß <strong>DSGVO</strong> und <strong>BDSG</strong>{' '}
              einverstanden. Die Daten werden nicht an Dritte weitergegeben.
            </>
          }
          required
          error={errors.datenschutz}
          testId="datenschutz-checkbox"
        />
      </Fieldset>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <Download size={14} />
          Eine PDF-Kopie deines Antrags wird automatisch heruntergeladen.
        </p>
        <button
          type="submit"
          disabled={state.submitting}
          data-testid="submit-foerder"
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
