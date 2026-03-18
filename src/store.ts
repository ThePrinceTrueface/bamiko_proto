import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Service = { id: string; name: string; createdAt: number; updatedAt?: number };
export type Bank = { id: string; serviceId: string; name: string; createdAt: number; updatedAt?: number };
export type Prospect = { id: string; bankId: string; name: string; phone: string; gender?: string; age?: number | null; createdAt: number; updatedAt?: number };
export type Card = {
  id: string;
  prospectId: string;
  objective: string;
  installmentAmount: number;
  totalSlots: number;
  filledSlots: number;
  status: 'active' | 'completed' | 'withdrawn';
  createdAt: number;
  updatedAt?: number;
  commissionAmount?: number;
};
export type Transaction = {
  id: string;
  cardId: string;
  type: 'installment' | 'withdrawal';
  amount: number;
  date: number;
  updatedAt?: number;
};

export interface AppSettings {
  currency: string;
  pinCode: string | null;
  darkMode: boolean;
  commissionType: 'slots' | 'percentage';
  commissionValue: number;
  inactivityDays: number;
  monthlyGoal?: number;
  updatedAt?: number;
}

interface AppState {
  services: Service[];
  banks: Bank[];
  prospects: Prospect[];
  cards: Card[];
  transactions: Transaction[];
  settings: AppSettings;

  addService: (name: string) => void;
  addBank: (serviceId: string, name: string) => void;
  addProspect: (bankId: string, name: string, phone: string, gender?: string, age?: number | null) => void;
  addCard: (prospectId: string, objective: string, installmentAmount: number, totalSlots: number) => void;
  addInstallment: (cardId: string) => void;
  removeInstallment: (cardId: string) => void;
  withdrawCard: (cardId: string, commissionAmount?: number) => void;
  deleteProspect: (id: string) => void;
  deleteCard: (id: string) => void;
  deleteService: (id: string) => void;
  deleteBank: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  restoreData: (data: any) => void;
  mergeData: (data: any) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      services: [],
      banks: [],
      prospects: [],
      cards: [],
      transactions: [],
      settings: {
        currency: 'XAF',
        pinCode: null,
        darkMode: false,
        commissionType: 'slots',
        commissionValue: 1,
        inactivityDays: 3,
        updatedAt: Date.now(),
      },

      addService: (name) =>
        set((state) => {
          if (state.services.length > 0) return state; // Only allow one service
          return {
            services: [{ id: generateId(), name, createdAt: Date.now(), updatedAt: Date.now() }],
          };
        }),

      addBank: (serviceId, name) =>
        set((state) => ({
          banks: [...state.banks, { id: generateId(), serviceId, name, createdAt: Date.now(), updatedAt: Date.now() }],
        })),

      addProspect: (bankId, name, phone, gender, age) =>
        set((state) => ({
          prospects: [...state.prospects, { id: generateId(), bankId, name, phone, gender, age, createdAt: Date.now(), updatedAt: Date.now() }],
        })),

      addCard: (prospectId, objective, installmentAmount, totalSlots) =>
        set((state) => ({
          cards: [
            ...state.cards,
            {
              id: generateId(),
              prospectId,
              objective,
              installmentAmount,
              totalSlots,
              filledSlots: 0,
              status: 'active',
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),

      addInstallment: (cardId) =>
        set((state) => {
          const card = state.cards.find((c) => c.id === cardId);
          if (!card || card.status !== 'active' || card.filledSlots >= card.totalSlots) return state;

          const newFilledSlots = card.filledSlots + 1;
          const newStatus = newFilledSlots === card.totalSlots ? 'completed' : 'active';

          const transaction: Transaction = {
            id: generateId(),
            cardId,
            type: 'installment',
            amount: card.installmentAmount,
            date: Date.now(),
            updatedAt: Date.now(),
          };

          return {
            cards: state.cards.map((c) =>
              c.id === cardId ? { ...c, filledSlots: newFilledSlots, status: newStatus, updatedAt: Date.now() } : c
            ),
            transactions: [...state.transactions, transaction],
          };
        }),

      removeInstallment: (cardId) =>
        set((state) => {
          const card = state.cards.find((c) => c.id === cardId);
          if (!card || card.status === 'withdrawn' || card.filledSlots <= 0) return state;

          const newFilledSlots = card.filledSlots - 1;
          const newStatus = 'active';

          const cardInstallments = state.transactions
            .filter((t) => t.cardId === cardId && t.type === 'installment')
            .sort((a, b) => b.date - a.date);

          let newTransactions = state.transactions;
          if (cardInstallments.length > 0) {
            const latestInstallmentId = cardInstallments[0].id;
            newTransactions = state.transactions.filter((t) => t.id !== latestInstallmentId);
          }

          return {
            cards: state.cards.map((c) =>
              c.id === cardId ? { ...c, filledSlots: newFilledSlots, status: newStatus, updatedAt: Date.now() } : c
            ),
            transactions: newTransactions,
          };
        }),

      withdrawCard: (cardId, commissionAmount = 0) =>
        set((state) => {
          const card = state.cards.find((c) => c.id === cardId);
          if (!card || (card.status !== 'completed' && card.status !== 'active')) return state;
          if (card.status === 'active' && card.filledSlots === 0) return state;

          const transaction: Transaction = {
            id: generateId(),
            cardId,
            type: 'withdrawal',
            amount: card.installmentAmount * card.filledSlots,
            date: Date.now(),
            updatedAt: Date.now(),
          };

          return {
            cards: state.cards.map((c) => (c.id === cardId ? { ...c, status: 'withdrawn', commissionAmount, updatedAt: Date.now() } : c)),
            transactions: [...state.transactions, transaction],
          };
        }),

      deleteProspect: (id) =>
        set((state) => {
          const prospectCards = state.cards.filter((c) => c.prospectId === id);
          const cardIds = prospectCards.map((c) => c.id);
          return {
            prospects: state.prospects.filter((p) => p.id !== id),
            cards: state.cards.filter((c) => c.prospectId !== id),
            transactions: state.transactions.filter((t) => !cardIds.includes(t.cardId)),
          };
        }),

      deleteCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
          transactions: state.transactions.filter((t) => t.cardId !== id),
        })),

      deleteService: (id) =>
        set((state) => {
          const serviceBanks = state.banks.filter((b) => b.serviceId === id);
          const bankIds = serviceBanks.map((b) => b.id);
          const serviceProspects = state.prospects.filter((p) => bankIds.includes(p.bankId));
          const prospectIds = serviceProspects.map((p) => p.id);
          const serviceCards = state.cards.filter((c) => prospectIds.includes(c.prospectId));
          const cardIds = serviceCards.map((c) => c.id);

          return {
            services: state.services.filter((s) => s.id !== id),
            banks: state.banks.filter((b) => b.serviceId !== id),
            prospects: state.prospects.filter((p) => !bankIds.includes(p.bankId)),
            cards: state.cards.filter((c) => !prospectIds.includes(c.prospectId)),
            transactions: state.transactions.filter((t) => !cardIds.includes(t.cardId)),
          };
        }),

      deleteBank: (id) =>
        set((state) => {
          const bankProspects = state.prospects.filter((p) => p.bankId === id);
          const prospectIds = bankProspects.map((p) => p.id);
          const bankCards = state.cards.filter((c) => prospectIds.includes(c.prospectId));
          const cardIds = bankCards.map((c) => c.id);

          return {
            banks: state.banks.filter((b) => b.id !== id),
            prospects: state.prospects.filter((p) => p.bankId !== id),
            cards: state.cards.filter((c) => !prospectIds.includes(c.prospectId)),
            transactions: state.transactions.filter((t) => !cardIds.includes(t.cardId)),
          };
        }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings, updatedAt: Date.now() },
        })),

      restoreData: (data) =>
        set(() => ({
          services: data.services || [],
          banks: data.banks || [],
          prospects: data.prospects || [],
          cards: data.cards || [],
          transactions: data.transactions || [],
          settings: data.settings || {
            currency: 'XAF',
            pinCode: null,
            darkMode: false,
            commissionType: 'slots',
            commissionValue: 1,
            inactivityDays: 3,
          },
        })),

      mergeData: (data) =>
        set((state) => {
          const mergeArraysByDate = (current: any[], backup: any[], dateKey: string) => {
            const mergedMap = new Map(current.map(item => [item.id, item]));
            
            (backup || []).forEach((bItem: any) => {
              const cItem = mergedMap.get(bItem.id);
              if (cItem) {
                const cDate = cItem.updatedAt || cItem[dateKey] || 0;
                const bDate = bItem.updatedAt || bItem[dateKey] || 0;
                if (bDate > cDate) {
                  mergedMap.set(bItem.id, bItem);
                }
              } else {
                mergedMap.set(bItem.id, bItem);
              }
            });
            
            return Array.from(mergedMap.values()).sort((a, b) => (a[dateKey] || 0) - (b[dateKey] || 0));
          };

          const cSettingsDate = state.settings.updatedAt || 0;
          const bSettingsDate = data.settings?.updatedAt || 0;
          const mergedSettings = bSettingsDate > cSettingsDate 
            ? { ...state.settings, ...data.settings, updatedAt: bSettingsDate } 
            : state.settings;

          return {
            services: mergeArraysByDate(state.services, data.services, 'createdAt'),
            banks: mergeArraysByDate(state.banks, data.banks, 'createdAt'),
            prospects: mergeArraysByDate(state.prospects, data.prospects, 'createdAt'),
            cards: mergeArraysByDate(state.cards, data.cards, 'createdAt'),
            transactions: mergeArraysByDate(state.transactions, data.transactions, 'date'),
            settings: mergedSettings,
          };
        }),
    }),
    {
      name: 'bamiko-storage',
    }
  )
);
