import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faWallet, faUsers, faLayerGroup, faCheckCircle, faBriefcase, faExclamationCircle, faEdit, faChartBar, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { prospects, cards, transactions, settings, updateSettings } = useStore();

  const totalCollected = transactions
    .filter((t) => t.type === 'installment')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeProspects = prospects.length;
  const activeCards = cards.filter((c) => c.status === 'active').length;
  const completedCards = cards.filter((c) => c.status === 'completed' || c.status === 'withdrawn').length;

  const inactivityThreshold = settings?.inactivityDays || 3;
  const now = Date.now();

  const inactiveCards = cards
    .filter((c) => c.status === 'active')
    .map((card) => {
      const cardTxs = transactions
        .filter((t) => t.cardId === card.id && t.type === 'installment')
        .sort((a, b) => b.date - a.date);
      
      const lastTxDate = cardTxs.length > 0 ? cardTxs[0].date : card.createdAt;
      const daysInactive = differenceInDays(now, lastTxDate);
      
      return {
        ...card,
        daysInactive,
        prospect: prospects.find((p) => p.id === card.prospectId),
      };
    })
    .filter((c) => c.daysInactive >= inactivityThreshold)
    .sort((a, b) => b.daysInactive - a.daysInactive);

  // Monthly Goal & Chart Logic
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const currentMonthTransactions = transactions.filter(
    (t) => t.type === 'installment' && isSameMonth(t.date, now)
  );

  const totalCollectedThisMonth = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const chartData = daysInMonth.map(day => {
    const dailyTotal = currentMonthTransactions
      .filter(t => isSameDay(t.date, day))
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      date: format(day, 'dd MMM', { locale: fr }),
      dayNum: format(day, 'dd'),
      amount: dailyTotal
    };
  });

  const monthlyGoal = settings?.monthlyGoal || 0;
  const progress = monthlyGoal > 0 ? Math.min((totalCollectedThisMonth / monthlyGoal) * 100, 100) : 0;
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(monthlyGoal.toString());

  const handleSaveGoal = () => {
    const parsed = parseFloat(goalInput);
    if (!isNaN(parsed) && parsed >= 0) {
      updateSettings({ monthlyGoal: parsed });
    }
    setIsEditingGoal(false);
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-600 text-white rounded-xl p-5 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Total Collecté (Global)</h2>
            <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalCollected)}</p>
          </div>
          <FontAwesomeIcon icon={faWallet} className="absolute -right-4 -bottom-4 text-blue-500/30 text-7xl" />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider flex items-center">
              <FontAwesomeIcon icon={faBullseye} className="mr-2 text-emerald-500" />
              Objectif du mois
            </h2>
            {!isEditingGoal ? (
              <button onClick={() => setIsEditingGoal(true)} className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium transition-colors">
                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Modifier
              </button>
            ) : (
              <div className="flex space-x-3">
                <button onClick={() => setIsEditingGoal(false)} className="text-slate-400 hover:text-slate-500 text-xs transition-colors">Annuler</button>
                <button onClick={handleSaveGoal} className="text-emerald-500 hover:text-emerald-600 text-xs font-medium transition-colors">Enregistrer</button>
              </div>
            )}
          </div>
          
          {isEditingGoal ? (
            <div className="mt-3">
              <div className="relative">
                <input
                  type="number"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-12 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 500000"
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                  {settings?.currency || 'XAF'}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <div className="flex items-end justify-between mb-2">
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(totalCollectedThisMonth)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
                  / {monthlyGoal > 0 ? formatCurrency(monthlyGoal) : 'Non défini'}
                </p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-1.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-right text-slate-500 dark:text-slate-400 font-medium">
                {progress.toFixed(1)}% {progress >= 100 && '🎉'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center">
          <FontAwesomeIcon icon={faChartBar} className="mr-2 text-blue-500" />
          Revenus du mois ({format(now, 'MMMM yyyy', { locale: fr })})
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="dayNum" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                interval="preserveStartEnd"
                minTickGap={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                formatter={(value: number) => [formatCurrency(value), 'Collecté']}
                labelFormatter={(label, payload) => payload && payload.length > 0 ? payload[0].payload.date : label}
                labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 600 }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={faUsers} iconColor="text-sky-500" label="Prospects Actifs" value={activeProspects} />
        <StatCard icon={faLayerGroup} iconColor="text-amber-500" label="Cartes en cours" value={activeCards} />
        <StatCard icon={faCheckCircle} iconColor="text-emerald-500" label="Cartes terminées" value={completedCards} />
        <StatCard icon={faWallet} iconColor="text-purple-500" label="Total Cartes" value={cards.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inactiveCards.length > 0 && (
          <div className="mt-6 md:mt-0">
            <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3 px-1 flex items-center">
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
              À relancer ({inactiveCards.length})
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700 shadow-sm">
              {inactiveCards.slice(0, 5).map((card) => (
                <Link key={card.id} to={`/cards/${card.id}`} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-sm">{card.prospect?.name}</p>
                    <p className="text-xs text-red-500 font-medium">Inactif depuis {card.daysInactive} jours</p>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 dark:text-slate-500 text-sm" />
                </Link>
              ))}
              {inactiveCards.length > 5 && (
                <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                  + {inactiveCards.length - 5} autres clients
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 md:mt-0">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Actions Rapides</h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700 shadow-sm">
            <Link to="/prospects" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">Gérer les prospects</span>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 dark:text-slate-500 text-sm" />
            </Link>
            <Link to="/services" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-sky-50 dark:bg-sky-900/30 w-8 h-8 rounded-full flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">Services et banques</span>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 dark:text-slate-500 text-sm" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconColor, label, value }: { icon: any; iconColor: string; label: string; value: number | string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
      <div className="mb-2"><FontAwesomeIcon icon={icon} className={iconColor} size="lg" /></div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}
