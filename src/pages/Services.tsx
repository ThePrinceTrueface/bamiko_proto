import React, { useState } from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faPlus, faTrash, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../components/ConfirmModal';

export default function Services() {
  const { services, banks, addService, addBank, deleteService, deleteBank } = useStore();
  const [newServiceName, setNewServiceName] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');

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
      setSelectedServiceId('');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <h2 className="text-2xl font-bold text-slate-900 px-1">Services & Banques</h2>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center uppercase tracking-wider">
          <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600" />
          Nouveau Service
        </h3>
        <form onSubmit={handleAddService} className="flex gap-2">
          <input
            type="text"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            placeholder="Nom du service (ex: Ikema Bank)"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={!newServiceName.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </form>
      </div>

      {services.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center uppercase tracking-wider">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-sky-600" />
            Nouveau Point de collecte
          </h3>
          <form onSubmit={handleAddBank} className="space-y-3">
            <select
              value={selectedServiceId || ''}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="" disabled>Sélectionner un service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                placeholder="Nom du point (ex: Marché Total)"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={!newBankName.trim() || !selectedServiceId}
                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {services.map((service) => {
          const serviceBanks = banks.filter((b) => b.serviceId === service.id);
          return (
            <div key={service.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
                <h4 className="font-bold text-slate-800 text-sm">{service.name}</h4>
                <button
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Supprimer le service',
                      message: `Supprimer le service ${service.name} et tous ses points de collecte ?`,
                      isDestructive: true,
                      onConfirm: () => deleteService(service.id),
                    });
                  }}
                  className="text-red-500 p-1 hover:bg-red-50 rounded"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </div>
              {serviceBanks.length === 0 ? (
                <p className="p-4 text-sm text-slate-500 italic">Aucun point de collecte.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {serviceBanks.map((bank) => (
                    <li key={bank.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                      <Link
                        to={`/banks/${bank.id}`}
                        className="flex-1 flex items-center justify-between pr-4"
                      >
                        <span className="text-slate-700 text-sm font-medium">{bank.name}</span>
                        <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-xs" />
                      </Link>
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
                        className="text-slate-400 hover:text-red-500 p-2 -mr-2 rounded transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
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
