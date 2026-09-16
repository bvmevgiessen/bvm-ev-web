import React, { useState } from 'react';
import { ExternalLink, Search, Check, Users, Shield, Sparkles } from 'lucide-react';
import type { SocialAccountConfig } from '../../data/socialMonitor';

interface AccountSelectorProps {
  accounts: SocialAccountConfig[];
  selectedAccountId: string | null;
  onSelectAccount: (accountId: string | null) => void;
}

export default function AccountSelector({
  accounts,
  selectedAccountId,
  onSelectAccount,
}: AccountSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(accounts.map((a) => a.category)))];

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.handleX.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.focus.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || acc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-brand-teal" />
            <h2 className="text-base font-bold text-slate-900">
              Überwachte Stimmen & Organisationen ({accounts.length})
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Ausgewählte Menschenrechtsanwälte, Abgeordnete, Exil-Journalisten und Angehörigen-Initiativen
          </p>
        </div>

        {/* Clear selection if any */}
        {selectedAccountId && (
          <button
            type="button"
            onClick={() => onSelectAccount(null)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span>Filter aufheben (Alle zeigen)</span>
          </button>
        )}
      </div>

      {/* Search and Category Chips */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Account oder Schwerpunkt suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-teal focus:bg-white focus:outline-none"
          />
        </div>

        {/* Categories scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-navy text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Alle Kategorien' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
        {filteredAccounts.map((acc) => {
          const isSelected = selectedAccountId === acc.id;
          return (
            <div
              key={acc.id}
              className={`flex flex-col justify-between rounded-xl border p-3 transition-all ${
                isSelected
                  ? 'border-brand-teal bg-teal-50/40 ring-1 ring-brand-teal'
                  : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="truncate text-xs font-bold text-slate-900">{acc.name}</h3>
                    <span className="text-[10px] rounded bg-slate-200/70 px-1.5 py-0.2 font-medium text-slate-600">
                      {acc.category}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-500 leading-tight">
                    {acc.focus}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => onSelectAccount(isSelected ? null : acc.id)}
                  className={`font-semibold transition-colors cursor-pointer ${
                    isSelected ? 'text-brand-teal' : 'text-slate-700 hover:text-brand-navy'
                  }`}
                >
                  {isSelected ? '✓ Ausgewählt (Posts filtern)' : 'Posts filtern'}
                </button>

                <div className="flex items-center gap-2 text-slate-400">
                  {acc.profileUrlX && (
                    <a
                      href={acc.profileUrlX}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-slate-600 hover:text-slate-950 transition-colors"
                      title={`Profil von ${acc.name} (@${acc.handleX}) auf X öffnen`}
                    >
                      X
                    </a>
                  )}
                  {acc.profileUrlX && acc.profileUrlInstagram && <span>•</span>}
                  {acc.profileUrlInstagram && (
                    <a
                      href={acc.profileUrlInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-pink-600 hover:text-pink-800 transition-colors"
                      title={`Profil von ${acc.name} auf Instagram öffnen`}
                    >
                      IG
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}