import { useStore } from '../store';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faWallet, faUsers, faLayerGroup, faCheckCircle, faBriefcase } from '@fortawesome/free-solid-svg-icons';

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
      <div className="bg-blue-600 text-white rounded-xl p-5 shadow-sm">
        <h2 className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Total Collecté</h2>
        <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalCollected)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={faUsers} iconColor="text-sky-500" label="Prospects Actifs" value={activeProspects} />
        <StatCard icon={faLayerGroup} iconColor="text-amber-500" label="Cartes en cours" value={activeCards} />
        <StatCard icon={faCheckCircle} iconColor="text-blue-500" label="Cartes terminées" value={completedCards} />
        <StatCard icon={faWallet} iconColor="text-purple-500" label="Total Cartes" value={cards.length} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Actions Rapides</h3>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
          <Link to="/prospects" className="flex items-center justify-between p-4 active:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center text-blue-600">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <span className="font-medium text-slate-700">Gérer les prospects</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-sm" />
          </Link>
          <Link to="/services" className="flex items-center justify-between p-4 active:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-sky-50 w-8 h-8 rounded-full flex items-center justify-center text-sky-600">
                <FontAwesomeIcon icon={faBriefcase} />
              </div>
              <span className="font-medium text-slate-700">Services et banques</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconColor, label, value }: { icon: any; iconColor: string; label: string; value: number | string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="mb-2"><FontAwesomeIcon icon={icon} className={iconColor} size="lg" /></div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}
