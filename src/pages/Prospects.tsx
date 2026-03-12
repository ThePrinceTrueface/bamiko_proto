import React, { useState } from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { Plus, Search, UserCircle2, ChevronRight } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-800">Prospects</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={24} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Nouveau Prospect</h3>
          <form onSubmit={handleAddProspect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Banque / Point de collecte</label>
              <select
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                required
              >
                <option value="" disabled>Sélectionner une banque</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nom complet</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Ex: 06 123 45 67"
                className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!newName.trim() || !selectedBankId}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un prospect..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
      </div>

      <div className="space-y-3">
        {filteredProspects.length === 0 ? (
          <div className="text-center py-10 text-neutral-500">
            <UserCircle2 size={48} className="mx-auto mb-3 opacity-20" />
            <p>Aucun prospect trouvé.</p>
          </div>
        ) : (
          filteredProspects.map((prospect) => {
            const bank = banks.find((b) => b.id === prospect.bankId);
            return (
              <Link
                key={prospect.id}
                to={`/prospects/${prospect.id}`}
                className="block bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {prospect.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">{prospect.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {bank?.name || 'Banque inconnue'} • {prospect.phone || 'Pas de numéro'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-neutral-400" size={20} />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
