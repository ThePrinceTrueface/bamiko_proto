import React, { useState } from 'react';
import { useStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../components/ConfirmModal';

export default function Settings() {
  const { services, banks, prospects, cards, transactions } = useStore();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleExport = () => {
    const data = {
      services,
      banks,
      prospects,
      cards,
      transactions,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bamiko-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Effacer toutes les données',
      message: 'ATTENTION : Vous êtes sur le point de supprimer TOUTES les données de l\'application. Cette action est irréversible. Voulez-vous continuer ?',
      isDestructive: true,
      onConfirm: () => {
        localStorage.removeItem('bamiko-storage');
        window.location.reload();
      },
    });
  };

  return (
    <div className="space-y-6 pb-16">
      <h2 className="text-2xl font-bold text-slate-900 px-1">Paramètres</h2>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faDownload} className="mr-2 text-blue-600" />
            Sauvegarde
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Téléchargez une copie de toutes vos données au format JSON.
          </p>
        </div>
        <div className="p-4 bg-slate-50">
          <button
            onClick={handleExport}
            className="w-full py-2.5 bg-white text-blue-600 rounded-lg font-medium border border-slate-200 shadow-sm active:bg-slate-50 transition-colors flex items-center justify-center text-sm"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Exporter les données
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-red-100 bg-red-50">
          <h3 className="text-sm font-semibold text-red-800 flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-red-600" />
            Zone Dangereuse
          </h3>
          <p className="text-xs text-red-600 mt-1">
            La suppression des données effacera définitivement tout l'historique sur cet appareil.
          </p>
        </div>
        <div className="p-4">
          <button
            onClick={handleClearData}
            className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium shadow-sm active:bg-red-700 transition-colors flex items-center justify-center text-sm"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Effacer toutes les données
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        isDestructive={confirmModal.isDestructive}
      />
    </div>
  );
}
