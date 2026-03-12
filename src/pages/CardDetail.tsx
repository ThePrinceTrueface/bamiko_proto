import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatCurrency, cn } from '../lib/utils';
import { ArrowLeft, CheckCircle2, Circle, Banknote, History, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, prospects, transactions, addInstallment, withdrawCard, removeInstallment } = useStore();

  const card = cards.find((c) => c.id === id);
  const prospect = prospects.find((p) => p.id === card?.prospectId);
  const cardTransactions = transactions
    .filter((t) => t.cardId === id)
    .sort((a, b) => b.date - a.date);

  if (!card || !prospect) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">Carte introuvable.</p>
        <button onClick={() => navigate(-1)} className="text-emerald-600 font-medium mt-4 inline-block">
          Retour
        </button>
      </div>
    );
  }

  const isCompleted = card.status === 'completed';
  const isWithdrawn = card.status === 'withdrawn';
  const isActive = card.status === 'active';
  const totalAmount = card.totalSlots * card.installmentAmount;
  const currentAmount = card.filledSlots * card.installmentAmount;

  const handleAddInstallment = () => {
    if (isActive && card.filledSlots < card.totalSlots) {
      addInstallment(card.id);
    }
  };

  const handleWithdraw = () => {
    if (isCompleted) {
      if (window.confirm(`Confirmer le retrait de ${formatCurrency(totalAmount)} pour ${prospect.name} ?`)) {
        withdrawCard(card.id);
      }
    }
  };

  const handleRemoveInstallment = () => {
    if ((isActive || isCompleted) && card.filledSlots > 0) {
      if (window.confirm('Êtes-vous sûr de vouloir annuler le dernier pointage ?')) {
        removeInstallment(card.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm text-neutral-600 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">{card.objective}</h2>
          <p className="text-sm text-neutral-500 font-medium">{prospect.name}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm relative overflow-hidden">
        {isWithdrawn && (
          <div className="absolute top-4 right-4 bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs font-bold">
            Retirée
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
            Terminée
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm text-neutral-500 mb-1">Objectif Total</p>
          <p className="text-4xl font-black text-neutral-800 tracking-tight">{formatCurrency(totalAmount)}</p>
          <p className="text-sm font-medium text-emerald-600 mt-2">
            Épargné : {formatCurrency(currentAmount)}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-neutral-600">Progression</span>
            <span className="text-neutral-800">{card.filledSlots} / {card.totalSlots}</span>
          </div>
          <div className="grid grid-cols-10 gap-1 sm:gap-2">
            {Array.from({ length: card.totalSlots }).map((_, index) => {
              const isFilled = index < card.filledSlots;
              return (
                <div
                  key={index}
                  className={cn(
                    "aspect-square rounded-md flex items-center justify-center transition-all duration-300",
                    isFilled ? "bg-emerald-500 text-white shadow-sm" : "bg-neutral-100 border border-neutral-200 text-neutral-300"
                  )}
                >
                  {isFilled ? <CheckCircle2 size={16} /> : <Circle size={16} strokeWidth={1.5} />}
                </div>
              );
            })}
          </div>
        </div>

        {isActive && (
          <button
            onClick={handleAddInstallment}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center"
          >
            <Banknote className="mr-2" />
            Pointer {formatCurrency(card.installmentAmount)}
          </button>
        )}

        {isCompleted && (
          <button
            onClick={handleWithdraw}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center animate-pulse"
          >
            <Banknote className="mr-2" />
            Retirer {formatCurrency(totalAmount)}
          </button>
        )}

        {(isActive || isCompleted) && card.filledSlots > 0 && (
          <button
            onClick={handleRemoveInstallment}
            className="w-full mt-3 py-3 bg-red-50 text-red-600 rounded-2xl font-semibold text-base hover:bg-red-100 active:scale-[0.98] transition-all flex items-center justify-center border border-red-200"
          >
            <Undo2 className="mr-2" size={20} />
            Annuler le dernier pointage
          </button>
        )}
      </div>

      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <History className="mr-2 text-neutral-500" size={20} />
          Historique
        </h3>
        
        {cardTransactions.length === 0 ? (
          <p className="text-neutral-500 text-sm italic text-center py-4">Aucune transaction.</p>
        ) : (
          <div className="space-y-3">
            {cardTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    tx.type === 'installment' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>
                    <Banknote size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 text-sm">
                      {tx.type === 'installment' ? 'Versement' : 'Retrait'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {format(tx.date, "d MMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "font-bold",
                  tx.type === 'installment' ? "text-emerald-600" : "text-blue-600"
                )}>
                  {tx.type === 'installment' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
