# Bamiko 🏦

**Bamiko** est une application moderne et intuitive de gestion de tontine et de cartes d'épargne. Elle permet aux collecteurs et aux gestionnaires de suivre facilement les cotisations de leurs clients, de gérer les retraits et de calculer automatiquement les commissions.

Propulsé par **ebinasoft**.

## 🚀 Fonctionnalités Principales

*   **Gestion Hiérarchique :** Organisation par Services > Points de collecte (Banques) > Clients (Prospects).
*   **Cartes d'Épargne :** Création de cartes personnalisées avec un objectif, un montant par case (mise) et un nombre total de cases.
*   **Suivi des Pointages :** Ajout et annulation de versements en temps réel avec une interface visuelle (grille de cases).
*   **Retraits Flexibles :** 
    *   Retrait classique à la fin de la carte.
    *   Retrait anticipé ("Casse") avec calcul automatique de la commission sur le montant déjà épargné.
*   **Commissions Automatiques :** Configuration des commissions par pourcentage ou par montant fixe par case.
*   **Tableau de Bord & Statistiques :** Visualisation des revenus, des commissions et de l'activité récente via des graphiques interactifs.
*   **Exportation de Données :** 
    *   Rapport complet en PDF (classé par service et point de collecte).
    *   Exportation CSV de l'historique des transactions et de la liste des clients.
*   **Sécurité & Sauvegarde :**
    *   Verrouillage de l'application par code PIN.
    *   Sauvegarde et synchronisation dans le Cloud (Firebase).
*   **Personnalisation :** Mode Sombre (Dark Mode) et choix de la devise.

## 🛠️ Technologies Utilisées

*   **Frontend :** React 18, TypeScript, Vite
*   **Styling :** Tailwind CSS
*   **State Management :** Zustand (avec persistance locale)
*   **Graphiques :** Recharts
*   **Animations :** Framer Motion
*   **Export PDF :** jsPDF & jsPDF-AutoTable
*   **Backend / Cloud :** Firebase (Auth & Firestore)

## 📦 Installation et Lancement

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/votre-utilisateur/bamiko.git
   cd bamiko
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

4. Ouvrez votre navigateur sur `http://localhost:3000` (ou le port indiqué dans la console).

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés.

---
*Propulsé par ebinasoft*
