import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { Button } from './Button';

export const MessageModal: React.FC = () => {
  const { isMessageModalOpen, messageText, hideMessage } = useUIStore();

  if (!isMessageModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="bg-cream-100 dark:bg-charcoal-800 p-6 rounded-xl shadow-lg border border-gray-400/20 max-w-md text-center">
        <p className="mb-5 text-slate-900 dark:text-gray-200">{messageText}</p>
        <Button variant="primary" onClick={hideMessage}>
          OK
        </Button>
      </div>
    </div>
  );
};
