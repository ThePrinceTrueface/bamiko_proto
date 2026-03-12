import React from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, Users, LayoutGrid, CheckCircle2, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const { prospects, cards, transactions } = useStore();

  const totalCollected = transactions
    .filter((t) => t.type === 'installment')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeProspects = prospects.length;
  const activeCards = cards.filter((c) => c.status === 'active').length;
  const completedCards = cards.filter((c) => c.status === 'completed' || c.status === 'withdrawn').length;

  return (
    <div className="space-y-6">
      <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-emerald-100 text-sm font-medium mb-1">Total Collecté</h2>
        <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalCollected)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<Users className="text-blue-500" />} label="Prospects Actifs" value={activeProspects} />
        <StatCard icon={<LayoutGrid className="text-amber-500" />} label="Cartes en cours" value={activeCards} />
        <StatCard icon={<CheckCircle2 className="text-emerald-500" />} label="Cartes terminées" value={completedCards} />
        <StatCard icon={<Wallet className="text-purple-500" />} label="Total Cartes" value={cards.length} />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">Actions Rapides</h3>
        </div>
        <div className="space-y-3">
          <Link
            to="/prospects"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <Users size={20} />
              </div>
              <span className="font-medium text-neutral-700">Gérer les prospects</span>
            </div>
            <ArrowRight size={20} className="text-neutral-400" />
          </Link>
          <Link
            to="/services"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Briefcase size={20} />
              </div>
              <span className="font-medium text-neutral-700">Gérer les services et banques</span>
            </div>
            <ArrowRight size={20} className="text-neutral-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-between">
      <div className="mb-3">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-neutral-800">{value}</p>
        <p className="text-xs text-neutral-500 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}
