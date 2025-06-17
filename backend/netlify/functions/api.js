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
