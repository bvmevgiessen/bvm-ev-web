import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Scale, 
  ArrowLeft, 
  Share2, 
  FileText, 
  BookOpen, 
  BarChart3, 
  Globe, 
  ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import JusticeHero from '../components/justicesquare/JusticeHero';
import JusticeNews from '../components/justicesquare/JusticeNews';
import JusticeReports from '../components/justicesquare/JusticeReports';
import JusticeInfographics from '../components/justicesquare/JusticeInfographics';
import JusticeUsefulLinks from '../components/justicesquare/JusticeUsefulLinks';
import JusticeEditorialGuideline from '../components/justicesquare/JusticeEditorialGuideline';
import ShareButtons from '../components/ShareButtons';

export default function JusticeSquarePage() {
  useEffect(() => {
    document.title = 'JusticeSquare – Menschenrechte, Freiheit & Gerechtigkeit | BVM e.V.';
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <JusticeHero />

      {/* Sticky Secondary Navigation Subbar */}
      <nav 
        aria-label="JusticeSquare Themennavigation"
        className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <Link 
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-teal transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft size={14} />
              <span>Zur Hauptseite</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs font-black text-brand-navy">
              <Scale size={15} className="text-brand-teal" />
              <span>JusticeSquare</span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('news')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
            >
              News
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('reports')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Berichte
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('infografiken')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Infografiken
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('links')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Links
            </button>
          </div>
        </div>
      </nav>

      {/* Main Sections */}
      <main>
        {/* 1. NEWS-BEREICH */}
        <JusticeNews />

        {/* 2. REPORTS-BEREICH */}
        <JusticeReports />

        {/* 3. INFOGRAFIKEN */}
        <JusticeInfographics />

        {/* 4. NÜTZLICHE LINKS */}
        <JusticeUsefulLinks />

        {/* 5. REDAKTIONELLE LEITLINIEN */}
        <JusticeEditorialGuideline />

        {/* Share & Outreach Section */}
        <section className="py-12 bg-slate-100/70 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-xl font-bold text-brand-navy mb-2">
              Informieren, Teilen & Bewusstsein schaffen
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
              Menschenrechte brauchen eine informierte Öffentlichkeit. Teilen Sie diese Dokumentation in Ihren Netzwerken oder empfehlen Sie die Primärberichte weiter.
            </p>
            <div className="flex justify-center">
              <ShareButtons title="JusticeSquare – Menschenrechte, Freiheit & Gerechtigkeit" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}