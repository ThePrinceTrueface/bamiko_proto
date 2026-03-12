import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Building2, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Services() {
  const { services, banks, addService, addBank } = useStore();
  const [newServiceName, setNewServiceName] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceName.trim()) {
      addService(newServiceName.trim());
      setNewServiceName('');
    }
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceIdToUse = services.length === 1 ? services[0].id : selectedServiceId;
    if (newBankName.trim() && serviceIdToUse) {
      addBank(serviceIdToUse, newBankName.trim());
      setNewBankName('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-800">Services & Banques</h2>

      {services.length === 0 && (
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <Building2 className="mr-2 text-emerald-600" size={20} />
            Nouveau Service
          </h3>
          <form onSubmit={handleAddService} className="flex gap-2">
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Nom du service (ex: Ikema Bank Service)"
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!newServiceName.trim()}
              className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Plus size={24} />
            </button>
          </form>
        </div>
      )}

      {services.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <MapPin className="mr-2 text-blue-600" size={20} />
            Nouvelle Banque / Point de collecte
          </h3>
          <form onSubmit={handleAddBank} className="space-y-3">
            {services.length > 1 && (
              <select
                value={selectedServiceId || ''}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="" disabled>
                  Sélectionner un service
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                placeholder="Nom de la banque (ex: Bank Marché Total)"
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!newBankName.trim() || (services.length > 1 && !selectedServiceId)}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800">Organisation</h3>
        {services.length === 0 ? (
          <p className="text-neutral-500 text-sm italic">Aucun service créé pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => {
              const serviceBanks = banks.filter((b) => b.serviceId === service.id);
              return (
                <div key={service.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                  <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 font-semibold text-neutral-800 flex items-center">
                    <Building2 className="mr-2 text-neutral-500" size={18} />
                    {service.name}
                  </div>
                  <ul className="divide-y divide-neutral-100">
                    {serviceBanks.length === 0 ? (
                      <li className="px-4 py-3 text-sm text-neutral-500 italic">Aucune banque rattachée.</li>
                    ) : (
                      serviceBanks.map((bank) => (
                        <li key={bank.id} className="px-4 py-3 text-sm text-neutral-700 flex items-center">
                          <MapPin className="mr-2 text-neutral-400" size={16} />
                          {bank.name}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
