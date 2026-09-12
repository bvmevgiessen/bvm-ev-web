import { Building2, HeartHandshake } from 'lucide-react';

interface SelectionProps {
  onSelect: (type: 'foerdermitglied' | 'ordentlich') => void;
}

export default function Selection({ onSelect }: SelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">Teil der Gemeinschaft werden</h1>
        <p className="text-lg text-slate-600">
          Wählen Sie die Art Ihrer Mitgliedschaft und unterstützen Sie unsere Arbeit in Gießen. Ihre Daten werden sicher via Formspree übertragen und direkt in Ihren PDF-Antrag integriert.
        </p>
      </div>

      {/* Membership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Fördermitglied */}
        <div 
          onClick={() => onSelect('foerdermitglied')}
          className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col hover:border-blue-300 transition-colors group cursor-pointer"
        >
          <div className="mb-6">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Option 1</span>
            <h2 className="text-2xl font-bold mt-4">Fördermitglied</h2>
            <p className="text-slate-500 mt-2">Flexible Unterstützung ohne aktive Vereinspflichten.</p>
          </div>
          
          <div className="space-y-4 mb-8 flex-grow">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Frei wählbarer Förderbeitrag</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Jährliche Spendenbescheinigung</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Kündigungsfrist: 1 Monat</span>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold group-hover:bg-blue-600 transition-colors">
            Antrag ausfüllen
          </button>
        </div>

        {/* Ordentliches Mitglied */}
        <div 
          onClick={() => onSelect('ordentlich')}
          className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col hover:border-blue-300 transition-colors group cursor-pointer"
        >
          <div className="mb-6">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Option 2</span>
            <h2 className="text-2xl font-bold mt-4">Ordentliches Mitglied</h2>
            <p className="text-slate-500 mt-2">Aktive Teilnahme und Stimmrecht im Verein.</p>
          </div>

          <div className="space-y-4 mb-8 flex-grow">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Volles Stimmrecht & Mitbestimmung</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>SEPA-Lastschriftmandat nötig</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Kündigungsfrist: 3 Monate</span>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold group-hover:bg-blue-600 transition-colors">
            Antrag ausfüllen
          </button>
        </div>
      </div>

      {/* Process Indicators */}
      <div className="mt-12 w-full flex flex-wrap items-center justify-center gap-8 md:gap-12 border-t border-slate-200 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">PDF-Lib Integration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Formspree Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Sofort-Download</span>
        </div>
      </div>
    </div>
  );
}