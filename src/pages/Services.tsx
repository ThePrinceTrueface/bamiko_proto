import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faPlus, faTrash, faChevronRight, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../components/ConfirmModal';
import { cn } from '../lib/utils';

export default function Services() {
  const { services, banks, addService, addBank, deleteService, deleteBank } = useStore();
  const [newServiceName, setNewServiceName] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');

  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      setSelectedServiceId(services[0].id);
    } else if (selectedServiceId && !services.find(s => s.id === selectedServiceId)) {
      setSelectedServiceId(services.length > 0 ? services[0].id : '');
    }
  }, [services, selectedServiceId]);

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

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceName.trim()) {
      addService(newServiceName.trim());
      setNewServiceName('');
    }
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBankName.trim() && selectedServiceId) {
      addBank(selectedServiceId, newBankName.trim());
      setNewBankName('');
    }
  };

  const selectedService = services.find(s => s.id === selectedServiceId);
  const serviceBanks = banks.filter(b => b.serviceId === selectedServiceId);

  return (
    <div className="space-y-4 pb-16 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white px-1">Services & Banques</h2>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-[500px]">
        {/* Left Panel: Services */}
        <div className="w-full md:w-1/3 flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3 flex items-center uppercase tracking-wider">
              <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600 dark:text-blue-400" />
              Services
            </h3>
            <form onSubmit={handleAddService} className="flex gap-2">
              <input
                type="text"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="Nouveau service..."
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
              />
              <button
                type="submit"
                disabled={!newServiceName.trim()}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </form>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {services.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <FontAwesomeIcon icon={faFolderOpen} className="text-4xl mb-3 opacity-20" />
                <p className="text-sm">Aucun service créé.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {services.map((service) => (
                  <li key={service.id}>
                    <button
                      onClick={() => setSelectedServiceId(service.id)}
                      className={cn(
                        "w-full text-left px-4 py-4 flex items-center justify-between transition-colors",
                        selectedServiceId === service.id 
                          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/30 border-l-4 border-transparent"
                      )}
                    >
                      <span className={cn(
                        "font-medium text-sm",
                        selectedServiceId === service.id ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"
                      )}>
                        {service.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-full">
                          {banks.filter(b => b.serviceId === service.id).length}
                        </span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmModal({
                              isOpen: true,
                              title: 'Supprimer le service',
                              message: `Supprimer le service ${service.name} et tous ses points de collecte ?`,
                              isDestructive: true,
                              onConfirm: () => deleteService(service.id),
                            });
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Panel: Banks */}
        <div className="w-full md:w-2/3 flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {selectedService ? (
            <>
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-sky-600 dark:text-sky-400" />
                    {selectedService.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">Points de collecte</p>
                </div>
                
                <form onSubmit={handleAddBank} className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    placeholder="Nouveau point..."
                    className="flex-1 sm:w-48 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newBankName.trim()}
                    className="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </form>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {serviceBanks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 opacity-60">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-5xl mb-4" />
                    <p>Aucun point de collecte pour ce service.</p>
                    <p className="text-sm mt-1">Ajoutez-en un via le formulaire ci-dessus.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {serviceBanks.map((bank) => (
                      <div key={bank.id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md transition-all flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-sky-50 dark:bg-sky-900/30 w-10 h-10 rounded-lg flex items-center justify-center text-sky-600 dark:text-sky-400">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
                          </div>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: 'Supprimer le point de collecte',
                                message: `Supprimer le point ${bank.name} ?`,
                                isDestructive: true,
                                onConfirm: () => deleteBank(bank.id),
                              });
                            }}
                            className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1 line-clamp-1" title={bank.name}>{bank.name}</h4>
                          <Link
                            to={`/banks/${bank.id}`}
                            className="inline-flex items-center text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 mt-2"
                          >
                            Voir les clients <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-[10px]" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <FontAwesomeIcon icon={faBuilding} className="text-6xl mb-4 opacity-20" />
              <p>Sélectionnez un service pour voir ses points de collecte</p>
            </div>
          )}
        </div>
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
