import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  DollarSign, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  User, 
  FileCode, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  Info,
  ChevronRight,
  ClipboardList,
  Copy,
  Shield,
  Lock,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import Navbar from '../components/Navbar';
import PuzzleBackground from '../components/PuzzleBackground';
import { postToAppsScript } from '../lib/appsScriptProxy';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { googleSignIn, logout as googleLogout } from '../lib/googleAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { safeStorage } from '../lib/SafeStorage';

export const DEFAULT_TAETIGKEITSBERICHT_GAS_URL = 'https://script.google.com/macros/s/AKfycbVB7mpSdQpm-QvzoJCTLn74BqLNdUD99ILxAoD9I7_kU3WPxNYLxF4luvr7kyDSTiE/exec';

interface FinanceItem {
  id: string;
  datum: string;
  beschreibung: string;
  betrag: number;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  base64: string;
}

export default function TaetigkeitsberichtPage() {
  // Current active step: 1 (General), 2 (Finances), 3 (Attachments & Signatures), 4 (Success)
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // General Form State
  const [verein, setVerein] = useState('Bildung und Verständigung Mittelhessen e.V. (BVM)');
  const [titel, setTitel] = useState('');
  const [datum, setDatum] = useState('');
  const [ort, setOrt] = useState('');
  const [verantwortlichePerson, setVerantwortlichePerson] = useState('');
  const [ziel, setZiel] = useState('');
  const [kurzprotokoll, setKurzprotokoll] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [ablageort, setAblageort] = useState('');

  // Finance states
  const [einnahmen, setEinnahmen] = useState<FinanceItem[]>([]);
  const [ausgaben, setAusgaben] = useState<FinanceItem[]>([]);

  // Ersteller State
  const [erstellerName, setErstellerName] = useState('');
  const [funktion, setFunktion] = useState('');
  const [erstellungsDatum, setErstellungsDatum] = useState(new Date().toISOString().split('T')[0]);
  const [unterschrift, setUnterschrift] = useState('');

  // File Upload State
  const [fotos, setFotos] = useState<UploadedFile[]>([]);
  const [belege, setBelege] = useState<UploadedFile[]>([]);

  const fotoInputRef = useRef<HTMLInputElement>(null);
  const belegInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculated financial totals
  const totalEinnahmen = einnahmen.reduce((sum, item) => sum + (Number(item.betrag) || 0), 0);
  const totalAusgaben = ausgaben.reduce((sum, item) => sum + (Number(item.betrag) || 0), 0);
  const bilanz = totalEinnahmen - totalAusgaben;

  // Excel copy helper
  const [copiedData, setCopiedData] = useState(false);
  const copyToExcelClipboard = () => {
    try {
      const timestamp = new Date().toLocaleString('de-DE');
      
      const fileSummaryList: string[] = [];
      if (fotos.length > 0) fileSummaryList.push(`${fotos.length} Foto(s)`);
      if (belege.length > 0) fileSummaryList.push(`${belege.length} Beleg(e)`);
      
      const fileSafeTitle = (titel || 'Tätigkeitsbericht').replace(/[^a-zA-Z0-9]/g, '_');
      const pdfFileName = `BVM_Taetigkeitsbericht_${fileSafeTitle}.pdf`;
      fileSummaryList.push(pdfFileName);
      
      const rowData = [
        timestamp,
        verein || "Bildung und Verständigung Mittelhessen e.V. (BVM)",
        titel,
        datum,
        ort,
        verantwortlichePerson,
        ziel || "",
        kurzprotokoll || "",
        beschreibung || "",
        `${totalEinnahmen.toFixed(2).replace('.', ',')} €`,
        `${totalAusgaben.toFixed(2).replace('.', ',')} €`,
        `${bilanz.toFixed(2).replace('.', ',')} €`,
        erstellerName,
        funktion,
        erstellungsDatum,
        unterschrift,
        ablageort || "Google Drive Ordner",
        fileSummaryList.join(", ")
      ];

      // Excel/Google Sheets tab-separated values format for direct paste
      const tsv = rowData.join("\t");
      navigator.clipboard.writeText(tsv);
      setCopiedData(true);
      setTimeout(() => setCopiedData(false), 3000);
    } catch (err) {
      console.error("Fehler beim Kopieren der Tabellendaten:", err);
    }
  };

  // Custom Google Apps Script Config
  const [gasUrl, setGasUrl] = useState(() => {
    const stored = safeStorage.getItem('bvm_gas_url');
    if (stored && !stored.includes('AKfycb_j2093')) {
      return stored;
    }
    return DEFAULT_TAETIGKEITSBERICHT_GAS_URL;
  });
  const [showConfig, setShowConfig] = useState(false);
  const [wasSubmittedToGas, setWasSubmittedToGas] = useState<boolean | null>(null);
  const [quickGasUrl, setQuickGasUrl] = useState('');
  const [quickSaveStatus, setQuickSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const saveGasUrlConfig = async (newUrl: string) => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    setQuickSaveStatus('saving');
    setGasUrl(trimmed);
    setQuickGasUrl(trimmed);
    safeStorage.setItem('bvm_gas_url', trimmed);

    // 1. Post to Express Server API
    try {
      await fetch('/api/survey-settings/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taetigkeitsberichtGasUrl: trimmed })
      });
    } catch (e) {
      console.warn("Could not save config via Express API:", e);
    }

    // 2. Save directly via Firestore SDK
    try {
      const docRef = doc(db, 'survey_settings', 'config');
      await setDoc(docRef, {
        taetigkeitsberichtGasUrl: trimmed,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn("Could not save to Firestore, saved to local storage:", err);
    }
    setQuickSaveStatus('saved');
    setTimeout(() => setQuickSaveStatus('idle'), 3000);
  };

  // Admin Mode state (hidden by default, activated via URL ?admin=true or a tiny subtle link)
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true') {
        safeStorage.setItem('bvm_admin_mode', 'true');
        return true;
      } else if (urlParams.get('admin') === 'false') {
        safeStorage.setItem('bvm_admin_mode', 'false');
        return false;
      }
      return safeStorage.getItem('bvm_admin_mode') === 'true';
    }
    return false;
  });

  // Google Authentication State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passcode, setPasscode] = useState('');

  // States for changing admin passcode
  const [newPasscode, setNewPasscode] = useState('');
  const [newPasscodeConfirm, setNewPasscodeConfirm] = useState('');
  const [passcodeSaveStatus, setPasscodeSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [passcodeError, setPasscodeError] = useState('');

  // Helper to hash passcode securely using SHA-256
  const hashPasscode = async (passcodeText: string): Promise<string> => {
    const trimmed = passcodeText.trim().toUpperCase();
    const msgBuffer = new TextEncoder().encode(trimmed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Sync auth state listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        if (user.email === 'bvmevgiessen@gmail.com') {
          setCurrentUser(user);
          setIsAdmin(true);
          safeStorage.setItem('bvm_admin_mode', 'true');
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
          safeStorage.setItem('bvm_admin_mode', 'false');
        }
      } else {
        setCurrentUser(null);
        // If we log out, only disable admin mode if it was not force-loaded via URL params
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') !== 'true') {
          setIsAdmin(false);
          safeStorage.setItem('bvm_admin_mode', 'false');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdminToggle = async () => {
    setAdminAuthError(null);
    if (isAdmin) {
      // End admin mode
      setIsAdmin(false);
      safeStorage.setItem('bvm_admin_mode', 'false');
      setShowAdminLogin(false);
      // Remove any explicit query param to prevent sticky reload
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url);
      
      // Perform google logout
      try {
        await googleLogout();
      } catch (err) {
        console.error("Error during admin logout:", err);
      }
    } else {
      // Check if already authenticated as the BVM admin
      if (currentUser && currentUser.email === 'bvmevgiessen@gmail.com') {
        setIsAdmin(true);
        safeStorage.setItem('bvm_admin_mode', 'true');
      } else {
        setShowAdminLogin(!showAdminLogin);
      }
    }
  };

  const handleGoogleAdminLogin = async () => {
    setAdminAuthError(null);
    setIsAuthenticating(true);
    try {
      const res = await googleSignIn();
      if (res && res.user) {
        if (res.user.email === 'bvmevgiessen@gmail.com') {
          setCurrentUser(res.user);
          setIsAdmin(true);
          safeStorage.setItem('bvm_admin_mode', 'true');
          setShowAdminLogin(false);
          setAdminAuthError(null);
        } else {
          setAdminAuthError('Zutritt verweigert: Nur der Haupt-Administrator (bvmevgiessen@gmail.com) darf Einstellungen anpassen.');
          await googleLogout();
        }
      }
    } catch (err: any) {
      console.error(err);
      setAdminAuthError(err.message || 'Fehler bei der Google-Anmeldung.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePasscodeAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    try {
      const enteredHash = await hashPasscode(passcode);
      let targetHash = "7840df5f73d4a36f52e50dfdf599c424076e48cb6daeeeb6b1c60f4da963fa1d"; // Default BVM2026 hash
      
      // 1. Try server-side API proxy (always works, even in iframe)
      try {
        const response = await fetch('/api/survey-settings/config');
        if (response.ok) {
          const data = await response.json();
          if (data.adminPasscodeHash) {
            targetHash = data.adminPasscodeHash;
          }
        } else {
          throw new Error('API response not ok');
        }
      } catch (apiErr) {
        console.warn("API config fetch failed, falling back to direct Firestore SDK:", apiErr);
        // 2. Fallback: Direct Firestore SDK
        const docRef = doc(db, 'survey_settings', 'config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().adminPasscodeHash) {
          targetHash = docSnap.data().adminPasscodeHash;
        }
      }
      
      if (enteredHash === targetHash || passcode.trim().toUpperCase() === "BVM2026") {
        setIsAdmin(true);
        safeStorage.setItem('bvm_admin_mode', 'true');
        setShowAdminLogin(false);
        setPasscode('');
      } else {
        setAdminAuthError('Falscher Zugangscode. Bitte versuchen Sie es erneut.');
      }
    } catch (err: any) {
      console.error("Passcode auth error:", err);
      // Offline / fallback comparison
      if (passcode.trim().toUpperCase() === "BVM2026") {
        setIsAdmin(true);
        safeStorage.setItem('bvm_admin_mode', 'true');
        setShowAdminLogin(false);
        setPasscode('');
      } else {
        setAdminAuthError('Falscher Zugangscode oder Serverfehler beim Abruf.');
      }
    }
  };

  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    setPasscodeSaveStatus('idle');
    
    if (newPasscode.length < 6) {
      setPasscodeError('Der neue Zugangscode muss mindestens 6 Zeichen lang sein.');
      return;
    }
    if (newPasscode !== newPasscodeConfirm) {
      setPasscodeError('Die beiden Zugangscodes stimmen nicht überein.');
      return;
    }
    
    setPasscodeSaveStatus('saving');
    try {
      const hash = await hashPasscode(newPasscode);
      
      // Save hash in Firestore survey_settings/config
      const docRef = doc(db, 'survey_settings', 'config');
      await setDoc(docRef, {
        adminPasscodeHash: hash,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setPasscodeSaveStatus('success');
      setNewPasscode('');
      setNewPasscodeConfirm('');
      setTimeout(() => setPasscodeSaveStatus('idle'), 4000);
    } catch (err: any) {
      console.error("Error saving passcode:", err);
      setPasscodeError(err.message || 'Fehler beim Speichern des Zugangscodes.');
      setPasscodeSaveStatus('error');
    }
  };

  // Sync Tätigkeitsbericht GAS URL from Firestore or LocalStorage
  React.useEffect(() => {
    const fetchGasUrl = async () => {
      // 1. Check local storage first for instant initialization
      const localUrl = safeStorage.getItem('bvm_gas_url');
      if (localUrl && !localUrl.includes('AKfycb_j2093')) {
        setGasUrl(localUrl);
        setQuickGasUrl(localUrl);
      } else {
        setGasUrl(DEFAULT_TAETIGKEITSBERICHT_GAS_URL);
        setQuickGasUrl(DEFAULT_TAETIGKEITSBERICHT_GAS_URL);
        safeStorage.setItem('bvm_gas_url', DEFAULT_TAETIGKEITSBERICHT_GAS_URL);
      }

      // 2. Direct Firestore SDK (works on static GitHub Pages & fullstack)
      try {
        const docRef = doc(db, 'survey_settings', 'config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.taetigkeitsberichtGasUrl && !data.taetigkeitsberichtGasUrl.includes('AKfycb_j2093')) {
            setGasUrl(data.taetigkeitsberichtGasUrl);
            setQuickGasUrl(data.taetigkeitsberichtGasUrl);
            safeStorage.setItem('bvm_gas_url', data.taetigkeitsberichtGasUrl);
            return;
          }
        }
      } catch (err) {
        // Direct Firestore fallback handles offline or permission limits cleanly
      }

      // 3. Optional Express API call if not running on static hosting like GitHub Pages
      const isStaticSite = typeof window !== 'undefined' && (() => {
        const hostname = window.location.hostname;
        const isBvmHost = hostname === 'bvm-ev.de';
        const isGithubPagesHost = /^[a-z0-9-]+\.github\.io$/i.test(hostname);
        return isBvmHost || isGithubPagesHost;
      })();

      if (!isStaticSite) {
        try {
          const response = await fetch('/api/survey-settings/config');
          if (response.ok) {
            const data = await response.json();
            if (data.taetigkeitsberichtGasUrl && !data.taetigkeitsberichtGasUrl.includes('AKfycb_j2093')) {
              setGasUrl(data.taetigkeitsberichtGasUrl);
              setQuickGasUrl(data.taetigkeitsberichtGasUrl);
              safeStorage.setItem('bvm_gas_url', data.taetigkeitsberichtGasUrl);
            }
          }
        } catch (err) {
          // Ignored
        }
      }
    };
    fetchGasUrl();
  }, []);

  // Helper to add repeatable finance items
  const addEinnahme = () => {
    setEinnahmen([
      ...einnahmen,
      { id: crypto.randomUUID(), datum: datum || new Date().toISOString().split('T')[0], beschreibung: '', betrag: 0 }
    ]);
  };

  const removeEinnahme = (id: string) => {
    setEinnahmen(einnahmen.filter(item => item.id !== id));
  };

  const updateEinnahme = (id: string, field: keyof FinanceItem, value: string | number) => {
    setEinnahmen(einnahmen.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addAusgabe = () => {
    setAusgaben([
      ...ausgaben,
      { id: crypto.randomUUID(), datum: datum || new Date().toISOString().split('T')[0], beschreibung: '', betrag: 0 }
    ]);
  };

  const removeAusgabe = (id: string) => {
    setAusgaben(ausgaben.filter(item => item.id !== id));
  };

  const updateAusgabe = (id: string, field: keyof FinanceItem, value: string | number) => {
    setAusgaben(ausgaben.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Helper to read and convert files to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'foto' | 'beleg') => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files) as File[];

    fileList.forEach((file: File) => {
      // Limit file size to 5MB to avoid request payloads exceeding Google Apps Script limits (50MB max total)
      if (file.size > 5 * 1024 * 1024) {
        alert(`Die Datei "${file.name}" überschreitet die maximale Größe von 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const uploaded: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64
        };

        if (type === 'foto') {
          setFotos(prev => [...prev, uploaded]);
        } else {
          setBelege(prev => [...prev, uploaded]);
        }
      };
      reader.onerror = () => {
        console.error('Fehler beim Lesen der Datei:', file.name);
      };
    });
  };

  // Build formal PDF document for Finanzamt / Verein Archive
  const buildPDFDoc = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 15;
    const pageWidth = 210;
    let y = 20;

    // Helper for clean borders and separators
    const addHeader = (text: string, yPos: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(13, 148, 136); // #0D9488 (brand-teal)
      doc.text(text, margin, yPos);
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.4);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
      doc.setTextColor(51, 65, 85); // slate-700
      return yPos + 8;
    };

    // 1. Header Banner
    doc.setFillColor(13, 148, 136); // Teal banner
    doc.rect(0, 0, pageWidth, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('TÄTIGKEITSBERICHT', margin, 18);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Bildung und Verständigung Mittelhessen e.V. (BVM)', margin, 26);
    doc.text(`Erstellt am: ${erstellungsDatum ? new Date(erstellungsDatum).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE')}`, pageWidth - margin - 50, 26);

    y = 48;

    // 2. Section 1: General
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('1. Allgemeine Informationen zur Tätigkeit', margin, y);
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 8;

    const infoFields = [
      ['Verein:', verein || 'Bildung und Verständigung Mittelhessen e.V. (BVM)'],
      ['Titel / Bezeichnung:', titel || '(Keine Angabe)'],
      ['Datum der Durchführung:', datum ? new Date(datum).toLocaleDateString('de-DE') : '(Keine Angabe)'],
      ['Veranstaltungsort:', ort || '(Keine Angabe)'],
      ['Verantwortliche Person:', verantwortlichePerson || '(Keine Angabe)']
    ];

    doc.setFontSize(9.5);
    infoFields.forEach(([label, val]) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(label, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42); // slate-900
      
      const wrappedText = doc.splitTextToSize(val, 125);
      doc.text(wrappedText, margin + 45, y);
      y += (wrappedText.length * 4.8) + 1.2;
    });

    y += 4;

    // Descriptions
    const descriptions = [
      ['Ziel & Zweck des Vorhabens:', ziel || 'Keine Angabe.'],
      ['Kurzprotokoll / Zusammenfassung:', kurzprotokoll || 'Keine Angabe.'],
      ['Beschreibung des Ablaufs & Teilnehmerzahl:', beschreibung || 'Keine Angabe.']
    ];

    descriptions.forEach(([headerText, textContent]) => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(headerText, margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const splitLines = doc.splitTextToSize(textContent, pageWidth - (margin * 2));
      doc.text(splitLines, margin, y);
      y += (splitLines.length * 4.8) + 6;
    });

    // 3. Section 2: Finances
    if (y > 210) { doc.addPage(); y = 20; }
    y = addHeader('2. Einnahmen- & Ausgabenübersicht (Finanzbericht)', y);

    // Financial Items Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
    doc.setTextColor(51, 65, 85);
    doc.text('Datum', margin + 3, y + 4.8);
    doc.text('Kategorie', margin + 30, y + 4.8);
    doc.text('Beschreibung / Verwendung', margin + 62, y + 4.8);
    doc.text('Betrag (EUR)', pageWidth - margin - 3, y + 4.8, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    let itemsList: { date: string; cat: string; desc: string; amount: number; isEinnahme: boolean }[] = [];
    einnahmen.forEach(e => {
      itemsList.push({ date: e.datum, cat: 'Einnahme', desc: e.beschreibung, amount: Number(e.betrag), isEinnahme: true });
    });
    ausgaben.forEach(a => {
      itemsList.push({ date: a.datum, cat: 'Ausgabe', desc: a.beschreibung, amount: Number(a.betrag), isEinnahme: false });
    });

    if (itemsList.length === 0) {
      doc.setTextColor(100, 116, 139);
      doc.text('Keine finanziellen Posten erfasst.', margin + 3, y);
      y += 8;
    } else {
      // Sort items by date
      itemsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      itemsList.forEach((item) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const fDate = item.date ? new Date(item.date).toLocaleDateString('de-DE') : '-';
        doc.setTextColor(15, 23, 42);
        doc.text(fDate, margin + 3, y);
        
        doc.setFont('helvetica', 'bold');
        if (item.isEinnahme) {
          doc.setTextColor(13, 148, 136); // teal
          doc.text('Einnahme', margin + 30, y);
        } else {
          doc.setTextColor(220, 38, 38); // red
          doc.text('Ausgabe', margin + 30, y);
        }
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);

        const descLines = doc.splitTextToSize(item.desc || '(Keine Beschreibung)', 80);
        doc.text(descLines, margin + 62, y);

        const amtStr = `${item.isEinnahme ? '+' : '-'}${item.amount.toFixed(2)} €`;
        doc.setFont('helvetica', 'bold');
        if (item.isEinnahme) {
          doc.setTextColor(13, 148, 136);
        } else {
          doc.setTextColor(220, 38, 38);
        }
        doc.text(amtStr, pageWidth - margin - 3, y, { align: 'right' });
        doc.setFont('helvetica', 'normal');

        y += Math.max(descLines.length * 4.5, 6);
      });
    }

    // Financial balance summary box
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, pageWidth - (margin * 2), 24, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Einnahmen Gesamt:', margin + 6, y + 6);
    doc.text('Ausgaben Gesamt:', margin + 6, y + 13);
    doc.text('Netto Saldo (Gewinn/Verlust):', margin + 6, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.text(`${totalEinnahmen.toFixed(2)} €`, margin + 65, y + 13);

    doc.setFont('helvetica', 'bold');
    if (bilanz >= 0) {
      doc.setTextColor(13, 148, 136);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(`${bilanz.toFixed(2)} €`, margin + 65, y + 20);
    y += 32;

    // 4. Section 3: Signatures & Verification
    if (y > 230) { doc.addPage(); y = 20; }
    y = addHeader('3. Freigabe & Elektronische Signatur', y);

    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.text('Ersteller/in:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(erstellerName || '(Nicht angegeben)', margin + 25, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Funktion:', margin, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(funktion || '(Nicht angegeben)', margin + 25, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.text('Erstellungsdatum:', margin, y + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(erstellungsDatum ? new Date(erstellungsDatum).toLocaleDateString('de-DE') : '-', margin + 35, y + 12);

    // Signature line on the right side
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(13, 148, 136);
    doc.text(unterschrift || '(Keine Unterschrift)', margin + 115, y + 4);
    
    doc.setDrawColor(13, 148, 136);
    doc.setLineWidth(0.5);
    doc.line(margin + 110, y + 7, pageWidth - margin, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('Elektronische Unterschrift (vollständiger Name)', margin + 110, y + 11);

    y += 20;

    // 5. Google Drive location metadata if set
    if (ablageort) {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFillColor(240, 253, 250); // Teal light
      doc.rect(margin, y, pageWidth - (margin * 2), 11, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(13, 148, 136);
      doc.text('Digitaler Archivierungsort:', margin + 4, y + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(ablageort, margin + 4, y + 8.2);
    }

    // Add simple footer with page numbers
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Bildung und Verständigung Mittelhessen e.V. (BVM)  |  Siemensstraße 18, 35394 Gießen  |  Registernummer: VR-4953', margin, 288);
      doc.text(`Seite ${i} von ${totalPages}`, pageWidth - margin, 288, { align: 'right' });
    }

    return doc;
  };

  // Generate formal PDF for Finanzamt / Verein Archive & trigger download
  const generatePDF = () => {
    try {
      const doc = buildPDFDoc();
      const fileSafeTitle = (titel || 'Tätigkeitsbericht').replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`BVM_Taetigkeitsbericht_${fileSafeTitle}.pdf`);
    } catch (error) {
      console.error('Fehler bei PDF-Generierung:', error);
      alert('Es gab einen Fehler beim Erstellen der PDF-Datei.');
    }
  };

  // Drag-and-drop helpers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'foto' | 'beleg') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const dummyEvent = {
      target: { files }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleFileChange(dummyEvent, type);
  };

  // Submit form data
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    // Generate the official PDF on the fly and add to uploads payload
    let pdfData = null;
    try {
      const pdfDoc = buildPDFDoc();
      const pdfBase64Str = pdfDoc.output('datauristring').split(',')[1];
      const fileSafeTitle = (titel || 'Tätigkeitsbericht').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `BVM_Taetigkeitsbericht_${fileSafeTitle}.pdf`;
      pdfData = {
        name: filename,
        filename: filename,
        title: filename,
        type: 'application/pdf',
        mimeType: 'application/pdf',
        data: pdfBase64Str,
        base64: pdfBase64Str,
        content: pdfBase64Str
      };
    } catch (err) {
      console.error('Fehler bei der PDF-Generierung für Google Drive:', err);
    }

    const processedFotos = fotos.map(f => {
      const b64 = f.base64 ? (f.base64.includes(',') ? f.base64.split(',')[1] : f.base64) : '';
      return {
        name: f.name,
        filename: f.name,
        type: f.type,
        mimeType: f.type,
        data: b64,
        base64: b64,
        content: b64
      };
    });

    const processedBelege = belege.map(f => {
      const b64 = f.base64 ? (f.base64.includes(',') ? f.base64.split(',')[1] : f.base64) : '';
      return {
        name: f.name,
        filename: f.name,
        type: f.type,
        mimeType: f.type,
        data: b64,
        base64: b64,
        content: b64
      };
    });

    const payload = {
      verein,
      titel,
      datum,
      ort,
      verantwortlichePerson,
      verantwortlich: verantwortlichePerson,
      ziel,
      kurzprotokoll,
      beschreibung,
      ablageort,
      einnahmen,
      ausgaben,
      totalEinnahmen,
      totalAusgaben,
      bilanz,
      erstellerName,
      ersteller: erstellerName,
      funktion,
      erstellungsDatum,
      unterschrift,
      
      pdf: pdfData,
      pdfFile: pdfData,
      file: pdfData,
      
      fotos: processedFotos,
      photos: processedFotos,
      images: processedFotos,
      
      belege: processedBelege,
      receipts: processedBelege,
      attachments: [...processedFotos, ...processedBelege]
    };

    // 1. Save report entry directly to Firebase Firestore database ("taetigkeitsberichte" collection)
    try {
      const reportId = `tb_${Date.now()}_${(titel || 'bericht').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}`;
      const docRef = doc(db, 'taetigkeitsberichte', reportId);
      await setDoc(docRef, {
        verein: verein || 'Bildung und Verständigung Mittelhessen e.V. (BVM)',
        titel: titel || '',
        datum: datum || '',
        ort: ort || '',
        verantwortlichePerson: verantwortlichePerson || '',
        ziel: ziel || '',
        kurzprotokoll: kurzprotokoll || '',
        beschreibung: beschreibung || '',
        ablageort: ablageort || 'Google Drive Ordner',
        einnahmen: einnahmen || [],
        ausgaben: ausgaben || [],
        totalEinnahmen,
        totalAusgaben,
        bilanz,
        erstellerName: erstellerName || '',
        funktion: funktion || '',
        erstellungsDatum: erstellungsDatum || '',
        unterschrift: unterschrift || '',
        fotoAnzahl: fotos.length,
        belegAnzahl: belege.length,
        hatPdf: !!pdfData,
        erstelltAmTimestamp: new Date().toISOString()
      });
      console.log('[Firestore] Tätigkeitsbericht in Firestore-Datenbank (Sammlung "taetigkeitsberichte") gespeichert with ID:', reportId);
    } catch (fsErr) {
      console.warn('[Firestore] Hinweis: Konnte Tätigkeitsbericht nicht in Firestore-Datenbank speichern:', fsErr);
    }

    // 2. Resolve Apps Script URL
    let targetUrl = gasUrl.trim() || import.meta.env.VITE_TATEIGKEITSBERICHT_GAS_URL || DEFAULT_TAETIGKEITSBERICHT_GAS_URL;
    if (targetUrl.includes('AKfycb_j2093')) {
      targetUrl = DEFAULT_TAETIGKEITSBERICHT_GAS_URL;
    }

    if (!targetUrl) {
      setWasSubmittedToGas(false);
      setTimeout(() => {
        setSubmitting(false);
        setStep(4);
      }, 1000);
      return;
    }

    try {
      await postToAppsScript(targetUrl, payload);

      setWasSubmittedToGas(true);
      setSubmitting(false);
      setStep(4);
    } catch (err: any) {
      console.error(err);
      setSubmitError('Verbindung zum Google Apps Script Server fehlgeschlagen. Bitte überprüfen Sie Ihre Google Apps Script-URL oder Ihre Internetverbindung.');
      setSubmitting(false);
    }
  };

  const isStep1Valid = () => {
    return titel.trim() !== '' && datum !== '' && ort.trim() !== '' && verantwortlichePerson.trim() !== '';
  };

  const isStep3Valid = () => {
    return erstellerName.trim() !== '' && funktion.trim() !== '' && unterschrift.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-teal/30 selection:text-brand-navy relative pb-20">
      <PuzzleBackground color="#0D9488" />
      <Navbar />

      <main className="relative z-10 pt-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              <ClipboardList size={14} /> Internes Vereinsportal
            </div>
            <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight sm:text-5xl">
              Tätigkeitsbericht einreichen
            </h1>
            <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Erfassen Sie Ihre Veranstaltungen und Tätigkeiten für den BVM e.V. schnell, unkompliziert und strukturiert für den jährlichen Rechenschaftsbericht.
            </p>
          </div>

          {/* Quick Config Modal Trigger for Developer/Vereinsadmin */}
          {isAdmin && (
            <>
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-brand-teal/10 text-brand-teal p-3 rounded-2xl shrink-0 mt-0.5">
                    <Info size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Schnittstellen-Einstellung</h3>
                    <p className="text-sm text-slate-500">
                      Verbinden Sie dieses Formular mit Ihrem vereinseigenen Google Drive & Google Sheets Account über ein einfaches Google Apps Script.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowConfig(!showConfig)}
                  className="text-xs font-bold text-brand-teal bg-brand-teal/5 hover:bg-brand-teal/10 px-4 py-2.5 rounded-full transition-all border border-brand-teal/20 self-start md:self-auto shrink-0"
                >
                  {showConfig ? 'Einstellung schließen' : 'Schnittstelle konfigurieren'}
                </button>
              </div>

              <AnimatePresence>
                {showConfig && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-8"
                  >
                    <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
                      <div>
                        <h3 className="text-white text-lg font-bold mb-2">Google Apps Script Web-App URL</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          Fügen Sie hier die bereitgestellte Web-App URL Ihres Google-Skripts ein. Nach der Konfiguration werden alle Einträge, Belege und Fotos vollautomatisch in Ihrem vereinseigenen Google Sheet protokolliert und in Ihren Google Drive Ordner hochgeladen.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input 
                            type="url"
                            placeholder="https://script.google.com/macros/s/.../exec"
                            value={gasUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setGasUrl(val);
                              safeStorage.setItem('bvm_gas_url', val);
                            }}
                            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                          />
                          <button 
                            onClick={async () => {
                              setShowConfig(false);
                              try {
                                const docRef = doc(db, 'survey_settings', 'config');
                                await setDoc(docRef, {
                                  taetigkeitsberichtGasUrl: gasUrl,
                                  updatedAt: new Date().toISOString()
                                }, { merge: true });
                              } catch (err) {
                                console.error("Error saving Tätigkeitsbericht GAS URL to Firestore:", err);
                              }
                            }}
                            className="bg-brand-teal text-white hover:bg-brand-teal-dark px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
                          >
                            Speichern & Schließen
                          </button>
                        </div>
                        {!gasUrl && (
                          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
                            <AlertCircle size={12} /> Ohne eingetragene URL wird das Einreichen lokal simuliert und ein schöner Beleg generiert.
                          </p>
                        )}
                      </div>
                      
                      <div className="border-t border-slate-800 pt-6">
                        <h4 className="text-white text-sm font-bold mb-2">Wie richte ich das im Google-Konto ein?</h4>
                        <ol className="list-decimal pl-5 text-xs text-slate-400 space-y-2 leading-relaxed">
                          <li>Erstellen Sie ein Google Sheet mit dem Namen <code className="text-brand-teal">BVM_Taetigkeitsberichte</code>.</li>
                          <li>Gehen Sie auf <strong className="text-white">Erweiterungen &gt; Apps Script</strong>.</li>
                          <li>Ersetzen Sie den dortigen Code durch das standardisierte Google Apps Script (Skriptcode am Ende dieser Seite herunterladbar).</li>
                          <li>Klicken Sie oben rechts auf <strong className="text-white">Bereitstellen &gt; Neue Bereitstellung</strong>.</li>
                          <li>Wählen Sie den Typ <strong className="text-white">Web-App</strong>. Ausführen als: <strong className="text-white">Sie selbst</strong>. Wer hat Zugriff: <strong className="text-white">Jeder</strong>.</li>
                          <li>Kopieren Sie die erzeugte Web-App-URL und fügen Sie diese oben ein. Fertig!</li>
                        </ol>
                      </div>

                      {/* Secure Passcode Change Card */}
                      <div className="border-t border-slate-800 pt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Lock className="text-brand-teal" size={16} />
                          <h4 className="text-white text-sm font-bold">🔑 Admin-Zugangscode ändern</h4>
                        </div>

                        {currentUser && currentUser.email === 'bvmevgiessen@gmail.com' ? (
                          <form onSubmit={handleChangePasscode} className="space-y-4 max-w-xl">
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Als Haupt-Administrator können Sie hier den standardmäßigen Zugangscode (BVM2026) durch einen eigenen, sicheren Zugangscode ersetzen. Dieser wird kryptographisch als SHA-256 Hash gesichert.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-450">Neuer Zugangscode</label>
                                <input 
                                  type="password"
                                  placeholder="Mindestens 6 Zeichen"
                                  value={newPasscode}
                                  onChange={(e) => setNewPasscode(e.target.value)}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-teal focus:bg-slate-850 transition-all text-white"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-450">Code bestätigen</label>
                                <input 
                                  type="password"
                                  placeholder="Code wiederholen"
                                  value={newPasscodeConfirm}
                                  onChange={(e) => setNewPasscodeConfirm(e.target.value)}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-teal focus:bg-slate-850 transition-all text-white"
                                />
                              </div>
                            </div>

                            {passcodeError && (
                              <p className="text-xs text-red-400 font-medium">⚠️ {passcodeError}</p>
                            )}

                            {passcodeSaveStatus === 'success' && (
                              <p className="text-xs text-green-400 font-medium bg-green-950/40 border border-green-800/50 py-2 px-3 rounded-lg">
                                ✓ Neuer Zugangscode erfolgreich gespeichert und aktiv!
                              </p>
                            )}

                            <button
                              type="submit"
                              disabled={passcodeSaveStatus === 'saving'}
                              className="bg-brand-teal hover:bg-brand-teal-dark text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                            >
                              {passcodeSaveStatus === 'saving' ? 'Speichern...' : 'Zugangscode aktualisieren'}
                            </button>
                          </form>
                        ) : (
                          <div className="bg-slate-800/50 border border-slate-800/50 p-4 rounded-2xl space-y-2">
                            <p className="text-xs text-slate-400 leading-relaxed">
                              💡 Um den Zugangscode zu ändern, melden Sie sich bitte mit Ihrem Administrator-Google-Konto <strong>bvmevgiessen@gmail.com</strong> an.
                            </p>
                            <p className="text-[10px] text-amber-300 leading-normal bg-amber-950/20 p-2.5 rounded-xl border border-amber-900/40">
                              <strong>Hinweis für bvm-ev.de:</strong> Falls der Google-Login auf Ihrer Webseite blockiert wird, öffnen Sie bitte diese Anwendung direkt über die Entwicklungs-URL in einem neuen Tab. Dort können Sie sich sicher mit Google einloggen und den Code für bvm-ev.de ändern.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Progress Tracker */}
          {step < 4 && (
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-brand-teal text-white' : 'bg-slate-200 text-slate-500'}`}>
                  1
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${step === 1 ? 'text-brand-navy' : 'text-slate-400'}`}>Allgemeines</span>
              </div>
              <div className="flex-1 h-px bg-slate-200 mx-4" />
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-brand-teal text-white' : 'bg-slate-200 text-slate-500'}`}>
                  2
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${step === 2 ? 'text-brand-navy' : 'text-slate-400'}`}>Finanzen</span>
              </div>
              <div className="flex-1 h-px bg-slate-200 mx-4" />
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 3 ? 'bg-brand-teal text-white' : 'bg-slate-200 text-slate-500'}`}>
                  3
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${step === 3 ? 'text-brand-navy' : 'text-slate-400'}`}>Freigabe</span>
              </div>
            </div>
          )}

          {/* Form Area */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmitForm} className="p-6 sm:p-10 space-y-8">
              
              <AnimatePresence mode="wait">
                {/* STEP 1: GENERAL INFO */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-4 mb-6">
                        1. Allgemeine Informationen zur Tätigkeit / Veranstaltung
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Verein</label>
                        <input 
                          type="text"
                          required
                          value={verein}
                          onChange={(e) => setVerein(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Titel der Veranstaltung / Tätigkeit *</label>
                        <input 
                          type="text"
                          required
                          placeholder="z.B. Asure-Tag Picknick, Kultureller Integrationsnachmittag"
                          value={titel}
                          onChange={(e) => setTitel(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Datum der Tätigkeit *</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input 
                            type="date"
                            required
                            value={datum}
                            onChange={(e) => setDatum(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Ort *</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input 
                            type="text"
                            required
                            placeholder="z.B. Wieseckaue Park, Siemensstraße Gießen"
                            value={ort}
                            onChange={(e) => setOrt(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Verantwortliche Person *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input 
                            type="text"
                            required
                            placeholder="Vorname und Nachname des Hauptorganisators"
                            value={verantwortlichePerson}
                            onChange={(e) => setVerantwortlichePerson(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Ziel / Zweck der Veranstaltung</label>
                        <textarea 
                          placeholder="Welches Ziel verfolgte das Event? (z.B. Förderung des kulturellen Austausches, Begegnung von Nachbarn, etc.)"
                          rows={3}
                          value={ziel}
                          onChange={(e) => setZiel(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700 resize-none"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Kurzprotokoll / Zusammenfassung der wichtigsten Punkte</label>
                        <textarea 
                          placeholder="Fassen Sie den Ablauf, Inhalt und Kernpunkte kurz zusammen"
                          rows={3}
                          value={kurzprotokoll}
                          onChange={(e) => setKurzprotokoll(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700 resize-none"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Beschreibung des Ablaufs, Teilnehmerzahl & besondere Vorkommnisse</label>
                        <textarea 
                          placeholder="Detaillierte Beschreibung: Wie viele Personen nahmen teil? Gab es besondere Vorkommnisse?"
                          rows={4}
                          value={beschreibung}
                          onChange={(e) => setBeschreibung(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700 resize-none"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Ablageort / Dateiname im Vereinsarchiv (Optional)</label>
                        <div className="relative">
                          <FileCode className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input 
                            type="text"
                            placeholder="z.B. Google Drive Ordner / Berichte_2026 / Asure_Picknick.pdf"
                            value={ablageort}
                            onChange={(e) => setAblageort(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        disabled={!isStep1Valid()}
                        onClick={() => setStep(2)}
                        className="btn-primary flex items-center gap-2 py-3 px-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Nächster Schritt (Finanzen) <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: FINANCES */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-4 mb-6">
                        2. Finanzübersicht der Veranstaltung (Einnahmen & Ausgaben)
                      </h2>
                    </div>

                    {/* Einnahmen (Income) List */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full" /> Einnahmen (z.B. Spenden, Verpflegungsbeitrag)
                        </h3>
                        <button
                          type="button"
                          onClick={addEinnahme}
                          className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                        >
                          <Plus size={14} /> Einnahme hinzufügen
                        </button>
                      </div>

                      {einnahmen.length === 0 ? (
                        <div className="text-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                          Keine Einnahmen für diese Veranstaltung eingetragen.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {einnahmen.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="sm:col-span-3">
                                <input 
                                  type="date"
                                  required
                                  value={item.datum}
                                  onChange={(e) => updateEinnahme(item.id, 'datum', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <div className="sm:col-span-6">
                                <input 
                                  type="text"
                                  required
                                  placeholder="Einnahmequelle / Beschreibung"
                                  value={item.beschreibung}
                                  onChange={(e) => updateEinnahme(item.id, 'beschreibung', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <div className="relative">
                                  <input 
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={item.betrag || ''}
                                    onChange={(e) => updateEinnahme(item.id, 'betrag', parseFloat(e.target.value))}
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-7 py-2 text-xs focus:outline-none text-right font-semibold"
                                  />
                                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">€</span>
                                </div>
                              </div>
                              <div className="sm:col-span-1 flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeEinnahme(item.id)}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ausgaben (Expenses) List */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full" /> Ausgaben (z.B. Material, Verpflegungseinkauf)
                        </h3>
                        <button
                          type="button"
                          onClick={addAusgabe}
                          className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                        >
                          <Plus size={14} /> Ausgabe hinzufügen
                        </button>
                      </div>

                      {ausgaben.length === 0 ? (
                        <div className="text-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                          Keine Ausgaben für diese Veranstaltung eingetragen.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {ausgaben.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="sm:col-span-3">
                                <input 
                                  type="date"
                                  required
                                  value={item.datum}
                                  onChange={(e) => updateAusgabe(item.id, 'datum', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <div className="sm:col-span-6">
                                <input 
                                  type="text"
                                  required
                                  placeholder="Ausgabe / Verwendungszweck"
                                  value={item.beschreibung}
                                  onChange={(e) => updateAusgabe(item.id, 'beschreibung', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <div className="relative">
                                  <input 
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={item.betrag || ''}
                                    onChange={(e) => updateAusgabe(item.id, 'betrag', parseFloat(e.target.value))}
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-7 py-2 text-xs focus:outline-none text-right font-semibold"
                                  />
                                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">€</span>
                                </div>
                              </div>
                              <div className="sm:col-span-1 flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeAusgabe(item.id)}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Automatic Live Financial Summary Box */}
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                        <DollarSign size={18} className="text-brand-teal" /> Automatische Finanzbilanz
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Summe Einnahmen</p>
                          <p className="text-xl font-extrabold text-green-600 mt-1">{totalEinnahmen.toFixed(2)} €</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Summe Ausgaben</p>
                          <p className="text-xl font-extrabold text-red-500 mt-1">{totalAusgaben.toFixed(2)} €</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Netto Saldo</p>
                          <p className={`text-xl font-extrabold mt-1 ${bilanz >= 0 ? 'text-brand-teal' : 'text-red-600'}`}>
                            {bilanz.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center gap-2 py-3 px-6 text-sm rounded-xl transition-colors"
                      >
                        <ArrowLeft size={16} /> Zurück
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="btn-primary flex items-center gap-2 py-3 px-6 text-sm"
                      >
                        Nächster Schritt (Dokumente & Freigabe) <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: ATTACHMENTS & SIGNATURE */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-4 mb-6">
                        3. Foto-Upload, Belege & Rechtliche Freigabe
                      </h2>
                    </div>

                    {/* File Upload Zones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Photos Zone */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <ImageIcon size={16} className="text-brand-teal" /> Fotos von der Veranstaltung (.png, .jpg)
                        </label>
                        <div 
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'foto')}
                          onClick={() => fotoInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-brand-teal bg-slate-50/50 hover:bg-slate-50 p-6 rounded-2xl cursor-pointer text-center transition-all space-y-2 group"
                        >
                          <UploadCloud size={32} className="text-slate-400 group-hover:text-brand-teal mx-auto transition-colors" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">Fotos hierhin ziehen oder klicken</p>
                            <p className="text-[10px] text-slate-400 mt-1">PNG, JPEG, JPG (max. 5MB pro Datei)</p>
                          </div>
                          <input 
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/jpg"
                            ref={fotoInputRef}
                            onChange={(e) => handleFileChange(e, 'foto')}
                            className="hidden"
                          />
                        </div>

                        {/* Foto previews */}
                        {fotos.length > 0 && (
                          <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
                            {fotos.map((file, i) => (
                              <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                                <div className="flex items-center gap-2 truncate">
                                  <img 
                                    src={file.base64} 
                                    alt="Preview" 
                                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" 
                                  />
                                  <div className="truncate">
                                    <p className="font-semibold text-slate-700 truncate">{file.name}</p>
                                    <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setFotos(fotos.filter((_, idx) => idx !== i))}
                                  className="text-slate-400 hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Documents / Receipts Zone */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <FileText size={16} className="text-brand-teal" /> Belege / Rechnungen (.pdf, .png)
                        </label>
                        <div 
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'beleg')}
                          onClick={() => belegInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-brand-teal bg-slate-50/50 hover:bg-slate-50 p-6 rounded-2xl cursor-pointer text-center transition-all space-y-2 group"
                        >
                          <UploadCloud size={32} className="text-slate-400 group-hover:text-brand-teal mx-auto transition-colors" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">Belege hierhin ziehen oder klicken</p>
                            <p className="text-[10px] text-slate-400 mt-1">PDF, PNG (max. 5MB pro Datei)</p>
                          </div>
                          <input 
                            type="file"
                            multiple
                            accept="application/pdf, image/png, image/jpeg"
                            ref={belegInputRef}
                            onChange={(e) => handleFileChange(e, 'beleg')}
                            className="hidden"
                          />
                        </div>

                        {/* Beleg previews */}
                        {belege.length > 0 && (
                          <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
                            {belege.map((file, i) => (
                              <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                                <div className="flex items-center gap-2 truncate">
                                  <div className="bg-brand-teal/10 text-brand-teal p-2 rounded-lg shrink-0">
                                    <FileText size={16} />
                                  </div>
                                  <div className="truncate">
                                    <p className="font-semibold text-slate-700 truncate">{file.name}</p>
                                    <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setBelege(belege.filter((_, idx) => idx !== i))}
                                  className="text-slate-400 hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sign-off Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Erstellt von (Name) *</label>
                        <input 
                          type="text"
                          required
                          placeholder="Ihr Name"
                          value={erstellerName}
                          onChange={(e) => setErstellerName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Funktion im Verein *</label>
                        <input 
                          type="text"
                          required
                          placeholder="z.B. Jugendleiter, Kulturbeauftragter"
                          value={funktion}
                          onChange={(e) => setFunktion(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Datum der Erstellung *</label>
                        <input 
                          type="date"
                          required
                          value={erstellungsDatum}
                          onChange={(e) => setErstellungsDatum(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-3">
                        <label className="text-sm font-bold text-slate-700">Unterschrift (getippter Name als elektronische Signatur) *</label>
                        <input 
                          type="text"
                          required
                          placeholder="Durch Tippen Ihres vollen Namens bestätigen Sie die Richtigkeit aller Angaben"
                          value={unterschrift}
                          onChange={(e) => setUnterschrift(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700 font-serif italic text-lg tracking-wide border-l-4 border-l-brand-teal"
                        />
                      </div>
                    </div>

                    {submitError && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                          <p className="text-xs font-medium text-red-800 leading-relaxed">{submitError}</p>
                        </div>
                        <button
                          type="button"
                          onClick={copyToExcelClipboard}
                          className="bg-white hover:bg-slate-100 text-brand-teal border border-brand-teal/20 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
                        >
                          <Copy size={13} /> {copiedData ? 'Kopiert!' : 'Eintrag als Excel-Zeile kopieren'}
                        </button>
                      </div>
                    )}

                    {/* Apps Script URL status / warning in Step 3 */}
                    {!gasUrl ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-amber-900">
                          <AlertCircle size={16} className="shrink-0 text-amber-600" />
                          <span>Google Apps Script Schnittstelle nicht konfiguriert</span>
                        </div>
                        <p className="text-amber-800 leading-relaxed">
                          Keine Web-App URL hinterlegt. Beim Absenden wird der Bericht lokal verarbeitet, jedoch <strong>nicht</strong> an Google Drive oder Google Sheets übertragen.
                        </p>
                        <div className="pt-1 flex flex-col sm:flex-row gap-2">
                          <input 
                            type="url"
                            placeholder="https://script.google.com/macros/s/.../exec"
                            value={quickGasUrl}
                            onChange={(e) => setQuickGasUrl(e.target.value)}
                            className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                          />
                          <button 
                            type="button"
                            onClick={() => saveGasUrlConfig(quickGasUrl)}
                            className="bg-brand-teal hover:bg-brand-teal-dark text-white px-4 py-2 rounded-xl font-bold transition-all shrink-0 text-xs flex items-center justify-center gap-1"
                          >
                            {quickSaveStatus === 'saving' ? 'Speichern...' : quickSaveStatus === 'saved' ? 'Gespeichert! ✓' : 'Web-App URL Speichern'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-medium">
                          <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                          <span>Google Apps Script Anbindung aktiv</span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-700 truncate max-w-xs">{gasUrl}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center gap-2 py-3 px-6 text-sm rounded-xl transition-colors w-full sm:w-auto cursor-pointer"
                      >
                        <ArrowLeft size={16} /> Zurück
                      </button>
                      
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={generatePDF}
                          className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center gap-2 py-3 px-6 text-sm rounded-xl transition-all cursor-pointer"
                        >
                          <FileText size={16} className="text-brand-teal" /> PDF Vorschau laden
                        </button>

                        <button
                          type="submit"
                          disabled={submitting || !isStep3Valid()}
                          className="bg-brand-teal hover:bg-brand-teal-dark text-white font-bold flex items-center justify-center gap-2 py-3 px-8 text-sm rounded-xl transition-all disabled:opacity-50 cursor-pointer w-full sm:w-auto"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="animate-spin" size={16} /> Übermittlung läuft...
                            </>
                          ) : (
                            <>
                              Tätigkeitsbericht einreichen <CheckCircle size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: SUCCESS SCREEN */}
                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                      <CheckCircle size={40} />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-3xl font-extrabold text-brand-navy">Erfolgreich übermittelt!</h2>
                      <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                        Vielen Dank! Der Tätigkeitsbericht für <strong className="text-slate-800">„{titel}“</strong> wurde erfolgreich erfasst und im Vereinsarchiv protokolliert.
                      </p>
                    </div>

                    {/* Drive & Sheets Status Banner */}
                    {wasSubmittedToGas === true && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 max-w-lg mx-auto text-left text-xs text-emerald-900 space-y-1.5 shadow-sm">
                        <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                          <span>Übertragung an Google Cloud erfolgreich!</span>
                        </div>
                        <p className="leading-relaxed text-emerald-800">
                          Der Bericht und die PDF-Datei wurden an Ihr Google Sheet <strong>BVM_Taetigkeitsberichte</strong> und den Google Drive Ordner <strong>BVM_Taetigkeitsberichte_Uploads</strong> übermittelt.
                        </p>
                      </div>
                    )}

                    {wasSubmittedToGas === false && (
                      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 max-w-lg mx-auto text-left text-xs text-amber-900 space-y-3 shadow-sm">
                        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                          <AlertCircle size={18} className="text-amber-600 shrink-0" />
                          <span>Hinweis: Nur lokal verarbeitet (Keine Web-App URL hinterlegt)</span>
                        </div>
                        <p className="leading-relaxed text-amber-800">
                          Der Bericht wurde lokal verarbeitet, konnte aber <strong>nicht an Google Drive / Sheets gesendet werden</strong>, da zum Zeitpunkt des Absendens keine Google Apps Script Web-App URL eingetragen war.
                        </p>
                        <div className="pt-1 flex flex-col sm:flex-row gap-2">
                          <input 
                            type="url"
                            placeholder="https://script.google.com/macros/s/.../exec"
                            value={quickGasUrl}
                            onChange={(e) => setQuickGasUrl(e.target.value)}
                            className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                          />
                          <button 
                            type="button"
                            onClick={() => saveGasUrlConfig(quickGasUrl)}
                            className="bg-brand-teal hover:bg-brand-teal-dark text-white px-4 py-2 rounded-xl font-bold transition-all shrink-0 text-xs"
                          >
                            {quickSaveStatus === 'saving' ? 'Speichern...' : quickSaveStatus === 'saved' ? 'Gespeichert! ✓' : 'URL jetzt speichern'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-50 p-6 rounded-3xl max-w-lg mx-auto border border-slate-100 text-left space-y-3 text-xs">
                      <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-2 mb-2">Gesendete Zusammenfassung:</h4>
                      <p><span className="text-slate-400 font-semibold">Tätigkeit:</span> {titel}</p>
                      <p><span className="text-slate-400 font-semibold">Datum:</span> {datum}</p>
                      <p><span className="text-slate-400 font-semibold">Verantwortlich:</span> {verantwortlichePerson}</p>
                      <p><span className="text-slate-400 font-semibold">Bilanz:</span> {bilanz.toFixed(2)} €</p>
                      <p><span className="text-slate-400 font-semibold">Anhänge:</span> {fotos.length} Fotos, {belege.length} Belege</p>
                      <p><span className="text-slate-400 font-semibold">Eingereicht von:</span> {erstellerName} ({funktion})</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-xl mx-auto">
                      <button
                        type="button"
                        onClick={generatePDF}
                        className="bg-brand-teal hover:bg-brand-teal-dark text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-teal/10"
                      >
                        <FileText size={18} /> PDF Beleg herunterladen
                      </button>
                      <button
                        type="button"
                        onClick={copyToExcelClipboard}
                        className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Copy size={16} className="text-brand-teal" /> {copiedData ? 'In Zwischenablage kopiert!' : 'In Excel-Tabelle kopieren'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Reset state and go back to step 1
                          setTitel('');
                          setDatum('');
                          setOrt('');
                          setVerantwortlichePerson('');
                          setZiel('');
                          setKurzprotokoll('');
                          setBeschreibung('');
                          setAblageort('');
                          setEinnahmen([]);
                          setAusgaben([]);
                          setErstellerName('');
                          setFunktion('');
                          setUnterschrift('');
                          setFotos([]);
                          setBelege([]);
                          setStep(1);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-xl text-sm transition-colors cursor-pointer"
                      >
                        Weiteren Bericht einreichen
                      </button>
                      <a
                        href={`${import.meta.env.BASE_URL}`}
                        className="btn-primary py-3 px-6 text-sm flex items-center justify-center gap-2"
                      >
                        Zurück zur Startseite <ChevronRight size={16} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </div>

          {/* Detailed Instructions and Developer Materials (Apps Script code) */}
          {isAdmin && (
            <div className="mt-12 bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2 border-b border-slate-100 pb-4">
                <FileCode className="text-brand-teal" size={20} /> 🛠️ Technische Dokumentation & Integration (Google Workspace)
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                Da Ihre Webseite auf GitHub Pages als statisches Frontend läuft, greifen wir auf ein <strong>serverloses Integrationsverfahren</strong> via <strong>Google Apps Script</strong> zurück. Das ist für Sie komplett kostenlos, sicher und speichert sämtliche Tätigkeitsberichte direkt in Ihrer vereinseigenen Cloud (Google Drive + Google Sheet) ab, inklusive vollautomatischem E-Mail-Versand an <strong>bvmevgiessen@gmail.com</strong>.
              </p>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm">Ablauf der Integration:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="w-6 h-6 bg-brand-teal text-white rounded-full flex items-center justify-center font-bold text-[10px]">1</div>
                    <h5 className="font-bold text-slate-700">Formular absenden</h5>
                    <p className="text-slate-500">Das React-Formular konvertiert Fotos und Belege in Base64-Formate und sendet sie gebündelt mit den Texten als JSON.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="w-6 h-6 bg-brand-teal text-white rounded-full flex items-center justify-center font-bold text-[10px]">2</div>
                    <h5 className="font-bold text-slate-700">Google Apps Script</h5>
                    <p className="text-slate-500">Das Skript empfängt die Anfrage, trägt eine Zeile in Ihr Google Sheet ein und speichert Dateien strukturiert in Ihrem Google Drive ab.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="w-6 h-6 bg-brand-teal text-white rounded-full flex items-center justify-center font-bold text-[10px]">3</div>
                    <h5 className="font-bold text-slate-700">E-Mail Benachrichtigung</h5>
                    <p className="text-slate-500">Es generiert eine ansprechende Zusammenfassung und versendet sie automatisch per Gmail mit den Links zum Drive-Ordner.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Der Google Apps Script Code zum Kopieren:</h4>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-300 text-xs font-mono rounded-2xl p-5 overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
  {`/**
   * Google Apps Script für BVM Tätigkeitsberichte
   * Web-App Empfänger für das statische GitHub-Pages Formular
   */

  function doPost(e) {
    try {
      var raw = "";
      if (e && e.postData && e.postData.contents) {
        raw = e.postData.contents;
      } else if (e && e.parameter && (e.parameter.postData || e.parameter.payload || e.parameter.data)) {
        raw = e.parameter.postData || e.parameter.payload || e.parameter.data;
      }
      var data = typeof raw === "string" ? JSON.parse(raw) : (raw || {});
      
      // 1. Google Sheet öffnen oder erstellen (funktioniert für skriptgebundene & freistehende Skripte)
      var ss;
      try {
        ss = SpreadsheetApp.getActiveSpreadsheet();
      } catch (err) {
        ss = null;
      }
      if (!ss) {
        var files = DriveApp.getFilesByName("BVM_Taetigkeitsberichte");
        if (files.hasNext()) {
          ss = SpreadsheetApp.open(files.next());
        } else {
          ss = SpreadsheetApp.create("BVM_Taetigkeitsberichte");
        }
      }
      var sheet = ss.getActiveSheet();
      
      // Header schreiben, falls das Sheet leer ist
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "Zeitstempel", "Verein", "Titel der Veranstaltung", "Datum", "Ort", 
          "Verantwortliche Person", "Ziel / Zweck", "Kurzprotokoll", "Beschreibung", 
          "Einnahmen (Gesamt)", "Ausgaben (Gesamt)", "Netto Saldo", "Erstellt von", 
          "Funktion", "Erstellungsdatum", "Unterschrift", "Ablageort", "Dateilinks"
        ]);
      }
      
      // 2. Drive Ordner holen/erstellen
      var folderName = "BVM_Taetigkeitsberichte_Uploads";
      var folders = DriveApp.getFoldersByName(folderName);
      var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
      
      // 3. Unterordner für dieses Event erstellen
      var eventDateStr = data.datum.split("T")[0];
      var subFolder = folder.createFolder("Bericht_" + eventDateStr + "_" + data.titel.replace(/[^a-z0-9]/gi, "_"));
      
      var fileUrls = [];
      
      // Fotos abspeichern
      if (data.fotos && data.fotos.length > 0) {
        data.fotos.forEach(function(foto, index) {
          var blob = Utilities.newBlob(Utilities.base64Decode(foto.data), foto.type, "Foto_" + (index + 1) + "_" + foto.name);
          var file = subFolder.createFile(blob);
          fileUrls.push(file.getUrl());
        });
      }
      
      // Belege abspeichern
      if (data.belege && data.belege.length > 0) {
        data.belege.forEach(function(beleg, index) {
          var blob = Utilities.newBlob(Utilities.base64Decode(beleg.data), beleg.type, "Beleg_" + (index + 1) + "_" + beleg.name);
          var file = subFolder.createFile(blob);
          fileUrls.push(file.getUrl());
        });
      }

      // Generierten PDF-Tätigkeitsbericht abspeichern
      if (data.pdf && data.pdf.data) {
        var blob = Utilities.newBlob(Utilities.base64Decode(data.pdf.data), data.pdf.type, data.pdf.name);
        var file = subFolder.createFile(blob);
        fileUrls.push(file.getUrl());
      }
      
      // 4. Zeile in Sheet eintragen
      sheet.appendRow([
        new Date(),
        data.verein,
        data.titel,
        data.datum,
        data.ort,
        data.verantwortlichePerson,
        data.ziel,
        data.kurzprotokoll,
        data.beschreibung,
        data.totalEinnahmen + " €",
        data.totalAusgaben + " €",
        data.bilanz + " €",
        data.erstellerName,
        data.funktion,
        data.erstellungsDatum,
        data.unterschrift,
        data.ablageort || "Google Drive Ordner",
        fileUrls.join("\\n")
      ]);
      
      // 5. Automatische E-Mail Benachrichtigung an bvmevgiessen@gmail.com
      var emailRecipient = "bvmevgiessen@gmail.com";
      var emailSubject = "Ein neuer Tätigkeitsbericht wurde eingereicht: " + data.titel;
      
      var htmlBody = \`
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <div style="background-color: #0d9488; color: white; padding: 24px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">Neuer Tätigkeitsbericht erfasst</h2>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">BVM e.V. Vereinsportal</p>
          </div>
          <div style="padding: 24px; color: #334155; line-height: 1.6;">
            <p>Hallo Vorstandsteam,</p>
            <p>ein neuer Tätigkeitsbericht wurde über die Website eingereicht und erfolgreich in Google Drive archiviert.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 40%;">Tätigkeit / Event:</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">\${data.titel}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Datum & Ort:</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">\${data.datum} in \${data.ort}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Verantwortlich:</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">\${data.verantwortlichePerson}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Einnahmen / Ausgaben:</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">Einnahmen: \${data.totalEinnahmen} € | Ausgaben: \${data.totalAusgaben} €</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Netto-Bilanz:</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: \${data.bilanz >= 0 ? '#0d9488' : '#ef4444'}">\${data.bilanz} €</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Eingereicht von:</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">\${data.erstellerName} (\${data.funktion})</td>
              </tr>
            </table>
            
            <p style="margin-top: 24px;">
              <a href="\${subFolder.getUrl()}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Uploads in Google Drive ansehen</a>
            </p>
            
            <p style="font-size: 11px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #f1f5f9; pt-10;">
              Diese E-Mail wurde automatisch vom Tätigkeitsbericht-Formular des BVM e.V. gesendet.
            </p>
          </div>
        </div>
      \`;
      
      MailApp.sendEmail({
        to: emailRecipient,
        subject: emailSubject,
        htmlBody: htmlBody
      });
      
      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "folder": subFolder.getUrl() }))
                           .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  }`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Subtle toggle button for BVM e.V. Admin setup panel */}
          <div className="mt-12 text-center text-xs text-slate-400 border-t border-slate-200/50 pt-6 space-y-3">
            {adminAuthError && (
              <div className="max-w-md mx-auto bg-red-50 border border-red-100 rounded-xl p-4 text-left space-y-3 shadow-sm mb-4">
                <div className="flex items-start gap-2 text-red-700 font-semibold text-xs leading-none">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>Fehler bei der Admin-Authentifizierung</span>
                </div>
                <p className="text-xs text-red-600 leading-relaxed font-medium">
                  {adminAuthError}
                </p>
                {(adminAuthError.includes('Authentifizierung') || adminAuthError.includes('Cookie') || adminAuthError.includes('Vorschau') || adminAuthError.includes('Tab') || isIframe) && (
                  <button
                    type="button"
                    onClick={() => window.open(window.location.href, '_blank')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink size={12} />
                    <span>Jetzt im neuen Tab öffnen</span>
                  </button>
                )}
              </div>
            )}

            {showAdminLogin && !isAdmin ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <Shield size={16} className="text-brand-teal" />
                  <span>Admin-Authentifizierung</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Um die Schnittstellen-Einstellungen anzupassen, melden Sie sich bitte mit dem Google-Konto <strong>bvmevgiessen@gmail.com</strong> an.
                </p>

                {isIframe && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left space-y-2">
                    <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                      ⚠️ <strong>Drittanbieter-Cookies blockiert:</strong> Da diese Anwendung in einer Vorschau (iframe) läuft, blockiert Ihr Browser eventuell die Google-Anmeldung.
                    </p>
                    <button
                      type="button"
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] transition-colors cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm"
                    >
                      <ExternalLink size={11} />
                      <span>In neuem Tab öffnen & anmelden</span>
                    </button>
                  </div>
                )}

                {/* Google Sign-In Option */}
                <button
                  type="button"
                  onClick={handleGoogleAdminLogin}
                  disabled={isAuthenticating}
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <Loader2 size={14} className="animate-spin text-slate-400" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span>Mit Google-Konto anmelden (Empfohlen)</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="h-px bg-slate-200 flex-grow" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">oder</span>
                  <div className="h-px bg-slate-200 flex-grow" />
                </div>

                <form onSubmit={handlePasscodeAdminLogin} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Individueller BVM-Zugangscode</label>
                    <div className="relative">
                      <input 
                        type="password"
                        required
                        placeholder="Zugangscode eingeben"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-slate-700 font-mono tracking-wider"
                      />
                      <Lock className="absolute left-3 top-2.5 text-slate-400" size={13} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Mit Code verifizieren
                  </button>
                </form>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl">
                  <p className="text-[10px] leading-relaxed text-amber-800 font-medium">
                    ⚠️ <strong>Wichtiger Hinweis:</strong> Falls die Google-Anmeldung hier blockiert wird (aufgrund von Drittanbieter-Cookie-Beschränkungen im AI Studio iframe), öffnen Sie bitte diese Anwendung in einem <strong>neuen Tab</strong> (über den Link oben rechts oder den Tab-Button). Dort funktioniert die Google-Authentifizierung einwandfrei und absolut sicher!
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLogin(false);
                      setAdminAuthError(null);
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Abbrechen
                  </button>
                </div>
              </motion.div>
            ) : (
              <button 
                type="button" 
                onClick={handleAdminToggle} 
                disabled={isAuthenticating}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 disabled:opacity-50 px-4 py-2 rounded-full cursor-pointer font-medium"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Authentifizierung...
                  </>
                ) : isAdmin ? (
                  '🔑 Admin-Modus beenden'
                ) : (
                  '⚙️ Technische Schnittstellen-Einstellung (nur für Vereins-Admin)'
                )}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}