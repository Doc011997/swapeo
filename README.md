# 🚀 Swapeo - Plateforme de Swap de Trésorerie

## 📋 Description

Swapeo est une plateforme révolutionnaire qui permet aux entreprises d'échanger leur trésorerie de manière directe et sécurisée, sans passer par les banques traditionnelles.

## 🎯 Fonctionnalités

### Frontend (React + Vite + Tailwind)

- ✅ **Interface révolutionnaire** avec animations dynamiques
- ✅ **Dashboard complet** pour la gestion des swaps
- ✅ **Authentification** JWT intégrée
- ✅ **Design responsive** et moderne
- ✅ **Background dynamique** avec particules
- ✅ **Logo interactif** avec effets

### Backend (Express + Netlify Functions)

- ✅ **API REST complète** avec authentification JWT
- ✅ **Gestion utilisateurs** et KYC
- ✅ **Système de swaps** complet
- ✅ **Wallet interne** avec mouvements
- ✅ **Algorithme de matching** intelligent
- ✅ **Panel administrateur**
- ✅ **Upload de documents**

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn

### Frontend

```bash
# Installation des dépendances
npm install

# Configuration
cp .env.example .env
# Modifier VITE_API_URL avec votre URL backend

# Démarrage en développement
npm run dev

# Build pour production
npm run build
```

### Backend

```bash
# Aller dans le dossier backend
cd backend

# Installation des dépendances
npm install

# Démarrage local (optionnel)
npm run dev

# Déploiement Netlify
# 1. Zipper le dossier backend/
# 2. Déployer sur Netlify
# 3. L'API sera disponible sur votre URL Netlify
```

## 🔑 Comptes de Test

### Emprunteur

- **Email**: john@example.com
- **Mot de passe**: password123
- **Rôle**: Emprunteur (demande de financement)

### Financeur

- **Email**: sarah@example.com
- **Mot de passe**: password123
- **Rôle**: Financeur (offre de financement)

## 🌐 URLs de Déploiement

### Frontend

- **Builder.io**: https://290bc7b7169d4258a1d984c8f32b8067.builder.codes
- **Production**: [À définir]

### Backend

- **Netlify**: https://coruscating-griffin-58551d.netlify.app
- **Documentation API**: https://coruscating-griffin-58551d.netlify.app/

## 📱 Utilisation

1. **Inscription/Connexion**

   - Créez un compte ou utilisez les comptes de test
   - Choisissez votre rôle (emprunteur/financeur)

2. **Dashboard**

   - Consultez votre wallet et vos swaps
   - Créez de nouveaux swaps
   - Gérez vos transactions

3. **Matching**
   - Trouvez des contreparties compatibles
   - Négociez et finalisez vos swaps

## 🛠️ Technologies Utilisées

### Frontend

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Shadcn/ui** (composants)
- **Framer Motion** (animations)
- **React Router** (navigation)
- **React Query** (state management)

### Backend

- **Node.js** + **Express**
- **Netlify Functions** (serverless)
- **JWT** (authentification)
- **Joi** (validation)
- **bcryptjs** (hashage)
- **JSON file storage** (base de données simple)

## 📁 Structure du Projet

```
swapeo-project/
├── src/                        # Frontend React
│   ├── components/            # Composants UI
│   │   ├── ui/               # Composants Shadcn
│   │   ├── Navigation.tsx    # Navigation principale
│   │   ├── HeroSection.tsx   # Section hero
│   │   ├── DynamicBackground.tsx # Background animé
│   │   └── ...
│   ├── pages/                # Pages de l'application
│   │   ├── Index.tsx         # Landing page
│   │   ├── Dashboard.tsx     # Dashboard principal
│   │   ├── Login.tsx         # Page de connexion
│   │   └── Register.tsx      # Page d'inscription
│   ├── lib/                  # Utilitaires
│   │   ├── api.ts           # Configuration API
│   │   └── utils.ts         # Utilitaires généraux
│   └── hooks/               # Custom hooks
├── backend/                  # Backend Express
│   ├── data/                # Stockage des données
│   ├── middleware/          # Middleware Express
│   ├── routes/              # Routes API
│   ├── utils/               # Utilitaires backend
│   ├── netlify/functions/   # Fonctions Netlify
│   └── package.json         # Dépendances backend
├── public/                  # Assets statiques
└── package.json            # Dépendances frontend
```

## 🔧 Configuration

### Variables d'Environnement

#### Frontend (.env)

```env
VITE_API_URL=https://votre-backend.netlify.app
NODE_ENV=development
```

#### Backend (.env)

```env
JWT_SECRET=swapeo-secret-key-2024
NODE_ENV=production
FRONTEND_URL=https://votre-frontend.vercel.app
```

## 🧪 Tests

```bash
# Tests frontend
npm run test

# Vérification des types
npm run typecheck

# Formatage du code
npm run format.fix
```

## 📚 Documentation API

Une fois le backend déployé, la documentation complète est disponible à :
`https://votre-backend.netlify.app/`

### Endpoints Principaux

- **POST** `/api/auth/login` - Connexion
- **POST** `/api/auth/register` - Inscription
- **GET** `/api/users/profile` - Profil utilisateur
- **GET** `/api/swaps` - Liste des swaps
- **POST** `/api/swaps` - Créer un swap
- **GET** `/api/wallet` - Informations wallet
- **POST** `/api/wallet/deposit` - Déposer des fonds

## 🚀 Déploiement

### Frontend

- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop du dossier `dist/`
- **Builder.io**: Déjà configuré

### Backend

1. Zipper le dossier `backend/`
2. Déployer sur Netlify
3. Configurer les variables d'environnement
4. Tester l'API

## 🐛 Débogage

### Problèmes courants

1. **CORS Error**

   - Vérifier la configuration CORS dans `backend/netlify/functions/api.js`
   - S'assurer que l'URL frontend est autorisée

2. **Token invalide**

   - Vérifier que `VITE_API_URL` pointe vers le bon backend
   - Réessayer la connexion

3. **Build error**
   - Vérifier les dépendances avec `npm install`
   - Résoudre les erreurs TypeScript

## 📞 Support

Pour toute question ou problème :

- Vérifiez la documentation API
- Consultez les logs de déploiement
- Testez avec les comptes de test

## 🔄 Mise à jour

Pour mettre à jour le projet :

1. Pull les dernières modifications
2. `npm install` pour les nouvelles dépendances
3. Redéployer frontend et backend si nécessaire

---

**Swapeo** - Révolutionnez votre gestion de trésorerie ! 🚀
