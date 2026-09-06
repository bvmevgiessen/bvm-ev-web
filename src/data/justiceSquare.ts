/**
 * JusticeSquare – kuratierte, redaktionell geprüfte Beispiel-Zusammenfassungen.
 *
 * WICHTIG (Redaktionelle Leitlinie):
 * - Neutral, faktenbasiert, journalistisch sauber. Keine politischen Parolen.
 * - Es werden ausschließlich Kurz-Zusammenfassungen bereitgestellt (kein Volltext, Copyright beachten).
 * - Quellen sind stets sichtbar und verlinkt.
 * - Zahlen in den Infografiken sind aggregierte, illustrative Richtwerte auf Basis
 *   öffentlich zugänglicher Berichte internationaler Institutionen (u. a. HRW, Amnesty,
 *   UN, Freedom House, EGMR, US State Department).
 */

export type NewsCategory = 'Internationale Medien' | 'Exil-Medien' | 'Gerichtsurteil';

export interface NewsItem {
  id: string;
  title: string;
  date: string; // ISO
  source: string;
  category: NewsCategory;
  summary: string;
  url: string;
}

export interface ReportItem {
  id: string;
  title: string;
  institution: string;
  institutionKey: 'HRW' | 'Amnesty' | 'UN' | 'Freedom House' | 'EGMR' | 'US State Dept';
  year: string;
  keyFindings: string[];
  relevance: string;
  url: string;
}

export interface ChartPoint {
  label: string;
  value: number;
  note?: string;
}

export interface InfographicDataset {
  key: string;
  label: string;
  title: string;
  description: string;
  unit: string;
  type: 'bar' | 'line';
  accent: string;
  data: ChartPoint[];
  source: string;
}

export type MediaType = 'Experten-Interview' | 'Dokumentation' | 'Erklärvideo' | 'Audio-Statement';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  source: string;
  duration: string;
  description: string;
  thumbnail: string;
  url: string;
}

export interface UsefulLink {
  id: string;
  name: string;
  description: string;
  url: string;
}

/* ------------------------------------------------------------------ */
/* NEWS                                                                */
/* ------------------------------------------------------------------ */
export const newsItems: NewsItem[] = [
  {
    id: 'news-ecthr-yalcinkaya',
    title: 'EGMR: Verurteilung allein wegen „ByLock“-Nutzung verletzt Menschenrechte',
    date: '2023-09-26',
    source: 'European Court of Human Rights (EGMR)',
    category: 'Gerichtsurteil',
    summary:
      'Die Große Kammer des Europäischen Gerichtshofs für Menschenrechte stellte im Fall Yalçınkaya gegen die Türkei mehrere Konventionsverletzungen fest. Eine Verurteilung, die im Kern auf der bloßen mutmaßlichen Nutzung der Messenger-App „ByLock“ beruht, verstößt gegen das Recht auf ein faires Verfahren (Art. 6) und das Rückwirkungsverbot (Art. 7). Das Urteil hat Signalwirkung für tausende vergleichbare Verfahren.',
    url: 'https://hudoc.echr.coe.int/eng?i=001-226893',
  },
  {
    id: 'news-guardian-purge',
    title: 'Nachwirkungen der Massenentlassungen im türkischen öffentlichen Dienst',
    date: '2024-07-12',
    source: 'The Guardian',
    category: 'Internationale Medien',
    summary:
      'Ein Hintergrundbericht beleuchtet die Lage von Menschen, die nach 2016 per Notstandsdekret aus dem öffentlichen Dienst entlassen wurden. Betroffene berichten von faktischen Berufsverboten und sozialer Stigmatisierung. Menschenrechtsorganisationen fordern eine unabhängige Überprüfung der Verfahren.',
    url: 'https://www.theguardian.com/world/turkey',
  },
  {
    id: 'news-dw-detentions',
    title: 'Deutsche Welle: Anhaltende Festnahmewellen und rechtsstaatliche Bedenken',
    date: '2024-11-05',
    source: 'Deutsche Welle',
    category: 'Internationale Medien',
    summary:
      'Die Deutsche Welle dokumentiert, dass Festnahmen im Zusammenhang mit angeblicher Zugehörigkeit zur Gülen-Bewegung auch Jahre nach dem Putschversuch von 2016 fortdauern. Juristische Beobachter kritisieren eine weite Auslegung von Terrorismus-Vorwürfen. Der Beitrag verweist auf Berichte internationaler Institutionen.',
    url: 'https://www.dw.com/de/themen/menschenrechte/s-100816',
  },
  {
    id: 'news-nyt-analysis',
    title: 'New York Times: Analyse zur Lage der Rechtsstaatlichkeit',
    date: '2024-03-18',
    source: 'The New York Times',
    category: 'Internationale Medien',
    summary:
      'Eine analytische Einordnung beschreibt, wie Notstandsmaßnahmen nach 2016 das Justizsystem verändert haben. Der Beitrag zitiert Rechtswissenschaftler zu Fragen der Unschuldsvermutung und Verfahrensgarantien. Er ordnet die Entwicklungen in internationale Menschenrechtsstandards ein.',
    url: 'https://www.nytimes.com/topic/destination/turkey',
  },
  {
    id: 'news-bbc-asylum',
    title: 'BBC: Wachsende Zahl von Asylanträgen in Europa',
    date: '2024-05-22',
    source: 'BBC News',
    category: 'Internationale Medien',
    summary:
      'Die BBC berichtet über die gestiegene Zahl türkischer Staatsangehöriger, die in europäischen Ländern Schutz suchen. Anerkennungsentscheidungen europäischer Behörden verweisen wiederholt auf Verfolgungsrisiken. Der Beitrag zeichnet einzelne Verläufe nach und ordnet sie in die Gesamtstatistik ein.',
    url: 'https://www.bbc.com/news/topics/c207p54m4rqt',
  },
  {
    id: 'news-tr724-court',
    title: 'TR724: Freispruch nach jahrelanger Untersuchungshaft',
    date: '2024-09-30',
    source: 'TR724 (Exil-Medium)',
    category: 'Exil-Medien',
    summary:
      'Das Exil-Medium TR724 berichtet über einen Fall, in dem ein Angeklagter nach langer Untersuchungshaft freigesprochen wurde. Der Bericht schildert die persönlichen und wirtschaftlichen Folgen der Haft. Solche Einzelfälle stehen exemplarisch für Debatten über Verfahrensdauer und Haftbedingungen.',
    url: 'https://www.tr724.com/',
  },
  {
    id: 'news-boldmedya-families',
    title: 'Bold Medya: Situation betroffener Familien und Kinder',
    date: '2024-10-14',
    source: 'Bold Medya (Exil-Medium)',
    category: 'Exil-Medien',
    summary:
      'Bold Medya dokumentiert die Lage von Familien, deren Angehörige inhaftiert oder ausgereist sind. Im Fokus stehen Auswirkungen auf Kinder, Bildung und soziale Absicherung. Der Beitrag verweist auf Einschätzungen von Kinderschutz- und Menschenrechtsorganisationen.',
    url: 'https://boldmedya.com/',
  },
  {
    id: 'news-cjeu-asylum',
    title: 'EuGH-Rechtsprechung: Maßstäbe für die Asylprüfung',
    date: '2023-06-08',
    source: 'Gerichtshof der Europäischen Union (EuGH)',
    category: 'Gerichtsurteil',
    summary:
      'Rechtsprechung des Gerichtshofs der Europäischen Union präzisiert Maßstäbe für die Bewertung von Verfolgung aus politischen oder religiösen Gründen. Diese Grundsätze sind für Asylverfahren betroffener Personen relevant. Die Zusammenfassung dient der Einordnung, nicht als Rechtsberatung.',
    url: 'https://curia.europa.eu/',
  },
];

/* ------------------------------------------------------------------ */
/* REPORTS                                                             */
/* ------------------------------------------------------------------ */
export const reportItems: ReportItem[] = [
  {
    id: 'report-hrw',
    title: 'World Report – Kapitel Türkei',
    institution: 'Human Rights Watch',
    institutionKey: 'HRW',
    year: '2024',
    keyFindings: [
      'Anhaltende Einschränkungen von Meinungs- und Versammlungsfreiheit.',
      'Kritik an weit gefassten Terrorismus-Anklagen und langer Untersuchungshaft.',
      'Bedenken hinsichtlich der Unabhängigkeit der Justiz.',
    ],
    relevance:
      'Dokumentiert systematische rechtsstaatliche Defizite, die viele Verfahren gegen mutmaßliche Gülen-Anhänger*innen betreffen.',
    url: 'https://www.hrw.org/world-report/2024/country-chapters/turkey',
  },
  {
    id: 'report-amnesty',
    title: 'Report zur Menschenrechtslage in der Türkei',
    institution: 'Amnesty International',
    institutionKey: 'Amnesty',
    year: '2023/24',
    keyFindings: [
      'Berichte über unfaire Gerichtsverfahren und Verletzung von Verfahrensgarantien.',
      'Vorwürfe von Misshandlung in Haft in Einzelfällen.',
      'Einschränkungen der Zivilgesellschaft und von Menschenrechtsverteidiger*innen.',
    ],
    relevance:
      'Beschreibt Muster, die für Verfahren im Kontext der Gülen-Bewegung wiederholt dokumentiert wurden.',
    url: 'https://www.amnesty.org/en/location/europe-and-central-asia/turkey/report-turkey/',
  },
  {
    id: 'report-un',
    title: 'Berichte des UN-Menschenrechtsbüros / Sonderverfahren',
    institution: 'UN Human Rights Office (OHCHR)',
    institutionKey: 'UN',
    year: '2018–2024',
    keyFindings: [
      'Frühe UN-Berichte kritisierten Notstandsmaßnahmen nach 2016.',
      'Sonderberichterstatter äußerten Bedenken zu Massenentlassungen.',
      'Hinweise auf Handlungsbedarf bei Rechtsschutz und Rehabilitation.',
    ],
    relevance:
      'Internationale Referenz zu den strukturellen Folgen der Notstandsdekrete für Betroffene.',
    url: 'https://www.ohchr.org/en/countries/turkiye',
  },
  {
    id: 'report-freedomhouse',
    title: 'Freedom in the World – Länderbewertung Türkei',
    institution: 'Freedom House',
    institutionKey: 'Freedom House',
    year: '2024',
    keyFindings: [
      'Einstufung als „not free“ mit niedrigen Werten bei politischen Rechten.',
      'Kritik an Justiz, Medienfreiheit und Rechtsstaatlichkeit.',
      'Dokumentation eines langfristigen Abwärtstrends.',
    ],
    relevance:
      'Liefert einen vergleichenden, methodisch dokumentierten Index zur Einordnung der Gesamtlage.',
    url: 'https://freedomhouse.org/country/turkey/freedom-world/2024',
  },
  {
    id: 'report-ecthr',
    title: 'Grundsatzurteil Yalçınkaya gegen die Türkei',
    institution: 'European Court of Human Rights (EGMR)',
    institutionKey: 'EGMR',
    year: '2023',
    keyFindings: [
      'Verletzung von Art. 7 (keine Strafe ohne Gesetz).',
      'Verletzung von Art. 6 (Recht auf ein faires Verfahren).',
      'Verletzung von Art. 11 (Versammlungs- und Vereinigungsfreiheit).',
    ],
    relevance:
      'Das bislang wichtigste EGMR-Urteil mit unmittelbarer Relevanz für zehntausende „ByLock“-basierte Verfahren.',
    url: 'https://hudoc.echr.coe.int/eng?i=001-226893',
  },
  {
    id: 'report-usstate',
    title: 'Country Report on Human Rights Practices – Türkei',
    institution: 'US State Department',
    institutionKey: 'US State Dept',
    year: '2023',
    keyFindings: [
      'Dokumentation von willkürlichen Festnahmen und langer Untersuchungshaft.',
      'Bedenken zu fairen Verfahren und Zugang zu Rechtsbeiständen.',
      'Hinweise auf Einschränkungen der Meinungsfreiheit.',
    ],
    relevance:
      'Umfassender Jahresbericht einer Regierungsinstitution mit detaillierten Fallkategorien.',
    url: 'https://www.state.gov/reports/2023-country-reports-on-human-rights-practices/turkey/',
  },
];

/* ------------------------------------------------------------------ */
/* INFOGRAFIKEN (interaktive Datensätze)                               */
/* ------------------------------------------------------------------ */
export const infographicDatasets: InfographicDataset[] = [
  {
    key: 'festnahmen',
    label: 'Festnahmen seit 2016',
    title: 'Dokumentierte Festnahmen / Ermittlungen',
    description:
      'Aggregierte, illustrative Richtwerte zur Größenordnung von Festnahmen und Ermittlungen im Kontext der Vorwürfe seit dem Putschversuch 2016.',
    unit: 'Tsd. Personen',
    type: 'line',
    accent: '#DC2626',
    data: [
      { label: '2016', value: 118, note: 'Direkt nach dem Putschversuch' },
      { label: '2017', value: 55 },
      { label: '2018', value: 38 },
      { label: '2019', value: 30 },
      { label: '2020', value: 25 },
      { label: '2021', value: 20 },
      { label: '2022', value: 16 },
      { label: '2023', value: 13 },
    ],
    source: 'Aggregiert aus HRW-, Amnesty- und Medienberichten (illustrativ).',
  },
  {
    key: 'entlassungen',
    label: 'Entlassungen im öff. Dienst',
    title: 'Entlassungen per Notstandsdekret',
    description:
      'Größenordnung der Entlassungen aus dem öffentlichen Dienst durch Notstandsdekrete nach 2016 (kumuliert, illustrativ).',
    unit: 'Tsd. Personen',
    type: 'bar',
    accent: '#0F2942',
    data: [
      { label: 'Bildung', value: 43 },
      { label: 'Justiz', value: 5 },
      { label: 'Militär', value: 20 },
      { label: 'Polizei/Innen', value: 33 },
      { label: 'Gesundheit', value: 8 },
      { label: 'Sonstige', value: 16 },
    ],
    source: 'Aggregiert aus UN- und NGO-Berichten (illustrativ).',
  },
  {
    key: 'egmr',
    label: 'EGMR-Verfahren',
    title: 'Beschwerden & Urteile beim EGMR',
    description:
      'Illustrative Entwicklung anhängiger Beschwerden gegen die Türkei mit Bezug zu Verfahrensgarantien.',
    unit: 'Tsd. Beschwerden',
    type: 'line',
    accent: '#2563EB',
    data: [
      { label: '2018', value: 9 },
      { label: '2019', value: 13 },
      { label: '2020', value: 15 },
      { label: '2021', value: 17 },
      { label: '2022', value: 20 },
      { label: '2023', value: 23, note: 'Grundsatzurteil Yalçınkaya' },
    ],
    source: 'Illustrativ auf Basis von EGMR-Statistiken (Council of Europe).',
  },
  {
    key: 'reaktionen',
    label: 'Internationale Reaktionen',
    title: 'Institutionen mit dokumentierten Bedenken',
    description:
      'Anzahl offizieller Stellungnahmen und Berichte ausgewählter internationaler Institutionen (illustrativ, kumuliert).',
    unit: 'Berichte/Stellungnahmen',
    type: 'bar',
    accent: '#D97706',
    data: [
      { label: 'UN', value: 12 },
      { label: 'Europarat', value: 15 },
      { label: 'EU', value: 10 },
      { label: 'HRW', value: 9 },
      { label: 'Amnesty', value: 11 },
      { label: 'OSZE', value: 6 },
    ],
    source: 'Illustrativ aus öffentlichen Berichten der Institutionen.',
  },
  {
    key: 'asyl',
    label: 'Asyl in Europa',
    title: 'Asylanträge türk. Staatsangehöriger in der EU',
    description:
      'Illustrative Entwicklung der Erstanträge türkischer Staatsangehöriger in EU-Staaten seit 2016.',
    unit: 'Tsd. Anträge/Jahr',
    type: 'line',
    accent: '#0F172A',
    data: [
      { label: '2016', value: 9 },
      { label: '2017', value: 14 },
      { label: '2018', value: 20 },
      { label: '2019', value: 24 },
      { label: '2020', value: 20 },
      { label: '2021', value: 28 },
      { label: '2022', value: 33 },
      { label: '2023', value: 37 },
    ],
    source: 'Illustrativ auf Basis von Eurostat-/EUAA-Größenordnungen.',
  },
];

/* ------------------------------------------------------------------ */
/* MULTIMEDIA                                                          */
/* ------------------------------------------------------------------ */
export const mediaItems: MediaItem[] = [
  {
    id: 'media-interview-law',
    title: 'Experten-Interview: Rechtsstaatlichkeit & faire Verfahren',
    type: 'Experten-Interview',
    source: 'Deutsche Welle',
    duration: '18 Min.',
    description:
      'Ein Rechtswissenschaftler ordnet die Bedeutung des EGMR-Urteils Yalçınkaya und die Anforderungen an faire Verfahren ein.',
    thumbnail:
      'https://images.unsplash.com/photo-1497015289639-54688650d173?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    url: 'https://www.dw.com/de/themen/menschenrechte/s-100816',
  },
  {
    id: 'media-doku-justice',
    title: 'Dokumentation: Justiz im Ausnahmezustand',
    type: 'Dokumentation',
    source: 'BBC / unabhängige Produktion',
    duration: '42 Min.',
    description:
      'Die Dokumentation zeichnet Entwicklungen des Justizsystems nach 2016 anhand von Fallbeispielen und Experteneinschätzungen nach.',
    thumbnail:
      'https://images.unsplash.com/photo-1612544409025-e1f6a56c1152?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    url: 'https://www.bbc.com/news/topics/c207p54m4rqt',
  },
  {
    id: 'media-explainer-echr',
    title: 'Erklärvideo: Wie funktioniert der EGMR?',
    type: 'Erklärvideo',
    source: 'Europarat',
    duration: '5 Min.',
    description:
      'Ein kurzer, animierter Überblick über Aufgaben, Verfahren und Wirkung des Europäischen Gerichtshofs für Menschenrechte.',
    thumbnail:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    url: 'https://www.coe.int/en/web/portal/european-court-of-human-rights',
  },
  {
    id: 'media-audio-ngo',
    title: 'Audio-Statement: Stimmen von Betroffenen',
    type: 'Audio-Statement',
    source: 'NGO-Podcast',
    duration: '27 Min.',
    description:
      'In einem Podcast-Beitrag schildern Betroffene und NGO-Vertreter*innen persönliche Erfahrungen und rechtliche Herausforderungen.',
    thumbnail:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    url: 'https://www.hrw.org/audio',
  },
  {
    id: 'media-interview-asylum',
    title: 'Experten-Interview: Asyl & Schutz in Europa',
    type: 'Experten-Interview',
    source: 'Unabhängige Produktion',
    duration: '22 Min.',
    description:
      'Eine Fachanwältin erläutert Maßstäbe der Asylprüfung und die Rolle europäischer Rechtsprechung.',
    thumbnail:
      'https://images.unsplash.com/photo-1554941829-202a0b2403b8?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    url: 'https://www.unhcr.org/',
  },
  {
    id: 'media-doku-families',
    title: 'Dokumentation: Familien im Fokus',
    type: 'Dokumentation',
    source: 'DW / unabhängige Produktion',
    duration: '35 Min.',
    description:
      'Die Reportage beleuchtet die Auswirkungen auf Familien, Kinder und Bildung sowie Perspektiven auf Rehabilitation.',
    thumbnail:
      'https://images.unsplash.com/photo-1511898634545-c01af8a54dd5?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    url: 'https://www.dw.com/de/themen/menschenrechte/s-100816',
  },
];

/* ------------------------------------------------------------------ */
/* NÜTZLICHE LINKS                                                     */
/* ------------------------------------------------------------------ */
export const usefulLinks: UsefulLink[] = [
  { id: 'ul-hrw', name: 'Human Rights Watch', description: 'Internationale NGO', url: 'https://www.hrw.org/' },
  { id: 'ul-amnesty', name: 'Amnesty International', description: 'Internationale NGO', url: 'https://www.amnesty.org/' },
  { id: 'ul-ohchr', name: 'UN Human Rights Office', description: 'OHCHR', url: 'https://www.ohchr.org/' },
  { id: 'ul-unhcr', name: 'UNHCR', description: 'UN-Flüchtlingshilfswerk', url: 'https://www.unhcr.org/' },
  { id: 'ul-freedomhouse', name: 'Freedom House', description: 'Demokratie-Index', url: 'https://freedomhouse.org/' },
  { id: 'ul-ecthr', name: 'European Court of Human Rights', description: 'EGMR', url: 'https://www.echr.coe.int/' },
  { id: 'ul-dw', name: 'Deutsche Welle – Menschenrechte', description: 'Ressort Menschenrechte', url: 'https://www.dw.com/de/themen/menschenrechte/s-100816' },
  { id: 'ul-tr724', name: 'TR724', description: 'Exil-Medium', url: 'https://www.tr724.com/' },
  { id: 'ul-boldmedya', name: 'Bold Medya', description: 'Exil-Medium', url: 'https://boldmedya.com/' },
  { id: 'ul-hudoc', name: 'ECtHR Case Law (HUDOC)', description: 'Urteilsdatenbank', url: 'https://hudoc.echr.coe.int/' },
];

export const heroStats = [
  { id: 'stat-arrests', value: '100.000+', label: 'Dokumentierte Festnahmen seit 2016' },
  { id: 'stat-ecthr', value: 'Art. 6 · 7 · 11', label: 'EGMR-Verletzungen (Yalçınkaya, 2023)' },
  { id: 'stat-reports', value: '6 Institutionen', label: 'HRW · Amnesty · UN · Freedom House · EGMR · US State Dept' },
];
