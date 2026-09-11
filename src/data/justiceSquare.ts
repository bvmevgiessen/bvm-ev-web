/**
 * JusticeSquare – Typen, statische Ressourcen & Feed-Fallback.
 *
 * Die dynamischen Inhalte (News, Reports, Infografiken, Multimedia) stammen aus
 * `public/data/justice_feeds.json`, das vom automatisierten Workflow
 * (`scripts/fetch_justice_feeds.py`) erzeugt wird. Zur Laufzeit lädt die Seite
 * diese Datei; schlägt der Abruf fehl, wird der hier importierte Build-Fallback
 * verwendet.
 *
 * Redaktionelle Leitlinie: neutral, faktenbasiert, nur Kurz-Zusammenfassungen
 * (kein Volltext), Quelle stets sichtbar, Fokus auf Menschenrechtsverletzungen
 * gegen die Gülen-/Hizmet-Bewegung.
 */
import fallbackFeeds from './justice_feeds.json';

export type NewsCategory = 'Internationale Medien' | 'Exil-Medien' | 'Gerichtsurteil';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  category: NewsCategory | string;
  summary: string;
  url: string;
}

export interface ReportItem {
  id: string;
  title: string;
  institution: string;
  date: string;
  summary: string;
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

export interface MediaItem {
  id: string;
  title: string;
  type: string;
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

export interface JusticeFeeds {
  generatedAt: string;
  lastUpdated: { news: string; reports: string; infographics: string; multimedia: string };
  news: NewsItem[];
  reports: ReportItem[];
  infographics: InfographicDataset[];
  multimedia: MediaItem[];
}

export const FEEDS_FALLBACK = fallbackFeeds as unknown as JusticeFeeds;

/* Öffentlicher Pfad der dynamischen Feed-Datei (wöchentlich/monatlich aktualisiert). */
export const FEEDS_URL = `${import.meta.env.BASE_URL}data/justice_feeds.json`;

/* ------------------------------------------------------------------ */
/* Statische Ressourcen                                               */
/* ------------------------------------------------------------------ */
export const usefulLinks: UsefulLink[] = [
  { id: 'ul-hrw', name: 'Human Rights Watch', description: 'Internationale NGO', url: 'https://www.hrw.org/' },
  { id: 'ul-ohchr', name: 'UN Human Rights Office', description: 'OHCHR', url: 'https://www.ohchr.org/' },
  { id: 'ul-unhcr', name: 'UNHCR', description: 'UN-Flüchtlingshilfswerk', url: 'https://www.unhcr.org/' },
  { id: 'ul-freedomhouse', name: 'Freedom House', description: 'Demokratie-Index', url: 'https://freedomhouse.org/' },
  { id: 'ul-ecthr', name: 'European Court of Human Rights', description: 'EGMR', url: 'https://www.echr.coe.int/' },
  { id: 'ul-trm', name: 'Turkey Rights Monitor', description: 'Monitoring-Datenbank', url: 'https://www.turkeyrightsmonitor.com/en/reports' },
  { id: 'ul-scf', name: 'Stockholm Center for Freedom', description: 'Exil-Medium', url: 'https://stockholmcf.org/news/' },
  { id: 'ul-dw', name: 'Deutsche Welle – Menschenrechte', description: 'Ressort Menschenrechte', url: 'https://www.dw.com/de/themen/menschenrechte/s-100816' },
  { id: 'ul-tr724', name: 'TR724', description: 'Exil-Medium', url: 'https://www.tr724.com/' },
  { id: 'ul-boldmedya', name: 'Bold Medya', description: 'Exil-Medium', url: 'https://boldmedya.com/' },
  { id: 'ul-hudoc', name: 'ECtHR Case Law (HUDOC)', description: 'Urteilsdatenbank', url: 'https://hudoc.echr.coe.int/' },
  { id: 'ul-trm-echr', name: 'Turkey Rights Monitor – ECHR', description: 'EGMR-Falldatenbank', url: 'https://database.turkeyrightsmonitor.com/en/echr/' },
  { id: 'ul-silenced', name: 'Silenced Turkey', description: 'NGO / Fallsammlung', url: 'https://silencedturkey.org/' },
  { id: 'ul-ija', name: 'International Journalists', description: 'Presse & Berichte', url: 'https://internationaljournalists.org/de/berichte/' },
];

export const heroStats = [
  { id: 'stat-arrests', value: '> 332.000', label: 'Festnahmen seit 2016 – amtlich erfasste Ermittlungsverfahren' },
  { id: 'stat-khk', value: '> 150.000', label: 'KHK-Entlassungen – Lehrer, Richter, Beamte per Dekret entlassen' },
  { id: 'stat-ecthr', value: '17 : 0', label: 'EGMR Große Kammer – Einstimmiges Yalçınkaya-Urteil (Art. 7 EMRK)' },
  { id: 'stat-renditions', value: '> 30 Staaten', label: 'Transnationale Entführungen – dokumentiert durch UN & Freedom House' },
];
