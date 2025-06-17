# 🚀 Swapeo Backend API

Backend API complet pour la plateforme Swapeo - Swap de trésorerie entre auto-entrepreneurs.

## 📋 Fonctionnalités

### ✅ Modules implémentés

- **Authentification** : Inscription, connexion, JWT
- **Utilisateurs** : Profils, KYC, préférences
- **Swaps** : Création, matching, gestion
- **Wallet** : Soldes, mouvements, dépôts/retraits
- **Matching** : Algorithme automatique + IA
- **Admin** : Panel administrateur complet
- **Upload** : Documents KYC, photos de profil
- **Notifications** : Système de notifications
- **Calculs** : Moteur de calcul des intérêts et frais

## 🛠 Installation

```bash
# Cloner et installer
cd backend
npm install

# Configuration
cp .env.example .env
# Modifier les variables dans .env

# Démarrer en développement
npm run dev

# Démarrer en production
npm start
```

## 📁 Structure du projet

```
backend/
├── data/                 # Stockage JSON (temporaire)
│   ├── storage.js       # Système de stockage
│   └── db/             # Fichiers JSON
├── middleware/          # Middlewares Express
│   ├── auth.js         # Authentification JWT
│   └── errorHandler.js # Gestion d'erreurs
├── routes/             # Routes API
│   ├── auth.js         # Authentification
│   ├── users.js        # Utilisateurs
│   ├── swaps.js        # Swaps
│   ├── wallet.js       # Wallet
│   ├── matching.js     # Matching
│   ├── admin.js        # Administration
│   └── upload.js       # Upload fichiers
├── utils/              # Utilitaires
│   └── calculator.js   # Moteur de calcul
├── uploads/            # Fichiers uploadés
├── server.js           # Serveur principal
└── package.json
```

## 🔌 API Endpoints

### 🔐 Authentification (`/api/auth`)

- `POST /register` - Inscription
- `POST /login` - Connexion
- `GET /me` - Profil utilisateur actuel
- `POST /forgot-password` - Mot de passe oublié

### 👤 Utilisateurs (`/api/users`)

- `GET /profile` - Profil utilisateur
- `PUT /profile` - Mise à jour profil
- `POST /kyc/update` - Mise à jour KYC
- `GET /stats` - Statistiques utilisateur
- `PUT /preferences` - Préférences
- `DELETE /account` - Supprimer compte

### 🔄 Swaps (`/api/swaps`)

- `GET /` - Liste des swaps
- `POST /` - Créer un swap
- `GET /:id` - Détails d'un swap
- `POST /:id/apply` - Candidater à un swap
- `POST /:id/applications/:userId/:action` - Accepter/rejeter
- `PATCH /:id/status` - Mettre à jour le statut

### 💳 Wallet (`/api/wallet`)

- `GET /` - Informations wallet
- `GET /movements` - Historique des mouvements
- `POST /deposit` - Déposer de l'argent
- `POST /withdraw` - Retirer de l'argent
- `GET /stats` - Statistiques wallet

### 🎯 Matching (`/api/matching`)

- `GET /compatible` - Swaps compatibles
- `GET /suggestions` - Suggestions IA
- `GET /stats` - Statistiques matching
- `POST /auto-match` - Matching automatique

### 📤 Upload (`/api/upload`)

- `POST /kyc` - Upload documents KYC
- `GET /kyc` - Documents uploadés
- `GET /download/:filename` - Télécharger document
- `DELETE /kyc/:type/:filename` - Supprimer document
- `POST /profile-picture` - Photo de profil

### 👨‍💼 Admin (`/api/admin`)

- `GET /dashboard` - Statistiques admin
- `GET /users` - Liste utilisateurs
- `GET /users/:id` - Détails utilisateur
- `PATCH /users/:id/verification` - Vérification
- `GET /swaps` - Liste swaps admin
- `PATCH /swaps/:id/intervene` - Intervention manuelle
- `GET /analytics` - Analytics plateforme
- `GET /health` - Santé du système

## 🔧 Configuration

### Variables d'environnement (.env)

```bash
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key
```

### Démarrage rapide

```bash
# Installation et démarrage
npm install
npm run dev

# L'API sera accessible sur http://localhost:3001
```

## 🧪 Tests et Développement

### Données de test

Le système génère automatiquement des données de test :

- 2 utilisateurs de test (John, Sarah)
- Wallets avec soldes
- Swaps d'exemple
- Mouvements de test

### Endpoints de test

```bash
# Health check
GET /health

# API documentation
GET /

# Simuler un paiement (dev seulement)
POST /api/wallet/simulate/incoming
```

## 🚀 D��ploiement

### Option 1 : Vercel

```bash
npm run build
vercel --prod
```

### Option 2 : Heroku

```bash
# Créer app Heroku
heroku create swapeo-api

# Déployer
git push heroku main
```

### Option 3 : VPS/Docker

```bash
# Build et run
docker build -t swapeo-api .
docker run -p 3001:3001 swapeo-api
```

## 📊 Monitoring

### Logs

- Morgan pour les logs HTTP
- Console.log pour le debug
- Gestion d'erreurs centralisée

### Métriques

- Health check endpoint
- Statistiques de performance
- Monitoring des erreurs

## 🔮 Améliorations futures

### Base de données

- Migration vers PostgreSQL/Supabase
- Optimisations performances
- Backup automatique

### Fonctionnalités

- Paiements réels (Stripe)
- Notifications push (Firebase)
- Email (SMTP)
- WebSockets temps réel
- Cache Redis

### Sécurité

- Rate limiting avancé
- Validation renforcée
- Audit logs
- Chiffrement données sensibles

## 📞 Support

Pour toute question :

- API Documentation : `GET /`
- Health Check : `GET /health`
- Logs serveur : `npm run dev` (mode verbose)

---

**🎉 Backend prêt pour la production !**
Toutes les fonctionnalités du MVP sont implémentées et testables.
