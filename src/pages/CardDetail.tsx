import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatCurrency, cn } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faMoneyBillWave, faRotateLeft, faTrash, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { format, eachDayOfInterval, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ConfirmModal from '../components/ConfirmModal';

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, prospects, transactions, addInstallment, withdrawCard, removeInstallment, deleteCard } = useStore();

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

  const card = cards.find((c) => c.id === id);
  const prospect = prospects.find((p) => p.id === card?.prospectId);
  const cardTransactions = transactions
    .filter((t) => t.cardId === id)
    .sort((a, b) => b.date - a.date);

  if (!card || !prospect) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 dark:text-slate-400">Carte introuvable.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 dark:text-blue-400 font-medium mt-4 inline-block">
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
  
  const { settings } = useStore();
  
  let commissionAmount = 0;
  if (settings?.commissionType === 'percentage') {
    commissionAmount = (totalAmount * (settings.commissionValue || 0)) / 100;
  } else {
    commissionAmount = (settings?.commissionValue || 0) * card.installmentAmount;
  }
  const clientAmount = totalAmount - commissionAmount;

  let earlyCommissionAmount = 0;
  if (settings?.commissionType === 'percentage') {
    earlyCommissionAmount = (currentAmount * (settings.commissionValue || 0)) / 100;
  } else {
    earlyCommissionAmount = (settings?.commissionValue || 0) * card.installmentAmount;
  }
  const earlyClientAmount = Math.max(0, currentAmount - earlyCommissionAmount);

  // Generate chart data
  const startDate = startOfDay(card.createdAt);
  const endDate = endOfDay(Date.now());
  let chartDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Limit to last 30 days to avoid overcrowding the chart
  if (chartDays.length > 30) {
    chartDays = chartDays.slice(-30);
  }

  const chartData = chartDays.map((day) => {
    const dayTransactions = cardTransactions.filter(
      (tx) => tx.type === 'installment' && isSameDay(tx.date, day)
    );
    const amount = dayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    return {
      date: format(day, 'dd/MM'),
      amount,
      fullDate: format(day, 'd MMMM yyyy', { locale: fr }),
    };
  });

  const handleAddInstallment = () => {
    if (isActive && card.filledSlots < card.totalSlots) {
      addInstallment(card.id);
    }
  };

  const handleWithdraw = () => {
    if (isCompleted) {
      setConfirmModal({
        isOpen: true,
        title: 'Retirer la carte',
        message: `Confirmer le retrait pour ${prospect.name} ?\n\nMontant total : ${formatCurrency(totalAmount)}\nCommission : ${formatCurrency(commissionAmount)}\nÀ remettre au client : ${formatCurrency(clientAmount)}`,
        onConfirm: () => withdrawCard(card.id, commissionAmount),
      });
    }
  };

  const handleEarlyWithdraw = () => {
    if (isActive && card.filledSlots > 0) {
      setConfirmModal({
        isOpen: true,
        title: 'Retrait anticipé (Casse)',
        message: `Le client souhaite récupérer son argent avant la fin.\n\nÉpargne actuelle : ${formatCurrency(currentAmount)}\nCommission : ${formatCurrency(earlyCommissionAmount)}\nÀ remettre au client : ${formatCurrency(earlyClientAmount)}\n\nCette action clôturera définitivement la carte.`,
        isDestructive: true,
        onConfirm: () => withdrawCard(card.id, earlyCommissionAmount),
      });
    }
  };

  const handleRemoveInstallment = () => {
    if ((isActive || isCompleted) && card.filledSlots > 0) {
      setConfirmModal({
        isOpen: true,
        title: 'Annuler le pointage',
        message: 'Êtes-vous sûr de vouloir annuler le dernier pointage ?',
        isDestructive: true,
        onConfirm: () => removeInstallment(card.id),
      });
    }
  };

  const handleDeleteCard = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer la carte',
      message: 'Êtes-vous sûr de vouloir supprimer cette carte d\'épargne et tout son historique ? Cette action est irréversible.',
      isDestructive: true,
      onConfirm: () => {
        deleteCard(card.id);
        navigate(-1);
      },
    });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => navigate(-1)} className="text-blue-600 dark:text-blue-400 p-2 -ml-2 active:opacity-70 transition-opacity flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span className="font-medium">Retour</span>
        </button>
        <button onClick={handleDeleteCard} className="text-red-500 p-2 -mr-2 active:opacity-70 transition-opacity">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      <div className="px-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{card.objective}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{prospect.name}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        {isWithdrawn && (
          <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold">
            Retirée
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold">
            Terminée
          </div>
        )}

        <div className="mb-6">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-semibold">Objectif Total</p>
          <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{formatCurrency(totalAmount)}</p>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
            Épargné : {formatCurrency(currentAmount)}
          </p>
          {isWithdrawn && card.commissionAmount !== undefined && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">Remis au client</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(totalAmount - card.commissionAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Commission</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(card.commissionAmount)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">
            <span>Progression</span>
            <span className="text-slate-800 dark:text-slate-200">{card.filledSlots} / {card.totalSlots}</span>
          </div>
          <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
            {Array.from({ length: card.totalSlots }).map((_, index) => {
              const isFilled = index < card.filledSlots;
              return (
                <div
                  key={index}
                  className={cn(
                    "aspect-square rounded flex items-center justify-center transition-all duration-300",
                    isFilled ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600"
                  )}
                >
                  {isFilled ? <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" /> : <FontAwesomeIcon icon={faCircle} className="text-[10px]" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Activité (30 derniers jours)</h3>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={settings?.darkMode ? '#334155' : '#f1f5f9'} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                dy={10}
                minTickGap={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                tickFormatter={(value) => value > 0 ? `${value}` : ''}
              />
              <Tooltip 
                cursor={{ fill: settings?.darkMode ? '#1e293b' : '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: `1px solid ${settings?.darkMode ? '#334155' : '#e2e8f0'}`, 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: settings?.darkMode ? '#0f172a' : '#ffffff'
                }}
                labelFormatter={(_, payload) => payload[0]?.payload.fullDate || ''}
                formatter={(value: number) => [`${formatCurrency(value)}`, 'Épargné']}
                labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px', fontWeight: 600 }}
                itemStyle={{ color: '#3b82f6', fontSize: '14px', fontWeight: 700 }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Historique</h3>
        
        {cardTransactions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-sm">Aucune transaction.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700 shadow-sm">
            {cardTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    tx.type === 'installment' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
                  )}>
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-sm">
                      {tx.type === 'installment' ? 'Versement' : 'Retrait'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {format(tx.date, "d MMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "font-bold text-sm",
                  tx.type === 'installment' ? "text-blue-600 dark:text-blue-400" : "text-sky-600 dark:text-sky-400"
                )}>
                  {tx.type === 'installment' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-20 max-w-md mx-auto transition-colors duration-200 md:relative md:bottom-auto md:p-0 md:bg-transparent md:dark:bg-transparent md:border-none md:max-w-none md:mt-6 md:flex md:gap-4 md:flex-wrap">
        {isActive && (
          <button
            onClick={handleAddInstallment}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center md:flex-1"
          >
            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
            Pointer {formatCurrency(card.installmentAmount)}
          </button>
        )}

        {isCompleted && (
          <button
            onClick={handleWithdraw}
            className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-bold text-base hover:bg-sky-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center md:flex-1"
          >
            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
            Retirer {formatCurrency(totalAmount)}
          </button>
        )}

        {isActive && card.filledSlots > 0 && (
          <button
            onClick={handleEarlyWithdraw}
            className="w-full mt-2 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-xl font-semibold text-sm active:bg-amber-100 dark:active:bg-amber-900/40 transition-all flex items-center justify-center border border-amber-200 dark:border-amber-800/50 md:mt-0 md:flex-1 md:py-3.5"
          >
            <FontAwesomeIcon icon={faHandHoldingDollar} className="mr-2" />
            Retrait anticipé (Casse)
          </button>
        )}

        {(isActive || isCompleted) && card.filledSlots > 0 && (
          <button
            onClick={handleRemoveInstallment}
            className="w-full mt-2 py-2.5 bg-slate-50 dark:bg-slate-700 text-red-500 dark:text-red-400 rounded-xl font-semibold text-sm active:bg-slate-100 dark:active:bg-slate-600 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-600 md:mt-0 md:flex-1 md:py-3.5"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="mr-2" />
            Annuler le dernier pointage
          </button>
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
