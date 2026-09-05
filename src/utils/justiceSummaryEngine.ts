import { JusticeNewsItem, JusticeReportItem, InfographicSection } from '../data/justiceSquareData';

export interface JusticeFilterOptions {
  searchQuery?: string;
  sourceType?: 'all' | 'international' | 'exile' | 'court';
  selectedTag?: string;
}

/**
 * Filter news items by search term and source type
 */
export function filterNewsItems(
  items: JusticeNewsItem[],
  options: JusticeFilterOptions
): JusticeNewsItem[] {
  return items.filter((item) => {
    // Category match
    if (options.sourceType && options.sourceType !== 'all') {
      if (item.sourceType !== options.sourceType) return false;
    }

    // Tag match
    if (options.selectedTag && options.selectedTag !== 'all') {
      if (!item.tags.includes(options.selectedTag)) return false;
    }

    // Search query match
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchSource = item.source.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchSource && !matchTags) return false;
    }

    return true;
  });
}

/**
 * Filter reports by keyword
 */
export function filterReports(
  reports: JusticeReportItem[],
  query: string
): JusticeReportItem[] {
  if (!query || query.trim().length === 0) return reports;
  const q = query.toLowerCase().trim();
  return reports.filter((r) => {
    const inTitle = r.title.toLowerCase().includes(q);
    const inInst = r.institution.toLowerCase().includes(q);
    const inPoints = r.keyPoints.some((p) => p.toLowerCase().includes(q));
    const inRel = r.relevance.toLowerCase().includes(q);
    return inTitle || inInst || inPoints || inRel;
  });
}

/**
 * Extract distinct tags from news items for filter pills
 */
export function extractUniqueNewsTags(items: JusticeNewsItem[]): string[] {
  const set = new Set<string>();
  items.forEach((item) => {
    item.tags.forEach((tag) => {
      if (tag && tag.trim().length > 0 && tag !== 'Gerichtsverfahren') {
        set.add(tag);
      }
    });
  });
  return Array.from(set);
}

/**
 * Formats a short summary preview with strict sentence capping (3-4 sentences)
 */
export function formatFactSummary(text: string, maxSentences: number = 3): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, maxSentences).join(' ');
}