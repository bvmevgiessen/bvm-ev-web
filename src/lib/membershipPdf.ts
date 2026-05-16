// Generates a printable PDF of the membership application using jsPDF.
// Kept dependency-free besides jsPDF so it tree-shakes nicely.

import { PDFDocument } from 'pdf-lib';
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
  // Consents
  datenschutz: boolean;
  satzung?: boolean;
  sepaMandat?: boolean;
}

// Coordinate configuration for mapping data to the PDF templates.
// `yOffset` is subtracted from the page height (e.g., height - yOffset).
const ORDENTLICH_PDF_CONFIG = {
  page1: {
    nachname: { x: 150, yOffset: 145 },
    vorname: { x: 150, yOffset: 180 },
    geburtsdatum: { x: 150, yOffset: 215 },
    strasse: { x: 150, yOffset: 250 },
    plzOrt: { x: 150, yOffset: 285 },
    email: { x: 150, yOffset: 320 },
    telefon: { x: 150, yOffset: 355 },

    tickOrdentlich: { x: 293, yOffset: 110, size: 14 },

    kontoinhaber: { x: 60, yOffset: 560 },
    kreditinstitut: { x: 60, yOffset: 600 },
    bic: { x: 250, yOffset: 600 },
    ibanFirstBlock: { x: 90, yOffset: 640 },
    ibanOtherBlocks: { startX: 145, yOffset: 640, spacing: 60 },

    ortDatum: { x: 60, yOffset: 750 },
  },
  page2: {
    beitragMonatlich: { x: 115, yOffset: 415 },
    abbuchungstag1: { x: 290, yOffset: 415, size: 14 },
    abbuchungstag15: { x: 400, yOffset: 415, size: 14 },
    ortDatum: { x: 60, yOffset: 620 },
  }
};

const FOERDER_PDF_CONFIG = {
  page1: {
    name: { x: 170, yOffset: 265 },
    strasse: { x: 170, yOffset: 285 },
    plzOrt: { x: 170, yOffset: 305 },
    geburtsdatum: { x: 170, yOffset: 325 },
    email: { x: 170, yOffset: 345 },
    telefon: { x: 170, yOffset: 365 },

    beginn: { x: 350, yOffset: 430 },
    beitragHoehe: { x: 350, yOffset: 460 },

    intervallMonatlich: { x: 345, yOffset: 485, size: 12 },
    intervallJaehrlich: { x: 430, yOffset: 485, size: 12 },
    spendenJa: { x: 345, yOffset: 515, size: 12 },
    spendenNein: { x: 400, yOffset: 515, size: 12 },
  },
  page2: {
    kreditinstitut: { x: 200, yOffset: 160 },
    kontoinhaber: { x: 200, yOffset: 190 },
    iban: { x: 200, yOffset: 220 },
    bic: { x: 200, yOffset: 250 },
    ortDatum: { x: 60, yOffset: 470 },
  }
};

export async function downloadMembershipPdf(data: MembershipData) {
  try {
    const isOrdentlich = data.kind === 'ordentlich';
    const pdfUrl = isOrdentlich ? '/Ordentliches_mitglied_antrag.pdf' : '/Foerdermitgliedschaftsantrag.pdf';
    
    const existingPdfBytes = await fetch(pdfUrl).then((res) => {
      if (!res.ok) throw new Error(`Failed to load PDF from ${pdfUrl}`);
      return res.arrayBuffer();
    });

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Instead of mapping AcroForm fields (since they might just be flat PDFs based on the uploaded images),
    // we will draw text directly onto the first or second page using standard coordinates.
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages.length > 1 ? pages[1] : null;
    
    const { height: h1 } = firstPage.getSize();
    const h2 = secondPage ? secondPage.getSize().height : 0;

    // Use Helvetica font
    const font = await pdfDoc.embedStandardFont('Helvetica');
    const drawText = (text: string, x: number, y: number, size = 11, page = firstPage) => {
      if (text) {
        page.drawText(text, { x, y, size, font });
      }
    };

    const today = new Date().toLocaleDateString('de-DE');
    const ortDatumStr = `${data.ort || ''}, ${today}`;

    if (isOrdentlich) {
      const cfg1 = ORDENTLICH_PDF_CONFIG.page1;
      
      drawText(data.nachname || '', cfg1.nachname.x, h1 - cfg1.nachname.yOffset);
      drawText(data.vorname || '', cfg1.vorname.x, h1 - cfg1.vorname.yOffset);
      drawText(data.geburtsdatum || '', cfg1.geburtsdatum.x, h1 - cfg1.geburtsdatum.yOffset);
      drawText(data.strasse || '', cfg1.strasse.x, h1 - cfg1.strasse.yOffset);
      drawText(`${data.plz || ''} ${data.ort || ''}`, cfg1.plzOrt.x, h1 - cfg1.plzOrt.yOffset);
      drawText(data.email || '', cfg1.email.x, h1 - cfg1.email.yOffset);
      drawText(data.telefon || '', cfg1.telefon.x, h1 - cfg1.telefon.yOffset);

      drawText('X', cfg1.tickOrdentlich.x, h1 - cfg1.tickOrdentlich.yOffset, cfg1.tickOrdentlich.size);

      // SEPA
      drawText(data.kontoinhaber || '', cfg1.kontoinhaber.x, h1 - cfg1.kontoinhaber.yOffset);
      drawText(data.kreditinstitut || '', cfg1.kreditinstitut.x, h1 - cfg1.kreditinstitut.yOffset);
      drawText(data.bic || '', cfg1.bic.x, h1 - cfg1.bic.yOffset);
      
      if (data.iban) {
        const ibanParts = formatIban(data.iban).split(' ');
        if (ibanParts[0] && ibanParts[0].startsWith('DE')) {
          drawText(ibanParts[0].substring(2), cfg1.ibanFirstBlock.x, h1 - cfg1.ibanFirstBlock.yOffset);
        } else if (ibanParts[0]) {
          drawText(ibanParts[0], cfg1.ibanFirstBlock.x, h1 - cfg1.ibanFirstBlock.yOffset);
        }
        ibanParts.slice(1).forEach((part, i) => {
          drawText(part, cfg1.ibanOtherBlocks.startX + (i * cfg1.ibanOtherBlocks.spacing), h1 - cfg1.ibanOtherBlocks.yOffset);
        });
      }
      
      drawText(ortDatumStr, cfg1.ortDatum.x, h1 - cfg1.ortDatum.yOffset);

      // Page 2
      if (secondPage) {
        const cfg2 = ORDENTLICH_PDF_CONFIG.page2;
        drawText(data.beitragMonatlich || '', cfg2.beitragMonatlich.x, h2 - cfg2.beitragMonatlich.yOffset, 11, secondPage);
        
        if (data.abbuchungstag === '1') {
          drawText('X', cfg2.abbuchungstag1.x, h2 - cfg2.abbuchungstag1.yOffset, cfg2.abbuchungstag1.size, secondPage); 
        } else if (data.abbuchungstag === '15') {
          drawText('X', cfg2.abbuchungstag15.x, h2 - cfg2.abbuchungstag15.yOffset, cfg2.abbuchungstag15.size, secondPage);
        }
        
        drawText(ortDatumStr, cfg2.ortDatum.x, h2 - cfg2.ortDatum.yOffset, 11, secondPage);
      }

    } else {
      // Förder
      const cfg1 = FOERDER_PDF_CONFIG.page1;
      
      drawText(`${data.vorname || ''} ${data.nachname || ''}`, cfg1.name.x, h1 - cfg1.name.yOffset);
      drawText(data.strasse || '', cfg1.strasse.x, h1 - cfg1.strasse.yOffset);
      drawText(`${data.plz || ''} ${data.ort || ''}`, cfg1.plzOrt.x, h1 - cfg1.plzOrt.yOffset);
      drawText(data.geburtsdatum || '', cfg1.geburtsdatum.x, h1 - cfg1.geburtsdatum.yOffset);
      drawText(data.email || '', cfg1.email.x, h1 - cfg1.email.yOffset);
      drawText(data.telefon || '', cfg1.telefon.x, h1 - cfg1.telefon.yOffset);

      drawText(data.beginn || '', cfg1.beginn.x, h1 - cfg1.beginn.yOffset);
      drawText(data.beitragHoehe ? `${data.beitragHoehe} €` : '', cfg1.beitragHoehe.x, h1 - cfg1.beitragHoehe.yOffset);

      if (data.intervall === 'monatlich') {
        drawText('X', cfg1.intervallMonatlich.x, h1 - cfg1.intervallMonatlich.yOffset, cfg1.intervallMonatlich.size);
      }
      if (data.intervall === 'jaehrlich') {
        drawText('X', cfg1.intervallJaehrlich.x, h1 - cfg1.intervallJaehrlich.yOffset, cfg1.intervallJaehrlich.size);
      }

      if (data.spendenquittung === 'ja') {
        drawText('X', cfg1.spendenJa.x, h1 - cfg1.spendenJa.yOffset, cfg1.spendenJa.size);
      }
      if (data.spendenquittung === 'nein') {
        drawText('X', cfg1.spendenNein.x, h1 - cfg1.spendenNein.yOffset, cfg1.spendenNein.size);
      }

      // Page 2 for SEPA
      if (secondPage) {
        const cfg2 = FOERDER_PDF_CONFIG.page2;
        drawText(data.kreditinstitut || '', cfg2.kreditinstitut.x, h2 - cfg2.kreditinstitut.yOffset, 11, secondPage);
        drawText(data.kontoinhaber || '', cfg2.kontoinhaber.x, h2 - cfg2.kontoinhaber.yOffset, 11, secondPage);
        drawText(data.iban ? formatIban(data.iban) : '', cfg2.iban.x, h2 - cfg2.iban.yOffset, 11, secondPage);
        drawText(data.bic || '', cfg2.bic.x, h2 - cfg2.bic.yOffset, 11, secondPage);
        
        drawText(ortDatumStr, cfg2.ortDatum.x, h2 - cfg2.ortDatum.yOffset, 11, secondPage);
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `BVM-${data.kind === 'ordentlich' ? 'Mitgliedsantrag' : 'Foerderantrag'}-${data.nachname || 'Antrag'}.pdf`.replace(/\s+/g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (err) {
    console.error('Error generating PDF:', err);
    alert('Fehler beim Generieren der PDF. Bitte stellen Sie sicher, dass die PDF-Vorlagen verfügbar sind.');
  }
}