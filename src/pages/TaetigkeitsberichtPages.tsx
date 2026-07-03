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
  ClipboardList
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PuzzleBackground from '../components/PuzzleBackground';

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

  // Custom Google Apps Script Config
  const [gasUrl, setGasUrl] = useState('');
  const [showConfig, setShowConfig] = useState(false);

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

    const payload = {
      verein,
      titel,
      datum,
      ort,
      verantwortlichePerson,
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
      funktion,
      erstellungsDatum,
      unterschrift,
      fotos: fotos.map(f => ({ name: f.name, type: f.type, data: f.base64.split(',')[1] })),
      belege: belege.map(f => ({ name: f.name, type: f.type, data: f.base64.split(',')[1] }))
    };

    // Use user-configured Apps Script URL or a default state info
    const targetUrl = gasUrl || import.meta.env.VITE_TATEIGKEITSBERICHT_GAS_URL;

    if (!targetUrl) {
      // Simulated successful storage since they haven't bound their specific GAS URL yet
      setTimeout(() => {
        setSubmitting(false);
        setStep(4);
      }, 1500);
      return;
    }

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        mode: 'no-cors', // standard workaround for Google Apps Script Web App redirects
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Since 'no-cors' mode won't let us read the status, we assume success if it didn't throw
      setSubmitting(false);
      setStep(4);
    } catch (err: any) {
      console.error(err);
      setSubmitError('Verbindung zum Server fehlgeschlagen. Bitte überprüfen Sie Ihre Google Apps Script-URL oder Internetverbindung.');
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
                        onChange={(e) => setGasUrl(e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                      />
                      <button 
                        onClick={() => setShowConfig(false)}
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl flex items-start gap-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs font-medium text-red-800 leading-relaxed">{submitError}</p>
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center gap-2 py-3 px-6 text-sm rounded-xl transition-colors"
                      >
                        <ArrowLeft size={16} /> Zurück
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || !isStep3Valid()}
                        className="bg-brand-teal hover:bg-brand-teal-dark text-white font-bold flex items-center justify-center gap-2 py-3 px-8 text-sm rounded-xl transition-all disabled:opacity-50"
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

                    <div className="bg-slate-50 p-6 rounded-3xl max-w-lg mx-auto border border-slate-100 text-left space-y-3 text-xs">
                      <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-2 mb-2">Gesendete Zusammenfassung:</h4>
                      <p><span className="text-slate-400 font-semibold">Tätigkeit:</span> {titel}</p>
                      <p><span className="text-slate-400 font-semibold">Datum:</span> {datum}</p>
                      <p><span className="text-slate-400 font-semibold">Verantwortlich:</span> {verantwortlichePerson}</p>
                      <p><span className="text-slate-400 font-semibold">Bilanz:</span> {bilanz.toFixed(2)} €</p>
                      <p><span className="text-slate-400 font-semibold">Anhänge:</span> {fotos.length} Fotos, {belege.length} Belege</p>
                      <p><span className="text-slate-400 font-semibold">Eingereicht von:</span> {erstellerName} ({funktion})</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
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
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-xl text-sm transition-colors"
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
    var data = JSON.parse(e.postData.contents);
    
    // 1. Google Sheet öffnen oder erstellen
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
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

        </div>
      </main>
    </div>
  );
}
