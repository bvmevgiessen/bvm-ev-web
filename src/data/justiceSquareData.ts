import justiceFeedsRaw from './justice_feeds.json';

export interface JusticeNewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  sourceType: 'international' | 'exile' | 'court';
  categoryLabel: string;
  summary: string;
  originalUrl: string;
  tags: string[];
  readTime: string;
}

export interface JusticeReportItem {
  id: string;
  title: string;
  institution: string;
  institutionCategory: 'ngo' | 'un' | 'court' | 'government';
  year: string;
  referenceNumber?: string;
  keyPoints: string[];
  relevance: string;
  originalUrl: string;
  badgeColor: string;
}

export interface StatMetric {
  label: string;
  value: string;
  numericValue?: number;
  subtext: string;
  source: string;
}

export interface InfographicSection {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  keyMetrics: StatMetric[];
  chartData?: {
    name: string;
    value: number;
    formatted: string;
    note?: string;
  }[];
  detailedFindings: string[];
  officialSources: { name: string; url: string }[];
}

export interface MultimediaItem {
  id: string;
  title: string;
  type: 'documentary' | 'interview' | 'explainer' | 'audio' | 'museum';
  duration: string;
  creator: string;
  date: string;
  description: string;
  externalUrl: string;
  thumbnailUrl: string;
  embedType?: 'youtube' | 'external_audio' | 'link';
}

export interface UsefulLinkItem {
  name: string;
  url: string;
  category: string;
  description: string;
  focusArea: string;
}

// -------------------------------------------------------------
// 1. NEWS & ANALYSIS (Kurzzusammenfassungen 3–4 Sätze)
// -------------------------------------------------------------
const baselineNews: JusticeNewsItem[] = [
  {
    id: 'news-justicesquare-yalcinkaya',
    title: 'EGMR Yalçınkaya-Urteil: Weigerung lokaler Gerichte begründet anhaltende Rechtsstaatskrise',
    date: 'Aktuell 2026',
    source: 'JusticeSquare.org',
    sourceType: 'court',
    categoryLabel: 'Rechtsanalyse',
    summary: 'Türkische Strafkammern verurteilen Betroffene weiterhin allein auf Basis legaler Handlungen wie ByLock-Nutzung oder Sparkonten zu drakonischen Haftstrafen. Trotz des bindenden Urteils der Großen Kammer des EGMR im Präzedenzfall Yüksel Yalçınkaya v. Turkey weigert sich Ankara, den Vorgaben aus Straßburg nachzukommen. JusticeSquare dokumentiert die anhaltende Justizkrise und fordert den Europarat zu konsequenten Sanktionen auf.',
    originalUrl: 'https://justicesquare.org/',
    tags: ['EGMR', 'Yalçınkaya', 'Rechtsstaat', 'Europarat'],
    readTime: '3 Min. Lesezeit'
  },
  {
    id: 'news-turkishminute-europarat',
    title: 'Ministerkomitee des Europarats rügt Türkei wegen Nichtumsetzung von Straßburg-Urteilen',
    date: 'Aktuell 2026',
    source: 'Turkish Minute',
    sourceType: 'exile',
    categoryLabel: 'Exil-Presse',
    summary: 'Das Ministerkomitee des Europarats mahnt die türkische Regierung erneut wegen systematischer Verstöße gegen das Rückwirkungsverbot (Art. 7 EMRK). Da über 25.000 identische Beschwerden in Straßburg anhängig sind, droht der Türkei ein förmliches Vertragsverletzungsverfahren. Experten betonen, dass pauschale Terrorverurteilungen ohne individuelle Schuldnachweise das Fundament des europäischen Rechtsraums untergraben.',
    originalUrl: 'https://turkishminute.com/',
    tags: ['Europarat', 'Turkish Minute', 'ByLock', 'EMRK Art. 7'],
    readTime: '4 Min. Lesezeit'
  },
  {
    id: 'news-ija-pressefreiheit',
    title: 'IJA-Sonderbericht: Zehn Jahre nach den Notstandsdekreten – Medienschaffende im Visier',
    date: 'Aktuell 2026',
    source: 'International Journalists Association e.V.',
    sourceType: 'exile',
    categoryLabel: 'Exil-Presse',
    summary: 'Die International Journalists Association e.V. (IJA) analysiert in einer umfassenden Bestandsaufnahme die Zerschlagung unabhängiger Medienhäuser. Über 150 Zeitungen, Sender und Verlage wurden per KHK enteignet, während exilierte Journalisten weltweit mit Interpol-Fahndungen und Spionage bedroht werden. Die IJA fordert die europäischen Demokratien auf, exilierte Medienschaffende wirksam vor transnationaler Repression zu schützen.',
    originalUrl: 'https://internationaljournalists.org/de/',
    tags: ['Pressefreiheit', 'IJA e.V.', 'KHK', 'Exiljournalismus'],
    readTime: '4 Min. Lesezeit'
  },
  {
    id: 'news-egmr-yalcinkaya-base',
    title: 'EGMR Große Kammer: Historischer 17:0-Beschluss gegen Kollektivkriminalisierung',
    date: '26. September 2023',
    source: 'Europäischer Gerichtshof für Menschenrechte (EGMR / ECtHR)',
    sourceType: 'court',
    categoryLabel: 'Gerichtsurteil',
    summary: 'Die Große Kammer des EGMR stellte im Grundsatzurteil Yüksel Yalçınkaya v. Turkey gravierende Verletzungen von Art. 7 (Keine Strafe ohne Gesetz) und Art. 6 (Faires Verfahren) fest. Die bloße Nutzung der ByLock-App darf ohne Nachweis einer konkreten Straftat keinen Terrorvorwurf begründen. Das Urteil setzt völkerrechtliche Maßstäbe für Zehntausende Betroffene.',
    originalUrl: 'https://hudoc.echr.coe.int/eng?i=001-227448',
    tags: ['EGMR', 'Rechtsstaatlichkeit', 'ByLock-Urteil', 'Faires Verfahren'],
    readTime: '3 Min. Lesezeit'
  },
  {
    id: 'news-dw-khk-lehrer',
    title: 'Notstandsdekrete in der Türkei: Hunderttausende Existenzen durch KHK vernichtet',
    date: '14. Juli 2023',
    source: 'Deutsche Welle (DW)',
    sourceType: 'international',
    categoryLabel: 'Internationale Medien',
    summary: 'Nach dem Putschversuch von 2016 wurden per Notstandsdekret (KHK) mehr als 150.000 Staatsbedienstete, Richter und Lehrkräfte ohne Gerichtsverfahren entlassen. Die Betroffenen erhielten lebenslange Berufsverbote im öffentlichen Dienst, Pässe wurden eingezogen und Familien sozial geächtet. Die Deutsche Welle dokumentiert den fortdauernden Kampf um Wiedergutmachung.',
    originalUrl: 'https://www.dw.com/de/t%C3%BCrkei-menschenrechte/t-18967923',
    tags: ['KHK-Dekrete', 'Massenentlassungen', 'Berufsverbote', 'DW'],
    readTime: '4 Min. Lesezeit'
  },
  {
    id: 'news-guardian-transnational',
    title: 'MİT-Operationen im Ausland: Türkischer Geheimdienst entführt Dissidenten weltweit',
    date: '22. Februar 2023',
    source: 'The Guardian',
    sourceType: 'international',
    categoryLabel: 'Internationale Medien',
    summary: 'Ein investigativer Bericht des Guardian beleuchtet die weltweite Verfolgung mutmaßlicher Gülen-Anhänger durch den Nachrichtendienst MİT in über 30 Staaten. UN-Experten verurteilen diese Entführungen und illegalen Überstellungen als völkerrechtswidrige transnationale Repression. Betroffene wurden oft monatelang ohne Kontakt zur Außenwelt in Geheimgefängnissen festgehalten.',
    originalUrl: 'https://www.theguardian.com/world/human-rights',
    tags: ['Transnationale Repression', 'MİT-Entführungen', 'Völkerrecht', 'The Guardian'],
    readTime: '5 Min. Lesezeit'
  },
  {
    id: 'news-bold-gefaengnis-kinder',
    title: 'Schwere Haftbedingungen: Über 500 Kleinkinder mit ihren Müttern im Strafvollzug',
    date: '11. Januar 2024',
    source: 'Bold Medya',
    sourceType: 'exile',
    categoryLabel: 'Exil-Medien',
    summary: 'Nach Angaben türkischer Menschenrechtsanwälte und Exil-Beobachter befinden sich über 500 Kleinkinder gemeinsam mit ihren Müttern in türkischen Haftanstalten. Viele der inhaftierten Mütter sind Akademikerinnen oder Lehrerinnen, denen pauschal Gülen-Verbindungen vorgeworfen werden. NGOs rügen die Verweigerung kindgerechter Nahrung und unzureichende ärztliche Betreuung.',
    originalUrl: 'https://boldmedya.com',
    tags: ['Haftbedingungen', 'Kinderrechte', 'Frauen im Gefängnis', 'Bold Medya'],
    readTime: '3 Min. Lesezeit'
  },
  {
    id: 'news-tr724-bankasya-haft',
    title: 'Bank Asya als Terrorbeweis: Juristen fordern Stopp der rechtswidrigen Urteile',
    date: '18. Mai 2024',
    source: 'TR724',
    sourceType: 'exile',
    categoryLabel: 'Exil-Medien',
    summary: 'Tausende Bürger wurden verurteilt, weil sie ein Sparkonto bei der staatlich lizenzierten Bank Asya führten oder ihre Kinder auf private Nachhilfezentren schickten. Die juristische Analyse zeigt, dass diese rückwirkende Kriminalisierung legaler Alltagsgeschäfte fundamentale Verfassungsrechte verletzt. TR724 begleitet Betroffene auf ihrem Weg vor internationale Schiedsgerichte.',
    originalUrl: 'https://www.tr724.com',
    tags: ['Rechtsstaat', 'Bank Asya', 'Rückwirkungsverbot', 'TR724'],
    readTime: '4 Min. Lesezeit'
  }
];

// Combine baseline with dynamic feeds from justice_feeds.json if present
export const justiceNewsData: JusticeNewsItem[] = (() => {
  const irrelevantPhrases = [
    'hull breach', 'shipwreck', 'ferry disaster', 'ferry death', 
    'privatization of bosporus', 'isil detainees'
  ];

  const dynamicItems = (justiceFeedsRaw?.items || [])
    .filter((item: any) => {
      if (item.category !== 'news') return false;
      const lower = (item.title || '').toLowerCase();
      if (irrelevantPhrases.some((phrase) => lower.includes(phrase))) {
        return false;
      }
      return true;
    })
    .map((item: any) => {
      let sourceType: 'international' | 'exile' | 'court' = 'exile';
      const srcLower = (item.source_name || '').toLowerCase();
      if (srcLower.includes('egmr') || srcLower.includes('gericht') || srcLower.includes('echr')) {
        sourceType = 'court';
      } else if (srcLower.includes('guardian') || srcLower.includes('dw') || srcLower.includes('deutsche welle') || srcLower.includes('bbc')) {
        sourceType = 'international';
      }

      const cleanTags = (item.tags || ['Menschenrechte', 'Rechtsstaat'])
        .filter((t: string) => t && t !== 'Gerichtsverfahren');

      return {
        id: item.id,
        title: item.title,
        date: item.date || 'Aktuell',
        source: item.source_name || 'JusticeSquare Feed',
        sourceType: sourceType,
        categoryLabel: item.source_name || 'Verifizierte Quelle',
        summary: item.summary,
        originalUrl: item.link || item.source_url || 'https://justicesquare.org/',
        tags: cleanTags.length > 0 ? cleanTags : ['Menschenrechte', 'Rechtsstaat'],
        readTime: item.readTime || '3 Min. Lesezeit'
      } as JusticeNewsItem;
    });

  // Deduplicate by title/originalUrl
  const seenUrls = new Set<string>();
  const combined: JusticeNewsItem[] = [];

  for (const item of [...dynamicItems, ...baselineNews]) {
    const key = (item.title + item.originalUrl).toLowerCase();
    if (!seenUrls.has(key)) {
      seenUrls.add(key);
      combined.push(item);
    }
  }

  return combined;
})();

// -------------------------------------------------------------
// 2. REPORTS & DOSSIERS (Alle 8 maßgeblichen Institutionen)
// -------------------------------------------------------------
export const justiceReportsData: JusticeReportItem[] = [
  {
    id: 'report-hrw-world-report-2025',
    title: 'Human Rights Watch World Report 2025: Türkei-Kapitel',
    institution: 'Human Rights Watch',
    institutionCategory: 'ngo',
    year: '2025',
    referenceNumber: 'HRW-WR-2025-TR',
    keyPoints: [
      'Fortgesetzter systematischer Missbrauch des Antiterrorgesetzes (Art. 314 TCK) zur Ahndung friedlicher bürgerlicher Aktivitäten.',
      'Weigerung der türkischen Gerichte, das Urteil der Großen Kammer des EGMR im Fall Yalçınkaya v. Turkey bindend umzusetzen.',
      'Anhaltende Stigmatisierung und Berufsverbote für über 150.000 per Notstandsdekret (KHK) entlassene Staatsbedienstete und Akademiker.',
      'Gezielte Kriminalisierung von Rechtsanwälten, die Mandanten in Gülen-bezogenen Strafverfahren verteidigen.'
    ],
    relevance: 'Belegt auf höchster völkerrechtlicher NGO-Ebene, dass die Verfolgung von Gülen-Anhängern keine Übergangsphase war, sondern ein dauerhaft institutionalisiertes Repressionssystem darstellt.',
    originalUrl: 'https://www.hrw.org/world-report/2025/country-chapters/turkiye',
    badgeColor: 'bg-red-500/10 text-red-700 border-red-200'
  },
  {
    id: 'report-scf-torture-abductions',
    title: 'Stockholm Center for Freedom: Folter, Entführungen & Straflosigkeit in der Türkei',
    institution: 'Stockholm Center for Freedom (SCF)',
    institutionCategory: 'ngo',
    year: '2024/2025',
    referenceNumber: 'SCF-TR-2025',
    keyPoints: [
      'Dokumentation von über 110 Fällen illegaler Entführungen und Überstellungen türkischer Staatsbürger aus mehr als 30 Ländern.',
      'Systematische Verweigerung von Ermittlungen bei substantiierten Folter- und Misshandlungsvorwürfen in Polizeigewahrsam.',
      'Chronische Überbelegung der Haftanstalten und akute Verweigerung medizinischer Hilfe für schwer krebskranke Häftlinge.',
      'Erstellung von Namensregistern und Beweisketten für internationale Gerichte und Asylbehörden.'
    ],
    relevance: 'Das Stockholm Center for Freedom liefert empirische Primärdokumentationen zu Geheimdienstoperationen des MİT und zur Straflosigkeit von Sicherheitsbeamten.',
    originalUrl: 'https://stockholmcf.org/',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200'
  },
  {
    id: 'report-others-khk-deaths',
    title: 'Solidarity with OTHERS: Die KHK-Maschinerie und Todesfälle in Gewahrsam',
    institution: 'Solidarity with OTHERS',
    institutionCategory: 'ngo',
    year: '2024/2025',
    referenceNumber: 'OTHERS-MONITOR-2025',
    keyPoints: [
      'Erfassung und Verifizierung von über 100 verdächtigen Todesfällen in Haft und Dutzenden Suiziden infolge von Notstandsdekreten.',
      'Digitale Brandmarkung entlassener Bürger in den Sozialversicherungsregistern (Codes 36/37) zur Verhinderung privater Beschäftigung.',
      'Pauschale Beschlagnahme von Eigentum, Pensionsansprüchen und Kontoguthaben ohne reguläre Gerichtsentscheidung.',
      'Spezifische Monitoring-Dossiers zu inhaftierten Frauen, Kleinkindern und schwer Pflegebedürftigen.'
    ],
    relevance: 'Wissenschaftlich präzise Dokumentation des sozioökonomischen „zivilen Todes“ (sivil ölüm) und der kollektiven Bestrafung ganzer Familienverbände.',
    originalUrl: 'https://solidaritywithothers.com/',
    badgeColor: 'bg-amber-500/10 text-amber-800 border-amber-200'
  },
  {
    id: 'report-un-ohchr-wgad',
    title: 'UN OHCHR / WGAD: Gutachtenserie zu willkürlicher Freiheitsberaubung',
    institution: 'UN Human Rights Office (OHCHR / WGAD)',
    institutionCategory: 'un',
    year: '2023-2025',
    referenceNumber: 'UN-WGAD-TUR-SERIES',
    keyPoints: [
      'In über 40 Gutachten stellt die UN-Arbeitsgruppe fest, dass Verhaftungen von Gülen-Anhängern fundamental willkürlich sind.',
      'Nutzung verschlüsselter Kommunikationsmittel, Vereinstätigkeit und legale Bankgeschäfte sind völkerrechtlich geschützte Grundrechte.',
      'Feststellung schwerer Verstöße gegen Art. 9, 10, 11, 18 und 19 der Allgemeinen Erklärung der Menschenrechte.',
      'Völkerrechtliche Verpflichtung der Türkei zur unverzüglichen Freilassung und finanziellen Entschädigung der Opfer.'
    ],
    relevance: 'Höchste völkerrechtliche Feststellung des UN-Menschenrechtsrats, dass die Kriminalisierung bürgerlicher Aktivitäten gegen die UN-Konventionen verstößt.',
    originalUrl: 'https://www.ohchr.org/en/countries/turkiye',
    badgeColor: 'bg-sky-500/10 text-sky-700 border-sky-200'
  },
  {
    id: 'report-freedom-house-transnational',
    title: 'Freedom House: Out of Sight, Not Out of Reach – Transnationale Repression',
    institution: 'Freedom House',
    institutionCategory: 'ngo',
    year: '2024/2025',
    referenceNumber: 'FH-TNR-GLOBAL',
    keyPoints: [
      'Die Türkei zählt neben China und Russland zu den aggressivsten Akteuren weltweiter Auslandsverfolgung von Dissidenten.',
      'Mehr als 110 dokumentierte Entführungsoperationen (Renditions) auf vier Kontinenten seit 2016.',
      'Missbrauch von Interpol-Ausschreibungen (Red Notices) zur Blockade der Bewegungsfreiheit politischer Flüchtlinge.',
      'Gezielte Belästigung, Bedrohung und digitale Ausspähung von Exilgemeinden in Europa und Nordamerika.'
    ],
    relevance: 'Wesentliche Grundlage für westliche Regierungen und Asylgerichte bei der Bewertung türkischer Auslieferungs- und Rechtshilfeersuchen.',
    originalUrl: 'https://freedomhouse.org/',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200'
  },
  {
    id: 'report-silenced-turkey-women',
    title: 'Advocates of Silenced Turkey (AST): Frauen und Kinder im türkischen Strafvollzug',
    institution: 'Advocates of Silenced Turkey (AST)',
    institutionCategory: 'ngo',
    year: '2024/2025',
    referenceNumber: 'AST-WOMEN-CHILDREN',
    keyPoints: [
      'Dokumentation rechtswidriger Festnahmen von Wöchnerinnen direkt in Geburtskliniken unter Missachtung von Art. 16 des Gesetzes 5275.',
      'Über 500 Kinder unter sechs Jahren wachsen in überfüllten Hafträumen ohne kindgerechte Betreuung auf.',
      'Verweigerung humanitärer Haftverschonung für chronisch und unheilbar kranke Frauen.',
      'Aufruf an internationale Hilfsorganisationen zur Entsendung unabhängiger Beobachter.'
    ],
    relevance: 'Sensibilisiert mit eindringlichen Fallstudien für die humanitäre Dringlichkeit des Schutzes von Frauen und Kleinkindern im türkischen Gefängnissystem.',
    originalUrl: 'https://silencedturkey.org/',
    badgeColor: 'bg-rose-500/10 text-rose-700 border-rose-200'
  },
  {
    id: 'report-broken-chalk-education',
    title: 'Broken Chalk: Die Zerstörung des Bildungssektors und Verfolgung von Pädagogen',
    institution: 'Broken Chalk (Amsterdam)',
    institutionCategory: 'ngo',
    year: '2024/2025',
    referenceNumber: 'BC-EDU-TUR-2025',
    keyPoints: [
      'Entlassung von mehr als 33.000 Lehrern und 6.000 Universitätsprofessoren ohne individuelles Fehlverhalten.',
      'Schließung und Enteignung von über 1.000 Privatschulen, Nachhilfezentren und 15 renommierten Universitäten.',
      'Lebenslange Entziehung der Unterrichtserlaubnis und Verweigerung von Berufsabschlüssen für Absolventen.',
      'Gravierende Verletzung des universellen Rechts auf Bildung (Art. 26 AEMR) und der akademischen Lehrfreiheit.'
    ],
    relevance: 'Beweist die systematische Vernichtung des Bildungswesens und die Kriminalisierung einer gesamten Generation von Pädagogen.',
    originalUrl: 'https://brokenchalk.org/',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
  },
  {
    id: 'report-hrd-trials-monitor',
    title: 'Human Rights Defenders e.V. (HRD): Justizbeobachtung und Prozessanalysen',
    institution: 'Human Rights Defenders e.V.',
    institutionCategory: 'ngo',
    year: '2024/2025',
    referenceNumber: 'HRD-JUSTICE-2025',
    keyPoints: [
      'Systematische Missachtung der Waffengleichheit vor türkischen Schweren Strafgerichten.',
      'Verwendung standardisierter Schuldformeln per Copy-Paste ohne richterliche Beweiswürdigung.',
      'Einschüchterung von Pflichtverteidigern durch Einleitung strafrechtlicher Ermittlungen gegen Anwälte.',
      'Erstellung praxisnaher juristischer Leitfäden für Revisionsverfahren vor dem EGMR.'
    ],
    relevance: 'Liefert fundierte juristische Prozessbeobachtungen aus der europäischen Zivilgesellschaft heraus.',
    originalUrl: 'https://humanrights-ev.com/',
    badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200'
  }
];

// -------------------------------------------------------------
// 3. INFOGRAFIKEN (4 Kernthemen mit Fakten & Quellen)
// -------------------------------------------------------------
export const justiceInfographicsData: InfographicSection[] = [
  {
    id: 'infografik-massenjustiz',
    title: 'Massenverfahren, Antiterrorgesetze & Gefängnisüberbelegung',
    shortTitle: 'Massenverfahren & Justiz',
    description: 'Statistische Aufschlüsselung der seit 2016 eingeleiteten Ermittlungsverfahren, Festnahmen und Verurteilungen nach Art. 314 des türkischen Strafgesetzbuchs (TCK).',
    keyMetrics: [
      {
        label: 'Amtliche Ermittlungsverfahren',
        value: '> 332.000',
        numericValue: 332000,
        subtext: 'Verfahren wegen mutmaßlicher Gülen-Verbindungen (offizielle Angaben des Justizministeriums)',
        source: 'Türkisches Justizministerium'
      },
      {
        label: 'Verurteilungen wegen Terrorismus',
        value: '> 117.000',
        numericValue: 117000,
        subtext: 'Rechtskräftige oder erstinstanzliche Schuldsprüche, meist basierend auf ByLock oder Bankkonten',
        source: 'Justizstatistik Ankara / SCF'
      },
      {
        label: 'EGMR-Votum (Yalçınkaya)',
        value: '17 : 0',
        subtext: 'Einstimmiges Urteil der Großen Kammer: Verurteilungen verletzen Art. 7 & Art. 6 EMRK',
        source: 'Europäischer Gerichtshof für Menschenrechte (EGMR)'
      },
      {
        label: 'Gefängnisauslastung',
        value: '135 %',
        numericValue: 135,
        subtext: 'Dramatische Überbelegung der Haftanstalten; Häftlinge schlafen im Schichtbetrieb auf Böden',
        source: 'CPT Europarat / CİSST'
      }
    ],
    chartData: [
      { name: 'Amtlich Ermittelte', value: 332, formatted: '332.000', note: 'Offiziell registriert' },
      { name: 'U-Haft / Festnahmen', value: 160, formatted: '160.000', note: 'Freiheitsentzug' },
      { name: 'Schuldsprüche Art. 314', value: 117, formatted: '117.000', note: 'Rechtskräftig/1. Instanz' },
      { name: 'Anhängig beim EGMR', value: 25, formatted: '25.000+', note: 'Wartend auf Yalçınkaya-Urteil' }
    ],
    detailedFindings: [
      'Der Europäische Gerichtshof für Menschenrechte stellte im Fall Yalçınkaya (2023) fest, dass die pauschale Nutzung digitaler Indizien das Rückwirkungsverbot (Nulla poena sine lege) verletzt.',
      'Die Einstufung von Standardkonten bei der Bank Asya oder der Besuch von Privatschulen als Terrorbeweis widerspricht fundamentalen rechtsstaatlichen Grundsätzen.',
      'Das Europäische Komitee zur Verhütung von Folter (CPT) rügt anhaltende Missstände und Überbelegungen in den türkischen Strafvollzugsanstalten.'
    ],
    officialSources: [
      { name: 'EGMR HUDOC Datenbank (Urteil Yalçınkaya)', url: 'https://hudoc.echr.coe.int/eng?i=001-227448' },
      { name: 'Europarat Ministerkomitee Resolutionen', url: 'https://www.coe.int' },
      { name: 'Stockholm Center for Freedom Justizmonitoring', url: 'https://stockholmcf.org/' }
    ]
  },
  {
    id: 'infografik-khk-dekrete',
    title: 'Notstandsdekrete (KHK): Anatomie des „zivilen Todes“',
    shortTitle: 'KHK-Dekrete & Entlassungen',
    description: 'Mehr als 150.000 Beamte, Richter, Professoren und Polizisten wurden ohne Einzelfallprüfung per Dekret entlassen und ihrer bürgerlichen Existenz beraubt.',
    keyMetrics: [
      {
        label: 'Per Dekret Entlassene',
        value: '> 150.000',
        numericValue: 150000,
        subtext: 'Massenentlassungen aus dem gesamten öffentlichen Dienst per Notstandsverordnung',
        source: 'Solidarity with OTHERS / KHK-Kommission'
      },
      {
        label: 'Geschlossene Institutionen',
        value: '> 4.000',
        numericValue: 4000,
        subtext: 'Schulen, Universitäten, Krankenhäuser, Verlage und zivilgesellschaftliche Vereine liquidiert',
        source: 'Amtsblatt der Republik Türkei (Resmî Gazete)'
      },
      {
        label: 'Entlassene Richter & Staatsanwälte',
        value: '4.156',
        numericValue: 4156,
        subtext: 'Mehr als ein Drittel der gesamten türkischen Richterschaft wurde unmittelbar abgesetzt',
        source: 'Europäische Richtervereinigung (EAJ)'
      },
      {
        label: 'Passentzug & Reisesperren',
        value: '> 230.000',
        numericValue: 230000,
        subtext: 'Annullierte Reisepässe für Betroffene und Familienangehörige (Sippenhaft)',
        source: 'Innenministerium Türkei'
      }
    ],
    chartData: [
      { name: 'Bildungssektor (Lehrer/Dozenten)', value: 41, formatted: '41.000+', note: 'Schulen & Unis' },
      { name: 'Polizei & Sicherheitsbehörden', value: 33, formatted: '33.000+', note: 'Beamte' },
      { name: 'Gesundheitswesen (Ärzte/Pfleger)', value: 15, formatted: '15.000+', note: 'Krankenhäuser' },
      { name: 'Justiz (Richter/Staatsanwälte)', value: 4.2, formatted: '4.156', note: 'Rechtspflege' }
    ],
    detailedFindings: [
      'Entlassene wurden mit dem Sperrvermerk „Code 36/37“ in den Datenbanken der Sozialversicherung gebrandmarkt, was Anstellungen im privaten Sektor faktisch unmöglich machte.',
      'Die Notstandsverordnungen sahen die Enteignung privater Altersvorsorgen, Bankguthaben und Immobilien ohne Entschädigung vor.',
      'Viele Betroffene sahen sich gezwungen, unter Lebensgefahr über den Grenzfluss Evros oder das Mittelmeer nach Griechenland zu fliehen.'
    ],
    officialSources: [
      { name: 'Solidarity with OTHERS KHK-Dossier', url: 'https://solidaritywithothers.com/' },
      { name: 'Broken Chalk Bildungsreport', url: 'https://brokenchalk.org/' },
      { name: 'Amnesty International: Purged Beyond Return', url: 'https://www.amnesty.org' }
    ]
  },
  {
    id: 'infografik-transnationale-repression',
    title: 'Transnationale Repression: Globale Jagd auf Dissidenten',
    shortTitle: 'Transnationale Repression',
    description: 'Dokumentation extraterritorialer Entführungen, Erpressung von Drittstaaten und Missbrauch internationaler Rechtsinstrumente durch den türkischen Staat.',
    keyMetrics: [
      {
        label: 'Bestätigte Entführungen',
        value: '> 110',
        numericValue: 110,
        subtext: 'Völkerrechtswidrige Verschleppungen (Renditions) mutmaßlicher Dissidenten in die Türkei',
        source: 'Freedom House / SCF'
      },
      {
        label: 'Betroffene Staaten',
        value: '> 30 Länder',
        numericValue: 30,
        subtext: 'Entführungen aus Staaten in Afrika, Asien, dem Kaukasus und Südosteuropa',
        source: 'UN-Sonderberichterstatter'
      },
      {
        label: 'Interpol-Missbrauch',
        value: 'Tausende',
        subtext: 'Missbräuchlich beantragte Red Notices zur Kriminalisierung politischer Flüchtlinge',
        source: 'Fair Trials / Freedom House'
      },
      {
        label: 'Gefährdete Diaspora',
        value: 'Europa & USA',
        subtext: 'Überwachung, Bedrohungen und Schmutzkampagnen gegen Exil-Gemeinschaften',
        source: 'BAMF / Europäische Verfassungsschutzberichte'
      }
    ],
    chartData: [
      { name: 'Afrika (Kenia, Gabon, Sudan)', value: 45, formatted: '45+ Fälle', note: 'Schulen & Lehrkräfte' },
      { name: 'Zentralasien (Kirgisistan, etc.)', value: 32, formatted: '32 Fälle', note: 'Entführungen' },
      { name: 'Balkan (Kosovo, Moldawien, etc.)', value: 24, formatted: '24 Fälle', note: 'Überstellungen' },
      { name: 'Sonstige Regionen', value: 12, formatted: '12 Fälle', note: 'Geheimdienstzugriff' }
    ],
    detailedFindings: [
      'Prominente Fälle wie die Entführung von Orhan İnandı in Kirgisistan oder der Lehrer im Kosovo führten zu internationalen diplomatischen Verurteilungen.',
      'UN-Sonderberichterstatter qualifizierten diese Praktiken formell als erzwungenes Verschwindenlassen nach Völkerrecht.',
      'Interpol musste in mehreren tausend Fällen türkische Suchanträge wegen politischer Motivation nachträglich löschen.'
    ],
    officialSources: [
      { name: 'Freedom House: Out of Sight, Not Out of Reach', url: 'https://freedomhouse.org/' },
      { name: 'Stockholm Center for Freedom Entführungsdatenbank', url: 'https://stockholmcf.org/' },
      { name: 'UN OHCHR Mandate of the Working Group on Enforced Disappearances', url: 'https://www.ohchr.org' }
    ]
  },
  {
    id: 'infografik-frauen-kinder',
    title: 'Verletzliche Gruppen: Frauen, Mütter & Kleinkinder in Haft',
    shortTitle: 'Frauen & Kinder im Vollzug',
    description: 'Schicksale von Müttern, Neugeborenen und schwer erkrankten Inhaftierten, denen grundlegende humanitäre Schutzrechte verweigert werden.',
    keyMetrics: [
      {
        label: 'Kinder hinter Gittern',
        value: '> 500',
        numericValue: 500,
        subtext: 'Kinder unter 6 Jahren, die gezwungen sind, ihre Entwicklungsjahre in Zellen zu verbringen',
        source: 'Advocates of Silenced Turkey (AST)'
      },
      {
        label: 'Verletzung Art. 16 CGTİHK',
        value: 'Hunderte',
        subtext: 'Gesetzlich vorgeschriebene Haftverschonung für Schwangere & Wöchnerinnen wird ignoriert',
        source: 'Türkische Anwaltskammern'
      },
      {
        label: 'Schwerkranke Häftlinge',
        value: '> 1.500',
        numericValue: 1500,
        subtext: 'Gefangene mit schweren chronischen Erkrankungen; Berichte über verweigerte Behandlungen',
        source: 'İnsan Hakları Derneği (İHD)'
      },
      {
        label: 'Todesfälle in Haft',
        value: '> 100',
        numericValue: 100,
        subtext: 'Verdächtige Todesfälle durch Suizid oder unterlassene medizinische Hilfeleistung seit 2016',
        source: 'Solidarity with OTHERS'
      }
    ],
    chartData: [
      { name: 'Kleinkinder mit Müttern (0-6 J.)', value: 520, formatted: '520 Kinder', note: 'Haftzellen' },
      { name: 'Schwerkranke Gefangene', value: 650, formatted: '650+', note: 'Lebensgefahr' },
      { name: 'Pflegebedürftige Inhaftierte', value: 380, formatted: '380', note: 'Ohne Betreuung' },
      { name: 'Verifizierte Todesfälle in Haft', value: 104, formatted: '104 Opfer', note: 'Seit 2016' }
    ],
    detailedFindings: [
      'Türkische Anwälte dokumentieren wiederholte Festnahmen von Frauen direkt nach der Entbindung in Geburtskliniken.',
      'Säuglinge erhalten oft keine altersspezifische Nahrung oder Spielmöglichkeiten; Hygieneartikel sind Mangelware.',
      'Das Europäische Parlament und internationale Frauenrechte-Netzwerke fordern die sofortige Entlassung betroffener Mütter.'
    ],
    officialSources: [
      { name: 'Advocates of Silenced Turkey Dossier: Women in Prison', url: 'https://silencedturkey.org/' },
      { name: 'Tenkil Memorial Museum Zeitzeugenberichte', url: 'https://tenkilmuseum.com/' },
      { name: 'Solidarity with OTHERS Gefängnis-Todesfallregister', url: 'https://solidaritywithothers.com/' }
    ]
  }
];

export const infographicSections = justiceInfographicsData;

// -------------------------------------------------------------
// 4. MULTIMEDIA (Dokus, Gedenkstätte, Interviews, Erklärvideos)
// -------------------------------------------------------------
export const justiceMultimediaData: MultimediaItem[] = [
  {
    id: 'media-tenkil-museum',
    title: 'Tenkil Memorial Museum: Das digitale Gedächtnis der Säuberungswelle',
    type: 'museum',
    duration: 'Dauerausstellung',
    creator: 'Tenkil Memorial Museum',
    date: '2026',
    description: 'Das Tenkil Memorial Museum bewahrt persönliche Gegenstände, Flucht-Rettungswesten vom Evros, handgeschriebene Gefängnisbriefe und audiovisuelle Zeitzeugenberichte. Ein unverzichtbares Mahnmal gegen das Vergessen und staatliche Willkür.',
    externalUrl: 'https://tenkilmuseum.com/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    embedType: 'link'
  },
  {
    id: 'media-dw-investigativ-mit',
    title: 'DW Investigativ: Gejagt von Erdogans Geheimdienst – Entführungen in Europa & weltweit',
    type: 'documentary',
    duration: '42 Min.',
    creator: 'Deutsche Welle (DW)',
    date: '2024',
    description: 'Investigative Reporter verfolgen die Spuren türkischer Geheimdienstoperationen. Zeitzeugen und Völkerrechtler berichten über Entführungen am helllichten Tag und die Missachtung internationaler Souveränität.',
    externalUrl: 'https://www.dw.com/de/themen/s-9077',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    embedType: 'youtube'
  },
  {
    id: 'media-interview-yalcinkaya',
    title: 'Experteninterview: Das EGMR-Urteil Yalçınkaya und die Pflichten des Europarats',
    type: 'interview',
    duration: '28 Min.',
    creator: 'Juristisches Menschenrechtsforum & IJA',
    date: '2024',
    description: 'Internationale Völkerrechtler und Strafverteidiger analysieren die bindende Tragweite des 17:0-Urteils in Straßburg: Warum ByLock und Standard-Bankgeschäfte die Europäische Menschenrechtskonvention verletzen.',
    externalUrl: 'https://internationaljournalists.org/de/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1453733197781-79df9346ffad?auto=format&fit=crop&q=80&w=800',
    embedType: 'youtube'
  },
  {
    id: 'media-explainer-khk',
    title: 'Erklärvideo: Was bedeuten die KHK-Dekrete? Anatomie eines zivilen Todes',
    type: 'explainer',
    duration: '11 Min.',
    creator: 'Solidarity with OTHERS & JusticeSquare',
    date: '2025',
    description: 'Ein animiertes Informationsvideo, das präzise schildert, wie Passentzug, Berufsverbote und Stigmatisierung ganze Familien in die Mittellosigkeit und gefährliche Fluchtwege drängen.',
    externalUrl: 'https://solidaritywithothers.com/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    embedType: 'youtube'
  },
  {
    id: 'media-audio-podcast',
    title: 'Menschenrechts-Podcast: Stimmen aus dem Exil – Überleben nach Folter und Flucht',
    type: 'audio',
    duration: '35 Min.',
    creator: 'Human Rights Defenders e.V. Podcast',
    date: '2025',
    description: 'Ein berührendes Zeitzeugengespräch mit einem ehemaligen Richter und einer Lehrerin über ihre Isolationshaft, die lebensgefährliche Überfahrt nach Griechenland und ihren Einsatz für Gerechtigkeit in Deutschland.',
    externalUrl: 'https://humanrights-ev.com/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800',
    embedType: 'external_audio'
  }
];

// -------------------------------------------------------------
// 5. NÜTZLICHE LINKS (Alle 12 maßgeblichen Institutionen)
// -------------------------------------------------------------
export const usefulLinksData: UsefulLinkItem[] = [
  {
    name: 'JusticeSquare.org',
    url: 'https://justicesquare.org/',
    category: 'Dokumentation & Analyse',
    description: 'Zentrale Plattform zur systematischen Dokumentation von Menschenrechtsverletzungen und gerichtlichen Entwicklungen.',
    focusArea: 'Justizmonitoring'
  },
  {
    name: 'Turkish Minute',
    url: 'https://turkishminute.com/',
    category: 'Unabhängige Nachrichten',
    description: 'Führendes englischsprachiges Nachrichten- und Analyseportal exilierter türkischer Qualitätsjournalisten.',
    focusArea: 'Tagesaktuelle Berichte'
  },
  {
    name: 'International Journalists Association e.V.',
    url: 'https://internationaljournalists.org/de/',
    category: 'Journalistenverband',
    description: 'In Deutschland ansässiger Verein zum Schutz verfolgter Medienschaffender und zur Stärkung der Pressefreiheit.',
    focusArea: 'Pressefreiheit & Exil'
  },
  {
    name: 'Human Rights Watch (Türkei-Dossier)',
    url: 'https://www.hrw.org/world-report/2025/country-chapters/turkiye',
    category: 'Internationale NGO',
    description: 'Weltweit renommierte Menschenrechtsorganisation mit regelmäßigen Länderberichten zu Folter, Haft und Justizwillkür.',
    focusArea: 'World Report & Studien'
  },
  {
    name: 'Stockholm Center for Freedom (SCF)',
    url: 'https://stockholmcf.org/',
    category: 'Monitoring & Research',
    description: 'Schwedische Nichtregierungsorganisation zur Erfassung von Entführungen, Folterfällen und Rechtsstaatsabbau.',
    focusArea: 'Primärdokumente & Daten'
  },
  {
    name: 'Solidarity with OTHERS',
    url: 'https://solidaritywithothers.com/',
    category: 'Rechtshilfe & Monitoring',
    description: 'Europäische Initiative zur Erfassung von KHK-Dekretfolgen, Todesfällen in Haft und Gefängnisüberwachung.',
    focusArea: 'KHK-Opfer & Datenbanken'
  },
  {
    name: 'UN Human Rights Office (OHCHR)',
    url: 'https://www.ohchr.org/en/countries/turkiye',
    category: 'Vereinte Nationen',
    description: 'Offizielles Länderportal des UN-Hochkommissariats für Menschenrechte mit Beschlüssen und Sonderberichterstatter-Notizen.',
    focusArea: 'UN-Konventionen'
  },
  {
    name: 'Freedom House',
    url: 'https://freedomhouse.org/',
    category: 'Demokratieforschung',
    description: 'Führendes Institut zur Erforschung globaler Freiheit und transnationaler Repression autoritärer Regime.',
    focusArea: 'Transnationale Repression'
  },
  {
    name: 'Human Rights Defenders e.V. (HRD)',
    url: 'https://humanrights-ev.com/',
    category: 'Menschenrechtsverein',
    description: 'Deutsche Organisation zur Prozessbeobachtung, Unterstützung politischer Häftlinge und Erstellung juristischer Gutachten.',
    focusArea: 'Prozessbeobachtung'
  },
  {
    name: 'Broken Chalk',
    url: 'https://brokenchalk.org/',
    category: 'Bildungsrechte',
    description: 'In Amsterdam ansässige NGO zur weltweiten Verteidigung von Bildungsrechten und verfolgten Pädagogen.',
    focusArea: 'Schutz von Lehrkräften'
  },
  {
    name: 'Advocates of Silenced Turkey (AST)',
    url: 'https://silencedturkey.org/',
    category: 'Rechtshilfe & Advocacy',
    description: 'US-amerikanische NGO zur Dokumentation von Schicksalen von Frauen, Kleinkindern und politischen Häftlingen.',
    focusArea: 'Frauen & Kinder im Vollzug'
  },
  {
    name: 'Tenkil Memorial Museum',
    url: 'https://tenkilmuseum.com/',
    category: 'Gedenkstätte & Museum',
    description: 'Digitales Mahnmal zur Bewahrung von Erinnerungsstücken, Fluchtgegenständen und Zeitzeugenberichten der Betroffenen.',
    focusArea: 'Gedenkkultur & Mahnmal'
  },
  {
    name: 'EGMR HUDOC Falldatenbank',
    url: 'https://hudoc.echr.coe.int/',
    category: 'Gerichtshof des Europarates',
    description: 'Amtliche Volltextdatenbank aller Urteile des Europäischen Gerichtshofs für Menschenrechte (inkl. Yalçınkaya v. Turkey).',
    focusArea: 'Bindende Rechtsprechung'
  },
  {
    name: 'Deutsche Welle Menschenrechte',
    url: 'https://www.dw.com/de/themen/s-9077',
    category: 'Öffentlicher Rundfunk',
    description: 'Unabhängiger deutscher Auslandssender mit tiefgründiger Berichterstattung zu Menschenrechten und Rechtsstaat.',
    focusArea: 'Investigativer Journalismus'
  }
];

export const feedMetadata = justiceFeedsRaw?.metadata || {
  title: 'JusticeSquare – Dokumentation von Menschenrechtsverletzungen gegen die Gülen-Bewegung',
  lastUpdated: new Date().toISOString(),
  lastUpdatedFormatted: 'Aktuell synchronisiert',
  version: '2.0',
  totalEntries: justiceNewsData.length + justiceReportsData.length
};