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

// In-memory storage (production would use a real database)
let users = [];
let swaps = [];
let transactions = [];
let notifications = [];
let contacts = [];
let analytics = {};

// Initialize with rich demo data
function initializeData() {
  if (users.length === 0) {
    const hashedPassword = bcrypt.hashSync("password123", 12);

    // Demo users with complete profiles
    users.push({
      id: "user-john-123",
      email: "john@example.com",
      password: hashedPassword,
      firstName: "John",
      lastName: "Dupont",
      role: "emprunteur",
      company: "TechStart Innovation",
      kycStatus: "verified",
      trustScore: 85,
      phone: "+33 6 12 34 56 78",
      address: "Paris, France",
      avatar: null,
      settings: {
        notifications: true,
        emailAlerts: true,
        smsAlerts: false,
        darkMode: false,
      },
      wallet: {
        balance: 42847,
        totalDeposited: 50000,
        totalWithdrawn: 7153,
        pendingDeposits: 0,
        pendingWithdrawals: 0,
        frozenAmount: 0,
      },
      statistics: {
        totalSwaps: 12,
        activeSwaps: 3,
        completedSwaps: 8,
        totalBorrowed: 125000,
        totalLent: 45000,
        averageRate: 3.2,
        totalEarnings: 2840,
        successRate: 94.5,
        averageResponseTime: "2.3 jours",
      },
      createdAt: new Date("2023-06-15").toISOString(),
      lastActive: new Date().toISOString(),
    });

    users.push({
      id: "user-sarah-456",
      email: "sarah@example.com",
      password: hashedPassword,
      firstName: "Sarah",
      lastName: "Martin",
      role: "financeur",
      company: "Investment Pro",
      kycStatus: "verified",
      trustScore: 92,
      phone: "+33 6 98 76 54 32",
      address: "Lyon, France",
      avatar: null,
      settings: {
        notifications: true,
        emailAlerts: true,
        smsAlerts: true,
        darkMode: true,
      },
      wallet: {
        balance: 128450,
        totalDeposited: 150000,
        totalWithdrawn: 21550,
        pendingDeposits: 0,
        pendingWithdrawals: 0,
        frozenAmount: 5000,
      },
      statistics: {
        totalSwaps: 18,
        activeSwaps: 5,
        completedSwaps: 12,
        totalBorrowed: 25000,
        totalLent: 185000,
        averageRate: 3.8,
        totalEarnings: 4520,
        successRate: 96.2,
        averageResponseTime: "1.8 jours",
      },
      createdAt: new Date("2023-03-20").toISOString(),
      lastActive: new Date().toISOString(),
    });

    // Initialize demo swaps
    initializeSwaps();
    initializeTransactions();
    initializeNotifications();
    initializeContacts();
    initializeAnalytics();
  }
}

function initializeSwaps() {
  const demoSwaps = [
    {
      id: "swap-001",
      requesterId: "user-john-123",
      providerId: "user-sarah-456",
      type: "demande",
      amount: 15000,
      duration: 6,
      interestRate: 3.2,
      category: "Tech",
      riskLevel: "low",
      status: "Actif",
      progress: 75,
      title: "Développement MVP SaaS",
      description:
        "Financement pour le développement d'une plateforme SaaS de gestion de projet",
      purpose: "Développement produit",
      guarantees: "Caution personnelle, contrat de développement",
      documents: ["business-plan.pdf", "projections-financieres.xlsx"],
      repaymentSchedule: "monthly",
      earlyRepayment: true,
      insurance: true,
      matchingScore: 96,
      daysRemaining: 45,
      nextPaymentDate: "2024-02-15",
      nextPaymentAmount: 2650,
      totalRepaid: 11250,
      totalInterest: 720,
      createdAt: "2024-01-15T10:30:00Z",
      startedAt: "2024-01-18T14:20:00Z",
      updatedAt: new Date().toISOString(),
      verified: true,
      priority: "high",
      tags: ["startup", "tech", "saas"],
      communication: {
        lastMessage: "2024-02-01T09:15:00Z",
        unreadMessages: 2,
        allowMessages: true,
        allowCalls: true,
      },
      milestones: [
        {
          name: "Validation business plan",
          completed: true,
          date: "2024-01-18",
        },
        { name: "Premier versement", completed: true, date: "2024-01-20" },
        { name: "MVP version 1", completed: true, date: "2024-01-28" },
        { name: "Tests utilisateurs", completed: false, date: "2024-02-10" },
        { name: "Lancement beta", completed: false, date: "2024-02-25" },
      ],
    },
    {
      id: "swap-002",
      requesterId: "user-john-123",
      providerId: "user-sarah-456",
      type: "offre",
      amount: 8000,
      duration: 4,
      interestRate: 2.8,
      category: "E-commerce",
      riskLevel: "low",
      status: "Terminé",
      progress: 100,
      title: "Stock produits été",
      description: "Financement du stock pour la saison estivale",
      purpose: "Achat stock",
      guarantees: "Stock en garantie",
      documents: ["factures-fournisseurs.pdf"],
      repaymentSchedule: "monthly",
      earlyRepayment: false,
      insurance: true,
      matchingScore: 94,
      daysRemaining: 0,
      nextPaymentDate: null,
      nextPaymentAmount: 0,
      totalRepaid: 8224,
      totalInterest: 224,
      createdAt: "2023-12-10T08:45:00Z",
      startedAt: "2023-12-12T11:30:00Z",
      completedAt: "2024-01-15T16:20:00Z",
      updatedAt: "2024-01-15T16:20:00Z",
      verified: true,
      priority: "medium",
      tags: ["ecommerce", "saisonnier"],
      communication: {
        lastMessage: "2024-01-15T16:20:00Z",
        unreadMessages: 0,
        allowMessages: true,
        allowCalls: false,
      },
      rating: {
        borrowerRating: 5,
        lenderRating: 5,
        borrowerComment: "Excellent partenaire, très professionnel",
        lenderComment: "Remboursement dans les temps, communication parfaite",
      },
    },
    {
      id: "swap-003",
      requesterId: "user-sarah-456",
      providerId: null,
      type: "demande",
      amount: 25000,
      duration: 8,
      interestRate: 4.1,
      category: "Restauration",
      riskLevel: "medium",
      status: "En recherche",
      progress: 15,
      title: "Extension restaurant",
      description: "Agrandissement de la salle et achat d'équipements",
      purpose: "Expansion",
      guarantees: "Hypothèque sur le local",
      documents: ["permis-construire.pdf", "devis-travaux.pdf"],
      repaymentSchedule: "monthly",
      earlyRepayment: true,
      insurance: true,
      matchingScore: 89,
      daysRemaining: 120,
      nextPaymentDate: null,
      nextPaymentAmount: 0,
      totalRepaid: 0,
      totalInterest: 0,
      createdAt: "2024-01-22T14:15:00Z",
      startedAt: null,
      updatedAt: new Date().toISOString(),
      verified: true,
      priority: "high",
      tags: ["restauration", "travaux", "expansion"],
      communication: {
        lastMessage: null,
        unreadMessages: 0,
        allowMessages: true,
        allowCalls: true,
      },
      interestedParties: [
        {
          userId: "user-john-123",
          interest: "high",
          message: "Projet très intéressant",
        },
      ],
    },
    {
      id: "swap-004",
      requesterId: "user-john-123",
      providerId: "user-sarah-456",
      type: "offre",
      amount: 5000,
      duration: 3,
      interestRate: 2.5,
      category: "Artisanat",
      riskLevel: "low",
      status: "En négociation",
      progress: 30,
      title: "Outils professionnels",
      description: "Achat d'outillage professionnel pour atelier",
      purpose: "Équipement",
      guarantees: "Matériel en garantie",
      documents: ["devis-outillage.pdf"],
      repaymentSchedule: "monthly",
      earlyRepayment: true,
      insurance: false,
      matchingScore: 92,
      daysRemaining: 90,
      nextPaymentDate: null,
      nextPaymentAmount: 0,
      totalRepaid: 0,
      totalInterest: 0,
      createdAt: "2024-01-20T09:20:00Z",
      startedAt: null,
      updatedAt: new Date().toISOString(),
      verified: true,
      priority: "medium",
      tags: ["artisanat", "outillage"],
      communication: {
        lastMessage: "2024-01-25T11:30:00Z",
        unreadMessages: 1,
        allowMessages: true,
        allowCalls: true,
      },
      negotiation: {
        counterOffers: [
          { amount: 5000, rate: 2.8, duration: 3, status: "pending" },
        ],
        messages: 5,
        lastActivity: "2024-01-25T11:30:00Z",
      },
    },
  ];

  swaps.push(...demoSwaps);
}

function initializeTransactions() {
  const demoTransactions = [
    {
      id: "tx-001",
      userId: "user-john-123",
      type: "deposit",
      amount: 10000,
      description: "Dépôt initial par virement bancaire",
      status: "completed",
      method: "bank_transfer",
      reference: "SWAPEO-DEP-001",
      fees: 0,
      currency: "EUR",
      exchangeRate: 1,
      swapId: null,
      createdAt: "2024-01-20T14:30:00Z",
      completedAt: "2024-01-20T14:35:00Z",
      metadata: {
        bankAccount: "***1234",
        processingTime: "5 minutes",
      },
    },
    {
      id: "tx-002",
      userId: "user-john-123",
      type: "interest",
      amount: 224,
      description: "Intérêts reçus - SW-002 (Stock été)",
      status: "completed",
      method: "automatic",
      reference: "INT-SW-002",
      fees: 0,
      currency: "EUR",
      exchangeRate: 1,
      swapId: "swap-002",
      createdAt: "2024-01-15T16:20:00Z",
      completedAt: "2024-01-15T16:20:00Z",
      metadata: {
        interestRate: 2.8,
        period: "4 mois",
      },
    },
    {
      id: "tx-003",
      userId: "user-john-123",
      type: "withdraw",
      amount: 3000,
      description: "Retrait vers compte principal",
      status: "completed",
      method: "bank_transfer",
      reference: "SWAPEO-WIT-001",
      fees: 15,
      currency: "EUR",
      exchangeRate: 1,
      swapId: null,
      createdAt: "2024-01-16T10:15:00Z",
      completedAt: "2024-01-16T14:20:00Z",
      metadata: {
        bankAccount: "***1234",
        processingTime: "4 heures",
      },
    },
    {
      id: "tx-004",
      userId: "user-john-123",
      type: "fee",
      amount: -15,
      description: "Frais de retrait",
      status: "completed",
      method: "automatic",
      reference: "FEE-WIT-001",
      fees: 0,
      currency: "EUR",
      exchangeRate: 1,
      swapId: null,
      createdAt: "2024-01-16T10:15:00Z",
      completedAt: "2024-01-16T10:15:00Z",
      metadata: {
        feeType: "withdrawal",
        feeRate: "0.5%",
      },
    },
    {
      id: "tx-005",
      userId: "user-john-123",
      type: "swap_payment",
      amount: -15000,
      description: "Financement accordé - SW-001",
      status: "completed",
      method: "automatic",
      reference: "PAY-SW-001",
      fees: 0,
      currency: "EUR",
      exchangeRate: 1,
      swapId: "swap-001",
      createdAt: "2024-01-18T14:20:00Z",
      completedAt: "2024-01-18T14:20:00Z",
      metadata: {
        recipient: "TechStart Innovation",
        purpose: "Développement MVP SaaS",
      },
    },
  ];

  transactions.push(...demoTransactions);
}

function initializeNotifications() {
  const demoNotifications = [
    {
      id: "notif-001",
      userId: "user-john-123",
      type: "swap",
      title: "Nouveau remboursement reçu",
      description: "Sarah Martin a remboursé 2 240€ pour le swap SW-002",
      priority: "medium",
      read: false,
      actionUrl: "/dashboard?tab=swaps&id=swap-002",
      actionText: "Voir le swap",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      metadata: {
        swapId: "swap-002",
        amount: 2240,
        fromUser: "Sarah Martin",
      },
    },
    {
      id: "notif-002",
      userId: "user-john-123",
      type: "message",
      title: "Nouveau message",
      description: "Sophie Dubois souhaite négocier les conditions du swap",
      priority: "high",
      read: false,
      actionUrl: "/dashboard?tab=swaps&id=swap-003",
      actionText: "Répondre",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
      metadata: {
        fromUser: "Sophie Dubois",
        swapId: "swap-003",
        messagePreview: "Bonjour, serait-il possible de...",
      },
    },
    {
      id: "notif-003",
      userId: "user-john-123",
      type: "system",
      title: "Votre score de confiance a augmenté",
      description: "Félicitations ! Votre trust score est maintenant de 85%",
      priority: "low",
      read: true,
      actionUrl: "/dashboard?tab=analytics",
      actionText: "Voir les détails",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      metadata: {
        oldScore: 82,
        newScore: 85,
        reason: "Remboursement dans les temps",
      },
    },
    {
      id: "notif-004",
      userId: "user-john-123",
      type: "payment",
      title: "Échéance dans 7 jours",
      description: "N'oubliez pas le remboursement pour SW-001 (2 650€)",
      priority: "high",
      read: true,
      actionUrl: "/dashboard?tab=swaps&id=swap-001",
      actionText: "Programmer le paiement",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      metadata: {
        swapId: "swap-001",
        amount: 2650,
        dueDate: "2024-02-15",
        daysRemaining: 7,
      },
    },
    {
      id: "notif-005",
      userId: "user-john-123",
      type: "match",
      title: "Nouveau match trouvé",
      description: "3 nouveaux financeurs correspondent à votre demande",
      priority: "medium",
      read: true,
      actionUrl: "/dashboard?tab=swaps&filter=matches",
      actionText: "Voir les matches",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      metadata: {
        matchCount: 3,
        bestMatchScore: 96,
        categories: ["Tech", "Startup"],
      },
    },
  ];

  notifications.push(...demoNotifications);
}

function initializeContacts() {
  const demoContacts = [
    {
      id: "contact-001",
      userId: "user-john-123",
      contactUserId: "user-sarah-456",
      name: "Sarah Martin",
      company: "Investment Pro",
      email: "sarah@investment-pro.com",
      phone: "+33 6 98 76 54 32",
      avatar: null,
      trustScore: 92,
      totalSwaps: 8,
      activeSwaps: 2,
      averageAmount: 12500,
      averageRate: 3.1,
      totalVolume: 100000,
      successRate: 96.2,
      responseTime: "1.8 heures",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      lastSwap: "2024-01-18",
      verified: true,
      status: "active",
      relationship: "frequent_partner",
      tags: ["fiable", "réactif", "professionnel"],
      notes: "Excellent partenaire financier, toujours professionnel",
      preferredCategories: ["Tech", "E-commerce"],
      communicationPreference: "email",
      timezone: "Europe/Paris",
      createdAt: "2023-12-12T11:30:00Z",
      updatedAt: new Date().toISOString(),
      stats: {
        completedSwaps: 6,
        averageRepaymentTime: 95, // % dans les délais
        disputesCount: 0,
        positiveReviews: 8,
        negativeReviews: 0,
      },
    },
    {
      id: "contact-002",
      userId: "user-john-123",
      contactUserId: "user-marie-789",
      name: "Marie Laurent",
      company: "Le Bistrot Moderne",
      email: "marie@bistrot-moderne.fr",
      phone: "+33 6 12 34 56 78",
      avatar: null,
      trustScore: 88,
      totalSwaps: 4,
      activeSwaps: 1,
      averageAmount: 8500,
      averageRate: 3.4,
      totalVolume: 34000,
      successRate: 100,
      responseTime: "4.2 heures",
      lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
      lastSwap: "2024-01-10",
      verified: true,
      status: "active",
      relationship: "new_contact",
      tags: ["restauration", "local"],
      notes: "Propriétaire de restaurant, besoins saisonniers",
      preferredCategories: ["Restauration", "Équipement"],
      communicationPreference: "phone",
      timezone: "Europe/Paris",
      createdAt: "2024-01-05T09:15:00Z",
      updatedAt: new Date().toISOString(),
      stats: {
        completedSwaps: 3,
        averageRepaymentTime: 100,
        disputesCount: 0,
        positiveReviews: 4,
        negativeReviews: 0,
      },
    },
    {
      id: "contact-003",
      userId: "user-john-123",
      contactUserId: "user-thomas-321",
      name: "Thomas Kraft",
      company: "KraftCommerce",
      email: "thomas@kraftcommerce.com",
      phone: "+33 6 55 44 33 22",
      avatar: null,
      trustScore: 94,
      totalSwaps: 12,
      activeSwaps: 3,
      averageAmount: 15000,
      averageRate: 2.9,
      totalVolume: 180000,
      successRate: 91.7,
      responseTime: "2.1 heures",
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      lastSwap: "2024-01-15",
      verified: true,
      status: "active",
      relationship: "trusted_partner",
      tags: ["ecommerce", "volumes importants", "expérimenté"],
      notes: "Expert e-commerce, besoins récurrents pour le stock",
      preferredCategories: ["E-commerce", "Stock", "Saisonnier"],
      communicationPreference: "email",
      timezone: "Europe/Paris",
      createdAt: "2023-08-20T14:45:00Z",
      updatedAt: new Date().toISOString(),
      stats: {
        completedSwaps: 9,
        averageRepaymentTime: 98,
        disputesCount: 1,
        positiveReviews: 11,
        negativeReviews: 1,
      },
    },
  ];

  contacts.push(...demoContacts);
}

function initializeAnalytics() {
  analytics = {
    "user-john-123": {
      overview: {
        totalSwaps: 12,
        activeSwaps: 3,
        completedSwaps: 8,
        cancelledSwaps: 1,
        totalVolume: 125000,
        totalEarnings: 2840,
        averageReturn: 3.2,
        successRate: 94.5,
        trustScoreEvolution: [
          { date: "2023-06", score: 70 },
          { date: "2023-07", score: 72 },
          { date: "2023-08", score: 75 },
          { date: "2023-09", score: 78 },
          { date: "2023-10", score: 80 },
          { date: "2023-11", score: 82 },
          { date: "2023-12", score: 83 },
          { date: "2024-01", score: 85 },
        ],
      },
      performance: {
        monthlyEarnings: [
          { month: "2023-06", earnings: 120 },
          { month: "2023-07", earnings: 340 },
          { month: "2023-08", earnings: 280 },
          { month: "2023-09", earnings: 520 },
          { month: "2023-10", earnings: 380 },
          { month: "2023-11", earnings: 450 },
          { month: "2023-12", earnings: 520 },
          { month: "2024-01", earnings: 230 },
        ],
        categoryDistribution: [
          { category: "Tech", percentage: 45, amount: 56250, count: 5 },
          { category: "E-commerce", percentage: 30, amount: 37500, count: 4 },
          { category: "Restauration", percentage: 15, amount: 18750, count: 2 },
          { category: "Artisanat", percentage: 10, amount: 12500, count: 1 },
        ],
        riskDistribution: [
          { risk: "low", percentage: 75, count: 9 },
          { risk: "medium", percentage: 20, count: 2 },
          { risk: "high", percentage: 5, count: 1 },
        ],
      },
      trends: {
        averageMatchingTime: [
          { period: "Q3 2023", days: 3.8 },
          { period: "Q4 2023", days: 2.9 },
          { period: "Q1 2024", days: 2.3 },
        ],
        repaymentRate: [
          { period: "Q3 2023", rate: 92 },
          { period: "Q4 2023", rate: 95 },
          { period: "Q1 2024", rate: 97 },
        ],
        portfolioValue: [
          { date: "2023-06-01", value: 5000 },
          { date: "2023-07-01", value: 8500 },
          { date: "2023-08-01", value: 12000 },
          { date: "2023-09-01", value: 18500 },
          { date: "2023-10-01", value: 25000 },
          { date: "2023-11-01", value: 32000 },
          { date: "2023-12-01", value: 38500 },
          { date: "2024-01-01", value: 42847 },
        ],
      },
      insights: [
        {
          type: "performance",
          title: "Performance excellente",
          description:
            "Votre ROI de 12.4% est supérieur de 3.2% à la moyenne de la plateforme",
          severity: "positive",
          actionable: false,
        },
        {
          type: "opportunity",
          title: "Opportunité détectée",
          description:
            "Le secteur Tech montre une croissance de +15%. Considérez augmenter votre exposition.",
          severity: "info",
          actionable: true,
          action: "explore_tech_sector",
        },
        {
          type: "warning",
          title: "Échéance proche",
          description:
            "3 remboursements sont attendus dans les 7 prochains jours pour un total de 18,500€",
          severity: "warning",
          actionable: true,
          action: "schedule_payments",
        },
      ],
    },
  };
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

    // Update last active
    user.lastActive = new Date().toISOString();
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
    ...(process.env.NODE_ENV === "development" && { details: error.message }),
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
      "http://localhost:8080",
      "https://builder.codes",
      /https:\/\/.*\.builder\.codes$/,
      /https:\/\/.*\.netlify\.app$/,
      /https:\/\/.*\.fly\.dev$/,
    ],
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development
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
  phone: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const swapSchema = Joi.object({
  type: Joi.string().valid("demande", "offre").required(),
  amount: Joi.number().positive().required(),
  duration: Joi.number().positive().required(),
  description: Joi.string().required(),
  category: Joi.string().optional(),
  purpose: Joi.string().optional(),
  guarantees: Joi.string().optional(),
  repaymentSchedule: Joi.string()
    .valid("monthly", "quarterly", "end")
    .default("monthly"),
  earlyRepayment: Joi.boolean().default(true),
  insurance: Joi.boolean().default(false),
});

// ===========================
// AUTH ROUTES
// ===========================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, firstName, lastName, role, company, phone } =
      value;

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
      phone: phone || "",
      kycStatus: "pending",
      trustScore: 0,
      avatar: null,
      address: "",
      settings: {
        notifications: true,
        emailAlerts: true,
        smsAlerts: false,
        darkMode: false,
      },
      wallet: {
        balance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        pendingDeposits: 0,
        pendingWithdrawals: 0,
        frozenAmount: 0,
      },
      statistics: {
        totalSwaps: 0,
        activeSwaps: 0,
        completedSwaps: 0,
        totalBorrowed: 0,
        totalLent: 0,
        averageRate: 0,
        totalEarnings: 0,
        successRate: 0,
        averageResponseTime: "N/A",
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    users.push(user);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Create welcome notification
    notifications.push({
      id: uuidv4(),
      userId: user.id,
      type: "system",
      title: "Bienvenue sur Swapeo !",
      description:
        "Votre compte a été créé avec succès. Commencez par compléter votre profil.",
      priority: "medium",
      read: false,
      actionUrl: "/dashboard?tab=profile",
      actionText: "Compléter le profil",
      createdAt: new Date().toISOString(),
      metadata: {
        welcomeBonus: 0,
        nextSteps: ["complete_profile", "verify_identity", "first_swap"],
      },
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
        company: user.company,
        kycStatus: user.kycStatus,
        trustScore: user.trustScore,
        wallet: user.wallet,
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

    // Create login notification
    notifications.push({
      id: uuidv4(),
      userId: user.id,
      type: "system",
      title: "Nouvelle connexion",
      description: `Connexion détectée depuis ${req.ip || "IP inconnue"}`,
      priority: "low",
      read: false,
      actionUrl: "/dashboard?tab=security",
      actionText: "Voir l'activité",
      createdAt: new Date().toISOString(),
      metadata: {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        location: "France", // Would be detected from IP in production
      },
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
        settings: user.settings,
        statistics: user.statistics,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// ===========================
// USER ROUTES
// ===========================

app.get("/api/users/profile", authMiddleware, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

app.put("/api/users/profile", authMiddleware, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.id);
    const allowedFields = [
      "firstName",
      "lastName",
      "company",
      "phone",
      "address",
      "avatar",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    user.updatedAt = new Date().toISOString();

    const { password, ...userWithoutPassword } = user;
    res.json({
      message: "Profil mis à jour",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

app.put("/api/users/settings", authMiddleware, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.id);
    user.settings = { ...user.settings, ...req.body };
    user.updatedAt = new Date().toISOString();

    res.json({
      message: "Paramètres mis à jour",
      settings: user.settings,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// ===========================
// SWAP ROUTES
// ===========================

app.get("/api/swaps", authMiddleware, (req, res) => {
  try {
    const userSwaps = swaps.filter(
      (s) => s.requesterId === req.user.id || s.providerId === req.user.id,
    );

    const enrichedSwaps = userSwaps.map((swap) => {
      const requester = users.find((u) => u.id === swap.requesterId);
      const provider = users.find((u) => u.id === swap.providerId);

      return {
        ...swap,
        requesterName: requester
          ? `${requester.firstName} ${requester.lastName}`
          : "Utilisateur supprimé",
        providerName: provider
          ? `${provider.firstName} ${provider.lastName}`
          : null,
        counterparty:
          swap.requesterId === req.user.id
            ? provider
              ? `${provider.firstName} ${provider.lastName}`
              : "Recherche en cours..."
            : `${requester.firstName} ${requester.lastName}`,
      };
    });

    res.json({
      swaps: enrichedSwaps,
      total: enrichedSwaps.length,
      active: enrichedSwaps.filter((s) => s.status === "Actif").length,
      completed: enrichedSwaps.filter((s) => s.status === "Terminé").length,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement des swaps" });
  }
});

app.post("/api/swaps", authMiddleware, (req, res) => {
  try {
    const { error, value } = swapSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const swap = {
      id: `swap-${Date.now()}`,
      requesterId: req.user.id,
      providerId: null,
      ...value,
      interestRate: value.type === "demande" ? 3.5 : 3.0, // Default rates
      riskLevel: "low",
      status: "En recherche",
      progress: 0,
      title: value.description.substring(0, 50),
      matchingScore: Math.floor(Math.random() * 15) + 85,
      daysRemaining: value.duration * 30,
      nextPaymentDate: null,
      nextPaymentAmount: 0,
      totalRepaid: 0,
      totalInterest: 0,
      createdAt: new Date().toISOString(),
      startedAt: null,
      updatedAt: new Date().toISOString(),
      verified: true,
      priority: "medium",
      tags: [value.category || "autre"],
      communication: {
        lastMessage: null,
        unreadMessages: 0,
        allowMessages: true,
        allowCalls: true,
      },
    };

    swaps.push(swap);

    // Update user statistics
    const user = users.find((u) => u.id === req.user.id);
    user.statistics.totalSwaps++;
    user.statistics.activeSwaps++;

    // Create notification
    notifications.push({
      id: uuidv4(),
      userId: req.user.id,
      type: "swap",
      title: "Swap créé avec succès",
      description: `Votre ${value.type} de ${value.amount}€ est maintenant en recherche de partenaire`,
      priority: "medium",
      read: false,
      actionUrl: `/dashboard?tab=swaps&id=${swap.id}`,
      actionText: "Voir le swap",
      createdAt: new Date().toISOString(),
      metadata: {
        swapId: swap.id,
        amount: value.amount,
        type: value.type,
      },
    });

    res.status(201).json({
      message: "Swap créé avec succès",
      swap,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du swap" });
  }
});

app.get("/api/swaps/:id", authMiddleware, (req, res) => {
  try {
    const swap = swaps.find((s) => s.id === req.params.id);
    if (!swap) {
      return res.status(404).json({ error: "Swap non trouvé" });
    }

    // Check access rights
    if (swap.requesterId !== req.user.id && swap.providerId !== req.user.id) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    const requester = users.find((u) => u.id === swap.requesterId);
    const provider = users.find((u) => u.id === swap.providerId);

    const enrichedSwap = {
      ...swap,
      requester: requester
        ? {
            id: requester.id,
            firstName: requester.firstName,
            lastName: requester.lastName,
            company: requester.company,
            trustScore: requester.trustScore,
            avatar: requester.avatar,
          }
        : null,
      provider: provider
        ? {
            id: provider.id,
            firstName: provider.firstName,
            lastName: provider.lastName,
            company: provider.company,
            trustScore: provider.trustScore,
            avatar: provider.avatar,
          }
        : null,
    };

    res.json({ swap: enrichedSwap });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement du swap" });
  }
});

app.put("/api/swaps/:id", authMiddleware, (req, res) => {
  try {
    const swap = swaps.find((s) => s.id === req.params.id);
    if (!swap) {
      return res.status(404).json({ error: "Swap non trouvé" });
    }

    // Check access rights
    if (swap.requesterId !== req.user.id && swap.providerId !== req.user.id) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    const allowedFields = ["status", "progress", "notes"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        swap[field] = req.body[field];
      }
    });

    swap.updatedAt = new Date().toISOString();

    res.json({
      message: "Swap mis à jour",
      swap,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// ===========================
// WALLET ROUTES
// ===========================

app.get("/api/wallet", authMiddleware, (req, res) => {
  res.json({
    wallet: req.user.wallet,
    currency: "EUR",
    lastUpdate: new Date().toISOString(),
  });
});

app.post("/api/wallet/deposit", authMiddleware, (req, res) => {
  try {
    const { amount, method = "bank_transfer" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    if (amount > 100000) {
      return res
        .status(400)
        .json({ error: "Montant trop élevé (max 100,000€)" });
    }

    const user = users.find((u) => u.id === req.user.id);
    const fees = method === "card" ? Math.max(amount * 0.025, 2) : 0;
    const netAmount = amount - fees;

    user.wallet.balance += netAmount;
    user.wallet.totalDeposited += amount;

    // Create transaction record
    const transaction = {
      id: `tx-${Date.now()}`,
      userId: req.user.id,
      type: "deposit",
      amount: netAmount,
      description: `Dépôt par ${method === "card" ? "carte bancaire" : "virement bancaire"}`,
      status: "completed",
      method,
      reference: `SWAPEO-DEP-${Date.now()}`,
      fees,
      currency: "EUR",
      exchangeRate: 1,
      swapId: null,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      metadata: {
        processingTime: method === "card" ? "instantané" : "2-5 minutes",
        originalAmount: amount,
      },
    };

    transactions.push(transaction);

    // Create notification
    notifications.push({
      id: uuidv4(),
      userId: req.user.id,
      type: "payment",
      title: "Dépôt effectué",
      description: `${netAmount}€ ont été ajoutés à votre portefeuille`,
      priority: "low",
      read: false,
      actionUrl: "/dashboard?tab=wallet",
      actionText: "Voir le portefeuille",
      createdAt: new Date().toISOString(),
      metadata: {
        amount: netAmount,
        fees,
        method,
        transactionId: transaction.id,
      },
    });

    res.json({
      message: "Dépôt effectué avec succès",
      transaction,
      newBalance: user.wallet.balance,
      fees,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du dépôt" });
  }
});

app.post("/api/wallet/withdraw", authMiddleware, (req, res) => {
  try {
    const { amount, method = "bank_transfer" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const user = users.find((u) => u.id === req.user.id);
    const fees = Math.max(amount * 0.005, 1); // 0.5% min 1€

    if (amount + fees > user.wallet.balance) {
      return res.status(400).json({ error: "Solde insuffisant" });
    }

    user.wallet.balance -= amount + fees;
    user.wallet.totalWithdrawn += amount;

    // Create transaction records
    const withdrawTransaction = {
      id: `tx-${Date.now()}`,
      userId: req.user.id,
      type: "withdraw",
      amount: -amount,
      description: "Retrait vers compte bancaire",
      status: "completed",
      method,
      reference: `SWAPEO-WIT-${Date.now()}`,
      fees: 0,
      currency: "EUR",
      exchangeRate: 1,
      swapId: null,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      metadata: {
        processingTime: "2-24 heures",
        estimatedArrival: new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    };

    const feeTransaction = {
      id: `tx-${Date.now()}-fee`,
      userId: req.user.id,
      type: "fee",
      amount: -fees,
      description: "Frais de retrait",
      status: "completed",
      method: "automatic",
      reference: `FEE-WIT-${Date.now()}`,
      fees: 0,
      currency: "EUR",
      exchangeRate: 1,
      swapId: null,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      metadata: {
        feeType: "withdrawal",
        feeRate: "0.5%",
        relatedTransaction: withdrawTransaction.id,
      },
    };

    transactions.push(withdrawTransaction, feeTransaction);

    // Create notification
    notifications.push({
      id: uuidv4(),
      userId: req.user.id,
      type: "payment",
      title: "Retrait en cours",
      description: `${amount}€ seront transférés vers votre compte sous 24h`,
      priority: "medium",
      read: false,
      actionUrl: "/dashboard?tab=wallet",
      actionText: "Voir le portefeuille",
      createdAt: new Date().toISOString(),
      metadata: {
        amount,
        fees,
        method,
        transactionId: withdrawTransaction.id,
      },
    });

    res.json({
      message: "Retrait effectué avec succès",
      transaction: withdrawTransaction,
      newBalance: user.wallet.balance,
      fees,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du retrait" });
  }
});

app.get("/api/wallet/transactions", authMiddleware, (req, res) => {
  try {
    const { limit = 50, offset = 0, type, status } = req.query;

    let userTransactions = transactions.filter((t) => t.userId === req.user.id);

    if (type) {
      userTransactions = userTransactions.filter((t) => t.type === type);
    }

    if (status) {
      userTransactions = userTransactions.filter((t) => t.status === status);
    }

    // Sort by date desc
    userTransactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const paginatedTransactions = userTransactions.slice(
      offset,
      offset + parseInt(limit),
    );

    res.json({
      transactions: paginatedTransactions,
      total: userTransactions.length,
      hasMore: offset + parseInt(limit) < userTransactions.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des transactions" });
  }
});

// ===========================
// NOTIFICATIONS ROUTES
// ===========================

app.get("/api/notifications", authMiddleware, (req, res) => {
  try {
    const { limit = 20, offset = 0, unread } = req.query;

    let userNotifications = notifications.filter(
      (n) => n.userId === req.user.id,
    );

    if (unread === "true") {
      userNotifications = userNotifications.filter((n) => !n.read);
    }

    // Sort by date desc
    userNotifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const paginatedNotifications = userNotifications.slice(
      offset,
      offset + parseInt(limit),
    );

    res.json({
      notifications: paginatedNotifications,
      total: userNotifications.length,
      unreadCount: userNotifications.filter((n) => !n.read).length,
      hasMore: offset + parseInt(limit) < userNotifications.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des notifications" });
  }
});

app.put("/api/notifications/:id/read", authMiddleware, (req, res) => {
  try {
    const notification = notifications.find(
      (n) => n.id === req.params.id && n.userId === req.user.id,
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification non trouvée" });
    }

    notification.read = true;

    res.json({
      message: "Notification marquée comme lue",
      notification,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

app.put("/api/notifications/mark-all-read", authMiddleware, (req, res) => {
  try {
    const userNotifications = notifications.filter(
      (n) => n.userId === req.user.id,
    );
    userNotifications.forEach((n) => (n.read = true));

    res.json({
      message: "Toutes les notifications ont été marquées comme lues",
      count: userNotifications.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// ===========================
// CONTACTS/NETWORK ROUTES
// ===========================

app.get("/api/contacts", authMiddleware, (req, res) => {
  try {
    const userContacts = contacts.filter((c) => c.userId === req.user.id);

    const enrichedContacts = userContacts.map((contact) => {
      const contactUser = users.find((u) => u.id === contact.contactUserId);
      return {
        ...contact,
        isOnline:
          contactUser &&
          new Date(contactUser.lastActive).getTime() >
            Date.now() - 5 * 60 * 1000, // 5 min
      };
    });

    res.json({
      contacts: enrichedContacts,
      total: enrichedContacts.length,
      stats: {
        activeContacts: enrichedContacts.filter((c) => c.status === "active")
          .length,
        trustedPartners: enrichedContacts.filter(
          (c) => c.relationship === "trusted_partner",
        ).length,
        averageTrustScore:
          enrichedContacts.length > 0
            ? Math.round(
                enrichedContacts.reduce((sum, c) => sum + c.trustScore, 0) /
                  enrichedContacts.length,
              )
            : 0,
        totalVolume: enrichedContacts.reduce(
          (sum, c) => sum + c.totalVolume,
          0,
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement des contacts" });
  }
});

app.post("/api/contacts", authMiddleware, (req, res) => {
  try {
    const { email, notes } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    const contactUser = users.find((u) => u.email === email);
    if (!contactUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (contactUser.id === req.user.id) {
      return res
        .status(400)
        .json({ error: "Vous ne pouvez pas vous ajouter vous-même" });
    }

    const existingContact = contacts.find(
      (c) => c.userId === req.user.id && c.contactUserId === contactUser.id,
    );

    if (existingContact) {
      return res.status(400).json({ error: "Contact déjà ajouté" });
    }

    const contact = {
      id: uuidv4(),
      userId: req.user.id,
      contactUserId: contactUser.id,
      name: `${contactUser.firstName} ${contactUser.lastName}`,
      company: contactUser.company,
      email: contactUser.email,
      phone: contactUser.phone,
      avatar: contactUser.avatar,
      trustScore: contactUser.trustScore,
      totalSwaps: 0,
      activeSwaps: 0,
      averageAmount: 0,
      averageRate: 0,
      totalVolume: 0,
      successRate: 0,
      responseTime: "N/A",
      lastActive: contactUser.lastActive,
      lastSwap: null,
      verified: contactUser.kycStatus === "verified",
      status: "active",
      relationship: "new_contact",
      tags: [],
      notes: notes || "",
      preferredCategories: [],
      communicationPreference: "email",
      timezone: "Europe/Paris",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        completedSwaps: 0,
        averageRepaymentTime: 0,
        disputesCount: 0,
        positiveReviews: 0,
        negativeReviews: 0,
      },
    };

    contacts.push(contact);

    res.status(201).json({
      message: "Contact ajouté avec succès",
      contact,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du contact" });
  }
});

// ===========================
// ANALYTICS ROUTES
// ===========================

app.get("/api/analytics", authMiddleware, (req, res) => {
  try {
    const userAnalytics = analytics[req.user.id] || {
      overview: {
        totalSwaps: 0,
        activeSwaps: 0,
        completedSwaps: 0,
        cancelledSwaps: 0,
        totalVolume: 0,
        totalEarnings: 0,
        averageReturn: 0,
        successRate: 0,
        trustScoreEvolution: [],
      },
      performance: {
        monthlyEarnings: [],
        categoryDistribution: [],
        riskDistribution: [],
      },
      trends: {
        averageMatchingTime: [],
        repaymentRate: [],
        portfolioValue: [],
      },
      insights: [],
    };

    res.json({
      analytics: userAnalytics,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement des analytics" });
  }
});

app.get("/api/analytics/export", authMiddleware, (req, res) => {
  try {
    const { format = "json", period = "all" } = req.query;

    const userSwaps = swaps.filter(
      (s) => s.requesterId === req.user.id || s.providerId === req.user.id,
    );

    const userTransactions = transactions.filter(
      (t) => t.userId === req.user.id,
    );

    const exportData = {
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        company: req.user.company,
        trustScore: req.user.trustScore,
        statistics: req.user.statistics,
      },
      swaps: userSwaps,
      transactions: userTransactions,
      analytics: analytics[req.user.id] || {},
      exportDate: new Date().toISOString(),
      period,
    };

    if (format === "csv") {
      // In a real implementation, you'd format as CSV
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=swapeo-export.csv",
      );
      res.send("CSV export not implemented yet");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=swapeo-export.json",
      );
      res.json(exportData);
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'export" });
  }
});

// ===========================
// MATCHING ROUTES
// ===========================

app.get("/api/matching/compatible", authMiddleware, (req, res) => {
  try {
    const { category, minAmount, maxAmount, maxDuration } = req.query;

    // Find swaps that could match with user's profile
    let compatibleSwaps = swaps.filter((swap) => {
      // Don't show user's own swaps
      if (swap.requesterId === req.user.id) return false;

      // Only show available swaps
      if (swap.status !== "En recherche") return false;

      // Apply filters
      if (category && swap.category !== category) return false;
      if (minAmount && swap.amount < parseInt(minAmount)) return false;
      if (maxAmount && swap.amount > parseInt(maxAmount)) return false;
      if (maxDuration && swap.duration > parseInt(maxDuration)) return false;

      return true;
    });

    // Calculate matching scores
    compatibleSwaps = compatibleSwaps.map((swap) => {
      const requester = users.find((u) => u.id === swap.requesterId);

      let matchingScore = 85; // Base score

      // Boost for verified users
      if (requester?.kycStatus === "verified") matchingScore += 5;

      // Boost for high trust score
      if (requester?.trustScore > 90) matchingScore += 5;

      // Random variation
      matchingScore += Math.floor(Math.random() * 10) - 5;

      return {
        ...swap,
        matchingScore: Math.min(99, Math.max(60, matchingScore)),
        requesterName: requester
          ? `${requester.firstName} ${requester.lastName}`
          : "Utilisateur",
        requesterCompany: requester?.company || "",
        requesterTrustScore: requester?.trustScore || 0,
      };
    });

    // Sort by matching score
    compatibleSwaps.sort((a, b) => b.matchingScore - a.matchingScore);

    res.json({
      swaps: compatibleSwaps.slice(0, 20), // Limit to top 20
      total: compatibleSwaps.length,
      filters: { category, minAmount, maxAmount, maxDuration },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche de compatibilités" });
  }
});

app.post("/api/matching/interest", authMiddleware, (req, res) => {
  try {
    const { swapId, message } = req.body;

    const swap = swaps.find((s) => s.id === swapId);
    if (!swap) {
      return res.status(404).json({ error: "Swap non trouvé" });
    }

    if (swap.requesterId === req.user.id) {
      return res.status(400).json({
        error: "Vous ne pouvez pas exprimer un intérêt pour votre propre swap",
      });
    }

    // Initialize interested parties if not exists
    if (!swap.interestedParties) {
      swap.interestedParties = [];
    }

    // Check if already interested
    const existingInterest = swap.interestedParties.find(
      (p) => p.userId === req.user.id,
    );
    if (existingInterest) {
      return res
        .status(400)
        .json({ error: "Vous avez déjà exprimé votre intérêt" });
    }

    swap.interestedParties.push({
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userCompany: req.user.company,
      userTrustScore: req.user.trustScore,
      interest: "high",
      message: message || "",
      createdAt: new Date().toISOString(),
    });

    // Notify swap creator
    notifications.push({
      id: uuidv4(),
      userId: swap.requesterId,
      type: "match",
      title: "Nouvel intérêt pour votre swap",
      description: `${req.user.firstName} ${req.user.lastName} s'intéresse à votre ${swap.type}`,
      priority: "high",
      read: false,
      actionUrl: `/dashboard?tab=swaps&id=${swap.id}`,
      actionText: "Voir les détails",
      createdAt: new Date().toISOString(),
      metadata: {
        swapId: swap.id,
        interestedUserId: req.user.id,
        interestedUserName: `${req.user.firstName} ${req.user.lastName}`,
        message,
      },
    });

    res.json({
      message: "Intérêt exprimé avec succès",
      swap,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'expression d'intérêt" });
  }
});

// ===========================
// ADMIN/SYSTEM ROUTES
// ===========================

app.get("/api/system/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    stats: {
      totalUsers: users.length,
      totalSwaps: swaps.length,
      totalTransactions: transactions.length,
      totalNotifications: notifications.length,
    },
  });
});

app.get("/api/system/stats", (req, res) => {
  const totalVolume = swaps.reduce((sum, swap) => sum + swap.amount, 0);
  const activeSwaps = swaps.filter((s) => s.status === "Actif").length;
  const completedSwaps = swaps.filter((s) => s.status === "Terminé").length;
  const averageRate =
    swaps.length > 0
      ? swaps.reduce((sum, swap) => sum + swap.interestRate, 0) / swaps.length
      : 0;

  res.json({
    platform: {
      totalUsers: users.length,
      verifiedUsers: users.filter((u) => u.kycStatus === "verified").length,
      totalSwaps: swaps.length,
      activeSwaps,
      completedSwaps,
      totalVolume,
      averageRate: Math.round(averageRate * 100) / 100,
      totalTransactions: transactions.length,
      successRate:
        swaps.length > 0
          ? Math.round((completedSwaps / swaps.length) * 100)
          : 0,
    },
    categories: [
      {
        name: "Tech",
        count: swaps.filter((s) => s.category === "Tech").length,
      },
      {
        name: "E-commerce",
        count: swaps.filter((s) => s.category === "E-commerce").length,
      },
      {
        name: "Restauration",
        count: swaps.filter((s) => s.category === "Restauration").length,
      },
      {
        name: "Artisanat",
        count: swaps.filter((s) => s.category === "Artisanat").length,
      },
    ],
    recentActivity: {
      newUsersToday: users.filter(
        (u) =>
          new Date(u.createdAt).toDateString() === new Date().toDateString(),
      ).length,
      newSwapsToday: swaps.filter(
        (s) =>
          new Date(s.createdAt).toDateString() === new Date().toDateString(),
      ).length,
    },
  });
});

// ===========================
// ERROR HANDLING
// ===========================

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint non trouvé",
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(errorHandler);

// Export serverless function
module.exports.handler = serverless(app);
