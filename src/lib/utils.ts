import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore } from '../store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  const currency = useStore.getState().settings?.currency || 'XAF';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
