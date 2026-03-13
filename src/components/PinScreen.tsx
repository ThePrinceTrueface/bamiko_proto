import React, { useState } from 'react';
import { useStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';

export default function PinScreen({ onUnlock }: { onUnlock: () => void }) {
  const { settings } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        if (newPin === settings.pinCode) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faLock} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application verrouillée</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Entrez votre code PIN pour continuer</p>
        </div>

        <div className="flex justify-center space-x-4 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin.length > i 
                  ? 'bg-blue-600 dark:bg-blue-500 scale-110' 
                  : 'bg-slate-200 dark:bg-slate-700'
              } ${error ? 'bg-red-500 dark:bg-red-500 animate-bounce' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-2xl font-medium shadow-sm active:bg-slate-100 dark:active:bg-slate-700 transition-colors mx-auto flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePress('0')}
            className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-2xl font-medium shadow-sm active:bg-slate-100 dark:active:bg-slate-700 transition-colors mx-auto flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full text-slate-500 dark:text-slate-400 text-xl active:bg-slate-200 dark:active:bg-slate-800 transition-colors mx-auto flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faDeleteLeft} />
          </button>
        </div>
      </div>
    </div>
  );
}
