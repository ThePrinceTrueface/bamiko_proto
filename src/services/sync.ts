import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useStore } from '../store';

export const syncToCloud = async () => {
  if (!auth.currentUser) throw new Error('Utilisateur non connecté');

  const state = useStore.getState();
  const dataToSync = {
    services: state.services,
    banks: state.banks,
    prospects: state.prospects,
    cards: state.cards,
    transactions: state.transactions,
    settings: state.settings,
  };

  const payload = {
    uid: auth.currentUser.uid,
    data: JSON.stringify(dataToSync),
    updatedAt: Date.now(),
  };

  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  await setDoc(userDocRef, payload);
};

export const syncFromCloud = async () => {
  if (!auth.currentUser) throw new Error('Utilisateur non connecté');

  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    const payload = docSnap.data();
    if (payload.data) {
      try {
        const parsedData = JSON.parse(payload.data);
        useStore.getState().mergeData(parsedData);
      } catch (e) {
        console.error('Erreur lors du parsing des données cloud', e);
        throw new Error('Données cloud corrompues');
      }
    }
  } else {
    throw new Error('Aucune sauvegarde trouvée dans le cloud');
  }
};
