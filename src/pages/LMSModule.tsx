import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { lmsModules } from '../data/lmsData';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CheckCircle, Book, Circle, PlayCircle, Award } from 'lucide-react';

export default function LMSModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, profile, loading, markModuleCompleted } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/lms/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Lade...</div>;
  }

  const moduleItem = lmsModules.find(m => m.id === moduleId);

  if (!moduleItem) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-brand-navy mb-4">Modul nicht gefunden</h2>
        <Link to="/lms/dashboard" className="text-brand-teal hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const isCompleted = profile?.completedModules.includes(moduleItem.id);
  
  const handleMarkComplete = async () => {
    if (!isCompleted) {
      await markModuleCompleted(moduleItem.id);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Navbar area */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/lms/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors font-medium">
            <ArrowLeft size={18} /> Ansicht wechseln
          </Link>
          <div className="text-sm font-bold text-brand-navy hidden sm:block">
            Woche {moduleItem.week} / 16
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <div className="inline-flex px-3 py-1 bg-brand-teal/10 text-brand-teal text-sm font-bold rounded-lg mb-4">
              Woche {moduleItem.week}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-brand-navy mb-6 tracking-tight">
              {moduleItem.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
              {moduleItem.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mt-16">
            
            <div className="md:col-span-2 space-y-12">
              {/* Learning Objectives */}
              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                  <Award className="text-brand-orange" /> Lernziele
                </h2>
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <ul className="space-y-4">
                    {moduleItem.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className="w-6 h-6 shrink-0 bg-white rounded-full flex items-center justify-center border border-slate-200 mt-0.5 text-xs font-bold text-slate-500">
                          {i + 1}
                        </div>
                        <span className="text-slate-700 leading-relaxed font-medium">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Video Content Placeholder */}
              <section>
                 <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                  <PlayCircle className="text-brand-teal" /> Videomaterial
                </h2>
                <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative flex items-center justify-center shadow-lg group">
                  <div className="absolute inset-0 bg-brand-navy opacity-50"></div>
                  <PlayCircle size={64} className="text-white/80 relative z-10 group-hover:scale-110 transition-transform cursor-pointer" />
                  <div className="absolute bottom-6 left-6 text-white font-medium z-10 bg-black/40 px-3 py-1 rounded-md text-sm">
                    Modul {moduleItem.week} Video Lecture
                  </div>
                </div>
              </section>

              {/* Action Button */}
              <section className="pt-8">
                <button
                  onClick={handleMarkComplete}
                  disabled={isCompleted}
                  className={`w-full md:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                    isCompleted 
                      ? 'bg-brand-teal text-white shadow-brand-teal/20 shadow-lg cursor-default' 
                      : 'bg-brand-orange hover:bg-orange-600 text-white shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {isCompleted ? (
                    <>Abgeschlossen <CheckCircle size={20} /></>
                  ) : (
                    <>Als "Erledigt" markieren <Circle size={20} /></>
                  )}
                </button>
              </section>
            </div>

            {/* Sidebar Resources */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                  <Book className="text-slate-400" size={20} /> Lesematerial
                </h3>
                
                {moduleItem.readingMaterials.length > 0 ? (
                  <div className="space-y-4">
                    {moduleItem.readingMaterials.map((doc, i) => (
                      <a href={doc.url} key={i} className="group block bg-white border border-slate-200 rounded-2xl p-4 hover:border-brand-teal transition-colors shadow-sm">
                        <div className="text-sm font-bold text-slate-700 group-hover:text-brand-teal transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                           PDF Dokument öffnen
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    Kein zusätzliches Lesematerial in dieser Woche erforderlich.
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}