import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import {
  Scale,
  RefreshCw,
  Search,
  Filter,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers,
  LayoutGrid,
  List,
  AlertCircle,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import SocialPostCard from '../components/social/SocialPostCard';
import AccountSelector from '../components/social/AccountSelector';
import {
  SOCIAL_MONITOR_CONFIG,
  FALLBACK_SOCIAL_FEED,
  formatFullDateTimeGerman,
  formatRelativeTimeGerman,
  type SocialPost,
  type SocialPlatform,
  type SocialFeedPayload
} from '../data/socialMonitor';

export default function JusticeSquareSocialMonitorPage() {
  const [feedData, setFeedData] = useState<SocialFeedPayload>(FALLBACK_SOCIAL_FEED);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'stream'>('grid');
  const [showAccountsDrawer, setShowAccountsDrawer] = useState(false);

  // Fetch feed on mount from API endpoint or static json
  useEffect(() => {
    let isMounted = true;

    async function loadFeed() {
      setIsLoading(true);
      try {
        // Try server API first
        const res = await fetch('/api/social-monitor/feed');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.posts && Array.isArray(data.posts)) {
            setFeedData(data);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // Continue to static file fallback
      }

      try {
        // Fallback to static public json file
        const resStatic = await fetch('/data/social_posts.json');
        if (resStatic.ok) {
          const data = await resStatic.json();
          if (isMounted && data.posts && Array.isArray(data.posts)) {
            setFeedData(data);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // Retain fallback data
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    loadFeed();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/social-monitor/feed?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.posts) {
          setFeedData(data);
        }
      } else {
        const resStatic = await fetch(`/data/social_posts.json?t=${Date.now()}`);
        if (resStatic.ok) {
          const data = await resStatic.json();
          if (data.posts) {
            setFeedData(data);
          }
        }
      }
    } catch {
      // Retain existing
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    feedData.posts.forEach((p) => {
      p.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [feedData.posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return feedData.posts.filter((post) => {
      // Platform filter
      if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) {
        return false;
      }

      // Account filter
      if (selectedAccountId && post.accountId !== selectedAccountId) {
        return false;
      }

      // Tag filter
      if (selectedTag !== 'all' && (!post.tags || !post.tags.includes(selectedTag))) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAuthor =
          post.authorName.toLowerCase().includes(q) ||
          post.handle.toLowerCase().includes(q);
        const matchesText = post.text.toLowerCase().includes(q);
        const matchesTranslation = post.textDe?.toLowerCase().includes(q);
        const matchesTags = post.tags?.some((t) => t.toLowerCase().includes(q));

        return matchesAuthor || matchesText || matchesTranslation || matchesTags;
      }

      return true;
    });
  }, [feedData.posts, selectedPlatform, selectedAccountId, selectedTag, searchQuery]);

  const selectedAccount = useMemo(() => {
    if (!selectedAccountId) return null;
    return SOCIAL_MONITOR_CONFIG.accounts.find((a) => a.id === selectedAccountId);
  }, [selectedAccountId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-brand-navy transition-colors">Startseite</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <Link to="/justicesquare" className="hover:text-brand-navy transition-colors">JusticeSquare</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="font-semibold text-slate-900">Social Monitor</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="relative mt-4 border-b border-slate-200 bg-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-3xl">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-bold text-brand-teal">
                  <Scale size={14} />
                  <span>JusticeSquare • Social Media Dokumentation</span>
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                  JusticeSquare Social Monitor
                </h1>

                <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
                  Tagesaktuelle Aggregation von Social-Media-Beiträgen ausgewählter Stimmen,
                  Journalisten und Menschenrechtsinitiativen auf X und Instagram. Dokumentation von
                  Verfahren, Haftbedingungen und Willkürmaßnahmen gegen die Gülen-Bewegung – mit
                  On-Demand-Übersetzung ins Deutsche.
                </p>

                {/* Key Status Indicators */}
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 font-medium">
                    <Users size={14} className="text-brand-navy" />
                    <span>{SOCIAL_MONITOR_CONFIG.accounts.length} überwachte Accounts</span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 font-medium">
                    <Clock size={14} className="text-brand-teal" />
                    <span>Aktualisierung: Täglich (CRON)</span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 font-medium">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span>24h-Cache aktiv</span>
                  </div>

                  <span className="text-slate-400 font-mono text-[11px]">
                    Stand: {formatFullDateTimeGerman(feedData.lastUpdated)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-navy/90 transition-all cursor-pointer"
                >
                  <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                  <span>{isRefreshing ? 'Aktualisiere...' : 'Feed neu laden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAccountsDrawer(!showAccountsDrawer)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Users size={16} className="text-brand-teal" />
                  <span>{showAccountsDrawer ? 'Account-Filter ausblenden' : `Alle ${SOCIAL_MONITOR_CONFIG.accounts.length} Accounts anzeigen`}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Account Selector Area */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <AnimatePresence>
            {showAccountsDrawer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <AccountSelector
                  accounts={SOCIAL_MONITOR_CONFIG.accounts}
                  selectedAccountId={selectedAccountId}
                  onSelectAccount={(id) => setSelectedAccountId(id)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Pill if an Account is selected */}
          {selectedAccount && !showAccountsDrawer && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/70 p-3 text-xs text-teal-900">
              <div className="flex items-center gap-2">
                <img
                  src={selectedAccount.avatar}
                  alt={selectedAccount.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span>
                  Gefiltert nach: <strong>{selectedAccount.name}</strong> (@{selectedAccount.handleX})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAccountId(null)}
                className="font-bold underline hover:text-teal-700 cursor-pointer"
              >
                Filter aufheben
              </button>
            </div>
          )}

          {/* Control Bar: Search, Platform Tabs, Tags, Layout */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="In Beiträgen suchen (Türkisch oder Deutsche Übersetzung)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-teal focus:bg-white focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
                  >
                    Löschen
                  </button>
                )}
              </div>

              {/* Platform Switcher */}
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('all')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedPlatform === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Alle ({feedData.posts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('x')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedPlatform === 'x'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  X / Twitter
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('instagram')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedPlatform === 'instagram'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Instagram
                </button>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Raster-Ansicht"
                  aria-label="Raster-Ansicht"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('stream')}
                  className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                    viewMode === 'stream' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Feed-Ansicht"
                  aria-label="Feed-Ansicht"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Tag Quick Filters */}
            {allTags.length > 0 && (
              <div className="mt-3.5 flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3 scrollbar-none">
                <span className="text-xs font-semibold text-slate-400 shrink-0">Themen:</span>
                <button
                  type="button"
                  onClick={() => setSelectedTag('all')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTag === 'all'
                      ? 'bg-brand-navy text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Alle Themen
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-brand-teal text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Feed Posts Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Aktuelle Meldungen ({filteredPosts.length})
            </h2>
            <span className="text-xs text-slate-500">
              Max. 5 neueste Beiträge je Account • 24h gecached
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <AlertCircle size={36} className="mx-auto text-slate-400" />
              <h3 className="mt-3 text-base font-bold text-slate-900">
                Keine Beiträge für diese Filterauswahl gefunden
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Bitte überprüfen Sie Ihren Suchbegriff oder heben Sie gesetzte Plattform- oder Themenfilter auf.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlatform('all');
                  setSelectedAccountId(null);
                  setSelectedTag('all');
                }}
                className="mt-4 rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white hover:bg-brand-navy/90 transition-colors"
              >
                Alle Filter zurücksetzen
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  onAccountSelect={(accId) => {
                    setSelectedAccountId(accId);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {filteredPosts.map((post) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  onAccountSelect={(accId) => {
                    setSelectedAccountId(accId);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Jump-back to JusticeSquare Main Sections */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-slate-200">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-xl">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-teal-300">
                <Scale size={14} />
                <span>JusticeSquare Hauptplattform</span>
              </div>
              <h3 className="mt-3 text-2xl font-bold">
                Möchten Sie tiefergehende Berichte und Urteilsanalysen einsehen?
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                JusticeSquare vereint neben dem Social Media Monitoring auch strukturierte
                Nachrichtenexzerpte, juristische Fachberichte (EGMR, UN, Europarat), interaktive
                Infografiken und multimediale Dokumentationen.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/justicesquare#news"
                  className="rounded-xl bg-brand-teal px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-teal/90 transition-colors"
                >
                  Aktuelle News & Urteile
                </Link>
                <Link
                  to="/justicesquare#reports"
                  className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                >
                  Berichte & Analysen
                </Link>
                <Link
                  to="/justicesquare#infografiken"
                  className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                >
                  Infografiken & Zahlen
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}