import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Service = { id: string; name: string; createdAt: number };
export type Bank = { id: string; serviceId: string; name: string; createdAt: number };
export type Prospect = { id: string; bankId: string; name: string; phone: string; createdAt: number };
export type Card = {
  id: string;
  prospectId: string;
  objective: string;
  installmentAmount: number;
  totalSlots: number;
  filledSlots: number;
  status: 'active' | 'completed' | 'withdrawn';
  createdAt: number;
};
export type Transaction = {
  id: string;
  cardId: string;
  type: 'installment' | 'withdrawal';
  amount: number;
  date: number;
};

interface AppState {
  services: Service[];
  banks: Bank[];
  prospects: Prospect[];
  cards: Card[];
  transactions: Transaction[];

  addService: (name: string) => void;
  addBank: (serviceId: string, name: string) => void;
  addProspect: (bankId: string, name: string, phone: string) => void;
  addCard: (prospectId: string, objective: string, installmentAmount: number, totalSlots: number) => void;
  addInstallment: (cardId: string) => void;
  removeInstallment: (cardId: string) => void;
  withdrawCard: (cardId: string) => void;
  deleteProspect: (id: string) => void;
  deleteCard: (id: string) => void;
  deleteService: (id: string) => void;
  deleteBank: (id: string) => void;
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

      addService: (name) =>
        set((state) => {
          if (state.services.length > 0) return state; // Only allow one service
          return {
            services: [{ id: generateId(), name, createdAt: Date.now() }],
          };
        }),

      addBank: (serviceId, name) =>
        set((state) => ({
          banks: [...state.banks, { id: generateId(), serviceId, name, createdAt: Date.now() }],
        })),

      addProspect: (bankId, name, phone) =>
        set((state) => ({
          prospects: [...state.prospects, { id: generateId(), bankId, name, phone, createdAt: Date.now() }],
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
          };

          return {
            cards: state.cards.map((c) =>
              c.id === cardId ? { ...c, filledSlots: newFilledSlots, status: newStatus } : c
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
              c.id === cardId ? { ...c, filledSlots: newFilledSlots, status: newStatus } : c
            ),
            transactions: newTransactions,
          };
        }),

      withdrawCard: (cardId) =>
        set((state) => {
          const card = state.cards.find((c) => c.id === cardId);
          if (!card || card.status !== 'completed') return state;

          const transaction: Transaction = {
            id: generateId(),
            cardId,
            type: 'withdrawal',
            amount: card.installmentAmount * card.totalSlots,
            date: Date.now(),
          };

          return {
            cards: state.cards.map((c) => (c.id === cardId ? { ...c, status: 'withdrawn' } : c)),
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
    }),
    {
      name: 'bamiko-storage',
    }
  )
);
