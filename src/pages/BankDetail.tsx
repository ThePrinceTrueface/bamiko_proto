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

  if (!bank) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">Point de collecte introuvable.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 font-medium mt-4 inline-block">
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
      addProspect(bank.id, newName.trim(), newPhone.trim());
      setNewName('');
      setNewPhone('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex items-center mb-2">
        <button onClick={() => navigate(-1)} className="text-blue-600 p-2 -ml-2 active:opacity-70 transition-opacity flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span className="font-medium">Retour</span>
        </button>
      </div>

      <div className="px-1">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-sky-600" />
          {bank.name}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{bankProspects.length} client(s)</p>
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
        />
      </div>

      <div className="flex items-center justify-between mt-6 mb-2 px-1">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Clients</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-blue-600 font-medium text-sm active:opacity-70"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
          <h3 className="text-base font-semibold text-slate-800 mb-3">Nouveau Client</h3>
          <form onSubmit={handleAddProspect} className="space-y-3">
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
                disabled={!newName.trim()}
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
            <p className="text-sm">Aucun client trouvé.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredProspects.map((prospect) => (
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
                        {prospect.phone || 'Pas de numéro'}
                      </p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-sm" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
