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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use(limiter);

// Logging
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use("/uploads", express.static("uploads"));

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
    environment: process.env.NODE_ENV || "development",
  });
});

// Welcome route with documentation
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Bienvenue sur l'API Swapeo !",
    version: "1.0.0",
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

// Initialize and start server
async function startServer() {
  try {
    // Initialize backend data
    await initializeBackend();

    // Start server
    app.listen(PORT, () => {
      console.log("\n" + "=".repeat(60));
      console.log("🚀 SERVEUR SWAPEO DÉMARRÉ AVEC SUCCÈS !");
      console.log("=".repeat(60));
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📖 Documentation: http://localhost:${PORT}/`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || "development"}`);
      console.log("=".repeat(60));
      console.log("\n🔗 PRÊT À RECEVOIR LES CONNEXIONS FRONTEND !");
      console.log(
        `🎯 CORS configuré pour: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
      );
      console.log("\n💡 Conseil: Utilisez les comptes de test pour commencer");
      console.log("📧 john@example.com / password123 (emprunteur)");
      console.log("📧 sarah@example.com / password123 (financeur)");
      console.log("\n");
    });
  } catch (error) {
    console.error("❌ Erreur démarrage serveur:", error);
    process.exit(1);
  }
}

startServer();

export default app;
