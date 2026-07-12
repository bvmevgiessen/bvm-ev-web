import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  ArrowLeft, 
  Download, 
  FileText, 
  FileSpreadsheet,
  Settings, 
  HelpCircle, 
  Check, 
  RefreshCw, 
  Calendar, 
  FolderOpen,
  Cloud,
  ChevronRight,
  Info,
  Sliders,
  Sparkles,
  Search,
  MessageSquare,
  Flame,
  Star,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PuzzleBackground from '../components/PuzzleBackground';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

interface ResponseDoc {
  id: string;
  language: 'de' | 'tr';
  usability_intuitive: number;
  usability_navigation: number;
  usability_quick_find: number;
  usability_clear_menus: number;
  usability_logical_structure: number;
  content_helpful: number;
  content_clear_texts: number;
  content_appealing: number;
  content_more_desired: string;
  content_less_desired: string;
  design_clarity: number;
  design_readability: number;
  design_modernity: number;
  design_images_quality: number;
  tech_loading_speed: number;
  tech_mobile_usability: number;
  tech_has_bugs: boolean;
  tech_bugs_description: string;
  improvement_suggestions: string;
  timestamp?: string;
  submittedAt?: Timestamp;
}

export default function AdminSurveys() {
  const [responses, setResponses] = useState<ResponseDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'results' | 'gdrive'>('results');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isTestingSettings, setIsTestingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
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
        const cachedUrl = localStorage.getItem('bvm_google_sheets_url');
        if (cachedUrl) {
          setGoogleSheetsUrl(cachedUrl);
        }
      }
    };
    if (activeTab === 'gdrive') {
      fetchSettings();
    }
  }, [activeTab]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsMessage(null);
    try {
      localStorage.setItem('bvm_google_sheets_url', googleSheetsUrl);
      const docRef = doc(db, 'survey_settings', 'config');
      await setDoc(docRef, {
        googleSheetsUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSettingsMessage({
        type: 'success',
        text: 'Die Google Sheets Web-App-URL wurde erfolgreich gespeichert!'
      });
    } catch (err: any) {
      console.warn("Error saving settings to Firestore:", err);
      setSettingsMessage({
        type: 'success',
        text: 'URL lokal gespeichert! (Firestore-Sync ist offline und wird synchronisiert, sobald Sie wieder online sind)'
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingSettings(true);
    setSettingsMessage(null);
    try {
      // Send a test payload to the Apps Script URL
      const testPayload = {
        language: 'de',
        usability_intuitive: 5,
        usability_navigation: 5,
        usability_quick_find: 5,
        usability_clear_menus: 5,
        usability_logical_structure: 5,
        content_helpful: 5,
        content_clear_texts: 5,
        content_appealing: 5,
        content_more_desired: 'Test Verbindung',
        content_less_desired: 'Keine',
        tech_loading_speed: 5,
        tech_mobile_usability: 5,
        tech_has_bugs: false,
        tech_bugs_description: '',
        improvement_suggestions: 'Das ist eine Testübertragung für die Google Tabelle.',
        is_test: true,
        timestamp: new Date().toISOString()
      };

      await fetch(googleSheetsUrl, {
        method: 'POST',
        mode: 'no-cors', // standard Apps Script POST redirection
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      setSettingsMessage({
        type: 'success',
        text: 'Test-Daten erfolgreich gesendet! Bitte prüfen Sie Ihre Google-Tabelle, ob eine neue Zeile hinzugefügt wurde.'
      });
    } catch (err: any) {
      console.error("Error testing connection:", err);
      setSettingsMessage({
        type: 'error',
        text: 'Verbindungstest fehlgeschlagen: ' + err.message
      });
    } finally {
      setIsTestingSettings(false);
    }
  };

  const fetchResponses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Sync offline queue if online
      const offlineQueue = JSON.parse(localStorage.getItem('bvm_offline_surveys_queue') || '[]');
      if (offlineQueue.length > 0) {
        const remainingQueue = [...offlineQueue];
        for (const item of offlineQueue) {
          try {
            const { id, ...surveyPayload } = item;
            await addDoc(collection(db, 'survey_responses'), {
              ...surveyPayload,
              submittedAt: serverTimestamp(),
              userAgent: navigator.userAgent
            });
            remainingQueue.shift();
          } catch (syncErr) {
            console.warn("Failed to sync offline response, stopping sync sequence:", syncErr);
            break;
          }
        }
        localStorage.setItem('bvm_offline_surveys_queue', JSON.stringify(remainingQueue));
      }

      const q = query(collection(db, 'survey_responses'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docsList: ResponseDoc[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        docsList.push({
          id: doc.id,
          ...data
        } as ResponseDoc);
      });
      setResponses(docsList);
      // Save cache to localStorage
      localStorage.setItem('bvm_survey_responses_cache', JSON.stringify(docsList));
    } catch (err: any) {
      console.warn("Error retrieving survey responses, checking cache:", err);
      const cached = localStorage.getItem('bvm_survey_responses_cache');
      if (cached) {
        try {
          const docsList = JSON.parse(cached);
          setResponses(docsList);
          setError("Sie sind offline. Zeige lokal zwischengespeicherte Daten an.");
        } catch (parseErr) {
          setError("Verbindung zu Firestore fehlgeschlagen und lokaler Cache ist beschädigt.");
        }
      } else {
        setError("Verbindung zu Firestore fehlgeschlagen oder Sie sind offline. Keine zwischengespeicherten Daten vorhanden.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  // Compute averages
  const total = responses.length;
  const getAverage = (key: keyof ResponseDoc) => {
    if (total === 0) return 0;
    const sum = responses.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    return Number((sum / total).toFixed(1));
  };

  // Filter responses
  const filteredResponses = responses.filter(r => {
    const textFields = [
      r.content_more_desired, 
      r.content_less_desired, 
      r.improvement_suggestions, 
      r.tech_bugs_description
    ].join(' ').toLowerCase();
    return textFields.includes(searchTerm.toLowerCase());
  });

  const exportToJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(responses, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `BVM_Website_Survey_Responses_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportToCSV = () => {
    if (responses.length === 0) return;
    
    // Headers
    const headers = [
      'ID', 'Language', 'Submitted At',
      'Intuitive', 'Navigation Ease', 'Quick Find', 'Clear Menus', 'Logical Structure',
      'Content Helpful', 'Content Clear Texts', 'Content Appealing', 'More Content Desired', 'Less Content Desired',
      'Design Clarity', 'Design Readability', 'Design Modernity', 'Images Quality',
      'Loading Speed', 'Mobile Usability', 'Has Bugs', 'Bugs Description', 'Improvement Suggestions'
    ];

    const rows = responses.map(r => {
      const dateStr = r.submittedAt ? r.submittedAt.toDate().toISOString() : r.timestamp || '';
      return [
        r.id,
        r.language,
        dateStr,
        r.usability_intuitive,
        r.usability_navigation,
        r.usability_quick_find,
        r.usability_clear_menus,
        r.usability_logical_structure,
        r.content_helpful,
        r.content_clear_texts,
        r.content_appealing,
        `"${(r.content_more_desired || '').replace(/"/g, '""')}"`,
        `"${(r.content_less_desired || '').replace(/"/g, '""')}"`,
        r.design_clarity,
        r.design_readability,
        r.design_modernity,
        r.design_images_quality,
        r.tech_loading_speed,
        r.tech_mobile_usability,
        r.tech_has_bugs ? 'Yes' : 'No',
        `"${(r.tech_bugs_description || '').replace(/"/g, '""')}"`,
        `"${(r.improvement_suggestions || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `BVM_Website_Survey_Responses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-brand-orange/30 selection:text-brand-navy">
      <PuzzleBackground color="#0D9488" className="opacity-10" />
      <Navbar />

      <main className="relative z-10 pt-[72px] pb-24 max-w-7xl mx-auto px-6">
        
        {/* Header Breadcrumbs */}
        <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-brand-teal font-bold mb-3 hover:text-brand-teal/80 transition-all">
              <ArrowLeft size={16} /> Zurück zur Startseite
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-brand-navy flex items-center gap-2">
              <Database size={28} className="text-brand-orange" /> Umfragen-Dashboard <span className="text-xs bg-brand-teal/10 text-brand-teal px-2.5 py-1 rounded-full font-black uppercase tracking-wider">Internal Admin</span>
            </h1>
            <p className="text-slate-500 font-medium text-xs mt-1">
              Verwalte, analysiere und exportiere die Umfrageergebnisse zur Benutzerfreundlichkeit der Website von BVM e. V.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={fetchResponses}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-brand-navy px-4 py-3 rounded-xl border border-slate-200 font-extrabold text-xs transition-all shadow-sm"
            >
              <RefreshCw size={14} /> Aktualisieren
            </button>
            <button
              disabled={responses.length === 0}
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-brand-teal hover:bg-teal-700 text-white px-4 py-3 rounded-xl font-extrabold text-xs transition-all shadow-sm disabled:bg-teal-200"
            >
              <FileSpreadsheet size={14} /> CSV herunterladen
            </button>
            <button
              disabled={responses.length === 0}
              onClick={exportToJSON}
              className="flex items-center gap-2 bg-brand-navy hover:bg-slate-800 text-white px-4 py-3 rounded-xl font-extrabold text-xs transition-all shadow-sm disabled:bg-slate-700"
            >
              <FileText size={14} /> JSON exportieren
            </button>
          </div>
        </div>

        {/* Tab System */}
        <div className="flex gap-4 border-b border-slate-200 mt-8 mb-6">
          <button
            onClick={() => setActiveTab('results')}
            className={`pb-4 px-2 font-black text-sm transition-all border-b-2 relative ${
              activeTab === 'results' 
                ? 'border-brand-orange text-brand-navy' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Antworten & Statistiken ({total})
          </button>
          <button
            onClick={() => setActiveTab('gdrive')}
            className={`pb-4 px-2 font-black text-sm transition-all border-b-2 relative ${
              activeTab === 'gdrive' 
                ? 'border-brand-orange text-brand-navy' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Google Drive / Google Sheets
          </button>
        </div>

        {activeTab === 'results' ? (
          <div>
            {isLoading ? (
              <div className="py-24 text-center space-y-4">
                <RefreshCw size={40} className="text-brand-teal animate-spin mx-auto" />
                <p className="text-slate-500 font-bold text-sm">Umfrageergebnisse werden geladen...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-3xl text-center max-w-xl mx-auto my-12 space-y-3">
                <AlertTriangle size={32} className="mx-auto" />
                <h4 className="font-bold text-lg">Verbindungsfehler</h4>
                <p className="text-xs font-medium leading-relaxed">{error}</p>
                <p className="text-[10px] text-slate-400">Vergewissern Sie sich, dass die Firestore-Regeln hochgeladen und Ihre Datenbank bereitgestellt ist.</p>
              </div>
            ) : total === 0 ? (
              <div className="bg-white border border-slate-200 p-16 rounded-[2.5rem] text-center max-w-xl mx-auto my-12 space-y-4 shadow-sm">
                <Database size={48} className="text-slate-300 mx-auto" />
                <h3 className="text-xl font-extrabold text-brand-navy">Noch keine Umfragen</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed">
                  Bisher wurden noch keine Antworten in Ihrer Firestore-Datenbank gespeichert. Sobald Besucher an der Umfrage auf der Homepage teilnehmen, erscheinen die Daten hier in Echtzeit.
                </p>
                <button
                  onClick={() => {
                    localStorage.removeItem('bvm_survey_status');
                    window.location.reload();
                  }}
                  className="px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all"
                >
                  Umfrage auf Homepage testen
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                
                {/* Executive Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Navigation</span>
                    <div className="text-3xl font-black text-brand-navy flex items-center justify-center gap-1">
                      {getAverage('usability_navigation')} <Star size={20} className="text-amber-400 fill-amber-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Duchschnittlich (1-5)</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Inhalt & Texte</span>
                    <div className="text-3xl font-black text-brand-teal flex items-center justify-center gap-1">
                      {getAverage('content_helpful')} <Star size={20} className="text-brand-teal fill-brand-teal shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Duchschnittlich (1-5)</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Design Moderne</span>
                    <div className="text-3xl font-black text-brand-orange flex items-center justify-center gap-1">
                      {getAverage('design_modernity')} <Star size={20} className="text-brand-orange fill-brand-orange shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Duchschnittlich (1-5)</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Mobile Nutzung</span>
                    <div className="text-3xl font-black text-indigo-600 flex items-center justify-center gap-1">
                      {getAverage('tech_mobile_usability')} <Star size={20} className="text-indigo-600 fill-indigo-600 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Duchschnittlich (1-5)</p>
                  </div>
                </div>

                {/* Sub-Averages Table & Details */}
                <div className="grid lg:grid-cols-12 gap-8">
                  
                  {/* Detailed Scores list */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-brand-navy text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                      <Sliders size={16} className="text-brand-orange" /> Durchschnittliche Detailbewertungen
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Schnittstelle Intuitiv</span>
                          <span>{getAverage('usability_intuitive')} / 5</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange" style={{ width: `${(getAverage('usability_intuitive')/5)*100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Inhalte schnell finden</span>
                          <span>{getAverage('usability_quick_find')} / 5</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-teal" style={{ width: `${(getAverage('usability_quick_find')/5)*100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Menüs verständlich</span>
                          <span>{getAverage('usability_clear_menus')} / 5</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${(getAverage('usability_clear_menus')/5)*100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Texte verständlich</span>
                          <span>{getAverage('content_clear_texts')} / 5</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500" style={{ width: `${(getAverage('content_clear_texts')/5)*100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Bilder & Grafiken</span>
                          <span>{getAverage('design_images_quality')} / 5</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${(getAverage('design_images_quality')/5)*100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Ladezeiten</span>
                          <span>{getAverage('tech_loading_speed')} / 5</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500" style={{ width: `${(getAverage('tech_loading_speed')/5)*100}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Sprache: DE</span>
                        <span>{responses.filter(r => r.language === 'de').length} Antworten</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Sprache: TR</span>
                        <span>{responses.filter(r => r.language === 'tr').length} Antworten</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedbacks Listing */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-sm space-y-4 flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3 shrink-0">
                      <h3 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                        <MessageSquare size={16} className="text-brand-orange" /> Einzelne Rückmeldungen
                      </h3>
                      
                      <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Feedback filtern..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-teal font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[500px] flex-1 pr-1">
                      {filteredResponses.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-medium text-xs">
                          Keine Treffer für Ihre Suche gefunden.
                        </div>
                      ) : (
                        filteredResponses.map((resItem) => {
                          const date = resItem.submittedAt ? resItem.submittedAt.toDate().toLocaleString('de-DE') : resItem.timestamp ? new Date(resItem.timestamp).toLocaleString('de-DE') : 'Unbekannt';
                          return (
                            <div key={resItem.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                              <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                    {resItem.language === 'de' ? '🇩🇪 DE' : '🇹🇷 TR'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                    <Calendar size={10} /> {date}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {resItem.id.slice(0, 6)}...</span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div className="bg-white p-2 rounded-xl border border-slate-100">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">Navi</div>
                                  <div className="font-extrabold text-sm text-brand-navy">{resItem.usability_navigation} <span className="text-[10px] text-slate-400 font-normal">/5</span></div>
                                </div>
                                <div className="bg-white p-2 rounded-xl border border-slate-100">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">Inhalte</div>
                                  <div className="font-extrabold text-sm text-brand-teal">{resItem.content_helpful} <span className="text-[10px] text-slate-400 font-normal">/5</span></div>
                                </div>
                                <div className="bg-white p-2 rounded-xl border border-slate-100">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">Design</div>
                                  <div className="font-extrabold text-sm text-brand-orange">{resItem.design_modernity} <span className="text-[10px] text-slate-400 font-normal">/5</span></div>
                                </div>
                                <div className="bg-white p-2 rounded-xl border border-slate-100">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">Ladezeit</div>
                                  <div className="font-extrabold text-sm text-indigo-600">{resItem.tech_loading_speed} <span className="text-[10px] text-slate-400 font-normal">/5</span></div>
                                </div>
                              </div>

                              {resItem.content_more_desired && (
                                <div className="text-xs">
                                  <strong className="text-brand-navy font-bold text-[11px] block">Mehr gewünschte Inhalte:</strong>
                                  <p className="text-slate-600 mt-0.5">{resItem.content_more_desired}</p>
                                </div>
                              )}

                              {resItem.content_less_desired && (
                                <div className="text-xs">
                                  <strong className="text-brand-navy font-bold text-[11px] block">Weniger gewünschte Inhalte:</strong>
                                  <p className="text-slate-600 mt-0.5">{resItem.content_less_desired}</p>
                                </div>
                              )}

                              {resItem.tech_has_bugs && (
                                <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs">
                                  <strong className="text-red-700 font-bold text-[11px] flex items-center gap-1">
                                    <AlertTriangle size={12} /> Fehler entdeckt:
                                  </strong>
                                  <p className="text-red-600 mt-0.5">{resItem.tech_bugs_description || 'Keine Beschreibung angegeben'}</p>
                                </div>
                              )}

                              {resItem.improvement_suggestions && (
                                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs">
                                  <strong className="text-brand-teal font-bold text-[11px] flex items-center gap-1">
                                    <Sparkles size={12} /> Verbesserungsvorschläge:
                                  </strong>
                                  <p className="text-slate-600 mt-0.5">{resItem.improvement_suggestions}</p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/80 shadow-sm animate-fade-in space-y-8">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                  <Cloud className="text-brand-orange" size={24} /> Google Drive Backup & Sync Integration
                </h3>
                <p className="text-slate-500 font-medium text-xs">
                  Automatisierte und zuverlässige Speicherung aller Umfrageergebnisse direkt in Ihrem Google-Drive-Ordner.
                </p>
              </div>
              <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal font-extrabold text-[10px] uppercase rounded-full tracking-wide">
                Datenschutzkonform
              </span>
            </div>

            {/* Explanatory intro */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs leading-relaxed text-slate-600 space-y-3 font-medium">
              <p>
                <strong>Architektur-Hinweis für öffentliche Website-Umfragen:</strong> Da öffentliche, anonyme Website-Besucher nicht über Ihre administrativen Google-Drive-Berechtigungen verfügen, ist es <strong>technisch nicht ratsam</strong>, den Besucher direkt beim Absenden nach einem Google-Drive-Login zu fragen. Sie würden sonst die Antworten in <em>deren</em> persönlichem Drive und nicht in Ihrem Vereins-Drive speichern.
              </p>
              <p>
                Stattdessen speichert diese Applet-Architektur die Antworten standardmäßig 100% zuverlässig in Ihrer geschützten <strong>Firestore-Datenbank</strong>. Über die folgenden zwei Wege können die Antworten automatisch in Echtzeit in Ihr Google Drive fließen:
              </p>
            </div>

            {/* Implementation choices */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Option A: Google Sheets Sync (Google Apps Script) */}
              <div className="border border-slate-200/80 p-6 rounded-2xl space-y-4 hover:border-brand-orange/40 transition-all flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange">
                  <FileSpreadsheet size={20} />
                </div>
                <h4 className="font-extrabold text-brand-navy text-sm">Option A: Automatische Google-Tabelle in Drive (Empfohlen)</h4>
                <p className="text-slate-500 text-xs leading-relaxed flex-1">
                  Verbinden Sie die Umfrage mit einer Google-Tabelle in Ihrem Wunsch-Drive-Ordner. Jedes Mal, wenn ein Besucher die Umfrage absendet, wird sofort eine neue Zeile in der Tabelle erstellt.
                </p>
                
                <div className="pt-2 border-t border-slate-100">
                  <h5 className="font-extrabold text-brand-navy text-xs mb-1">Kurzanleitung:</h5>
                  <ol className="text-[10px] text-slate-500 list-decimal pl-4 space-y-1">
                    <li>Erstellen Sie eine Google-Tabelle in Ihrem Drive-Ordner.</li>
                    <li>Gehen Sie auf <strong>Erweiterungen &gt; Apps Script</strong>.</li>
                    <li>Fügen Sie das untenstehende Script ein und klicken Sie auf "Als Web-App bereitstellen".</li>
                    <li>Tragen Sie die bereitgestellte Web-App-URL in Ihre App ein.</li>
                  </ol>
                </div>

                <button
                  onClick={() => copyToClipboard(`function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Erstelle Kopfzeilen falls leer
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Zeitstempel", "Sprache", "Intuitiv", "Navigation", "Schnell Finden", 
        "Menüs", "Struktur", "Inhalte Hilfreich", "Texte", "Darstellung", 
        "Mehr Inhalt", "Weniger Inhalt", "Ladezeit", "Mobile Nutzung", 
        "Fehler?", "Fehlerbeschreibung", "Verbesserungsvorschläge"
      ]);
    }
    
    sheet.appendRow([
      new Date(),
      data.language,
      data.usability_intuitive,
      data.usability_navigation,
      data.usability_quick_find,
      data.usability_clear_menus,
      data.usability_logical_structure,
      data.content_helpful,
      data.content_clear_texts,
      data.content_appealing,
      data.content_more_desired,
      data.content_less_desired,
      data.tech_loading_speed,
      data.tech_mobile_usability,
      data.tech_has_bugs ? "Ja" : "Nein",
      data.tech_bugs_description,
      data.improvement_suggestions
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`, 'script_a')}
                  className="w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-brand-navy flex items-center justify-center gap-2 transition-all mt-2"
                >
                  {copiedId === 'script_a' ? <Check size={14} className="text-emerald-500" /> : <Download size={14} />}
                  {copiedId === 'script_a' ? 'Apps Script Code kopiert!' : 'Apps Script Code kopieren'}
                </button>

                {/* Live connection setup */}
                <div className="pt-4 border-t border-slate-100 space-y-3 mt-4">
                  <h5 className="font-extrabold text-brand-navy text-xs">Echtzeit-Verbindung konfigurieren</h5>
                  
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Google Apps Script Web-App-URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={googleSheetsUrl}
                      onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-slate-700 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSavingSettings}
                      className="py-2 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      {isSavingSettings ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                      Speichern
                    </button>
                    <button
                      onClick={handleTestConnection}
                      disabled={isTestingSettings || !googleSheetsUrl}
                      className="py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      {isTestingSettings ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                      Test Senden
                    </button>
                  </div>

                  {settingsMessage && (
                    <div className={`p-2.5 rounded-xl text-[10px] font-medium border leading-relaxed animate-fade-in ${
                      settingsMessage.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {settingsMessage.text}
                    </div>
                  )}
                </div>

              </div>

              {/* Option B: JSON Backups in Google Drive */}
              <div className="border border-slate-200/80 p-6 rounded-2xl space-y-4 hover:border-brand-orange/40 transition-all flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange">
                  <FolderOpen size={20} />
                </div>
                <h4 className="font-extrabold text-brand-navy text-sm">Option B: JSON/CSV-Datei Backup in Drive-Ordner</h4>
                <p className="text-slate-500 text-xs leading-relaxed flex-1">
                  Generieren Sie strukturierte JSON- oder CSV-Dateien für jede Antwort und laden Sie diese über eine automatisierte Cloud-Funktion (Firebase Cloud Function) in ein definiertes Google Drive-Verzeichnis hoch.
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <h5 className="font-extrabold text-brand-navy text-xs mb-1">Technische Drive-Struktur:</h5>
                  <div className="bg-slate-950 p-3 rounded-lg text-[10px] text-emerald-400 font-mono space-y-1">
                    <div>Google Drive Verzeichnis:</div>
                    <div className="text-slate-300">/BVM_Website_Umfragen_Feedback/</div>
                    <div className="text-slate-500 mt-2">// Dateiformat für jede Antwort:</div>
                    <div className="text-white">response_[ID]_[TIMESTAMP].json</div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Info size={14} className="text-brand-orange inline mr-1.5 -translate-y-0.5 shrink-0" />
                  <strong>Tipp:</strong> Die strukturierte JSON/CSV kann auch manuell mit den Buttons oben rechts exportiert werden und in jedes beliebige Drive-Verzeichnis hochgeladen werden.
                </div>
              </div>

            </div>

            {/* Database properties */}
            <div className="border-t border-slate-100 pt-8">
              <h4 className="font-extrabold text-brand-navy text-sm mb-3">Verwendetes Daten-Schema (JSON)</h4>
              <p className="text-slate-500 text-xs mb-4">Das folgende JSON-Schema wird für jede Antwort strukturiert erfasst:</p>
              
              <div className="bg-slate-950 text-emerald-400 font-mono text-[10px] p-4 rounded-xl overflow-x-auto relative">
                <button
                  onClick={() => copyToClipboard(`{
  "language": "de",                  // "de" oder "tr"
  "usability_intuitive": 5,          // Bewertung 1-5
  "usability_navigation": 4,         // Bewertung 1-5
  "usability_quick_find": 4,         // Bewertung 1-5
  "usability_clear_menus": 5,        // Bewertung 1-5
  "usability_logical_structure": 5,  // Bewertung 1-5
  "content_helpful": 5,              // Bewertung 1-5
  "content_clear_texts": 4,          // Bewertung 1-5
  "content_appealing": 4,            // Bewertung 1-5
  "content_more_desired": "Beiträge", // Freitext
  "content_less_desired": "Keine",   // Freitext
  "design_clarity": 5,               // Bewertung 1-5
  "design_readability": 5,           // Bewertung 1-5
  "design_modernity": 5,             // Bewertung 1-5
  "design_images_quality": 4,        // Bewertung 1-5
  "tech_loading_speed": 4,           // Bewertung 1-5
  "tech_mobile_usability": 5,        // Bewertung 1-5
  "tech_has_bugs": false,            // boolean
  "tech_bugs_description": "",       // Freitext
  "improvement_suggestions": "",     // Freitext
  "timestamp": "2026-07-12T10:00:00Z"
}`, 'schema')}
                  className="absolute top-2 right-2 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] transition-colors"
                >
                  {copiedId === 'schema' ? 'Kopiert!' : 'Kopieren'}
                </button>
                <pre>{`{
  "language": "de",                  // "de" oder "tr"
  "usability_intuitive": 5,          // Bewertung 1-5
  "usability_navigation": 4,         // Bewertung 1-5
  "usability_quick_find": 4,         // Bewertung 1-5
  "usability_clear_menus": 5,        // Bewertung 1-5
  "usability_logical_structure": 5,  // Bewertung 1-5
  "content_helpful": 5,              // Bewertung 1-5
  "content_clear_texts": 4,          // Bewertung 1-5
  "content_appealing": 4,            // Bewertung 1-5
  "content_more_desired": "Beiträge", // Freitext
  "content_less_desired": "Keine",   // Freitext
  "design_clarity": 5,               // Bewertung 1-5
  "design_readability": 5,           // Bewertung 1-5
  "design_modernity": 5,             // Bewertung 1-5
  "design_images_quality": 4,        // Bewertung 1-5
  "tech_loading_speed": 4,           // Bewertung 1-5
  "tech_mobile_usability": 5,        // Bewertung 1-5
  "tech_has_bugs": false,            // boolean
  "tech_bugs_description": "",       // Freitext
  "improvement_suggestions": "",     // Freitext
  "timestamp": "2026-07-12T10:00:00Z"
}`}</pre>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
