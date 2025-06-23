const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

// Initialize environment
dotenv.config();

const app = express();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "swapeo-secret-key-2024";

// In-memory storage (simple pour Netlify Functions)
let users = [];
let swaps = [];
let movements = [];

// Initialize with test data
function initializeData() {
  if (users.length === 0) {
    const hashedPassword = bcrypt.hashSync("password123", 12);

    users.push({
      id: uuidv4(),
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
      createdAt: new Date().toISOString(),
    });

    users.push({
      id: uuidv4(),
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
      createdAt: new Date().toISOString(),
    });
  }
}

// Middleware d'authentification
function authMiddleware(req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide" });
  }
}

// Error handler
function errorHandler(error, req, res, next) {
  console.error("Error:", error);
  res.status(500).json({
    error: "Erreur serveur interne",
  });
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

// Initialize data
initializeData();

// Validation schemas
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

// Routes Auth
app.post("/api/auth/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, firstName, lastName, role, company } = value;

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const user = {
      id: uuidv4(),
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
      createdAt: new Date().toISOString(),
    };

    users.push(user);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

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

app.post("/api/auth/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company,
        kycStatus: user.kycStatus,
        trustScore: user.trustScore,
        wallet: user.wallet,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// Routes Users
app.get("/api/users/profile", authMiddleware, (req, res) => {
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

// Routes Wallet
app.get("/api/wallet", authMiddleware, (req, res) => {
  res.json({
    wallet: req.user.wallet,
  });
});

app.post("/api/wallet/deposit", authMiddleware, (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const user = users.find((u) => u.id === req.user.id);
    user.wallet.balance += amount;
    user.wallet.totalDeposited += amount;

    movements.push({
      id: uuidv4(),
      userId: req.user.id,
      type: "deposit",
      amount,
      description: "Dépôt de fonds",
      createdAt: new Date().toISOString(),
    });

    res.json({
      message: "Dépôt effectué avec succès",
      newBalance: user.wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur dépôt" });
  }
});

// Routes Swaps
app.get("/api/swaps", authMiddleware, (req, res) => {
  try {
    const userRole = req.user.role;

    const filteredSwaps = swaps.filter((swap) => {
      if (userRole === "emprunteur") {
        return swap.type === "offre";
      } else {
        return swap.type === "demande";
      }
    });

    res.json({ swaps: filteredSwaps });
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération swaps" });
  }
});

app.post("/api/swaps", authMiddleware, (req, res) => {
  try {
    const { type, amount, duration, description } = req.body;

    const swap = {
      id: uuidv4(),
      userId: req.user.id,
      type,
      amount,
      duration,
      description,
      interestRate: 0.05,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    swaps.push(swap);

    res.status(201).json({
      message: "Swap créé avec succès",
      swap,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur création swap" });
  }
});

// Routes Matching
app.get("/api/matching/compatible", authMiddleware, (req, res) => {
  try {
    const { amount, duration, type } = req.query;

    const compatible = swaps.filter((swap) => {
      const amountMatch = Math.abs(swap.amount - amount) / amount <= 0.2;
      const durationMatch = Math.abs(swap.duration - duration) <= 2;
      const typeMatch = swap.type !== type;

      return (
        amountMatch && durationMatch && typeMatch && swap.status === "active"
      );
    });

    res.json({ compatible });
  } catch (error) {
    res.status(500).json({ error: "Erreur recherche compatibilité" });
  }
});

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
module.exports.handler = serverless(app);
