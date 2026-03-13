import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTimes } from '@fortawesome/free-solid-svg-icons';

interface PinPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
  title?: string;
}

export default function PinPromptModal({ isOpen, onClose, onSuccess, correctPin, title = "Authentification requise" }: PinPromptModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError(false);

    if (value.length === 4) {
      if (value === correctPin) {
        onSuccess();
        onClose();
      } else {
        setError(true);
        setTimeout(() => setPin(''), 500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center">
            <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-500" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
            Veuillez entrer votre code PIN actuel pour confirmer cette action.
          </p>
          
          <input
            type="password"
            inputMode="numeric"
            pattern="\d*"
            autoFocus
            value={pin}
            onChange={handlePinChange}
            className={`w-32 text-center text-2xl tracking-[0.5em] font-bold px-4 py-3 border-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-colors ${
              error 
                ? 'border-red-500 focus:border-red-500 animate-shake' 
                : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
            }`}
            placeholder="••••"
          />
          
          {error && (
            <p className="text-red-500 text-xs mt-2 font-medium">Code PIN incorrect</p>
          )}
        </div>
      </div>
    </div>
  );
}
