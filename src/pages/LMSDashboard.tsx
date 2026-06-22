import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { lmsModules } from '../data/lmsData';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { translations, LMSLanguage } from '../utils/lmsTranslations';

export default function LMSDashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [lang, setLang] = React.useState<LMSLanguage>(() => {
    return (localStorage.getItem('lms_lang') as LMSLanguage) || 'de';
  });

  const handleLanguageChange = (newLang: LMSLanguage) => {
    setLang(newLang);
    localStorage.setItem('lms_lang', newLang);
  };

  const t = translations[lang];

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/lms/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Lade... / Yükleniyor...</div>;
  }

  if (!user || !profile) {
    return null;
  }

  if (profile.status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        {/* Floating Language Switcher */}
        <div className="mb-4 flex bg-slate-200/50 rounded-xl p-0.5 border border-slate-200">
          <button 
            onClick={() => handleLanguageChange('de')} 
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'de' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-600 hover:text-brand-navy'}`}
          >
            DE
          </button>
          <button 
            onClick={() => handleLanguageChange('tr')} 
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'tr' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-600 hover:text-brand-navy'}`}
          >
            TR
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center border-t-4 border-brand-orange"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl font-bold text-brand-navy mb-4">{t.pendingTitle}</h1>
          <p className="text-slate-600 mb-8">
            {t.pendingText}
          </p>
          <button 
            onClick={signOut}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
          >
            <LogOut size={18} /> {t.signOut}
          </button>
        </motion.div>
      </div>
    );
  }

  if (profile.status === 'rejected') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        {/* Floating Language Switcher */}
        <div className="mb-4 flex bg-slate-200/50 rounded-xl p-0.5 border border-slate-200">
          <button 
            onClick={() => handleLanguageChange('de')} 
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'de' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-600 hover:text-brand-navy'}`}
          >
            DE
          </button>
          <button 
            onClick={() => handleLanguageChange('tr')} 
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'tr' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-600 hover:text-brand-navy'}`}
          >
            TR
          </button>
        </div>

        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border-t-4 border-red-500">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t.rejectedTitle}</h1>
          <p className="text-slate-600 mb-8">{t.rejectedText}</p>
          <button onClick={signOut} className="px-6 py-3 bg-slate-100 rounded-xl font-medium text-slate-700 hover:bg-slate-200 transition-colors">{t.signOut}</button>
        </div>
      </div>
    );
  }

  const completedCount = profile?.completedModules?.length || 0;
  const totalCount = lmsModules.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-brand-navy text-white pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link to="/dialog" className="text-white/60 hover:text-white mb-6 animate-fade-in inline-flex items-center gap-2 text-sm font-medium transition-colors">
              <ArrowRight className="rotate-180" size={16} /> {t.backToDialog}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.certProgram}</h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              {t.progressDesc}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6 md:mt-0">
            {/* Language Selection Buttons */}
            <div className="flex bg-white/10 rounded-xl p-0.5 border border-white/10">
              <button 
                onClick={() => handleLanguageChange('de')} 
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${lang === 'de' ? 'bg-white text-brand-navy shadow-sm' : 'text-white/70 hover:text-white'}`}
              >
                DE
              </button>
              <button 
                onClick={() => handleLanguageChange('tr')} 
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${lang === 'tr' ? 'bg-white text-brand-navy shadow-sm' : 'text-white/70 hover:text-white'}`}
              >
                TR
              </button>
            </div>

            {profile?.role === 'admin' && (
              <Link to="/lms/admin" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange hover:bg-orange-500 text-white font-medium rounded-xl transition-colors">
                {t.adminPanel}
              </Link>
            )}
            <button 
              onClick={signOut}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors shrink-0"
            >
              <LogOut size={18} /> {t.signOut}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        
        {/* Progress Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 mb-12 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0 flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" className="stroke-slate-100" strokeWidth="12" fill="none" />
              <circle 
                cx="64" cy="64" r="58" 
                className="stroke-brand-teal transition-all duration-1000 ease-out" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - progressPercent / 100)}`}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-black text-brand-navy leading-none">{progressPercent}%</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-navy mb-2">{t.yourProgress}</h2>
            <p className="text-slate-600">
              {t.completedOf.replace('{completed}', completedCount.toString()).replace('{total}', totalCount.toString())}
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
            <BookOpen className="text-brand-orange" /> {t.curriculumVerlauf}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lmsModules.map((moduleItem, index) => {
            const isCompleted = profile?.completedModules?.includes(moduleItem.id);
            return (
              <Link 
                key={moduleItem.id}
                to={`/lms/module/${moduleItem.id}`}
                className={`block relative group bg-white rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isCompleted ? 'border-brand-teal/30 shadow-sm' : 'border-slate-200 shadow-sm hover:border-brand-orange/40'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-brand-teal/10 text-brand-teal' : 'bg-slate-100 text-slate-500'}`}>
                    {t.module} {moduleItem.week}
                  </div>
                  {isCompleted && (
                    <CheckCircle className="text-brand-teal" size={24} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                  {moduleItem.title[lang]}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2">
                  {moduleItem.description[lang]}
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-brand-teal opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  {t.viewCourse} <ArrowRight className="ml-1" size={16} />
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  );
}
