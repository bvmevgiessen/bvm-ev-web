// Generates a printable PDF of the membership application using jsPDF.
// Kept dependency-free besides jsPDF so it tree-shakes nicely.

import { jsPDF } from 'jspdf';
import { formatIban } from './iban';

export type MembershipKind = 'ordentlich' | 'foerder';

export interface MembershipData {
  kind: MembershipKind;
  // Personal
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  strasse: string;
  plz: string;
  ort: string;
  email: string;
  telefon: string;
  // SEPA
  kontoinhaber?: string;
  kreditinstitut?: string;
  iban?: string;
  bic?: string;
  // Ordentlich
  beitragsfrei?: boolean;
  beitragMonatlich?: string;
  abbuchungstag?: '1' | '15';
  // Förder
  beitragHoehe?: string;
  intervall?: 'monatlich' | 'jaehrlich';
  beginn?: string;
  spendenquittung?: 'ja' | 'nein';
  // Consents (already checked when reaching this point)
  datenschutz: boolean;
  satzung?: boolean;
  sepaMandat?: boolean;
}

const VEREIN = 'Bildung und Verständigung Mittelhessen e.V.';

export function generateMembershipPdf(data: MembershipData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = margin;

  const today = new Date().toLocaleDateString('de-DE');
  const titleMap = {
    ordentlich: 'Antrag auf Ordentliche Mitgliedschaft',
    foerder: 'Antrag auf Fördermitgliedschaft',
  } as const;

  // ---- Header --------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(VEREIN, margin, y);
  y += 7;
  doc.setFontSize(13);
  doc.text(titleMap[data.kind], margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(`Eingangsdatum: ${today}`, margin, y);
  doc.setTextColor(0);
  y += 8;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // ---- Helper to draw a labeled row ---------------------------------------
  const row = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(value || '—', margin + 55, y);
    y += 7;
  };

  const sectionTitle = (title: string) => {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 80, 90);
    doc.text(title, margin, y);
    doc.setTextColor(0);
    y += 6;
  };

  // ---- Personal Data -------------------------------------------------------
  sectionTitle('Persönliche Daten');
  row('Vorname', data.vorname);
  row('Name', data.nachname);
  row('Geburtsdatum', data.geburtsdatum);
  row('Straße, Hausnr.', data.strasse);
  row('PLZ, Ort', `${data.plz} ${data.ort}`.trim());
  row('E-Mail', data.email);
  row('Telefon', data.telefon);

  // ---- Membership-specific -------------------------------------------------
  if (data.kind === 'ordentlich') {
    sectionTitle('Mitgliedschaft');
    if (data.beitragsfrei) {
      row('Mitgliedsbeitrag', 'Beitragsfreie Mitgliedschaft');
    } else {
      row('Beitragshöhe', `${data.beitragMonatlich || '2,50'} € monatlich`);
      row('Abbuchungstag', `${data.abbuchungstag || '1'}. des Monats`);
    }
  } else {
    sectionTitle('Förderbeitrag');
    row('Höhe des Beitrages', `${data.beitragHoehe || ''} €`);
    row('Zahlungsintervall', data.intervall === 'jaehrlich' ? 'Jährlich' : 'Monatlich');
    if (data.beginn) row('Beginn der Fördermitgliedschaft', data.beginn);
    row('Spendenquittung', data.spendenquittung === 'ja' ? 'Gewünscht' : 'Nicht gewünscht');
  }

  // ---- SEPA ----------------------------------------------------------------
  const needsSepa = data.kind === 'foerder' || !data.beitragsfrei;
  if (needsSepa) {
    sectionTitle('SEPA-Lastschriftmandat');
    row('Kontoinhaber', data.kontoinhaber || `${data.vorname} ${data.nachname}`.trim());
    row('Kreditinstitut', data.kreditinstitut || '');
    row('IBAN', data.iban ? formatIban(data.iban) : '');
    row('BIC', data.bic || '');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(90);
    const mandate =
      `Ich ermächtige den Verein ${VEREIN} Zahlungen von meinem Konto mittels Lastschrift einzuziehen. ` +
      'Zugleich weise ich mein Kreditinstitut an, die vom Verein auf mein Konto gezogenen Lastschriften einzulösen. ' +
      'Hinweis: Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des Betrages verlangen.';
    const lines = doc.splitTextToSize(mandate, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 3.6 + 3;
    doc.setTextColor(0);
  }

  // ---- Consents ------------------------------------------------------------
  sectionTitle('Bestätigungen');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const checks: string[] = [];
  if (data.satzung) checks.push('Ich erkenne die Satzung des Vereins an.');
  if (data.sepaMandat) checks.push('Ich erteile das SEPA-Lastschriftmandat.');
  if (data.datenschutz) checks.push('Ich akzeptiere den Datenschutzhinweis.');
  checks.forEach((c) => {
    doc.text(`☑  ${c}`, margin, y);
    y += 5.5;
  });

  // ---- Signature placeholder ----------------------------------------------
  y = Math.max(y, doc.internal.pageSize.getHeight() - 35);
  doc.setDrawColor(120);
  doc.line(margin, y, margin + 70, y);
  doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text('Ort, Datum', margin, y + 4);
  doc.text('Unterschrift', pageWidth - margin - 70, y + 4);
  doc.setTextColor(0);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text(
    `Generiert über bvm-ev.de am ${today} – ${VEREIN}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 8,
    { align: 'center' },
  );

  return doc;
}

export function downloadMembershipPdf(data: MembershipData) {
  const doc = generateMembershipPdf(data);
  const fname =
    `BVM-${data.kind === 'ordentlich' ? 'Mitgliedsantrag' : 'Foerderantrag'}-` +
    `${data.nachname || 'Antrag'}.pdf`.replace(/\s+/g, '_');
  doc.save(fname);
}
