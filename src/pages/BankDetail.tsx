import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faSearch, faUserCircle, faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default function BankDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { banks, prospects, addProspect } = useStore();
  
  const bank = banks.find((b) => b.id === id);
  const bankProspects = prospects.filter((p) => p.bankId === id);

  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newAge, setNewAge] = useState('');

  if (!bank) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 dark:text-slate-400">Point de collecte introuvable.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 dark:text-blue-400 font-medium mt-4 inline-block">
          Retour
        </button>
      </div>
    );
  }

  const filteredProspects = bankProspects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addProspect(bank.id, newName.trim(), newPhone.trim(), newGender, newAge ? parseInt(newAge) : null);
      setNewName('');
      setNewPhone('');
      setNewGender('');
      setNewAge('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex items-center mb-2">
        <button onClick={() => navigate(-1)} className="text-blue-600 dark:text-blue-400 p-2 -ml-2 active:opacity-70 transition-opacity flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span className="font-medium">Retour</span>
        </button>
      </div>

      <div className="px-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-sky-600 dark:text-sky-400" />
          {bank.name}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{bankProspects.length} client(s)</p>
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      <div className="flex items-center justify-between mt-6 mb-2 px-1">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clients</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-blue-600 dark:text-blue-400 font-medium text-sm active:opacity-70"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-3">Nouveau Client</h3>
          <form onSubmit={handleAddProspect} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nom complet</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Ex: 06 123 45 67"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Sexe (Optionnel)</label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                >
                  <option value="">Non spécifié</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Âge (Optionnel)</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  placeholder="Ex: 35"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!newName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
        {filteredProspects.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <FontAwesomeIcon icon={faUserCircle} className="text-4xl mb-2 opacity-30" />
            <p className="text-sm">Aucun client trouvé.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:divide-y-0 md:gap-4 md:p-4">
            {filteredProspects.map((prospect) => (
              <li key={prospect.id} className="md:border md:border-slate-200 md:dark:border-slate-700 md:rounded-xl md:shadow-sm">
                <Link
                  to={`/prospects/${prospect.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700 transition-colors md:rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                      {prospect.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{prospect.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {prospect.phone || 'Pas de numéro'}
                      </p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 dark:text-slate-500 text-sm" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
