# SportConnect 🏆

Application mobile de mise en relation sportive locale permettant de trouver ou organiser des matchs de foot, basket et tennis autour de soi.

## 👥 Types d'utilisateurs et leurs rôles

### 1. Utilisateur Lambda (Standard)
- Rechercher des parties sportives autour de lui
- Rejoindre une partie disponible
- Payer pour participer
- Se retirer d'une partie jusqu'à 2h avant le début (remboursement en crédits)
- Possibilité de devenir Capo pour créer des parties

### 2. Capo (Organisateur)
- Accès à toutes les fonctionnalités utilisateur lambda
- Création de parties sur des terrains existants
- Validation requise par le gérant avant visibilité
- Gestion des participants
- Annulation possible si terrain non validé

**Détails requis pour la création d'une partie :**
- Terrain
- Date et heure
- Durée
- Format de match (ex: 5 vs 5)
- Description

### 3. Gérant (de Terrain)
- Création et soumission de terrains aux admins
- Gestion des co-gérants
- Validation des réservations
- Optimisation de l'utilisation des terrains

**Informations requises pour un terrain :**
- Nom du terrain
- Localisation
- Contact(s)
- Prix par heure
- Plages horaires disponibles
- Photos
- Description

## 🔁 Flux et cas d'utilisation

### Création de terrain (Gérant)
1. Le gérant saisit les informations du terrain
2. Le terrain est en attente d'approbation admin
3. Une fois validé, il devient disponible à la réservation

### Création de partie (Capo)
1. Le Capo choisit un terrain validé
2. Soumet sa demande de réservation
3. Le gérant valide ou refuse
4. Si accepté, la partie devient visible
5. Les utilisateurs peuvent rejoindre en payant

**Conditions d'annulation :**
- Si toutes les places ne sont pas prises 2h avant la partie :
  - Annulation automatique
  - Remboursement des utilisateurs en crédits

### Participation à une partie (Utilisateur)
1. Consultation des parties disponibles
2. Choix et paiement
3. Possibilité de retrait jusqu'à 2h avant (remboursement en crédits)

## 💰 Système de paiement et remboursement

### Paiement
- Obligatoire pour rejoindre une partie
- Prix basé sur la durée de réservation + marge d'organisation

### Remboursement
- En crédits pour annulation personnelle avant 2h
- En crédits pour annulation automatique (insuffisance de joueurs)

## 📌 Points à valider

- Fixation du prix total pour rejoindre une partie
- Possibilité de supplément pour le Capo
- Visibilité du crédit dans un portefeuille intégré
- Système de notifications (mail, SMS, push)
- Limitation du nombre de parties pour les Capos annulant fréquemment
- Gestion des conflits de réservation

## 🔐 Gestion des rôles

### Évolution des statuts
- Lambda → Capo : via création de partie
- Lambda → Gérant : via formulaire + validation admin

## ✅ Matrice des fonctionnalités par rôle

| Fonctionnalité | Utilisateur | Capo | Gérant |
|----------------|-------------|------|---------|
| Rechercher/rejoindre une partie | ✅ | ✅ | ❌ |
| Créer une partie | ❌ | ✅ | ❌ |
| Créer/soumettre un terrain | ❌ | ❌ | ✅ |
| Gérer les réservations | ❌ | ❌ | ✅ |
| Recevoir des paiements | ❌ | ❌ | ✅ |
| Être remboursé en crédit | ✅ | ✅ | ❌ |

## 🛠️ Technologies utilisées

- Frontend : React Native
- Backend : Node.js avec Express
- Base de données : MongoDB
- Système de paiement : Stripe
- Géolocalisation : Google Maps API

## 📦 Installation

```bash
# Installation des dépendances
npm install

# Lancement de l'application
npm start
```

## 📁 Structure du projet

```
sportConnect/
├── frontend/          # Application React Native
├── backend/           # API Node.js
├── docs/             # Documentation
└── tests/            # Tests unitaires et d'intégration
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT 