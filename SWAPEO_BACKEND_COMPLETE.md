# 🚀 BACKEND SWAPEO COMPLET - PRÊT POUR NETLIFY

## 📋 INSTRUCTIONS RAPIDES

1. **Créez un dossier** `swapeo-backend/` sur votre ordinateur
2. **Copiez-collez** chaque fichier ci-dessous exactement comme indiqué
3. **Zippez** le dossier complet
4. **Déployez** sur Netlify

---

## 📁 STRUCTURE COMPLÈTE

```
swapeo-backend/
├── package.json
├── netlify.toml
├── netlify/
│   └── functions/
│       └── api.js
├── data/
│   └── storage.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── swaps.js
│   ├── wallet.js
│   ├── matching.js
│   ├── admin.js
│   └── upload.js
├── utils/
│   └── calculator.js
├── init.js
├── server.js (pour dev local)
└── README.md
```

---

## 📄 FICHIERS À CRÉER

### 1. `package.json`

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

### 2. `netlify.toml`

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

### 3. `netlify/functions/api.js`

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
    contentSecurityPolicy: false,
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
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

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Bienvenue sur l'API Swapeo !",
    version: "1.0.0",
    platform: "Netlify Functions",
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
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl,
  });
});

// Export as serverless function
export const handler = serverless(app);
```

### 4. `data/storage.js`

```javascript
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = "./data";
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SWAPS_FILE = path.join(DATA_DIR, "swaps.json");
const MOVEMENTS_FILE = path.join(DATA_DIR, "movements.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

async function readFile(filename) {
  try {
    const data = await fs.readFile(filename, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeFile(filename, data) {
  await ensureDataDir();
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

// Users operations
export async function getUsers() {
  return await readFile(USERS_FILE);
}

export async function saveUsers(users) {
  await writeFile(USERS_FILE, users);
}

export async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find((user) => user.email === email);
}

export async function findUserById(id) {
  const users = await getUsers();
  return users.find((user) => user.id === id);
}

export async function createUser(userData) {
  const users = await getUsers();
  const newUser = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...userData,
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function updateUser(id, updates) {
  const users = await getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await saveUsers(users);
    return users[index];
  }
  return null;
}

// Swaps operations
export async function getSwaps() {
  return await readFile(SWAPS_FILE);
}

export async function saveSwaps(swaps) {
  await writeFile(SWAPS_FILE, swaps);
}

export async function createSwap(swapData) {
  const swaps = await getSwaps();
  const newSwap = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: "active",
    ...swapData,
  };
  swaps.push(newSwap);
  await saveSwaps(swaps);
  return newSwap;
}

export async function findSwapById(id) {
  const swaps = await getSwaps();
  return swaps.find((swap) => swap.id === id);
}

export async function updateSwap(id, updates) {
  const swaps = await getSwaps();
  const index = swaps.findIndex((swap) => swap.id === id);
  if (index !== -1) {
    swaps[index] = {
      ...swaps[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await saveSwaps(swaps);
    return swaps[index];
  }
  return null;
}

// Movements operations
export async function getMovements() {
  return await readFile(MOVEMENTS_FILE);
}

export async function saveMovements(movements) {
  await writeFile(MOVEMENTS_FILE, movements);
}

export async function createMovement(movementData) {
  const movements = await getMovements();
  const newMovement = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...movementData,
  };
  movements.push(newMovement);
  await saveMovements(movements);
  return newMovement;
}

export async function getUserMovements(userId) {
  const movements = await getMovements();
  return movements.filter((movement) => movement.userId === userId);
}
```

### 5. `middleware/auth.js`

```javascript
import jwt from "jsonwebtoken";
import { findUserById } from "../data/storage.js";

const JWT_SECRET = process.env.JWT_SECRET || "swapeo-secret-key-2024";

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export async function authMiddleware(req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide" });
  }
}
```

### 6. `middleware/errorHandler.js`

```javascript
export function errorHandler(error, req, res, next) {
  console.error("Error:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Données invalides",
      details: error.details,
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token invalide",
    });
  }

  res.status(500).json({
    error: "Erreur serveur interne",
  });
}
```

### 7. `routes/auth.js`

```javascript
import express from "express";
import bcrypt from "bcryptjs";
import Joi from "joi";
import { createUser, findUserByEmail } from "../data/storage.js";
import { generateToken } from "../middleware/auth.js";

const router = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid("emprunteur", "financeur").required(),
  company: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, firstName, lastName, role, company } = value;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      company: company || "",
      kycStatus: "pending",
      trustScore: 0,
      wallet: {
        balance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: "Inscription réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = generateToken(user.id);

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

export default router;
```

### 8. `routes/users.js`

```javascript
import express from "express";
import { updateUser } from "../data/storage.js";

const router = express.Router();

// Get profile
router.get("/profile", (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      company: req.user.company,
      kycStatus: req.user.kycStatus,
      trustScore: req.user.trustScore,
      wallet: req.user.wallet,
    },
  });
});

// Update profile
router.put("/profile", async (req, res) => {
  try {
    const { firstName, lastName, company } = req.body;

    const updatedUser = await updateUser(req.user.id, {
      firstName,
      lastName,
      company,
    });

    res.json({
      message: "Profil mis à jour",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur mise à jour profil" });
  }
});

export default router;
```

### 9. `routes/swaps.js`

```javascript
import express from "express";
import { getSwaps, createSwap, findSwapById } from "../data/storage.js";

const router = express.Router();

// Get all swaps
router.get("/", async (req, res) => {
  try {
    const swaps = await getSwaps();
    const userRole = req.user.role;

    // Filter swaps based on user role
    const filteredSwaps = swaps.filter((swap) => {
      if (userRole === "emprunteur") {
        return swap.type === "offre"; // Emprunteurs voient les offres
      } else {
        return swap.type === "demande"; // Financeurs voient les demandes
      }
    });

    res.json({ swaps: filteredSwaps });
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération swaps" });
  }
});

// Create swap
router.post("/", async (req, res) => {
  try {
    const { type, amount, duration, description } = req.body;

    const swap = await createSwap({
      userId: req.user.id,
      type,
      amount,
      duration,
      description,
      interestRate: 0.05, // 5%
    });

    res.status(201).json({
      message: "Swap créé avec succès",
      swap,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur création swap" });
  }
});

// Get swap details
router.get("/:id", async (req, res) => {
  try {
    const swap = await findSwapById(req.params.id);
    if (!swap) {
      return res.status(404).json({ error: "Swap non trouvé" });
    }
    res.json({ swap });
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération swap" });
  }
});

export default router;
```

### 10. `routes/wallet.js`

```javascript
import express from "express";
import {
  updateUser,
  createMovement,
  getUserMovements,
} from "../data/storage.js";

const router = express.Router();

// Get wallet info
router.get("/", (req, res) => {
  res.json({
    wallet: req.user.wallet,
  });
});

// Deposit
router.post("/deposit", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const newBalance = req.user.wallet.balance + amount;
    const newTotalDeposited = req.user.wallet.totalDeposited + amount;

    await updateUser(req.user.id, {
      wallet: {
        ...req.user.wallet,
        balance: newBalance,
        totalDeposited: newTotalDeposited,
      },
    });

    await createMovement({
      userId: req.user.id,
      type: "deposit",
      amount,
      description: "Dépôt de fonds",
    });

    res.json({
      message: "Dépôt effectué avec succès",
      newBalance,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur dépôt" });
  }
});

// Withdraw
router.post("/withdraw", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    if (amount > req.user.wallet.balance) {
      return res.status(400).json({ error: "Solde insuffisant" });
    }

    const newBalance = req.user.wallet.balance - amount;
    const newTotalWithdrawn = req.user.wallet.totalWithdrawn + amount;

    await updateUser(req.user.id, {
      wallet: {
        ...req.user.wallet,
        balance: newBalance,
        totalWithdrawn: newTotalWithdrawn,
      },
    });

    await createMovement({
      userId: req.user.id,
      type: "withdraw",
      amount,
      description: "Retrait de fonds",
    });

    res.json({
      message: "Retrait effectué avec succès",
      newBalance,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur retrait" });
  }
});

// Get movements history
router.get("/movements", async (req, res) => {
  try {
    const movements = await getUserMovements(req.user.id);
    res.json({ movements });
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération mouvements" });
  }
});

export default router;
```

### 11. `routes/matching.js`

```javascript
import express from "express";
import { getSwaps } from "../data/storage.js";

const router = express.Router();

// Get compatible swaps
router.get("/compatible", async (req, res) => {
  try {
    const { amount, duration, type } = req.query;
    const swaps = await getSwaps();

    // Find compatible swaps
    const compatible = swaps.filter((swap) => {
      const amountMatch = Math.abs(swap.amount - amount) / amount <= 0.2; // 20% tolerance
      const durationMatch = Math.abs(swap.duration - duration) <= 2; // 2 months tolerance
      const typeMatch = swap.type !== type; // Opposite types

      return (
        amountMatch && durationMatch && typeMatch && swap.status === "active"
      );
    });

    res.json({ compatible });
  } catch (error) {
    res.status(500).json({ error: "Erreur recherche compatibilité" });
  }
});

// Get AI suggestions
router.get("/suggestions", async (req, res) => {
  try {
    const swaps = await getSwaps();
    const userRole = req.user.role;

    // Simple AI-like suggestions based on user profile
    const suggestions = swaps
      .filter((swap) => {
        if (userRole === "emprunteur") {
          return swap.type === "offre" && swap.amount >= 10000;
        } else {
          return swap.type === "demande" && swap.duration <= 12;
        }
      })
      .slice(0, 5);

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: "Erreur suggestions" });
  }
});

export default router;
```

### 12. `routes/admin.js`

```javascript
import express from "express";
import { getUsers, getSwaps, getMovements } from "../data/storage.js";

const router = express.Router();

// Admin dashboard stats
router.get("/dashboard", async (req, res) => {
  try {
    const users = await getUsers();
    const swaps = await getSwaps();
    const movements = await getMovements();

    const stats = {
      totalUsers: users.length,
      totalSwaps: swaps.length,
      activeSwaps: swaps.filter((s) => s.status === "active").length,
      totalVolume: movements.reduce((sum, m) => sum + m.amount, 0),
      averageSwapAmount:
        swaps.length > 0
          ? swaps.reduce((sum, s) => sum + s.amount, 0) / swaps.length
          : 0,
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: "Erreur stats admin" });
  }
});

export default router;
```

### 13. `routes/upload.js`

```javascript
import express from "express";

const router = express.Router();

// Mock upload for KYC documents
router.post("/kyc", (req, res) => {
  res.json({
    message: "Document uploadé avec succès",
    fileId: "mock-file-id-" + Date.now(),
  });
});

export default router;
```

### 14. `utils/calculator.js`

```javascript
// Calculate interest
export function calculateInterest(amount, rate, duration) {
  return (amount * rate * duration) / 12;
}

// Calculate Swapeo fees (1%)
export function calculateSwapeoFees(amount) {
  return amount * 0.01;
}

// Calculate trust score
export function calculateTrustScore(user) {
  let score = 0;

  if (user.kycStatus === "verified") score += 30;
  if (user.wallet.totalDeposited > 50000) score += 20;
  if (user.wallet.balance > 10000) score += 15;

  return Math.min(score, 100);
}

export default {
  calculateInterest,
  calculateSwapeoFees,
  calculateTrustScore,
};
```

### 15. `init.js`

```javascript
import { getUsers, createUser } from "./data/storage.js";
import bcrypt from "bcryptjs";

export default async function initializeBackend() {
  try {
    const users = await getUsers();

    if (users.length === 0) {
      console.log("🔧 Initialisation des comptes de test...");

      const hashedPassword = await bcrypt.hash("password123", 12);

      // Compte emprunteur
      await createUser({
        email: "john@example.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        role: "emprunteur",
        company: "Tech Startup",
        kycStatus: "verified",
        trustScore: 85,
        wallet: {
          balance: 25000,
          totalDeposited: 50000,
          totalWithdrawn: 25000,
        },
      });

      // Compte financeur
      await createUser({
        email: "sarah@example.com",
        password: hashedPassword,
        firstName: "Sarah",
        lastName: "Martin",
        role: "financeur",
        company: "Investment Group",
        kycStatus: "verified",
        trustScore: 92,
        wallet: {
          balance: 100000,
          totalDeposited: 100000,
          totalWithdrawn: 0,
        },
      });

      console.log("✅ Comptes de test créés");
    }
  } catch (error) {
    console.error("❌ Erreur initialisation:", error);
  }
}
```

### 16. `server.js` (pour dev local uniquement)

```javascript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import swapRoutes from "./routes/swaps.js";
import walletRoutes from "./routes/wallet.js";
import matchingRoutes from "./routes/matching.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { authMiddleware } from "./middleware/auth.js";

// Import initialization
import initializeBackend from "./init.js";

// Initialize environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use(limiter);

// Logging
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

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
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Bienvenue sur l'API Swapeo !",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await initializeBackend();
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur démarrage serveur:", error);
    process.exit(1);
  }
}

startServer();

export default app;
```

### 17. `README.md`

````markdown
# 🚀 Swapeo Backend API

API backend complète pour la plateforme de swap de trésorerie Swapeo.

## 🚀 Déploiement Netlify

1. Zippez tout le dossier backend
2. Déployez sur Netlify (drag & drop)
3. L'API sera disponible sur votre URL Netlify

## 🧪 Test de l'API

```bash
# Health check
GET https://votre-url.netlify.app/health

# Connexion
POST https://votre-url.netlify.app/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```
````

## 📱 Comptes de test

- **john@example.com** / password123 (emprunteur)
- **sarah@example.com** / password123 (financeur)

## 🔗 Connexion Frontend

Variable d'environnement Builder.io :

```
VITE_API_URL=https://votre-url.netlify.app
```

```

---

## 🎯 INSTRUCTIONS FINALES

1. **Copiez** tout le contenu ci-dessus dans les fichiers correspondants
2. **Créez** la structure de dossiers exactement comme indiqué
3. **Zippez** le dossier `swapeo-backend/` complet
4. **Déployez** sur Netlify
5. **Testez** avec `https://coruscating-griffin-58551d.netlify.app/health`

**C'est tout ! Votre backend sera fonctionnel ! 🚀**
```
