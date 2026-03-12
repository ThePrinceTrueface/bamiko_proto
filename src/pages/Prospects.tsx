import React, { useState } from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faUserCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Prospects() {
  const { prospects, banks, addProspect } = useStore();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');

  const filteredProspects = prospects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && selectedBankId) {
      addProspect(selectedBankId, newName.trim(), newPhone.trim());
      setNewName('');
      setNewPhone('');
      setSelectedBankId('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un prospect..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
        />
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-3">Nouveau Prospect</h3>
          <form onSubmit={handleAddProspect} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Banque / Point de collecte</label>
              <select
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                required
              >
                <option value="" disabled>Sélectionner une banque</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nom complet</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Ex: 06 123 45 67"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!newName.trim() || !selectedBankId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {filteredProspects.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <FontAwesomeIcon icon={faUserCircle} className="text-4xl mb-2 opacity-30" />
            <p className="text-sm">Aucun prospect trouvé.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredProspects.map((prospect) => {
              const bank = banks.find((b) => b.id === prospect.bankId);
              return (
                <li key={prospect.id}>
                  <Link
                    to={`/prospects/${prospect.id}`}
                    className="flex items-center justify-between p-4 active:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                        {prospect.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm">{prospect.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {bank?.name || 'Banque inconnue'} • {prospect.phone || 'Pas de numéro'}
                        </p>
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-sm" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* FAB */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all z-30"
        >
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </button>
      )}
    </div>
  );
}
