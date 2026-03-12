import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faBuilding, faCog } from '@fortawesome/free-solid-svg-icons';

export default function Layout() {
  const location = useLocation();
  const titles: Record<string, string> = {
    '/': 'Tableau de bord',
    '/prospects': 'Prospects',
    '/services': 'Services & Banques',
    '/settings': 'Paramètres'
  };
  const currentTitle = titles[location.pathname] || 'Bamiko';

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top App Bar */}
      <header className="bg-blue-600 text-white px-4 py-3 shadow-sm z-10 flex items-center justify-center relative">
        <h1 className="text-lg font-semibold tracking-wide">{currentTitle}</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-md mx-auto w-full p-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 pb-safe z-20 max-w-md left-1/2 -translate-x-1/2">
        <NavItem to="/" icon={faHome} label="Accueil" />
        <NavItem to="/prospects" icon={faUsers} label="Prospects" />
        <NavItem to="/services" icon={faBuilding} label="Services" />
        <NavItem to="/settings" icon={faCog} label="Paramètres" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center w-full h-full space-y-1 text-[10px] font-medium transition-colors',
          isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        )
      }
    >
      {({ isActive }) => (
        <>
          <FontAwesomeIcon icon={icon} className={cn("text-lg mb-0.5", isActive ? "text-blue-600" : "text-slate-400")} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
