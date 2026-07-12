import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Star, 
  HelpCircle,
  AlertTriangle,
  Globe,
  Database
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

type Language = 'de' | 'tr';

interface SurveyData {
  language: Language;
  // Usability & Navigation
  usability_intuitive: number; // 1-5
  usability_navigation: number; // 1-5
  usability_quick_find: number; // 1-5
  usability_clear_menus: number; // 1-5
  usability_logical_structure: number; // 1-5
  
  // Content
  content_helpful: number; // 1-5
  content_clear_texts: number; // 1-5
  content_appealing: number; // 1-5
  content_more_desired: string;
  content_less_desired: string;

  // Design
  design_clarity: number; // 1-5
  design_readability: number; // 1-5
  design_modernity: number; // 1-5
  design_images_quality: number; // 1-5

  // Tech
  tech_loading_speed: number; // 1-5
  tech_mobile_usability: number; // 1-5
  tech_has_bugs: boolean;
  tech_bugs_description: string;

  // Open feedback
  improvement_suggestions: string;
}

const initialSurveyData: SurveyData = {
  language: 'de',
  usability_intuitive: 4,
  usability_navigation: 4,
  usability_quick_find: 4,
  usability_clear_menus: 4,
  usability_logical_structure: 4,
  
  content_helpful: 4,
  content_clear_texts: 4,
  content_appealing: 4,
  content_more_desired: '',
  content_less_desired: '',

  design_clarity: 4,
  design_readability: 4,
  design_modernity: 4,
  design_images_quality: 4,

  tech_loading_speed: 4,
  tech_mobile_usability: 4,
  tech_has_bugs: false,
  tech_bugs_description: '',

  improvement_suggestions: ''
};

export default function FeedbackSurvey() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: Consent, 1: Language, 2: Usability, 3: Content, 4: Design, 5: Tech & Open, 6: Thank you
  const [survey, setSurvey] = useState<SurveyData>(initialSurveyData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has already declined or filled out the survey
    const surveyStatus = localStorage.getItem('bvm_survey_status');
    if (!surveyStatus) {
      // Trigger survey after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Fetch google sheets URL settings from Firestore
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'survey_settings', 'config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.googleSheetsUrl) {
            setGoogleSheetsUrl(data.googleSheetsUrl);
            localStorage.setItem('bvm_google_sheets_url', data.googleSheetsUrl);
          }
        }
      } catch (err) {
        console.warn("Using offline fallback for Google Sheets URL:", err);
        // Fallback to local storage if offline or failed
        const cachedUrl = localStorage.getItem('bvm_google_sheets_url');
        if (cachedUrl) {
          setGoogleSheetsUrl(cachedUrl);
        }
      }
    };
    fetchSettings();
  }, []);

  const handleDecline = () => {
    localStorage.setItem('bvm_survey_status', 'declined');
    setIsVisible(false);
  };

  const handleAccept = () => {
    setHasConsented(true);
    setCurrentStep(1); // Move to language selection
  };

  const handleLanguageSelect = (lang: Language) => {
    setSurvey(prev => ({ ...prev, language: lang }));
    setCurrentStep(2); // Usability section
  };

  const updateRating = (field: keyof SurveyData, val: number) => {
    setSurvey(prev => ({ ...prev, [field]: val }));
  };

  const updateText = (field: keyof SurveyData, val: string) => {
    setSurvey(prev => ({ ...prev, [field]: val }));
  };

  const updateBool = (field: keyof SurveyData, val: boolean) => {
    setSurvey(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    let firestoreSaved = false;

    try {
      // Save survey response to Firestore
      await addDoc(collection(db, 'survey_responses'), {
        ...survey,
        submittedAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      firestoreSaved = true;
    } catch (err: any) {
      console.warn("Firestore save failed, using local offline queue:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'survey_responses');
      } catch (logErr) {
        console.error("Logged Firestore error detail:", logErr);
      }
      // Store in offline queue for future sync
      try {
        const queue = JSON.parse(localStorage.getItem('bvm_offline_surveys_queue') || '[]');
        queue.push({
          ...survey,
          id: 'offline_' + Date.now(),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('bvm_offline_surveys_queue', JSON.stringify(queue));
      } catch (queueErr) {
        console.error("Failed to write to local offline queue:", queueErr);
      }
    }

    // Forward to Google Sheets Web App if configured
    if (googleSheetsUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        await fetch(googleSheetsUrl, {
          method: 'POST',
          mode: 'no-cors', // Standard Apps Script POST redirection
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            ...survey,
            timestamp: new Date().toISOString()
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (postErr) {
        console.error("Error posting to Google Sheet:", postErr);
      }
    }

    // Mark as completed in local storage and proceed to thank you step
    localStorage.setItem('bvm_survey_status', 'completed');
    setCurrentStep(6); // Thank you step
    setIsSubmitting(false);
  };

  if (!isVisible) return null;

  const lang = survey.language;

  // Language translation helper objects
  const t = {
    title: {
      de: 'Website-Feedback',
      tr: 'Web Sitesi Geri Bildirimi'
    },
    consentQuestion: {
      de: 'Möchten Sie an einer kurzen Website-Umfrage teilnehmen?',
      tr: 'Kısa bir web sitesi anketine katılmak ister misiniz?'
    },
    consentSub: {
      de: 'Ihre Meinung hilft uns, die Dialogplattform für Mittelhessen stetig zu verbessern. Es dauert weniger als 3 Minuten.',
      tr: 'Fikirleriniz, Orta Hessen diyalog platformumuzu sürekli olarak geliştirmemize yardımcı olacaktır. 3 dakikadan az sürer.'
    },
    yes: {
      de: 'Ja, gerne',
      tr: 'Evet, memnuniyetle'
    },
    no: {
      de: 'Nein, danke',
      tr: 'Hayır, teşekkürler'
    },
    langSelectTitle: {
      de: 'Wählen Sie Ihre Sprache / Dilinizi seçin',
      tr: 'Wählen Sie Ihre Sprache / Dilinizi seçin'
    },
    ratingHelp: {
      de: '1 = stimmt nicht, 5 = stimmt voll',
      tr: '1 = hiç katılmıyorum, 5 = tamamen katılıyorum'
    },
    next: {
      de: 'Weiter',
      tr: 'İleri'
    },
    back: {
      de: 'Zurück',
      tr: 'Geri'
    },
    submit: {
      de: 'Umfrage absenden',
      tr: 'Anketi Gönder'
    },
    submitting: {
      de: 'Wird gesendet...',
      tr: 'Gönderiliyor...'
    },
    thanksTitle: {
      de: 'Vielen Dank!',
      tr: 'Çok Teşekkür Ederiz!'
    },
    thanksText: {
      de: 'Ihre Antworten wurden erfolgreich gespeichert. Sie leisten einen wertvollen Beitrag zur Weiterentwicklung von BVM e. V. und unserer Dialogplattform.',
      tr: 'Yanıtlarınız başarıyla kaydedilmiştir. BVM e. V. ve diyalog platformumuzun gelişimine değerli katkı sağladınız.'
    },
    close: {
      de: 'Schließen',
      tr: 'Kapat'
    },
    // Categories
    catUsability: {
      de: 'Benutzerfreundlichkeit & Navigation',
      tr: 'Kullanılabilirlik ve Gezinme'
    },
    catContent: {
      de: 'Inhaltliche Bewertung',
      tr: 'İçerik Değerlendirmesi'
    },
    catDesign: {
      de: 'Design & Eindruck',
      tr: 'Tasarım ve İzlenim'
    },
    catTech: {
      de: 'Technische Aspekte & Vorschläge',
      tr: 'Teknik Yönler ve Öneriler'
    },
    // Questions
    qIntuitive: {
      de: 'Wie intuitiv ist die Website?',
      tr: 'Web sitesi ne kadar sezgisel?'
    },
    qNavigation: {
      de: 'Wie leicht fällt die Navigation?',
      tr: 'Sitede gezinmek ne kadar kolay?'
    },
    qQuickFind: {
      de: 'Finden Sie Inhalte schnell?',
      tr: 'Aradığınız içeriklere hızlıca ulaşabiliyor musunuz?'
    },
    qClearMenus: {
      de: 'Sind die Menüs verständlich?',
      tr: 'Menüler anlaşılır ve açıklayıcı mı?'
    },
    qLogicalStructure: {
      de: 'Wirkt die Struktur logisch?',
      tr: 'Sitenin genel yapısı mantıklı geliyor mu?'
    },
    qHelpful: {
      de: 'Wie hilfreich sind die Inhalte?',
      tr: 'İçerikler ne kadar yararlı?'
    },
    qClearTexts: {
      de: 'Wie verständlich sind die Texte?',
      tr: 'Metinler ne kadar anlaşılır?'
    },
    qAppealing: {
      de: 'Wie ansprechend ist die Darstellung?',
      tr: 'İçeriklerin sunumu ne kadar ilgi çekici?'
    },
    qMoreDesired: {
      de: 'Welche Inhalte wünschen Sie sich MEHR?',
      tr: 'Hangi içerikleri DAHA FAZLA görmek istersiniz?'
    },
    qLessDesired: {
      de: 'Welche Inhalte wünschen Sie sich WENIGER?',
      tr: 'Hangi içerikleri DAHA AZ görmek istersiniz?'
    },
    placeholderMore: {
      de: 'z.B. Mehr Berichte, Veranstaltungen, Videos...',
      tr: 'örn. Daha fazla rapor, etkinlik, video...'
    },
    placeholderLess: {
      de: 'z.B. Weniger Text, weniger komplexe Menüs...',
      tr: 'örn. Daha az metin, daha az karmaşık menü...'
    },
    qClarity: {
      de: 'Wie bewerten Sie die Übersichtlichkeit?',
      tr: 'Sitenin genel düzenini nasıl değerlendirirsiniz?'
    },
    qReadability: {
      de: 'Wie gut ist die Lesbarkeit der Schrift?',
      tr: 'Yazıların okunabilirliğini nasıl değerlendirirsiniz?'
    },
    qModernity: {
      de: 'Wie modern wirkt das Design auf Sie?',
      tr: 'Tasarım size ne kadar modern geliyor?'
    },
    qImagesQuality: {
      de: 'Wie gut ist die Bild- & Grafikqualität?',
      tr: 'Görsel ve grafiklerin kalitesi nasıl?'
    },
    qLoadingSpeed: {
      de: 'Wie bewerten Sie die Ladezeiten?',
      tr: 'Sayfa yüklenme hızlarını nasıl buldunuz?'
    },
    qMobileUsability: {
      de: 'Wie gut funktioniert die Website auf Ihrem Smartphone?',
      tr: 'Sizce web sitesi cep telefonunuzda ne kadar iyi çalışıyor?'
    },
    qHasBugs: {
      de: 'Haben Sie Fehler oder Probleme entdeckt?',
      tr: 'Herhangi bir teknik hata veya sorunla karşılaştınız mı?'
    },
    qBugsDesc: {
      de: 'Falls ja, beschreiben Sie das Problem kurz:',
      tr: 'Evet ise, sorunu kısaca açıklayınız:'
    },
    qImprovement: {
      de: 'Was sollten wir an der Website verbessern?',
      tr: 'Sizce bu web sitesinde neleri geliştirmeliyiz?'
    },
    placeholderImprovement: {
      de: 'Ihre Vorschläge für Verbesserungen...',
      tr: 'Geliştirme için önerileriniz...'
    },
    yesLabel: {
      de: 'Ja',
      tr: 'Evet'
    },
    noLabel: {
      de: 'Nein',
      tr: 'Hayır'
    }
  };

  const renderRatingStars = (field: keyof SurveyData) => {
    const currentValue = survey[field] as number;
    return (
      <div className="flex gap-2 items-center justify-between mt-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <span className="text-xs font-semibold text-slate-400">1</span>
        <div className="flex gap-1.5 justify-center">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => updateRating(field, val)}
              className={`w-9 h-9 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${
                currentValue === val
                  ? 'bg-brand-orange text-white ring-2 ring-orange-400/30'
                  : 'bg-white text-slate-600 hover:bg-orange-50 border border-slate-200 hover:border-brand-orange/40'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-400">5</span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden shadow-brand-navy/10 flex flex-col max-h-[85vh]"
        id="bvm-feedback-survey-panel"
      >
        {/* Header bar */}
        <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-brand-orange animate-pulse" />
            <span className="font-extrabold text-sm tracking-wide">{t.title[lang]}</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator / Progress Bar */}
        {currentStep > 1 && currentStep < 6 && (
          <div className="h-1.5 w-full bg-slate-100 flex shrink-0">
            {[2, 3, 4, 5].map((stepNum) => (
              <div 
                key={stepNum} 
                className={`h-full flex-1 transition-all duration-300 ${
                  currentStep >= stepNum ? 'bg-brand-orange' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          {/* STEP 0: Consent Check */}
          {currentStep === 0 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                <HelpCircle size={32} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-brand-navy px-2 leading-snug">
                {t.consentQuestion[lang]}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {t.consentSub[lang]}
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button 
                  onClick={handleDecline} 
                  className="px-5 py-3 border border-slate-200 text-slate-500 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  {t.no[lang]}
                </button>
                <button 
                  onClick={handleAccept} 
                  className="px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-md shadow-brand-orange/10 transition-colors"
                >
                  {t.yes[lang]}
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Language Selection */}
          {currentStep === 1 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 bg-teal-50 text-brand-teal rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe size={26} />
              </div>
              <h3 className="text-base font-extrabold text-brand-navy">
                {t.langSelectTitle[lang]}
              </h3>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
                <button
                  onClick={() => handleLanguageSelect('de')}
                  className="p-4 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-brand-orange/40 rounded-2xl font-bold text-sm text-brand-navy transition-all flex flex-col items-center gap-1.5"
                >
                  <span className="text-2xl">🇩🇪</span>
                  Deutsch
                </button>
                <button
                  onClick={() => handleLanguageSelect('tr')}
                  className="p-4 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-brand-orange/40 rounded-2xl font-bold text-sm text-brand-navy transition-all flex flex-col items-center gap-1.5"
                >
                  <span className="text-2xl">🇹🇷</span>
                  Türkçe
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Usability & Navigation */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-orange-100 text-brand-orange rounded-md">Step 1/4</span>
                <h3 className="font-extrabold text-brand-navy text-sm">{t.catUsability[lang]}</h3>
              </div>
              <p className="text-[11px] text-slate-400 italic mb-2">{t.ratingHelp[lang]}</p>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qIntuitive[lang]}</label>
                {renderRatingStars('usability_intuitive')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qNavigation[lang]}</label>
                {renderRatingStars('usability_navigation')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qQuickFind[lang]}</label>
                {renderRatingStars('usability_quick_find')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qClearMenus[lang]}</label>
                {renderRatingStars('usability_clear_menus')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qLogicalStructure[lang]}</label>
                {renderRatingStars('usability_logical_structure')}
              </div>
            </div>
          )}

          {/* STEP 3: Content Evaluation */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-orange-100 text-brand-orange rounded-md">Step 2/4</span>
                <h3 className="font-extrabold text-brand-navy text-sm">{t.catContent[lang]}</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qHelpful[lang]}</label>
                {renderRatingStars('content_helpful')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qClearTexts[lang]}</label>
                {renderRatingStars('content_clear_texts')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qAppealing[lang]}</label>
                {renderRatingStars('content_appealing')}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qMoreDesired[lang]}</label>
                <input
                  type="text"
                  value={survey.content_more_desired}
                  onChange={(e) => updateText('content_more_desired', e.target.value)}
                  placeholder={t.placeholderMore[lang]}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-orange font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qLessDesired[lang]}</label>
                <input
                  type="text"
                  value={survey.content_less_desired}
                  onChange={(e) => updateText('content_less_desired', e.target.value)}
                  placeholder={t.placeholderLess[lang]}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-orange font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Design & Impression */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-orange-100 text-brand-orange rounded-md">Step 3/4</span>
                <h3 className="font-extrabold text-brand-navy text-sm">{t.catDesign[lang]}</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qClarity[lang]}</label>
                {renderRatingStars('design_clarity')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qReadability[lang]}</label>
                {renderRatingStars('design_readability')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qModernity[lang]}</label>
                {renderRatingStars('design_modernity')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qImagesQuality[lang]}</label>
                {renderRatingStars('design_images_quality')}
              </div>
            </div>
          )}

          {/* STEP 5: Technical & Open suggestions */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-orange-100 text-brand-orange rounded-md">Step 4/4</span>
                <h3 className="font-extrabold text-brand-navy text-sm">{t.catTech[lang]}</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qLoadingSpeed[lang]}</label>
                {renderRatingStars('tech_loading_speed')}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qMobileUsability[lang]}</label>
                {renderRatingStars('tech_mobile_usability')}
              </div>

              {/* Bug/problem reporting */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <AlertTriangle size={15} className="text-orange-500" />
                  {t.qHasBugs[lang]}
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => updateBool('tech_has_bugs', true)}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                      survey.tech_has_bugs 
                        ? 'bg-brand-orange text-white' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-orange'
                    }`}
                  >
                    {t.yesLabel[lang]}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBool('tech_has_bugs', false)}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                      !survey.tech_has_bugs 
                        ? 'bg-brand-navy text-white' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-navy'
                    }`}
                  >
                    {t.noLabel[lang]}
                  </button>
                </div>

                {survey.tech_has_bugs && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.qBugsDesc[lang]}</label>
                    <textarea
                      rows={2}
                      value={survey.tech_bugs_description}
                      onChange={(e) => updateText('tech_bugs_description', e.target.value)}
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-orange bg-white font-medium"
                    />
                  </motion.div>
                )}
              </div>

              {/* General Improvement suggestions */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-600 block mb-1">{t.qImprovement[lang]}</label>
                <textarea
                  rows={3}
                  value={survey.improvement_suggestions}
                  onChange={(e) => updateText('improvement_suggestions', e.target.value)}
                  placeholder={t.placeholderImprovement[lang]}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-orange font-medium"
                />
              </div>

              {submitError && (
                <div className="text-xs font-semibold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Success Message */}
          {currentStep === 6 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-black text-brand-navy">
                {t.thanksTitle[lang]}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {t.thanksText[lang]}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setIsVisible(false)}
                  className="px-6 py-3 bg-brand-navy text-white hover:bg-slate-800 font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  {t.close[lang]}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions for Steps 2 to 5 */}
        {currentStep >= 2 && currentStep <= 5 && (
          <div className="border-t border-slate-100 p-4 flex justify-between bg-slate-50/50 shrink-0">
            <button
              onClick={() => {
                if (currentStep === 2) {
                  setCurrentStep(1); // Back to language
                } else {
                  setCurrentStep(currentStep - 1);
                }
              }}
              className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors"
            >
              <ChevronLeft size={16} /> {t.back[lang]}
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1 px-5 py-2.5 bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                {t.next[lang]} <ChevronRight size={16} />
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                <Database size={14} />
                {isSubmitting ? t.submitting[lang] : t.submit[lang]}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
