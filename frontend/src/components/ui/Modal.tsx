import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = 'max-w-md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur"
        onClick={onClose}
      />
      <div
        className={`relative bg-cream-100 dark:bg-charcoal-800 rounded-xl shadow-lg border border-gray-400/20 w-[90%] ${className} max-h-[90vh] overflow-hidden`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-400/20">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-200 m-0">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl text-slate-500 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-gray-400/15 p-1 rounded-md transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[70vh]">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 p-5 border-t border-gray-400/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
