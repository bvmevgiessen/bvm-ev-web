import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowLeft, ShieldCheck, Scale, FileText, HeartHandshake } from 'lucide-react';
import { impressumContent, privacyContent, satzungContent, donationContent } from '../data/legalContents';
import Navbar from '../components/Navbar';
import PuzzleBackground from '../components/PuzzleBackground';

interface LegalPageProps {
  defaultType?: 'impressum' | 'privacy' | 'satzung' | 'donation';
}

export default function LegalPage({ defaultType }: LegalPageProps) {
  const location = useLocation();

  const getPageInfo = () => {
    const path = location.pathname.toLowerCase();
    if (defaultType === 'impressum' || path.includes('impressum')) {
      return {
        title: 'Impressum',
        subtitle: 'Rechtliche Angaben und Vertretungsberechtigte gemäß § 5 TMG',
        icon: Scale,
        content: impressumContent,
      };
    }
    if (defaultType === 'satzung' || path.includes('satzung')) {
      return {
        title: 'Satzung',
        subtitle: 'Vereinssatzung von Bildung und Verständigung Mittelhessen e.V.',
        icon: FileText,
        content: satzungContent,
      };
    }
    if (defaultType === 'donation' || path.includes('spendenbescheinigung')) {
      return {
        title: 'Spendenbescheinigung & Gemeinnützigkeit',
        subtitle: 'Steuerliche Abzugsfähigkeit und Bankverbindung',
        icon: HeartHandshake,
        content: donationContent,
      };
    }
    // Default to privacy policy
    return {
      title: 'Datenschutzerklärung',
      subtitle: 'Informationen zur Datenverarbeitung gemäß DSGVO und TDDDG',
      icon: ShieldCheck,
      content: privacyContent,
    };
  };

  const info = getPageInfo();
  const IconComponent = info.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col">
      <PuzzleBackground color="#0D9488" className="opacity-15" />
      <Navbar />

      <main className="flex-grow pt-28 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal hover:text-teal-700 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
            >
              <ArrowLeft size={16} /> Zurück zur Startseite
            </Link>
          </div>

          <article className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 md:p-16">
            <header className="mb-10 pb-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
                <IconComponent size={32} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-2">
                  {info.title}
                </h1>
                <p className="text-slate-500 text-sm sm:text-base">
                  {info.subtitle}
                </p>
              </div>
            </header>

            <div className="legal-content text-slate-700 leading-relaxed space-y-6">
              {info.content}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}