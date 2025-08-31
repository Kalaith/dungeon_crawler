import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  className = '',
  ...props
}) => {
  const inputClasses = `w-full px-3 py-2 text-base leading-6 text-slate-900 dark:text-gray-200 bg-cream-100 dark:bg-charcoal-800 border border-gray-400/30 rounded-lg transition-colors focus:border-teal-500 focus:outline-2 focus:outline-teal-500 ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-medium text-slate-500 dark:text-gray-300">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  className = '',
  children,
  ...props
}) => {
  const selectClasses = `w-full px-3 py-2 text-base leading-6 text-slate-900 dark:text-gray-200 bg-cream-100 dark:bg-charcoal-800 border border-gray-400/30 rounded-lg transition-colors focus:border-teal-500 focus:outline-2 focus:outline-teal-500 appearance-none pr-8 ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-medium text-slate-500 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select className={selectClasses} {...props}>
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
};