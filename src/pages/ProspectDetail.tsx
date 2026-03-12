import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatCurrency, cn } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../components/ConfirmModal';

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

  if (!prospect) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">Prospect introuvable.</p>
        <Link to="/prospects" className="text-blue-600 font-medium mt-4 inline-block">
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
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer le prospect',
      message: 'Êtes-vous sûr de vouloir supprimer ce prospect et toutes ses cartes ? Cette action est irréversible.',
      isDestructive: true,
      onConfirm: () => {
        deleteProspect(prospect.id);
        navigate('/prospects');
      },
    });
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => navigate(-1)} className="text-blue-600 p-2 -ml-2 active:opacity-70 transition-opacity flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span className="font-medium">Retour</span>
        </button>
        <button onClick={handleDelete} className="text-red-500 p-2 -mr-2 active:opacity-70 transition-opacity">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      <div className="px-1">
        <h2 className="text-2xl font-bold text-slate-900">{prospect.name}</h2>
        <p className="text-sm text-slate-500 mt-1">{prospect.phone || 'Aucun numéro'}</p>
      </div>

      <div className="flex items-center justify-between mt-6 mb-2 px-1">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Cartes d'épargne</h3>
        <button
          onClick={() => setIsAddingCard(!isAddingCard)}
          className="text-blue-600 font-medium text-sm active:opacity-70"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Ajouter
        </button>
      </div>

      {isAddingCard && (
        <form onSubmit={handleAddCard} className="mb-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Objectif</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Ex: Commerce, Loyer..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Montant / case</label>
              <input
                type="number"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(e.target.value)}
                placeholder="Ex: 500"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
                min="100"
                step="100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nb. de cases</label>
              <input
                type="number"
                value={totalSlots}
                onChange={(e) => setTotalSlots(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCard(false)}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!objective.trim() || !installmentAmount || !totalSlots}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Créer
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {prospectCards.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-slate-200">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl mb-2 opacity-30" />
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
                  isWithdrawn ? "bg-slate-50 border-slate-200 opacity-75" :
                  isCompleted ? "bg-blue-50 border-blue-200" :
                  "bg-white border-slate-200 shadow-sm active:bg-slate-50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{card.objective}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatCurrency(card.installmentAmount)} / case
                    </p>
                  </div>
                  <div className={cn(
                    "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md",
                    isWithdrawn ? "bg-slate-200 text-slate-600" :
                    isCompleted ? "bg-blue-200 text-blue-800" :
                    "bg-sky-100 text-sky-700"
                  )}>
                    {isWithdrawn ? 'Retirée' : isCompleted ? 'Terminée' : 'En cours'}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-600">{card.filledSlots} / {card.totalSlots} cases</span>
                    <span className="text-slate-800">{formatCurrency(card.filledSlots * card.installmentAmount)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        isCompleted || isWithdrawn ? "bg-blue-500" : "bg-sky-500"
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
