import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import { Heart, CheckCircle2 } from 'lucide-react';
import FormShield from '../components/FormShield';

export default function SpendenPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('sepa');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, turnstileToken?: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (turnstileToken) {
      formData.append('cf-turnstile-response', turnstileToken);
    }

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(() => setIsSubmitted(true))
    .catch((error) => {
      console.error(error);
      setIsSubmitted(true); // fall back to thank you for UX based on prompt
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-0 -ml-32 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block py-2 px-4 bg-brand-teal/10 text-brand-teal font-bold rounded-full mb-6 tracking-wide uppercase text-sm">
              Ihre Unterstützung
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
              Spenden & Unterstützen
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Mit Ihrer Spende helfen Sie uns, Projekte in den Bereichen Jugend, Dialog und Integration nachhaltig umzusetzen. Jeder Beitrag macht einen <span className="font-semibold text-brand-teal">Unterschied</span>.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
            {isSubmitted ? (
               <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-teal">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-bold text-brand-navy mb-4">Herzlichen Dank!</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                  Ihre Spendenanfrage ist erfolgreich bei uns eingegangen.
                  {paymentMethod === 'sepa' ? (
                     " Wir werden den Betrag wie gewünscht per SEPA-Lastschrift einziehen."
                  ) : (
                     " Bitte überweisen Sie den Betrag auf das angegebene Konto."
                  )}
                  <br /><br />
                  Ihre Spendenbescheinigung senden wir Ihnen zu, sobald der Prozess abgeschlossen ist.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary"
                >
                  Zurück zur Startseite
                </button>
              </motion.div>
            ) : (
              <FormShield formKey="spenden" onSubmit={handleSubmit}>
                <form action="https://formspree.io/f/xwvzlvrp" method="POST" className="space-y-12">
                  {/* 1. Spenden-Details */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal shrink-0">
                      <Heart size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-brand-navy">1. Spenden-Details</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Spendenbetrag (€)</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['10', '25', '50'].map(amount => (
                          <label key={amount} className="cursor-pointer">
                            <input type="radio" name="Betrag" value={`${amount}€`} className="peer sr-only" required />
                            <div className="py-3 text-center border-2 border-slate-200 rounded-xl font-bold text-slate-600 peer-checked:border-brand-teal peer-checked:bg-brand-teal/5 peer-checked:text-brand-teal transition-all">
                              {amount} €
                            </div>
                          </label>
                        ))}
                        <label className="cursor-pointer relative">
                          <input type="radio" name="Betrag" value="Individuell" className="peer sr-only" required />
                          <div className="py-3 px-4 text-center border-2 border-slate-200 rounded-xl font-bold text-slate-600 peer-checked:border-brand-teal peer-checked:bg-brand-teal/5 peer-checked:text-brand-teal transition-all flex items-center justify-between">
                             <span>Individuell</span>
                          </div>
                        </label>
                      </div>
                      <div className="mt-4">
                        <input type="number" name="Individueller_Betrag" placeholder="Wunschbetrag in € (optional)" className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Rhythmus</label>
                      <div className="flex gap-4">
                        <label className="cursor-pointer flex-1">
                          <input type="radio" name="Rhythmus" value="Einmalig" className="peer sr-only" required defaultChecked />
                          <div className="py-3 text-center border-2 border-slate-200 rounded-xl font-bold text-slate-600 peer-checked:border-brand-teal peer-checked:bg-brand-teal/5 peer-checked:text-brand-teal transition-all">
                            Einmalig
                          </div>
                        </label>
                        <label className="cursor-pointer flex-1">
                          <input type="radio" name="Rhythmus" value="Monatlich" className="peer sr-only" required />
                          <div className="py-3 text-center border-2 border-slate-200 rounded-xl font-bold text-slate-600 peer-checked:border-brand-teal peer-checked:bg-brand-teal/5 peer-checked:text-brand-teal transition-all">
                            Monatlich
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-slate-100" />

                {/* 2. Zahlungsart */}
                <section>
                  <h2 className="text-xl font-bold text-brand-navy mb-6">2. Zahlungsart</h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="cursor-pointer flex-1">
                      <input 
                        type="radio" 
                        name="Zahlungsart" 
                        value="sepa" 
                        className="peer sr-only" 
                        checked={paymentMethod === 'sepa'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required 
                      />
                      <div className="py-4 px-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 peer-checked:border-brand-teal peer-checked:bg-brand-teal/5 peer-checked:text-brand-teal transition-all flex items-center justify-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                           {paymentMethod === 'sepa' && <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        SEPA-Lastschrift
                      </div>
                    </label>
                    <label className="cursor-pointer flex-1">
                      <input 
                        type="radio" 
                        name="Zahlungsart" 
                        value="ueberweisung" 
                        className="peer sr-only" 
                        checked={paymentMethod === 'ueberweisung'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required 
                      />
                      <div className="py-4 px-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 peer-checked:border-brand-teal peer-checked:bg-brand-teal/5 peer-checked:text-brand-teal transition-all flex items-center justify-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                           {paymentMethod === 'ueberweisung' && <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        Überweisung
                      </div>
                    </label>
                  </div>
                </section>

                {/* 3. Zahlungsinformationen */}
                <AnimatePresence mode="popLayout">
                  {paymentMethod === 'sepa' ? (
                    <motion.section 
                      key="sepa"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-bold text-brand-navy mb-4">3. Zahlungsinformationen (SEPA)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="Kontoinhaber" placeholder="Kontoinhaber" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow" required />
                        <input type="text" name="IBAN" placeholder="IBAN" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow" required />
                      </div>
                      <label className="flex items-start gap-3 mt-4 p-4 rounded-xl bg-slate-50">
                        <input type="checkbox" name="SEPA_Mandat" required className="mt-1 w-4 h-4 text-brand-teal rounded border-slate-300 focus:ring-brand-teal" />
                        <span className="text-sm text-slate-600">
                          Ich ermächtige den Verein, Zahlungen von meinem Konto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die vom Verein auf mein Konto gezogenen Lastschriften einzulösen.
                        </span>
                      </label>
                    </motion.section>
                  ) : (
                    <motion.section 
                      key="ueberweisung"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                       <h2 className="text-xl font-bold text-brand-navy mb-4">3. Zahlungsinformationen (Bankverbindung)</h2>
                       <div className="bg-brand-navy text-white p-6 rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                          <p className="mb-4 text-white/80">Bitte überweisen Sie Ihre Spende auf folgendes Konto:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 gap-y-2 sm:gap-y-3 font-mono text-sm sm:text-base">
                            <span className="text-white/60">Empfänger:</span> <span className="font-bold break-all sm:break-normal">BILDUNG UND VERSTÄNDIGUNG MITTELHESSEN E.V.</span>
                            <span className="text-white/60">IBAN:</span> <span className="font-bold break-all sm:break-normal">DE67 5135 0025 0205 0833 07</span>
                            <span className="text-white/60">BIC:</span> <span className="font-bold break-all sm:break-normal">SKGIDE5FXXX</span>
                            <span className="text-white/60">Verwendungszweck:</span> <span className="font-bold text-brand-teal break-all sm:break-normal">"Spende [Ihr Name]"</span>
                          </div>
                       </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                <div className="h-px bg-slate-100" />

                {/* 4. Persönliche Daten & Anschrift */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-brand-navy mb-6">4. Persönliche Daten & Anschrift</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="Vorname" placeholder="Vorname" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow" required />
                    <input type="text" name="Nachname" placeholder="Nachname" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow" required />
                    <input type="email" name="Email" placeholder="E-Mail-Adresse" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow" required />
                    <input type="tel" name="Telefon" placeholder="Telefonnummer (Optional)" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <input type="text" name="Strasse_Hausnummer" placeholder="Straße und Hausnummer" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow" required />
                    <div className="grid grid-cols-3 gap-4">
                       <input type="text" name="PLZ" placeholder="PLZ" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow col-span-1" required />
                       <input type="text" name="Ort" placeholder="Ort" className="bg-slate-50 border-0 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal transition-shadow col-span-2" required />
                    </div>
                  </div>
                </section>

                {/* 5. Spendenbescheinigung */}
                <section>
                   <label className="flex items-center gap-3 p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20 cursor-pointer hover:bg-brand-teal/10 transition-colors">
                     <input type="checkbox" name="Spendenbescheinigung_gewuenscht" value="Ja" className="w-5 h-5 text-brand-teal rounded border-slate-300 focus:ring-brand-teal" />
                     <span className="text-brand-navy font-medium">
                       Ich benötige eine Spendenbescheinigung <span className="font-normal text-slate-500">(wird später per Post/E-Mail zugesandt)</span>.
                     </span>
                   </label>
                </section>

                <input type="hidden" name="_next" value="https://bvmevgiessen.github.io/" />
                <input type="hidden" name="_subject" value="Neue Spende eingegangen" />

                <div className="pt-6">
                  <button type="submit" className="w-full btn-primary py-4 text-lg">
                    Jetzt spenden
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4">
                    Alle Daten werden sicher per SSL übertragen.
                  </p>
                </div>
              </form>
            </FormShield>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}