import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { lmsModules, ModuleContent, LearningTarget, ReadingMaterial, VideoMaterial } from '../data/lmsData';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CheckCircle, Book, Circle, PlayCircle, Award, Target, FileText, Download, Check } from 'lucide-react';
import jsPDF from 'jspdf';

export default function LMSModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, profile, loading, markModuleCompleted, markItemCompleted } = useAuth();
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

  const completedModules = profile?.completedModules || [];
  const completedItems = profile?.completedItems || [];
  
  const isModuleCompletedLocally = completedModules.includes(moduleItem.id);

  // Check how many items are completed for THIS module
  const requiredItemIds = [
    ...(moduleItem.learningTargets || []).map(t => t.id),
    ...(moduleItem.readingMaterials || []).map(r => r.id),
    ...(moduleItem.videos || []).map(v => v.id),
  ];
  
  const completedCount = requiredItemIds.filter(id => completedItems.includes(id)).length;
  const totalRequired = requiredItemIds.length;
  const progressPercent = totalRequired === 0 ? 0 : Math.round((completedCount / totalRequired) * 100);
  const allItemsCompleted = totalRequired > 0 && completedCount === totalRequired;

  const handleMarkItem = async (itemId: string) => {
    if (!completedItems.includes(itemId)) {
      await markItemCompleted(itemId);
    }
  };

  const handleFinishModule = async () => {
    if (!isModuleCompletedLocally) {
      await markModuleCompleted(moduleItem.id);
    }
  };

  const downloadCertificate = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });
    
    // Add border
    doc.setLineWidth(5);
    doc.setDrawColor(21, 94, 117); // brand-teal
    doc.rect(10, 10, 277, 190);
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(30, 58, 138); // brand-navy
    doc.text("Abschlusszertifikat", 148, 50, { align: "center" });
    
    doc.setFontSize(20);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont("helvetica", "normal");
    doc.text("Dieses Zertifikat bescheinigt, dass", 148, 80, { align: "center" });
    
    // Name
    const studentName = profile?.name || user.email || "Teilnehmer/in";
    doc.setFontSize(30);
    doc.setTextColor(21, 94, 117);
    doc.setFont("helvetica", "bold");
    doc.text(studentName, 148, 100, { align: "center" });
    
    doc.setFontSize(20);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("das Modul erfolgreich abgeschlossen hat:", 148, 120, { align: "center" });
    
    // Module title
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 138);
    doc.setFont("helvetica", "bold");
    doc.text(moduleItem.title, 148, 140, { align: "center" });
    
    // Date
    const today = new Date().toLocaleDateString('de-DE');
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Ausgestellt am: ${today}`, 148, 170, { align: "center" });

    // Save locally
    doc.save(`Zertifikat_${moduleItem.title.replace(/\s+/g, '_')}.pdf`);
    
    // Convert to base64 for email (mocked implementation for GitHub Pages)
    try {
      const pdfBase64 = doc.output('datauristring');
      
      // emailjs.send(
      //   'YOUR_SERVICE_ID', 
      //   'YOUR_TEMPLATE_ID', 
      //   {
      //     to_email: user.email,
      //     to_name: studentName,
      //     module_name: moduleItem.title,
      //     attachment: pdfBase64
      //   }, 
      //   'YOUR_PUBLIC_KEY'
      // );
      
      console.log('Zertifikat als E-Mail vorbereitet.', pdfBase64.substring(0, 50) + "...");
      alert("Erfolg! Das Modul wurde beendet. Ihr Zertifikat wurde heruntergeladen und (theoretisch) per E-Mail gesendet.");
    } catch (e) {
      console.error('Fehler beim E-Mail-Versand', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Navbar area */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/lms/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors font-medium">
            <ArrowLeft size={18} /> Ansicht wechseln
          </Link>
          <div className="flex items-center gap-6">
            <div className="text-sm font-bold text-brand-navy hidden sm:block">
              Woche {moduleItem.week} / 16
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Progress Navigation */}
        <div className="md:w-1/3 lg:w-1/4 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="font-bold text-brand-navy mb-4 text-lg">Modul Fortschritt</h3>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-slate-600">{progressPercent}% Abgeschlossen</span>
                <span className="text-brand-teal">{completedCount}/{totalRequired}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                  className="bg-brand-teal h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inhalt</div>
              
              <a href="#targets" className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-brand-teal transition-colors">
                <Target size={18} className="text-slate-400" />
                Lernziele
              </a>
              <a href="#materials" className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-brand-teal transition-colors">
                <FileText size={18} className="text-slate-400" />
                Lesematerial
              </a>
              <a href="#videos" className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-brand-teal transition-colors">
                <PlayCircle size={18} className="text-slate-400" />
                Videos
              </a>
              <a href="#books" className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-brand-teal transition-colors">
                <Book size={18} className="text-slate-400" />
                Buchempfehlungen
              </a>
            </div>

            {allItemsCompleted && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center mb-4 border border-green-100">
                  <Award className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="font-bold text-sm">Modul erfolgreich beendet!</p>
                </div>
                {!isModuleCompletedLocally ? (
                  <button 
                    onClick={handleFinishModule}
                    className="w-full py-3 btn-primary text-sm shadow-md"
                  >
                    Modul Abschließen
                  </button>
                ) : (
                  <button 
                    onClick={downloadCertificate}
                    className="w-full py-3 bg-white border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Zertifikat & Email
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:w-2/3 lg:w-3/4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-10 pb-10 border-b border-slate-200">
              <div className="inline-flex px-3 py-1 bg-brand-teal/10 text-brand-teal text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
                Woche {moduleItem.week}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-brand-navy mb-6 tracking-tight">
                {moduleItem.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                {moduleItem.description}
              </p>
            </div>

            <div className="space-y-12">
              
              {/* Learning Targets */}
              <section id="targets" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                  <Target className="text-brand-orange" /> Lernziele
                </h2>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <ul className="space-y-4">
                    {moduleItem.learningTargets?.map((target) => {
                      const isItemDone = completedItems.includes(target.id);
                      return (
                        <li key={target.id} className="flex gap-4 items-start">
                          <button 
                            onClick={() => handleMarkItem(target.id)}
                            className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isItemDone 
                              ? 'bg-brand-teal border-brand-teal text-white' 
                              : 'border-slate-300 hover:border-brand-teal text-transparent'
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <span className={`${isItemDone ? 'text-slate-500' : 'text-slate-700'} font-medium text-lg leading-snug`}>
                            {target.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>

              {/* Reading Materials */}
              <section id="materials" className="scroll-mt-24">
                 <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                  <FileText className="text-brand-teal" /> Lesematerial
                </h2>
                {moduleItem.readingMaterials?.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {moduleItem.readingMaterials.map((doc) => {
                      const isItemDone = completedItems.includes(doc.id);
                      return (
                        <div key={doc.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-brand-navy text-lg mb-2">{doc.title}</h3>
                            <p className="text-slate-600 text-sm mb-4">{doc.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                            <a href={doc.url} className="text-sm font-semibold text-brand-teal hover:underline flex items-center gap-1">
                              <Download size={16} /> Herunterladen
                            </a>
                            <button 
                              onClick={() => handleMarkItem(doc.id)}
                              className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-2 ${
                                isItemDone 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-white text-slate-500 border-slate-200 hover:border-brand-teal hover:text-brand-teal'
                              }`}
                            >
                              {isItemDone ? <><Check size={16} /> Gelesen</> : 'Mark as Read'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-slate-500 italic p-6 border border-dashed border-slate-300 rounded-2xl bg-white">Keine Lesematerialien für diese Woche.</div>
                )}
              </section>

              {/* Video Materials */}
              <section id="videos" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                  <PlayCircle className="text-brand-orange" /> Empfohlene Videos
                </h2>
                {moduleItem.videos?.length > 0 ? (
                  <div className="space-y-6">
                    {moduleItem.videos.map((video) => {
                      const isItemDone = completedItems.includes(video.id);
                      return (
                        <div key={video.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                          <div className="md:w-1/3 bg-slate-900 aspect-video relative flex items-center justify-center group overflow-hidden">
                            {/* Generic iframe for youtube or placeholder */}
                            <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                            <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-brand-teal/90 transition-colors">
                                <PlayCircle size={32} className="text-white" />
                              </div>
                            </a>
                          </div>
                          <div className="p-6 md:w-2/3 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-brand-navy text-lg mb-2">{video.title}</h3>
                              <p className="text-slate-600 text-sm">{video.description}</p>
                            </div>
                            <div className="mt-6 flex justify-end">
                              <button 
                                onClick={() => handleMarkItem(video.id)}
                                className={`text-sm px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                                  isItemDone 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {isItemDone ? <><CheckCircle size={18} /> Gesehen</> : <><Circle size={18} /> Als gesehen markieren</>}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-slate-500 italic p-6 border border-dashed border-slate-300 rounded-2xl bg-white">Keine Videos für diese Woche.</div>
                )}
              </section>

              {/* Book Recommendations (No tracking) */}
              <section id="books" className="scroll-mt-24 pb-8">
                <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                  <Book className="text-brand-navy" /> Buchempfehlungen <span className="text-sm font-normal text-slate-400">(Optional)</span>
                </h2>
                {moduleItem.bookRecommendations?.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {moduleItem.bookRecommendations.map((book) => (
                      <div key={book.id} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{book.author}</div>
                        <h3 className="font-bold text-brand-navy text-lg mb-3">{book.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{book.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 italic p-6 border border-dashed border-slate-300 rounded-2xl bg-white">Keine Buchempfehlungen für diese Woche.</div>
                )}
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
