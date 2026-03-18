import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faSquare, faXmark, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsMaximized(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMinimize = () => {
    // If running in Electron/Tauri, you would call their specific APIs here
    if ((window as any).electronAPI) {
      (window as any).electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.maximize();
    } else {
      // Web fallback for fullscreen
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleClose = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.close();
    } else {
      // Web fallback
      window.close();
    }
  };

  return (
    <div 
      className="h-8 w-full bg-[#f3f4f6] dark:bg-[#202020] flex justify-between items-center select-none z-50 shrink-0 border-b border-slate-200 dark:border-slate-800"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      <div className="flex items-center pl-3 h-full">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Bamiko</span>
      </div>
      <div className="flex h-full" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button 
          onClick={handleMinimize}
          className="h-full px-4 hover:bg-slate-200 dark:hover:bg-[#333333] text-slate-600 dark:text-slate-400 transition-colors flex items-center justify-center"
          title="Réduire"
        >
          <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
        </button>
        <button 
          onClick={handleMaximize}
          className="h-full px-4 hover:bg-slate-200 dark:hover:bg-[#333333] text-slate-600 dark:text-slate-400 transition-colors flex items-center justify-center"
          title={isMaximized ? "Niveau inférieur" : "Agrandir"}
        >
          <FontAwesomeIcon icon={isMaximized ? faWindowRestore : faSquare} className="text-[10px]" />
        </button>
        <button 
          onClick={handleClose}
          className="h-full px-4 hover:bg-[#e81123] hover:text-white text-slate-600 dark:text-slate-400 transition-colors flex items-center justify-center"
          title="Fermer"
        >
          <FontAwesomeIcon icon={faXmark} className="text-[12px]" />
        </button>
      </div>
    </div>
  );
}
