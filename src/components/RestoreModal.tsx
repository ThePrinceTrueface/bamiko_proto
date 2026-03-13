import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCodeMerge, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface RestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverwrite: () => void;
  onMerge: () => void;
}

export default function RestoreModal({ isOpen, onClose, onOverwrite, onMerge }: RestoreModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faDatabase} className="text-xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Restauration des données
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Comment souhaitez-vous importer ces données ? Vous pouvez soit écraser vos données actuelles, soit les fusionner (les données les plus récentes seront conservées).
          </p>

          <div className="space-y-3">
            <button
              onClick={() => { onMerge(); onClose(); }}
              className="w-full flex items-center p-4 border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center mr-4 shrink-0">
                <FontAwesomeIcon icon={faCodeMerge} />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Fusionner (Recommandé)</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">Ajoute les nouvelles données sans supprimer les existantes.</p>
              </div>
            </button>

            <button
              onClick={() => { onOverwrite(); onClose(); }}
              className="w-full flex items-center p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-full flex items-center justify-center mr-4 shrink-0">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100 text-sm">Écraser tout</h4>
                <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">Supprime les données actuelles et les remplace par la sauvegarde.</p>
              </div>
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
