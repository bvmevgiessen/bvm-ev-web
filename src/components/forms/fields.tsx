import React from 'react';

// Shared field primitives for the membership forms. Kept presentational so
// each form can compose them freely (different fieldsets, different layouts).

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function Field({ id, label, hint, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-brand-navy">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p className="text-xs text-rose-600" data-testid={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

type InputBase = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export function TextInput({ invalid, className = '', ...rest }: InputBase) {
  return (
    <input
      {...rest}
      className={[
        'w-full px-4 py-3 bg-white border rounded-xl transition-all',
        'focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal',
        invalid ? 'border-rose-400' : 'border-slate-200',
        className,
      ].join(' ')}
    />
  );
}

type SelectBase = React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };

export function SelectInput({ invalid, className = '', children, ...rest }: SelectBase) {
  return (
    <select
      {...rest}
      className={[
        'w-full px-4 py-3 bg-white border rounded-xl transition-all',
        'focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal',
        invalid ? 'border-rose-400' : 'border-slate-200',
        className,
      ].join(' ')}
    >
      {children}
    </select>
  );
}

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  required?: boolean;
  error?: string;
  testId?: string;
}

export function Checkbox({ id, checked, onChange, label, required, error, testId }: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          data-testid={testId || id}
          className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-brand-teal focus:ring-brand-teal/40 cursor-pointer"
        />
        <span className="text-sm text-slate-700 leading-relaxed group-hover:text-brand-navy">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </span>
      </label>
      {error && (
        <p className="text-xs text-rose-600 ml-8" data-testid={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

interface RadioCardProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  title: string;
  description?: string;
}

export function RadioCard({ id, name, value, checked, onChange, title, description }: RadioCardProps) {
  return (
    <label
      htmlFor={id}
      className={[
        'flex-1 cursor-pointer rounded-2xl border-2 px-5 py-4 transition-all',
        checked
          ? 'border-brand-teal bg-brand-teal/5'
          : 'border-slate-200 bg-white hover:border-brand-teal/50',
      ].join(' ')}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <div className="flex items-center gap-2">
        <span
          className={[
            'h-4 w-4 rounded-full border-2 flex items-center justify-center',
            checked ? 'border-brand-teal' : 'border-slate-300',
          ].join(' ')}
        >
          {checked && <span className="h-2 w-2 rounded-full bg-brand-teal" />}
        </span>
        <span className="font-bold text-brand-navy">{title}</span>
      </div>
      {description && <p className="text-xs text-slate-600 mt-1.5 ml-6">{description}</p>}
    </label>
  );
}
