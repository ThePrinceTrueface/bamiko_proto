import { useStore } from '../store';
import { AlertTriangle, Download, Trash2 } from 'lucide-react';

export default function Settings() {
  const { services, banks, prospects, cards, transactions } = useStore();

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
    if (
      window.confirm(
        'ATTENTION : Vous êtes sur le point de supprimer TOUTES les données de l\'application. Cette action est irréversible. Voulez-vous continuer ?'
      )
    ) {
      if (window.confirm('Êtes-vous VRAIMENT sûr ? Tapez OK pour confirmer.')) {
        localStorage.removeItem('bamiko-storage');
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-800">Paramètres</h2>

      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
          <Download className="mr-2 text-blue-600" size={20} />
          Sauvegarde des données
        </h3>
        <p className="text-sm text-neutral-600">
          Téléchargez une copie de toutes vos données (services, banques, prospects, cartes, transactions) au format JSON.
        </p>
        <button
          onClick={handleExport}
          className="flex items-center justify-center w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors border border-blue-200"
        >
          <Download className="mr-2" size={20} />
          Exporter les données
        </button>
      </div>

      <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-red-800 flex items-center">
          <AlertTriangle className="mr-2 text-red-600" size={20} />
          Zone Dangereuse
        </h3>
        <p className="text-sm text-red-600">
          La suppression des données effacera définitivement tout l'historique de l'application sur cet appareil.
        </p>
        <button
          onClick={handleClearData}
          className="flex items-center justify-center w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm"
        >
          <Trash2 className="mr-2" size={20} />
          Effacer toutes les données
        </button>
      </div>
    </div>
  );
}
