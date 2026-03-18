import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faBuilding, faCog, faWallet } from '@fortawesome/free-solid-svg-icons';
import TitleBar from './TitleBar';

export default function Layout() {
  const location = useLocation();
  const titles: Record<string, string> = {
    '/': 'Tableau de bord',
    '/prospects': 'Prospects',
    '/services': 'Services & Banques',
    '/settings': 'Paramètres'
  };
  const currentTitle = titles[location.pathname] || 'Bamiko';

  const platform = import.meta.env.VITE_PLATFORM;
  const isWindows = platform !== 'mobile' && platform === 'windows';

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-hidden">
      {isWindows && <TitleBar />}
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <FontAwesomeIcon icon={faWallet} className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Bamiko</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2">
          <DesktopNavItem to="/" icon={faHome} label="Tableau de bord" />
          <DesktopNavItem to="/prospects" icon={faUsers} label="Prospects" />
          <DesktopNavItem to="/services" icon={faBuilding} label="Services & Banques" />
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <DesktopNavItem to="/settings" icon={faCog} label="Paramètres" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top App Bar (Mobile & Desktop) */}
        <header className="bg-blue-600 dark:bg-slate-800 text-white px-4 py-3 shadow-sm z-10 flex items-center justify-center md:justify-start md:px-8 md:bg-white md:dark:bg-slate-900 md:text-slate-900 md:dark:text-white md:border-b md:border-slate-200 md:dark:border-slate-700">
          <h1 className="text-lg font-semibold tracking-wide md:text-2xl md:font-bold">{currentTitle}</h1>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="max-w-md mx-auto w-full p-4 md:max-w-5xl md:p-8">
            <Outlet />
          </div>
        </main>

        {/* Bottom Navigation Bar (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around items-center h-16 pb-safe z-20 transition-colors duration-200">
          <MobileNavItem to="/" icon={faHome} label="Accueil" />
          <MobileNavItem to="/prospects" icon={faUsers} label="Prospects" />
          <MobileNavItem to="/services" icon={faBuilding} label="Services" />
          <MobileNavItem to="/settings" icon={faCog} label="Paramètres" />
        </nav>
      </div>
      </div>
    </div>
  );
}

function MobileNavItem({ to, icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center w-full h-full space-y-1 text-[10px] font-medium transition-colors',
          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
        )
      }
    >
      {({ isActive }) => (
        <>
          <FontAwesomeIcon icon={icon} className={cn("text-lg mb-0.5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function DesktopNavItem({ to, icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
          isActive 
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
        )
      }
    >
      {({ isActive }) => (
        <>
          <FontAwesomeIcon icon={icon} className={cn("text-lg w-6 mr-3", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
