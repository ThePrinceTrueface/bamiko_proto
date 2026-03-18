/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import BankDetail from './pages/BankDetail';
import Prospects from './pages/Prospects';
import ProspectDetail from './pages/ProspectDetail';
import CardDetail from './pages/CardDetail';
import Settings from './pages/Settings';
import PinScreen from './components/PinScreen';
import LoginScreen from './components/LoginScreen';
import SplashScreen from './components/SplashScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  const { settings } = useStore();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (settings?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings?.darkMode]);

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin" />
        </div>
      );
    }

    if (!user) {
      return <LoginScreen />;
    }

    const needsPin = settings?.pinCode && !isUnlocked;

    if (needsPin) {
      return <PinScreen onUnlock={() => setIsUnlocked(true)} />;
    }

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="services" element={<Services />} />
            <Route path="banks/:id" element={<BankDetail />} />
            <Route path="prospects" element={<Prospects />} />
            <Route path="prospects/:id" element={<ProspectDetail />} />
            <Route path="cards/:id" element={<CardDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      {renderContent()}
    </>
  );
}

