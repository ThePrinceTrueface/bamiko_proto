import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Users, Briefcase, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="bg-emerald-600 text-white p-4 shadow-md z-10">
        <h1 className="text-xl font-bold tracking-tight">Bamiko</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around items-center h-16 pb-safe z-10">
        <NavItem to="/" icon={<Home size={24} />} label="Accueil" />
        <NavItem to="/services" icon={<Briefcase size={24} />} label="Services" />
        <NavItem to="/prospects" icon={<Users size={24} />} label="Prospects" />
        <NavItem to="/settings" icon={<Settings size={24} />} label="Paramètres" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors',
          isActive ? 'text-emerald-600' : 'text-neutral-500 hover:text-neutral-900'
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
