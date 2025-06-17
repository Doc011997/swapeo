# 📦 BACKEND SWAPEO COMPLET - À TÉLÉCHARGER ET ZIPPER

## 🎯 Instructions

1. **Créez un dossier** `swapeo-backend/` sur votre ordinateur
2. **Copiez-collez** chaque fichier ci-dessous dans la bonne structure
3. **Zippez** le dossier complet
4. **Redéployez** sur Netlify

---

## 📁 Structure à créer :

```
swapeo-backend/
├── data/
│   └── storage.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── netlify/
│   └── functions/
│       └── api.js          ← NOUVEAU
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── matching.js
│   ├── swaps.js
│   ├── upload.js
│   ├── users.js
│   └── wallet.js
├── utils/
│   └── calculator.js
├── .env.example
├── DEPLOY_NETLIFY.md       ← NOUVEAU
├── deploy.md
├── init.js
├── netlify.toml           ← NOUVEAU
├── package.json           ← MODIFIÉ
├── README.md
└── server.js
```

---

## 🆕 NOUVEAUX FICHIERS ET MODIFICATIONS

### 📄 `netlify.toml`

```toml
[build]
  command = "npm install"
  functions = "netlify/functions"
  publish = "."

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/api"
  status = 200

[dev]
  command = "npm run dev"
  port = 3001
```

### 📄 `netlify/functions/api.js`

```javascript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import serverless from "serverless-http";

// Import routes
import authRoutes from "../../routes/auth.js";
import userRoutes from "../../routes/users.js";
import swapRoutes from "../../routes/swaps.js";
import walletRoutes from "../../routes/wallet.js";
import matchingRoutes from "../../routes/matching.js";
import adminRoutes from "../../routes/admin.js";
import uploadRoutes from "../../routes/upload.js";

// Import middleware
import { errorHandler } from "../../middleware/errorHandler.js";
import { authMiddleware } from "../../middleware/auth.js";

// Import initialization
import initializeBackend from "../../init.js";

// Initialize environment
dotenv.config();

const app = express();

// Initialize backend data only once
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    try {
      await initializeBackend();
      isInitialized = true;
      console.log("✅ Backend initialized");
    } catch (error) {
      console.error("❌ Backend initialization failed:", error);
    }
  }
}

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Required for Netlify functions
  }),
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://builder.codes",
      /https:\/\/.*\.builder\.codes$/,
      /https:\/\/.*\.netlify\.app$/,
    ],
    credentials: true,
  }),
);

// Rate limiting (reduced for serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increased for serverless
  message: "Trop de requêtes, veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Initialize data on each cold start
app.use(async (req, res, next) => {
  await ensureInitialized();
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/swaps", authMiddleware, swapRoutes);
app.use("/api/wallet", authMiddleware, walletRoutes);
app.use("/api/matching", authMiddleware, matchingRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/upload", authMiddleware, uploadRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
    platform: "Netlify Functions",
  });
});

// Welcome route with documentation
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Bienvenue sur l'API Swapeo !",
    version: "1.0.0",
    platform: "Netlify Functions",
    documentation: {
      description: "API backend complète pour la plateforme Swapeo",
      features: [
        "Authentification JWT",
        "Gestion utilisateurs et KYC",
        "Système de swaps complet",
        "Wallet interne avec mouvements",
        "Algorithme de matching intelligent",
        "Panel administrateur",
        "Upload de documents",
        "Notifications en temps réel",
        "Moteur de calcul des intérêts",
      ],
      testAccounts: [
        {
          email: "john@example.com",
          password: "password123",
          role: "emprunteur",
        },
        {
          email: "sarah@example.com",
          password: "password123",
          role: "financeur",
        },
      ],
    },
    endpoints: {
      auth: {
        base: "/api/auth",
        routes: [
          "POST /register - Inscription",
          "POST /login - Connexion",
          "GET /me - Profil actuel",
        ],
      },
      users: {
        base: "/api/users",
        routes: [
          "GET /profile - Profil utilisateur",
          "PUT /profile - Mise à jour profil",
          "POST /kyc/update - Mise à jour KYC",
        ],
      },
      swaps: {
        base: "/api/swaps",
        routes: [
          "GET / - Liste des swaps",
          "POST / - Créer un swap",
          "GET /:id - Détails swap",
          "POST /:id/apply - Candidater",
        ],
      },
      wallet: {
        base: "/api/wallet",
        routes: [
          "GET / - Informations wallet",
          "POST /deposit - Déposer",
          "POST /withdraw - Retirer",
          "GET /movements - Historique",
        ],
      },
      matching: {
        base: "/api/matching",
        routes: [
          "GET /compatible - Swaps compatibles",
          "GET /suggestions - Suggestions IA",
          "POST /auto-match - Matching auto",
        ],
      },
      upload: {
        base: "/api/upload",
        routes: [
          "POST /kyc - Upload documents KYC",
          "GET /kyc - Documents utilisateur",
          "POST /profile-picture - Photo profil",
        ],
      },
      admin: {
        base: "/api/admin",
        routes: [
          "GET /dashboard - Stats admin",
          "GET /users - Gestion utilisateurs",
          "GET /analytics - Analytics plateforme",
        ],
      },
    },
    examples: {
      login: {
        method: "POST",
        url: "/api/auth/login",
        body: {
          email: "john@example.com",
          password: "password123",
        },
      },
      createSwap: {
        method: "POST",
        url: "/api/swaps",
        headers: { Authorization: "Bearer your-jwt-token" },
        body: {
          type: "demande",
          amount: 50000,
          duration: 6,
          description: "Besoin de trésorerie pour développer mon activité",
        },
      },
      getMatchings: {
        method: "GET",
        url: "/api/matching/compatible?amount=50000&duration=6&type=demande",
        headers: { Authorization: "Bearer your-jwt-token" },
      },
    },
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl,
    availableRoutes: [
      "/health",
      "/",
      "/api/auth/*",
      "/api/users/*",
      "/api/swaps/*",
      "/api/wallet/*",
      "/api/matching/*",
      "/api/admin/*",
      "/api/upload/*",
    ],
  });
});

// Export as serverless function
export const handler = serverless(app);
```

### 📄 `package.json` (MODIFIÉ - ajout de serverless-http)

```json
{
  "name": "swapeo-backend",
  "version": "1.0.0",
  "description": "Backend API pour la plateforme Swapeo",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0",
    "dotenv": "^16.3.1",
    "morgan": "^1.10.0",
    "serverless-http": "^3.2.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8"
  },
  "keywords": ["swapeo", "fintech", "api", "swap", "tresorerie"],
  "author": "Swapeo Team",
  "license": "MIT"
}
```

### 📄 `DEPLOY_NETLIFY.md`

````markdown
# 🚀 Guide de Déploiement Netlify - Backend Swapeo

## ✅ Configuration Actuelle

Le backend est maintenant configuré pour fonctionner avec Netlify Functions :

- **Structure serverless** : `netlify/functions/api.js`
- **Configuration** : `netlify.toml`
- **Dépendance** : `serverless-http` ajoutée

## 🔧 Étapes de Redéploiement

### 1. Dans l'interface Netlify

1. Allez sur votre projet : `coruscating-griffin-58551d.netlify.app`
2. Cliquez sur **"Deploys"**
3. Cliquez sur **"Trigger deploy"** > **"Clear cache and deploy site"**

### 2. Ou via drag & drop

1. Zippez le dossier `backend/` complet
2. Déposez le zip sur Netlify
3. Attendez le déploiement

## 🧪 Test de l'API

Une fois déployé, testez ces URLs :

```bash
# Page d'accueil avec documentation
https://coruscating-griffin-58551d.netlify.app/

# Health check
https://coruscating-griffin-58551d.netlify.app/health

# Test de connexion
curl -X POST https://coruscating-griffin-58551d.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```
````

## 🔍 Debug si Problème

### Vérifier les logs de déploiement :

1. Netlify Dashboard > Deploys > Cliquez sur le deploy
2. Regardez les logs de build

### Erreurs communes :

- **"Module not found"** : Vérifiez que `serverless-http` est dans package.json
- **"Function timeout"** : Augmentez le timeout dans netlify.toml
- **"CORS errors"** : Vérifiez la configuration CORS dans api.js

## 🎯 Après le Déploiement

1. **Testez l'API** avec les URLs ci-dessus
2. **Connectez le frontend** en mettant à jour la variable d'environnement Builder.io :
   ```
   VITE_API_URL=https://coruscating-griffin-58551d.netlify.app
   ```

## 📱 Comptes de Test

- **john@example.com** / password123 (emprunteur)
- **sarah@example.com** / password123 (financeur)

## 🔗 URLs Importantes

- **Site principal** : https://coruscating-griffin-58551d.netlify.app
- **Documentation API** : https://coruscating-griffin-58551d.netlify.app/
- **Health check** : https://coruscating-griffin-58551d.netlify.app/health
- **Dashboard Netlify** : https://app.netlify.com/projects/coruscating-griffin-58551d

```

---

## 🎯 POUR LES AUTRES FICHIERS

**Tous les autres fichiers** (data/, middleware/, routes/, utils/, etc.) restent **IDENTIQUES** à ceux que nous avions créés précédemment.

**Il vous faut seulement :**
1. ✅ Ajouter les 3 nouveaux fichiers ci-dessus
2. ✅ Modifier le package.json pour ajouter `serverless-http`
3. ✅ Zipper le tout et redéployer sur Netlify

## 🚀 Étapes Finales

1. **Téléchargez/copiez** tous vos fichiers backend existants
2. **Ajoutez** les nouveaux fichiers ci-dessus
3. **Modifiez** le package.json
4. **Zippez** le dossier complet
5. **Redéployez** sur Netlify

Vous voulez que je vous donne aussi le contenu des autres fichiers backend pour être sûr d'avoir tout ?
```
