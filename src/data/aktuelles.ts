/**
 * Aktuelles – Typen & Feed-Loader.
 * Lädt zur Laufzeit `public/data/aktuelles_feeds.json`; Fallback ist der
 * gebündelte Build-Import. Wird vom monatlichen Workflow aktualisiert.
 */
import fallback from './aktuelles_feeds.json';

export interface Person { name: string; role: string; }

export interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  image: string;
  location?: string;
  shortText: string;
  highlights: string[];
  speech: string;
  persons: Person[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
  description: string;
  link: string;
}

export interface BlogItem {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  excerpt: string;
  link: string;
}

export interface AktuellesFeeds {
  generatedAt: string;
  lastUpdated: { news: string; events: string; blogs: string };
  news: NewsItem[];
  events: EventItem[];
  blogs: BlogItem[];
}

export const AKTUELLES_FALLBACK = fallback as unknown as AktuellesFeeds;
export const AKTUELLES_URL = `${import.meta.env.BASE_URL}data/aktuelles_feeds.json`;

export function formatDate(iso?: string) {
  if (!iso) return '–';
  try {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '–';
  }
}

import { useEffect, useState } from 'react';

/** Lädt die Feeds zur Laufzeit, mit gebündeltem Fallback. */
export function useAktuelles(): AktuellesFeeds {
  const [feeds, setFeeds] = useState<AktuellesFeeds>(AKTUELLES_FALLBACK);
  useEffect(() => {
    let active = true;
    fetch(AKTUELLES_URL, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: AktuellesFeeds) => {
        if (active && d && Array.isArray(d.news)) setFeeds(d);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return feeds;
}
