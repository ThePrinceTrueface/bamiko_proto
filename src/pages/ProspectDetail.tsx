import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatCurrency, cn } from '../lib/utils';
import { ArrowLeft, Plus, CreditCard, Trash2, AlertCircle } from 'lucide-react';

export default function ProspectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prospects, cards, addCard, deleteProspect } = useStore();

  const prospect = prospects.find((p) => p.id === id);
  const prospectCards = cards.filter((c) => c.prospectId === id);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [objective, setObjective] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [totalSlots, setTotalSlots] = useState('30');

  if (!prospect) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">Prospect introuvable.</p>
        <Link to="/prospects" className="text-emerald-600 font-medium mt-4 inline-block">
          Retour aux prospects
        </Link>
      </div>
    );
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(installmentAmount, 10);
    const slots = parseInt(totalSlots, 10);

    if (objective.trim() && !isNaN(amount) && amount > 0 && !isNaN(slots) && slots > 0) {
      addCard(prospect.id, objective.trim(), amount, slots);
      setIsAddingCard(false);
      setObjective('');
      setInstallmentAmount('');
      setTotalSlots('30');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prospect et toutes ses cartes ? Cette action est irréversible.')) {
      deleteProspect(prospect.id);
      navigate('/prospects');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm text-neutral-600 hover:text-emerald-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-neutral-800">{prospect.name}</h2>
        </div>
        <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
            <CreditCard className="mr-2 text-emerald-600" size={20} />
            Cartes d'épargne
          </h3>
          <button
            onClick={() => setIsAddingCard(!isAddingCard)}
            className="bg-emerald-100 text-emerald-700 p-2 rounded-xl hover:bg-emerald-200 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {isAddingCard && (
          <form onSubmit={handleAddCard} className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Objectif</label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Ex: Commerce, Loyer..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Montant / case (FCFA)</label>
                <input
                  type="number"
                  value={installmentAmount}
                  onChange={(e) => setInstallmentAmount(e.target.value)}
                  placeholder="Ex: 500"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                  min="100"
                  step="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre de cases</label>
                <input
                  type="number"
                  value={totalSlots}
                  onChange={(e) => setTotalSlots(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-xl font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!objective.trim() || !installmentAmount || !totalSlots}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                Créer la carte
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {prospectCards.length === 0 ? (
            <div className="text-center py-6 text-neutral-500 flex flex-col items-center">
              <AlertCircle size={32} className="mb-2 opacity-50" />
              <p className="text-sm">Aucune carte d'épargne.</p>
            </div>
          ) : (
            prospectCards.map((card) => {
              const progress = (card.filledSlots / card.totalSlots) * 100;
              const isCompleted = card.status === 'completed';
              const isWithdrawn = card.status === 'withdrawn';

              return (
                <Link
                  key={card.id}
                  to={`/cards/${card.id}`}
                  className={cn(
                    "block p-4 rounded-xl border transition-colors relative overflow-hidden",
                    isWithdrawn ? "bg-neutral-50 border-neutral-200 opacity-75" :
                    isCompleted ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400" :
                    "bg-white border-neutral-200 shadow-sm hover:border-emerald-400"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-neutral-800">{card.objective}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {formatCurrency(card.installmentAmount)} / case
                      </p>
                    </div>
                    <div className={cn(
                      "text-xs font-bold px-2 py-1 rounded-full",
                      isWithdrawn ? "bg-neutral-200 text-neutral-600" :
                      isCompleted ? "bg-emerald-200 text-emerald-800" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {isWithdrawn ? 'Retirée' : isCompleted ? 'Terminée' : 'En cours'}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-neutral-600">{card.filledSlots} / {card.totalSlots} cases</span>
                      <span className="text-neutral-800">{formatCurrency(card.filledSlots * card.installmentAmount)}</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          isCompleted || isWithdrawn ? "bg-emerald-500" : "bg-blue-500"
                        )}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
