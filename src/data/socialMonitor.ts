/**
 * JusticeSquare Social Monitor – Datenmodelle, statische Konfiguration & Fallback-Feed.
 *
 * Aggregiert tagesaktuelle Social-Media-Beiträge ausgewählter X- (ehemals Twitter)
 * und Instagram-Accounts, die Menschenrechtsverletzungen gegen Mitglieder
 * der Gülen-Bewegung dokumentieren.
 */

import fallbackPostsData from './social_posts.json';
import socialConfigData from './social_monitor_config.json';

export type SocialPlatform = 'x' | 'instagram' | 'all';

export interface SocialMetrics {
  reposts?: number;
  likes?: number;
  replies?: number;
  views?: number;
}

export interface SocialPost {
  id: string;
  platform: 'x' | 'instagram';
  accountId: string;
  authorName: string;
  handle: string;
  authorAvatar?: string;
  authorProfileUrl: string;
  url: string;
  publishedAt: string;
  text: string;
  textDe?: string;
  mediaType?: 'image' | 'video' | 'none';
  thumbnailUrl?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  metrics?: SocialMetrics;
  tags?: string[];
}

export interface SocialAccountConfig {
  id: string;
  name: string;
  handleX: string;
  handleInstagram: string;
  profileUrlX: string;
  profileUrlInstagram: string;
  avatar: string;
  category: string;
  focus: string;
}

export interface SocialFeedPayload {
  lastUpdated: string;
  fetchInterval: string;
  cacheTtlHours: number;
  totalPosts: number;
  accountsCount: number;
  posts: SocialPost[];
}

export interface SocialMonitorConfig {
  title: string;
  description: string;
  fetchInterval: string;
  scheduleCron: string;
  cacheTtlHours: number;
  postsPerAccount: number;
  maxTotalPosts: number;
  supportedPlatforms: string[];
  accounts: SocialAccountConfig[];
}

export const SOCIAL_MONITOR_CONFIG: SocialMonitorConfig = socialConfigData as SocialMonitorConfig;

export const FALLBACK_SOCIAL_FEED: SocialFeedPayload = fallbackPostsData as SocialFeedPayload;

/**
 * Format relative time in natural German
 */
export function formatRelativeTimeGerman(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'gerade eben';
    if (diffMin < 60) return `vor ${diffMin} ${diffMin === 1 ? 'Minute' : 'Minuten'}`;
    if (diffHour < 24) return `vor ${diffHour} ${diffHour === 1 ? 'Stunde' : 'Stunden'}`;
    if (diffDay < 7) return `vor ${diffDay} ${diffDay === 1 ? 'Tag' : 'Tagen'}`;

    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format absolute date & time in German format
 */
export function formatFullDateTimeGerman(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin',
    }).format(date) + ' Uhr (MEZ)';
  } catch {
    return dateString;
  }
}

/**
 * Format count numbers (e.g. 1.2k, 14.5k)
 */
export function formatMetricCount(count?: number): string {
  if (count === undefined || count === null) return '0';
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace('.0', '') + 'k';
  }
  return count.toLocaleString('de-DE');
}
