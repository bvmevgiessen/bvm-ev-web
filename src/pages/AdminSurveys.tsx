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
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PuzzleBackground from '../components/PuzzleBackground';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { postToAppsScript } from '../lib/appsScriptProxy';
import { initAuth, googleSignIn, logout as googleLogout } from '../lib/googleAuth';
import { User } from 'firebase/auth';

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
  const [activeTab, setActiveTab] = useState<'results' | 'gdrive' | 'database'>('results');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isTestingSettings, setIsTestingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const [googleSpreadsheetId, setGoogleSpreadsheetId] = useState('');
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSyncingDirect, setIsSyncingDirect] = useState(false);
  const [directSyncMessage, setDirectSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    try {
      setInIframe(window.self !== window.top);
    } catch (e) {
      setInIframe(true);
    }
  }, []);

  // Initialize google auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

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
          if (data.googleSpreadsheetId) {
            setGoogleSpreadsheetId(data.googleSpreadsheetId);
            localStorage.setItem('bvm_google_spreadsheet_id', data.googleSpreadsheetId);
          }
        }
      } catch (err) {
        console.warn("Using offline fallback for Google Sheets settings:", err);
        try {
          handleFirestoreError(err, OperationType.GET, 'survey_settings/config');
        } catch (logErr) {
          console.error("Logged Firestore error detail:", logErr);
        }
        const cachedUrl = localStorage.getItem('bvm_google_sheets_url');
        if (cachedUrl) {
          setGoogleSheetsUrl(cachedUrl);
        }
        const cachedSpreadsheetId = localStorage.getItem('bvm_google_spreadsheet_id');
        if (cachedSpreadsheetId) {
          setGoogleSpreadsheetId(cachedSpreadsheetId);
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
      try {
        handleFirestoreError(err, OperationType.WRITE, 'survey_settings/config');
      } catch (logErr) {
        console.error("Logged Firestore error detail:", logErr);
      }
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

      // Use text/plain;charset=utf-8 as standard CORS-safelisted content-type via the helper.
      await postToAppsScript(googleSheetsUrl, testPayload);

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

  const handleGoogleLogin = async () => {
    setDirectSyncMessage(null);
    setIsGoogleLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setDirectSyncMessage({
          type: 'success',
          text: `Erfolgreich angemeldet als ${result.user.email}!`
        });
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setDirectSyncMessage({
        type: 'error',
        text: err.message || String(err)
      });
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await googleLogout();
      setGoogleUser(null);
      setGoogleToken(null);
      setDirectSyncMessage({
        type: 'success',
        text: 'Erfolgreich abgemeldet!'
      });
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  };

  const handleSaveSpreadsheetId = async () => {
    setIsSavingSettings(true);
    setDirectSyncMessage(null);
    try {
      localStorage.setItem('bvm_google_spreadsheet_id', googleSpreadsheetId);
      const docRef = doc(db, 'survey_settings', 'config');
      await setDoc(docRef, {
        googleSpreadsheetId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setDirectSyncMessage({
        type: 'success',
        text: 'Google-Tabellen-ID erfolgreich gespeichert!'
      });
    } catch (err: any) {
      console.error("Error saving spreadsheet ID:", err);
      setDirectSyncMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Tabellen-ID: ' + err.message
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCreateGoogleSheet = async () => {
    if (!googleToken) {
      setDirectSyncMessage({
        type: 'error',
        text: 'Bitte melden Sie sich zuerst mit Ihrem Google-Konto an.'
      });
      return;
    }
    
    setIsCreatingSheet(true);
    setDirectSyncMessage(null);
    try {
      // 1. Create spreadsheet file using Sheets API v4
      const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: "BVM Website Umfragen Feedback"
          },
          sheets: [
            {
              properties: {
                title: "Antworten"
              }
            }
          ]
        })
      });
      
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error?.message || `HTTP ${res.status}`);
      }
      
      const sheetData = await res.json();
      const spreadsheetId = sheetData.spreadsheetId;
      const spreadsheetUrl = sheetData.spreadsheetUrl;
      
      setGoogleSpreadsheetId(spreadsheetId);
      localStorage.setItem('bvm_google_spreadsheet_id', spreadsheetId);
      
      // Save spreadsheetId and spreadsheetUrl to Firestore config
      const docRef = doc(db, 'survey_settings', 'config');
      await setDoc(docRef, {
        googleSpreadsheetId: spreadsheetId,
        googleSpreadsheetUrl: spreadsheetUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // 2. Initialize header row
      const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Antworten!A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [
            [
              "Zeitstempel", "Sprache", "Intuitiv", "Navigation", "Schnell Finden", 
              "Menüs", "Struktur", "Inhalte Hilfreich", "Texte", "Darstellung", 
              "Mehr Inhalt", "Weniger Inhalt", "Ladezeit", "Mobile Nutzung", 
              "Fehler?", "Fehlerbeschreibung", "Verbesserungsvorschläge"
            ]
          ]
        })
      });
      
      if (!appendRes.ok) {
        console.warn("Spreadsheet created, but failed to write initial header row:", appendRes.status);
      }
      
      setDirectSyncMessage({
        type: 'success',
        text: `Google-Tabelle "BVM Website Umfragen Feedback" wurde erfolgreich in Ihrem Google Drive erstellt! ID: ${spreadsheetId}`
      });
    } catch (err: any) {
      console.error('Error creating Google Sheet:', err);
      setDirectSyncMessage({
        type: 'error',
        text: 'Fehler beim Erstellen der Google-Tabelle: ' + err.message
      });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleSyncDataToGoogleSheet = async () => {
    if (!googleToken) {
      setDirectSyncMessage({
        type: 'error',
        text: 'Bitte melden Sie sich zuerst mit Ihrem Google-Konto an.'
      });
      return;
    }
    if (!googleSpreadsheetId) {
      setDirectSyncMessage({
        type: 'error',
        text: 'Bitte erstellen Sie zuerst eine Google-Tabelle oder tragen Sie eine Tabellen-ID ein.'
      });
      return;
    }
    
    setIsSyncingDirect(true);
    setDirectSyncMessage(null);
    try {
      // 1. Fetch latest responses from Firestore
      const q = query(collection(db, 'survey_responses'), orderBy('submittedAt', 'asc'));
      const querySnapshot = await getDocs(q);
      const rows: any[][] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const submittedDate = data.submittedAt instanceof Timestamp 
          ? data.submittedAt.toDate().toLocaleString('de-DE')
          : data.timestamp ? new Date(data.timestamp).toLocaleString('de-DE') : new Date().toLocaleString('de-DE');
        
        rows.push([
          submittedDate,
          data.language || 'de',
          data.usability_intuitive,
          data.usability_navigation,
          data.usability_quick_find,
          data.usability_clear_menus,
          data.usability_logical_structure,
          data.content_helpful,
          data.content_clear_texts,
          data.content_appealing,
          data.content_more_desired || '',
          data.content_less_desired || '',
          data.tech_loading_speed,
          data.tech_mobile_usability,
          data.tech_has_bugs ? "Ja" : "Nein",
          data.tech_bugs_description || '',
          data.improvement_suggestions || ''
        ]);
      });
      
      if (rows.length === 0) {
        setDirectSyncMessage({
          type: 'success',
          text: 'Keine Antworten in Firestore gefunden, die synchronisiert werden könnten.'
        });
        setIsSyncingDirect(false);
        return;
      }
      
      // 2. Clear existing values in sheet and write all rows back to keep it perfectly in sync with Firestore!
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetId}/values/Antworten!A2:Z10000:clear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update values
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetId}/values/Antworten!A2?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: rows
        })
      });
      
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error?.message || `HTTP ${res.status}`);
      }
      
      setDirectSyncMessage({
        type: 'success',
        text: `Erfolgreich ${rows.length} Antworten aus Firestore direkt in Ihre Google-Tabelle synchronisiert!`
      });
    } catch (err: any) {
      console.error('Error syncing to Google Sheet:', err);
      setDirectSyncMessage({
        type: 'error',
        text: 'Fehler bei der Synchronisierung: ' + err.message
      });
    } finally {
      setIsSyncingDirect(false);
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
      try {
        handleFirestoreError(err, OperationType.LIST, 'survey_responses');
      } catch (logErr) {
        console.error("Logged Firestore error detail:", logErr);
      }
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
          <button
            onClick={() => setActiveTab('database')}
            className={`pb-4 px-2 font-black text-sm transition-all border-b-2 relative ${
              activeTab === 'database' 
                ? 'border-brand-orange text-brand-navy' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Datenbank-Verbindung
          </button>
        </div>

        {activeTab === 'results' && (
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
        )}

        {activeTab === 'gdrive' && (
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
                Stattdessen speichert diese Applet-Architektur die Antworten standardmäßig 100% zuverlässig in Ihrer geschützten <strong>Firestore-Datenbank</strong>. Über die folgenden Wege können die Antworten automatisch in Echtzeit oder per Klick direkt in Ihr Google Drive fließen:
              </p>
            </div>

            {/* Implementation choices */}
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Option C: Google-Konto Direkt-Synchronisierung */}
              <div className="border border-brand-orange/60 bg-orange-50/5 p-6 rounded-2xl space-y-4 hover:border-brand-orange transition-all flex flex-col shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-brand-orange">
                  <Cloud size={20} />
                </div>
                <h4 className="font-extrabold text-brand-navy text-sm">Empfohlene Option: Google-Konto Direkt-Synchronisierung</h4>
                <p className="text-slate-500 text-xs leading-relaxed flex-1">
                  Melden Sie sich direkt mit Ihrem Google-Konto (z.B. <strong>bvmevgiessen@gmail.com</strong>) an, um ohne Google Apps Script eine Google-Tabelle in Ihrem Drive zu erstellen und Firestore-Daten dorthin zu übertragen.
                </p>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {!googleUser ? (
                    <div className="space-y-3">
                      {inIframe ? (
                        <div className="space-y-3 bg-amber-50/50 border border-brand-orange/30 p-4 rounded-xl">
                          <p className="text-[11px] text-brand-navy font-bold leading-normal flex items-start gap-1.5">
                            <span className="text-brand-orange text-sm leading-none">⚠️</span>
                            <span>Google-Login im Vorschau-Iframe blockiert</span>
                          </p>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Da diese Vorschau in einem gesicherten AI Studio Iframe läuft, blockieren Browser das Google-Popup und Drittanbieter-Cookies.
                            Bitte öffnen Sie die Anwendung in einem neuen Tab, um sich erfolgreich mit Google anzumelden.
                          </p>
                          <a
                            href={window.location.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer hover:no-underline"
                          >
                            <ExternalLink size={12} /> App in neuem Tab öffnen
                          </a>
                          
                          <div className="text-center pt-2 border-t border-slate-100">
                            <button
                              onClick={handleGoogleLogin}
                              disabled={isGoogleLoggingIn}
                              className="text-[10px] text-slate-400 hover:text-slate-600 underline bg-transparent border-none cursor-pointer"
                            >
                              {isGoogleLoggingIn ? 'Anmeldung läuft...' : 'Dennoch hier im Iframe versuchen'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoggingIn}
                            className="w-full text-center py-2.5 bg-white hover:bg-slate-50 disabled:opacity-60 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                          >
                            {isGoogleLoggingIn ? (
                              <RefreshCw size={14} className="animate-spin text-slate-500" />
                            ) : (
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.99 1 12 1 7.24 1 3.2 3.74 1.25 7.75l3.96 3.07C6.18 7.37 8.87 5.04 12 5.04z" />
                                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.47-5.01 3.47-8.64z" />
                                <path fill="#FBBC05" d="M5.21 10.82c-.25-.75-.39-1.56-.39-2.39s.14-1.64.39-2.39L1.25 6.97C.45 8.56 0 10.35 0 12.27s.45 3.71 1.25 5.3l3.96-3.07c-.25-.75-.39-1.56-.39-2.39z" />
                                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.52 1.18-4.2 1.18-3.13 0-5.82-2.33-6.79-5.78L1.25 15.6C3.2 19.61 7.24 22.27 12 22.27z" />
                              </svg>
                            )}
                            {isGoogleLoggingIn ? 'Anmeldung läuft...' : 'Mit Google anmelden'}
                          </button>
                          
                          <div className="text-center pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 leading-normal">
                              Sie befinden sich in einem separaten Tab. Das Google-Anmeldefenster sollte sich problemlos öffnen.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Connection status */}
                      <div className="flex items-center justify-between gap-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2">
                          {googleUser.photoURL ? (
                            <img src={googleUser.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-emerald-200" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-[10px] text-emerald-800">
                              {googleUser.email?.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="text-left">
                            <div className="text-[10px] font-black text-emerald-900 leading-none">Verbunden</div>
                            <div className="text-[9px] text-emerald-700 truncate max-w-[120px]">{googleUser.email}</div>
                          </div>
                        </div>
                        <button
                          onClick={handleGoogleLogout}
                          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[9px] font-bold text-slate-500 transition-all cursor-pointer"
                        >
                          Abmelden
                        </button>
                      </div>

                      {/* Google spreadsheet input & creator */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            Google-Tabellen-ID
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="ID oder erstelle eine neue..."
                              value={googleSpreadsheetId}
                              onChange={(e) => setGoogleSpreadsheetId(e.target.value)}
                              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-slate-700 bg-white"
                            />
                            <button
                              onClick={handleSaveSpreadsheetId}
                              className="px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Sichern
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={handleCreateGoogleSheet}
                            disabled={isCreatingSheet}
                            className="py-2.5 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white rounded-xl text-[10px] font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            {isCreatingSheet ? <RefreshCw size={12} className="animate-spin" /> : <FileSpreadsheet size={12} />}
                            Erstellen
                          </button>
                          <button
                            onClick={handleSyncDataToGoogleSheet}
                            disabled={isSyncingDirect || !googleSpreadsheetId}
                            className="py-2.5 bg-brand-teal hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-[10px] font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            {isSyncingDirect ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                            Syncen
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {directSyncMessage && (
                    <div className={`p-3 rounded-xl text-[10px] font-medium border leading-relaxed animate-fade-in ${
                      directSyncMessage.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {directSyncMessage.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Option A: Google Sheets Sync (Google Apps Script) */}
              <div className="border border-slate-200/80 p-6 rounded-2xl space-y-4 hover:border-brand-orange/40 transition-all flex flex-col shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange">
                  <FileSpreadsheet size={20} />
                </div>
                <h4 className="font-extrabold text-brand-navy text-sm">Option A: Automatische Google-Tabelle in Drive (Empfohlen)</h4>
                <p className="text-slate-500 text-xs leading-relaxed flex-1">
                  Verbinden Sie die Umfrage mit einer Google-Tabelle in Ihrem Wunsch-Drive-Ordner. Jedes Mal, wenn ein Besucher die Umfrage absendet, wird sofort eine neue Zeile in der Tabelle erstellt.
                </p>
                
                <div className="pt-2 border-t border-slate-100">
                  <h5 className="font-extrabold text-brand-navy text-xs mb-1">Kurzanleitung:</h5>
                  <ol className="text-[10px] text-slate-500 list-decimal pl-4 space-y-1.5 leading-relaxed">
                    <li>Erstellen Sie eine Google-Tabelle in Ihrem Drive-Ordner.</li>
                    <li>Gehen Sie im Tabellen-Menü auf <strong>Erweiterungen &gt; Apps Script</strong>.</li>
                    <li>Ersetzen Sie den dortigen Code durch das untenstehende Script und speichern Sie es.</li>
                    <li>Klicken Sie oben rechts auf <strong>Bereitstellen &gt; Neue Bereitstellung</strong>.</li>
                    <li>Wählen Sie den Typ <strong>Web-App</strong>. Ausführen als: <strong>Sie selbst</strong>. Wer hat Zugriff: <strong>Jeder</strong> (Sehr wichtig!).</li>
                    <li>Kopieren Sie die erzeugte <strong>Web-App-URL</strong> (endet auf <code>/exec</code>, NICHT die Editor-URL!) und tragen Sie diese unten ein.</li>
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
                    <div className={`p-3.5 rounded-2xl text-[11px] font-medium border leading-relaxed animate-fade-in ${
                      settingsMessage.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      <div className="font-bold mb-1.5">{settingsMessage.text}</div>
                      {settingsMessage.type === 'error' && (
                        <div className="mt-3 pt-3 border-t border-rose-100 space-y-2 text-[10px] text-rose-600 font-medium">
                          <p className="font-bold uppercase tracking-wider text-[9px] text-rose-700">🔍 Häufige Fehlerquellen beheben:</p>
                          <ul className="list-disc pl-3.5 space-y-1">
                            <li>
                              <strong>Falsche Berechtigungen (Sehr häufig):</strong> Klicken Sie in Google Apps Script auf <strong>Bereitstellen &gt; Neue Bereitstellung</strong>. Wählen Sie das Zahnrad-Symbol &gt; <strong>Web-App</strong>. Stellen Sie sicher, dass bei <strong>"Wer hat Zugriff" (Who has access)</strong> unbedingt <strong>"Jeder" (Anyone)</strong> und NICHT "Nur ich" oder "Jeder mit Google-Konto" ausgewählt ist!
                            </li>
                            <li>
                              <strong>Editor-URL statt Web-App-URL:</strong> Verwenden Sie die kopierte Web-App-URL, die auf <code>/exec</code> endet. Die Editor-URL (endet auf <code>/edit</code>) kann nicht für Datenübertragungen aufgerufen werden.
                            </li>
                            <li>
                              <strong>Neue Bereitstellung vergessen:</strong> Wenn Sie Änderungen am Skriptcode vorgenommen haben, müssen Sie in Google Apps Script eine <strong>"Neue Bereitstellung"</strong> erstellen, damit die Änderungen live geschaltet werden. Nur auf "Speichern" zu drücken reicht nicht aus.
                            </li>
                            <li>
                              <strong>Adblocker:</strong> Einige aggressive Adblocker oder Privatsphäre-Erweiterungen blockieren direkte POST-Anfragen an script.google.com. Schalten Sie diese für diese Domain kurzzeitig aus.
                            </li>
                          </ul>
                        </div>
                      )}
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

        {activeTab === 'database' && (
          <DatabaseConfigPanel />
        )}

      </main>
    </div>
  );
}

function DatabaseConfigPanel() {
  const [currentDbId, setCurrentDbId] = useState(() => {
    return localStorage.getItem('bvm_firebase_database_id') || 'ai-studio-07e2d538-c938-490a-b092-7a517f5e2308';
  });
  const [customDbId, setCustomDbId] = useState(currentDbId === 'default' ? '' : currentDbId);
  const [isSaving, setIsSaving] = useState(false);
  const [connStatus, setConnStatus] = useState<'testing' | 'success' | 'error' | null>(null);
  const [connError, setConnError] = useState<string | null>(null);

  // Test the current database connection
  const testConnection = async () => {
    setConnStatus('testing');
    setConnError(null);
    try {
      const docRef = doc(db, 'survey_settings', 'config');
      await getDoc(docRef);
      setConnStatus('success');
    } catch (err: any) {
      console.error("Database connection test failed:", err);
      setConnStatus('error');
      setConnError(err?.message || String(err));
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleSaveDatabaseId = (id: string) => {
    localStorage.setItem('bvm_firebase_database_id', id);
    setIsSaving(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/80 shadow-sm animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
            <Database className="text-brand-orange" size={24} /> Firebase-Datenbank-Verbindung
          </h3>
          <p className="text-slate-500 font-medium text-xs">
            Verwalten Sie die aktive Firestore-Datenbankinstanz für Ihre Anwendung.
          </p>
        </div>
        
        {connStatus === 'testing' && (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 font-extrabold text-[10px] uppercase rounded-full tracking-wide flex items-center gap-1.5">
            <RefreshCw size={10} className="animate-spin" /> Verbindung wird getestet...
          </span>
        )}
        {connStatus === 'success' && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[10px] uppercase rounded-full tracking-wide flex items-center gap-1.5">
            <Check size={10} /> Erfolgreich verbunden
          </span>
        )}
        {connStatus === 'error' && (
          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 font-extrabold text-[10px] uppercase rounded-full tracking-wide flex items-center gap-1.5">
            <AlertTriangle size={10} /> Verbindung fehlerhaft
          </span>
        )}
      </div>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <h4 className="font-extrabold text-brand-navy text-sm">Zwei Datenbanken Erklärt</h4>
        <p className="text-slate-500 text-xs leading-relaxed">
          Ihr Firebase-Projekt besitzt in der Regel zwei Datenbank-Instanzen. Das kann verwirrend sein, falls Einstellungen (z.B. Google Sheets IDs oder Google Apps Script-URLs) in einer Datenbank gespeichert sind, die Anwendung jedoch versucht, sich mit der anderen zu verbinden.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-brand-teal font-extrabold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal" /> Standard-Datenbank (Default)
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">(default)</code>. Dies ist die herkömmliche Standard-Datenbank Ihres Google Cloud/Firebase-Projekts.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-brand-orange font-extrabold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" /> Workspace-Spezifisch (AI Studio)
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">ai-studio-07e2d538-c938-490a-b092-7a517f5e2308</code>. Dies ist die dedizierte Instanz für Ihren AI Studio Workspace.
            </p>
          </div>
        </div>
      </div>

      {isSaving && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 animate-pulse">
          <RefreshCw size={14} className="animate-spin" /> Datenbank wird gewechselt... Seite lädt neu...
        </div>
      )}

      <div className="space-y-6">
        <h4 className="font-extrabold text-brand-navy text-sm">Aktive Datenbank auswählen</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleSaveDatabaseId('default')}
            disabled={isSaving}
            className={`p-6 rounded-2xl border text-left transition-all relative ${
              currentDbId === 'default'
                ? 'border-brand-teal bg-teal-50/20 text-brand-navy shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {currentDbId === 'default' && (
              <span className="absolute top-4 right-4 bg-brand-teal text-white w-5 h-5 rounded-full flex items-center justify-center">
                <Check size={12} />
              </span>
            )}
            <div className="font-extrabold text-sm mb-1">Standard-Datenbank</div>
            <div className="text-[10px] text-slate-400 font-mono mb-3">ID: (default)</div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Wählen Sie diese Option, falls sich Ihre Umfragedaten und Konfigurationen in der Standard-Instanz befinden.
            </p>
          </button>

          <button
            onClick={() => handleSaveDatabaseId('ai-studio-07e2d538-c938-490a-b092-7a517f5e2308')}
            disabled={isSaving}
            className={`p-6 rounded-2xl border text-left transition-all relative ${
              currentDbId === 'ai-studio-07e2d538-c938-490a-b092-7a517f5e2308'
                ? 'border-brand-teal bg-teal-50/20 text-brand-navy shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {currentDbId === 'ai-studio-07e2d538-c938-490a-b092-7a517f5e2308' && (
              <span className="absolute top-4 right-4 bg-brand-teal text-white w-5 h-5 rounded-full flex items-center justify-center">
                <Check size={12} />
              </span>
            )}
            <div className="font-extrabold text-sm mb-1">Workspace-Spezifisch</div>
            <div className="text-[10px] text-slate-400 font-mono mb-3">ID: ai-studio-07e2d538-c938...</div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Standard-Einstellung des AI Studio Blueprints. Wählen Sie diese Option, um die standardmäßige Workspace-Datenbank zu verwenden.
            </p>
          </button>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h5 className="font-extrabold text-brand-navy text-xs">Eigene benutzerdefinierte Datenbank-ID eingeben</h5>
          <div className="flex gap-3 max-w-xl">
            <input
              type="text"
              placeholder="z.B. meine-datenbank-id"
              value={customDbId}
              onChange={(e) => setCustomDbId(e.target.value)}
              disabled={isSaving}
              className="text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal text-slate-700 bg-white"
            />
            <button
              onClick={() => handleSaveDatabaseId(customDbId.trim() || 'default')}
              disabled={isSaving || !customDbId.trim()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0"
            >
              Speichern & Aktivieren
            </button>
          </div>
        </div>

        {connStatus === 'error' && connError && (
          <div className="p-4 bg-red-50 text-red-800 border border-red-100 rounded-2xl text-xs space-y-2">
            <div className="font-extrabold flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-red-600" /> Verbindungsfehler-Details:
            </div>
            <pre className="font-mono text-[10px] bg-white p-3 rounded-lg border border-red-200/50 overflow-x-auto text-red-700 whitespace-pre-wrap">
              {connError}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
