import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faDownload, faUpload, faTrash, faMoon, faMoneyBill, faLock, faClock, faPercentage, faHashtag, faCloud, faCloudArrowUp, faCloudArrowDown, faSignOutAlt, faTable, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../components/ConfirmModal';
import PinPromptModal from '../components/PinPromptModal';
import RestoreModal from '../components/RestoreModal';
import { auth, logOut } from '../firebase';
import { syncToCloud, syncFromCloud } from '../services/sync';
import { convertToCSV, downloadCSV } from '../lib/export';

export default function Settings() {
  const { services, banks, prospects, cards, transactions, settings, updateSettings } = useStore();

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

  const [pinPromptModal, setPinPromptModal] = useState<{
    isOpen: boolean;
    action: () => void;
  }>({
    isOpen: false,
    action: () => {},
  });

  const [pinInput, setPinInput] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreModal, setRestoreModal] = useState<{ isOpen: boolean; data: any | null }>({
    isOpen: false,
    data: null,
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const user = auth.currentUser;

  const handleSyncToCloud = async () => {
    try {
      setSyncStatus('syncing');
      setSyncMessage('Sauvegarde en cours...');
      await syncToCloud();
      setSyncStatus('success');
      setSyncMessage('Sauvegarde réussie !');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error: any) {
      setSyncStatus('error');
      setSyncMessage(error.message || 'Erreur lors de la sauvegarde');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const handleSyncFromCloud = async () => {
    try {
      setSyncStatus('syncing');
      setSyncMessage('Récupération en cours...');
      await syncFromCloud();
      setSyncStatus('success');
      setSyncMessage('Données synchronisées !');
      setTimeout(() => {
        setSyncStatus('idle');
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      setSyncStatus('error');
      setSyncMessage(error.message || 'Erreur lors de la récupération');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const handleExport = () => {
    const data = {
      services,
      banks,
      prospects,
      cards,
      transactions,
      settings,
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

  const handleExportClientsCSV = () => {
    const data = prospects.map(p => {
      const bank = banks.find(b => b.id === p.bankId);
      const service = services.find(s => s.id === bank?.serviceId);
      const prospectCards = cards.filter(c => c.prospectId === p.id);
      const totalSaved = prospectCards.reduce((sum, c) => sum + (c.filledSlots * c.installmentAmount), 0);
      
      return {
        'Nom du client': p.name,
        'Téléphone': p.phone || '',
        'Sexe': p.gender === 'M' ? 'Homme' : p.gender === 'F' ? 'Femme' : 'Non spécifié',
        'Âge': p.age || '',
        'Point de collecte': bank?.name || 'Inconnu',
        'Service': service?.name || 'Inconnu',
        'Cartes actives': prospectCards.filter(c => c.status === 'active').length,
        'Cartes terminées': prospectCards.filter(c => c.status === 'completed' || c.status === 'withdrawn').length,
        'Total Épargné': totalSaved
      };
    });
    const csv = convertToCSV(data);
    downloadCSV(`bamiko_clients_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const handleExportTransactionsCSV = () => {
    const data = transactions.map(t => {
      const card = cards.find(c => c.id === t.cardId);
      const prospect = prospects.find(p => p.id === card?.prospectId);
      const bank = banks.find(b => b.id === prospect?.bankId);
      const service = services.find(s => s.id === bank?.serviceId);
      
      return {
        'Date': new Date(t.date).toLocaleString('fr-FR'),
        'Type': t.type === 'installment' ? 'Versement' : 'Retrait',
        'Montant': t.amount,
        'Client': prospect?.name || 'Client supprimé',
        'Objectif Carte': card?.objective || 'Carte supprimée',
        'Point de collecte': bank?.name || 'Inconnu',
        'Service': service?.name || 'Inconnu'
      };
    });
    const csv = convertToCSV(data);
    downloadCSV(`bamiko_transactions_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        if (jsonData && typeof jsonData === 'object') {
          setRestoreModal({ isOpen: true, data: jsonData });
        }
      } catch (error) {
        alert('Erreur lors de la lecture du fichier. Le fichier est peut-être corrompu.');
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Effacer toutes les données',
      message: 'ATTENTION : Vous êtes sur le point de supprimer TOUTES les données de l\'application. Cette action est irréversible. Voulez-vous continuer ?',
      isDestructive: true,
      onConfirm: () => {
        if (settings?.pinCode) {
          setPinPromptModal({
            isOpen: true,
            action: () => {
              localStorage.removeItem('bamiko-storage');
              window.location.reload();
            }
          });
        } else {
          localStorage.removeItem('bamiko-storage');
          window.location.reload();
        }
      },
    });
  };

  const handlePinSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 4) {
      updateSettings({ pinCode: pinInput });
      setPinInput('');
      setShowPinSetup(false);
    }
  };

  const removePin = () => {
    if (settings?.pinCode) {
      setPinPromptModal({
        isOpen: true,
        action: () => {
          updateSettings({ pinCode: null });
        }
      });
    } else {
      updateSettings({ pinCode: null });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white px-1">Paramètres</h2>

      {/* Apparence */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faMoon} className="mr-2 text-indigo-500" />
            Apparence
          </h3>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-white">Mode sombre</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Activer le thème foncé</p>
          </div>
          <button
            onClick={() => updateSettings({ darkMode: !settings?.darkMode })}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings?.darkMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings?.darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Préférences */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-emerald-500" />
            Préférences
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-white mb-1">Devise</label>
            <select
              value={settings?.currency || 'XAF'}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="XAF">FCFA (XAF)</option>
              <option value="XOF">FCFA (XOF)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar ($)</option>
              <option value="MAD">Dirham (MAD)</option>
            </select>
          </div>
          
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-800 dark:text-white mb-1">Commission par défaut</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Prélevée lors du retrait d'une carte terminée</p>
            <div className="flex space-x-2">
              <select
                value={settings?.commissionType || 'slots'}
                onChange={(e) => updateSettings({ commissionType: e.target.value as 'slots' | 'percentage' })}
                className="w-1/3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              >
                <option value="slots">Cases</option>
                <option value="percentage">%</option>
              </select>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={settings?.commissionType === 'percentage' ? faPercentage : faHashtag} className="text-slate-400 text-xs" />
                </div>
                <input
                  type="number"
                  min="0"
                  step={settings?.commissionType === 'percentage' ? "0.1" : "1"}
                  value={settings?.commissionValue || 0}
                  onChange={(e) => updateSettings({ commissionValue: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-800 dark:text-white mb-1 flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-2 text-amber-500" />
              Alerte d'inactivité
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Nombre de jours sans versement avant de relancer un client</p>
            <input
              type="number"
              min="1"
              max="30"
              value={settings?.inactivityDays || 3}
              onChange={(e) => updateSettings({ inactivityDays: parseInt(e.target.value) || 3 })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-600" />
            Sécurité
          </h3>
        </div>
        <div className="p-4">
          {settings?.pinCode ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">Code PIN activé</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">L'application est protégée</p>
              </div>
              <button
                onClick={removePin}
                className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium"
              >
                Désactiver
              </button>
            </div>
          ) : (
            <div>
              {!showPinSetup ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">Code PIN désactivé</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Protéger l'accès à l'application</p>
                  </div>
                  <button
                    onClick={() => setShowPinSetup(true)}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium"
                  >
                    Configurer
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePinSetup} className="flex space-x-2">
                  <input
                    type="password"
                    maxLength={4}
                    pattern="\d{4}"
                    placeholder="Code à 4 chiffres"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm text-center tracking-widest"
                    required
                  />
                  <button
                    type="submit"
                    disabled={pinInput.length !== 4}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPinSetup(false);
                      setPinInput('');
                    }}
                    className="px-3 py-2 text-slate-500 dark:text-slate-400"
                  >
                    Annuler
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cloud Sync */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faCloud} className="mr-2 text-blue-500" />
            Compte & Cloud
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sauvegardez vos données en ligne et synchronisez-les entre vos appareils.
          </p>
        </div>
        <div className="p-4 space-y-4">
          {user && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.displayName || 'Utilisateur'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logOut}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  title="Se déconnecter"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSyncToCloud}
                  disabled={syncStatus === 'syncing'}
                  className="py-2.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 active:bg-slate-100 dark:active:bg-slate-500 transition-colors flex flex-col items-center justify-center text-sm disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} className="mb-1 text-blue-500" />
                  Sauvegarder
                </button>
                <button
                  onClick={handleSyncFromCloud}
                  disabled={syncStatus === 'syncing'}
                  className="py-2.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 active:bg-slate-100 dark:active:bg-slate-500 transition-colors flex flex-col items-center justify-center text-sm disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faCloudArrowDown} className="mb-1 text-emerald-500" />
                  Récupérer
                </button>
              </div>

              {syncStatus !== 'idle' && (
                <div className={`text-center text-sm font-medium p-2 rounded-lg ${
                  syncStatus === 'syncing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                  syncStatus === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                  'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {syncMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Exportation Comptable */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faTable} className="mr-2 text-emerald-600" />
            Exportation (Excel / CSV)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Téléchargez vos données au format CSV pour les ouvrir dans Excel, faire votre comptabilité ou imprimer des reçus.
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 space-y-3">
          <button
            onClick={handleExportTransactionsCSV}
            className="w-full py-2.5 bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 rounded-lg font-medium border border-slate-200 dark:border-slate-600 shadow-sm active:bg-slate-50 dark:active:bg-slate-600 transition-colors flex items-center justify-center text-sm"
          >
            <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
            Historique des transactions
          </button>
          
          <button
            onClick={handleExportClientsCSV}
            className="w-full py-2.5 bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 rounded-lg font-medium border border-slate-200 dark:border-slate-600 shadow-sm active:bg-slate-50 dark:active:bg-slate-600 transition-colors flex items-center justify-center text-sm"
          >
            <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
            Liste des clients
          </button>
        </div>
      </div>

      {/* Sauvegarde Locale */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faDownload} className="mr-2 text-sky-600" />
            Sauvegarde Locale & Restauration
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Téléchargez une copie de toutes vos données au format JSON sur cet appareil.
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 space-y-3">
          <button
            onClick={handleExport}
            className="w-full py-2.5 bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 rounded-lg font-medium border border-slate-200 dark:border-slate-600 shadow-sm active:bg-slate-50 dark:active:bg-slate-600 transition-colors flex items-center justify-center text-sm"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Exporter les données
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 bg-sky-600 text-white rounded-lg font-medium shadow-sm active:bg-sky-700 transition-colors flex items-center justify-center text-sm"
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Restaurer les données
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Zone Dangereuse */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-red-600 dark:text-red-500" />
            Zone Dangereuse
          </h3>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
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

      <PinPromptModal
        isOpen={pinPromptModal.isOpen}
        onClose={() => setPinPromptModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={pinPromptModal.action}
        correctPin={settings?.pinCode || ''}
      />

      <RestoreModal
        isOpen={restoreModal.isOpen}
        onClose={() => setRestoreModal({ isOpen: false, data: null })}
        onOverwrite={() => {
          if (restoreModal.data) {
            useStore.getState().restoreData(restoreModal.data);
            window.location.reload();
          }
        }}
        onMerge={() => {
          if (restoreModal.data) {
            useStore.getState().mergeData(restoreModal.data);
            window.location.reload();
          }
        }}
      />
    </div>
  );
}
