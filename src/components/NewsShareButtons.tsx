import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Mail, Link as LinkIcon, Check, Share2 } from 'lucide-react';
import { Twitter, Instagram } from './SocialIcons';

interface NewsShareButtonsProps {
  title: string;
  shortText?: string;
  newsId?: string;
  url?: string;
  variant?: 'card' | 'modal';
  className?: string;
}

export default function NewsShareButtons({
  title,
  shortText = '',
  newsId,
  url,
  variant = 'card',
  className = '',
}: NewsShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Compute absolute share URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bvm-ev.de';
  const sharePath = newsId ? `/aktuelles#news-${newsId}` : '/aktuelles#news';
  const targetUrl = url || `${origin}${sharePath}`;

  const whatsappMessage = `${title}\n\n${shortText ? shortText + '\n\n' : ''}Weiterlesen beim BVM e.V.: ${targetUrl}`;
  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(targetUrl)}`;

  const emailSubject = `BVM e.V. Neuigkeit: ${title}`;
  const emailBody = `Hallo,\n\nich möchte diese Neuigkeit von Bildung und Verständigung Mittelhessen e.V. mit dir teilen:\n\n${title}\n\n${shortText}\n\nAlle Details findest du hier:\n${targetUrl}\n\nViele Grüße!`;
  const emailHref = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setCopiedToast(true);
      setTimeout(() => setCopied(false), 2200);
      setTimeout(() => setCopiedToast(false), 2600);
    }
  };

  const handleInstagram = (e: React.MouseEvent) => {
    handleCopy(e);
  };

  if (variant === 'modal') {
    return (
      <div className={`rounded-2xl border border-slate-200 bg-slate-50/90 p-5 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Teilen
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Beitrag über WhatsApp, X, Instagram oder Direktlink teilen:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* WhatsApp */}
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="share-whatsapp-modal"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#25D366] text-white p-3 rounded-2xl shadow-lg shadow-black/5 flex items-center justify-center transition-all"
              title="Auf WhatsApp teilen"
              aria-label="Auf WhatsApp teilen"
            >
              <MessageCircle size={20} />
            </motion.a>

            {/* X (Twitter) */}
            <motion.a
              href={twitterHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="share-twitter-modal"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1DA1F2] text-white p-3 rounded-2xl shadow-lg shadow-black/5 flex items-center justify-center transition-all"
              title="Auf X (Twitter) teilen"
              aria-label="Auf X (Twitter) teilen"
            >
              <Twitter size={20} />
            </motion.a>

            {/* Instagram */}
            <motion.a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagram}
              data-testid="share-instagram-modal"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-3 rounded-2xl shadow-lg shadow-black/5 flex items-center justify-center transition-all"
              title="Link kopieren & Instagram öffnen"
              aria-label="Auf Instagram teilen"
            >
              <Instagram size={20} />
            </motion.a>

            {/* Link kopieren */}
            <motion.button
              type="button"
              onClick={handleCopy}
              data-testid="share-copy-modal"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-100 text-slate-600 hover:bg-slate-200 p-3 rounded-2xl shadow-lg shadow-black/5 flex items-center justify-center transition-all relative border border-slate-200/80"
              title={copied ? 'Link kopiert!' : 'Link kopieren'}
              aria-label="Link kopieren"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-emerald-600"
                  >
                    <Check size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="link"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <LinkIcon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* E-Mail */}
            <motion.a
              href={emailHref}
              data-testid="share-email-modal"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-navy text-white p-3 rounded-2xl shadow-lg shadow-black/5 flex items-center justify-center transition-all"
              title="Per E-Mail teilen"
              aria-label="Per E-Mail teilen"
            >
              <Mail size={20} />
            </motion.a>
          </div>
        </div>

        {/* Feedback message for clipboard */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200"
            >
              <Check size={14} className="text-emerald-600" />
              <span>Link erfolgreich in die Zwischenablage kopiert!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Card variant: compact inline icon buttons
  return (
    <div
      className={`relative inline-flex items-center gap-1.5 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* WhatsApp Button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`share-whatsapp-card-${newsId || 'default'}`}
        className="inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-[#25D366] hover:text-white p-2 transition-colors active:scale-95 border border-emerald-200/60"
        title="Auf WhatsApp teilen"
        aria-label="Auf WhatsApp teilen"
      >
        <MessageCircle size={15} />
      </a>

      {/* X (Twitter) Button */}
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`share-twitter-card-${newsId || 'default'}`}
        className="inline-flex items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-[#1DA1F2] hover:text-white p-2 transition-colors active:scale-95 border border-sky-200/60"
        title="Auf X (Twitter) teilen"
        aria-label="Auf X (Twitter) teilen"
      >
        <Twitter size={15} />
      </a>

      {/* Instagram Button */}
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleInstagram}
        data-testid={`share-instagram-card-${newsId || 'default'}`}
        className="inline-flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white p-2 transition-colors active:scale-95 border border-pink-200/60"
        title="Link kopieren & Instagram öffnen"
        aria-label="Auf Instagram teilen"
      >
        <Instagram size={15} />
      </a>

      {/* E-Mail Button */}
      <a
        href={emailHref}
        data-testid={`share-email-card-${newsId || 'default'}`}
        className="inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-brand-navy hover:text-white p-2 transition-colors active:scale-95 border border-slate-200"
        title="Per E-Mail teilen"
        aria-label="Per E-Mail teilen"
      >
        <Mail size={15} />
      </a>

      {/* Copy link button */}
      <button
        type="button"
        onClick={handleCopy}
        data-testid={`share-copy-card-${newsId || 'default'}`}
        className="inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 p-2 transition-colors active:scale-95 border border-slate-200"
        title={copied ? 'Kopiert!' : 'Link kopieren'}
        aria-label="Link kopieren"
      >
        {copied ? (
          <Check size={15} className="text-emerald-600" />
        ) : (
          <LinkIcon size={15} />
        )}
      </button>
    </div>
  );
}