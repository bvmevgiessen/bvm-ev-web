import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Languages,
  Check,
  Share2,
  Heart,
  Repeat,
  MessageCircle,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import type { SocialPost } from '../../data/socialMonitor';
import {
  formatRelativeTimeGerman,
  formatFullDateTimeGerman,
  formatMetricCount
} from '../../data/socialMonitor';

interface SocialPostCardProps {
  post: SocialPost;
  onAccountSelect?: (accountId: string) => void;
}

export default function SocialPostCard({ post, onAccountSelect }: SocialPostCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [dynamicTranslation, setDynamicTranslation] = useState<string | null>(post.textDe || null);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isInstagram = post.platform === 'instagram';
  const platformLabel = isInstagram ? 'Instagram' : 'X (Twitter)';
  const platformColor = isInstagram
    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white'
    : 'bg-slate-900 text-white';

  const handleTranslateClick = async () => {
    // If already showing German, toggle back to original
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }

    // If we already have the German translation (from cache or previous call)
    if (dynamicTranslation) {
      setShowTranslation(true);
      return;
    }

    // Fetch on-demand translation from server endpoint
    setIsTranslating(true);
    setTranslationError(null);

    try {
      const response = await fetch('/api/social-monitor/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: post.text, targetLang: 'de' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.translatedText) {
        setDynamicTranslation(data.translatedText);
        setShowTranslation(true);
      } else if (data.fallback && post.textDe) {
        setDynamicTranslation(post.textDe);
        setShowTranslation(true);
      } else {
        setTranslationError(data.message || 'Übersetzung derzeit nicht verfügbar.');
      }
    } catch (err: any) {
      // Fallback: If network fails or offline, check if fallback exists
      if (post.textDe) {
        setDynamicTranslation(post.textDe);
        setShowTranslation(true);
      } else {
        setTranslationError('Übersetzungsservice vorübergehend nicht erreichbar.');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(post.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Silent catch
      }
    }
  };

  const displayText = showTranslation && dynamicTranslation ? dynamicTranslation : post.text;
  const cleanHandle = post.handle.replace(/^@/, '').trim();
  const profileUrl = post.authorProfileUrl || (isInstagram ? `https://www.instagram.com/${cleanHandle}/` : `https://x.com/${cleanHandle}`);
  const safePostUrl = (!post.url || post.url.includes('/status/19678') || post.url.includes('/status/fake') || post.url.includes('/p/tutsak'))
    ? profileUrl
    : post.url;

  return (
    <article
      id={`post-${post.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
    >
      <div>
        {/* Card Header: Author Info & Platform Badge */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                referrerPolicy="no-referrer"
                className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                {post.authorName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => onAccountSelect?.(post.accountId)}
                  className="truncate text-sm font-bold text-slate-900 hover:text-brand-teal transition-colors text-left cursor-pointer"
                >
                  {post.authorName}
                </button>
              </div>
              <p className="truncate text-xs text-slate-500 font-mono">{post.handle.startsWith('@') ? post.handle : `@${post.handle}`}</p>
            </div>
          </div>

          {/* Platform Badge & Follow CTA */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-xs ${platformColor}`}
            >
              {isInstagram ? 'Instagram' : 'X'}
            </span>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal hover:text-brand-teal/80 transition-colors"
              title={`Profil von ${post.authorName} (@${cleanHandle}) auf ${platformLabel} öffnen`}
            >
              <span>Folgen</span>
              <ExternalLink size={10} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Timestamp */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
          <span
            className="inline-flex items-center gap-1 hover:text-slate-600 transition-colors"
            title={formatFullDateTimeGerman(post.publishedAt)}
          >
            <Clock size={12} aria-hidden="true" />
            <span>{formatRelativeTimeGerman(post.publishedAt)}</span>
          </span>
          {showTranslation && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <Sparkles size={11} /> Auf Deutsch
            </span>
          )}
        </div>

        {/* Post Text Body */}
        <div className="mt-3">
          <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line break-words">
            {displayText}
          </p>
        </div>

        {/* Translation Error alert if any */}
        {translationError && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
            <AlertCircle size={14} className="shrink-0 text-amber-600" />
            <span>{translationError}</span>
          </div>
        )}

        {/* Optional Media Thumbnail */}
        {post.thumbnailUrl && post.mediaType !== 'none' && (
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
            <a
              href={safePostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/img relative block aspect-video overflow-hidden"
            >
              <img
                src={post.thumbnailUrl}
                alt={post.mediaAlt || `Medienanhang von ${post.authorName}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-md">
                  <span>Auf {platformLabel} ansehen</span>
                  <ExternalLink size={12} />
                </span>
              </div>
            </a>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Action Bar */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between gap-2">
          {/* Translation Button */}
          <button
            type="button"
            id={`btn-translate-${post.id}`}
            onClick={handleTranslateClick}
            disabled={isTranslating}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              showTranslation
                ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title={showTranslation ? 'Originaltext anzeigen' : 'Auf Deutsch übersetzen'}
          >
            <Languages size={14} className={isTranslating ? 'animate-spin' : ''} />
            <span>
              {isTranslating
                ? 'Übersetze...'
                : showTranslation
                ? 'Originaltext'
                : 'Auf Deutsch'}
            </span>
          </button>

          {/* Right actions: Metrics + Direct Post Link */}
          <div className="flex items-center gap-3 text-slate-500 text-xs">
            {post.metrics?.likes !== undefined && (
              <span className="flex items-center gap-1" title={`${post.metrics.likes} Likes`}>
                <Heart size={13} className="text-slate-400" />
                <span>{formatMetricCount(post.metrics.likes)}</span>
              </span>
            )}
            {post.metrics?.reposts !== undefined && (
              <span className="flex items-center gap-1" title={`${post.metrics.reposts} Reposts`}>
                <Repeat size={13} className="text-slate-400" />
                <span>{formatMetricCount(post.metrics.reposts)}</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Link kopieren"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            </button>

            <a
              href={safePostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-brand-navy hover:text-brand-teal transition-colors"
              title={`Beiträge von @${cleanHandle} auf ${platformLabel} öffnen`}
            >
              <span>Öffnen</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}