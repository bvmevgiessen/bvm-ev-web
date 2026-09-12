import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon, Camera } from 'lucide-react';
import type { NewsGalleryItem } from '../data/aktuelles';

interface NewsPhotoGalleryProps {
  gallery?: NewsGalleryItem[];
  fallbackImage: string;
  title: string;
}

export default function NewsPhotoGallery({
  gallery = [],
  fallbackImage,
  title,
}: NewsPhotoGalleryProps) {
  // If gallery has items, use them; otherwise fallback to single image
  const items: NewsGalleryItem[] = gallery.length > 0
    ? gallery
    : [{ url: fallbackImage, title: title, caption: '' }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activePhoto = items[activeIndex] || items[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="w-full" data-testid="news-photo-gallery">
      {/* Gallery Header Info if multiple photos */}
      {items.length > 1 && (
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal">
            <Camera size={14} />
            <span>Foto-Galerie ({items.length} Originalfotos)</span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {activeIndex + 1} / {items.length}
          </span>
        </div>
      )}

      {/* Main photo container */}
      <div className="relative h-64 sm:h-80 overflow-hidden rounded-2xl bg-slate-900 shadow-inner group">
        <AnimatePresence mode="wait">
          <motion.img
            key={activePhoto.url}
            src={activePhoto.url}
            alt={activePhoto.title || title}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain sm:object-cover cursor-pointer select-none"
            onClick={() => setLightboxOpen(true)}
          />
        </AnimatePresence>

        {/* Subtle gradient vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Expand / Zoom button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          data-testid="gallery-zoom-button"
          aria-label="Foto vergrößern"
          className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white/90 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white active:scale-95 opacity-80 group-hover:opacity-100"
        >
          <Maximize2 size={16} />
        </button>

        {/* Previous / Next buttons */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              data-testid="gallery-prev-button"
              aria-label="Vorheriges Foto"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/90 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              data-testid="gallery-next-button"
              aria-label="Nächstes Foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/90 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Overlay Caption on main view */}
        {activePhoto.caption && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-xs sm:text-sm font-medium text-slate-100 drop-shadow line-clamp-2">
              {activePhoto.caption}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail Bar (if multiple images) */}
      {items.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                data-testid={`gallery-thumb-${idx}`}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all active:scale-95 ${
                  isActive
                    ? 'border-brand-teal ring-2 ring-brand-teal/40 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                title={item.title || `Foto ${idx + 1}`}
              >
                <img
                  src={item.url}
                  alt={item.title || `Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            data-testid="gallery-lightbox"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md"
          >
            {/* Top bar with close and counter */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
              <span className="font-mono text-sm text-slate-300">
                {activeIndex + 1} / {items.length} {activePhoto.title ? `– ${activePhoto.title}` : ''}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full bg-white/10 p-2.5 text-white transition-all hover:bg-white/20 active:scale-95"
                aria-label="Lightbox schließen"
              >
                <X size={22} />
              </button>
            </div>

            {/* Lightbox Main Image */}
            <div
              className="relative max-h-[80vh] max-w-5xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto.url}
                alt={activePhoto.title || title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
              />

              {/* Prev / Next controls in lightbox */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Vorheriges Bild"
                    className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur hover:bg-white/30 active:scale-95"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Nächstes Bild"
                    className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur hover:bg-white/30 active:scale-95"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Caption */}
            {activePhoto.caption && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-4 max-w-2xl text-center text-sm text-slate-200"
              >
                <p>{activePhoto.caption}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
