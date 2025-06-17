import express from "express";
import Joi from "joi";
import storage from "../data/storage.js";
import { calculateSwapDetails } from "../utils/calculator.js";

const router = express.Router();

// Get wallet information
router.get("/", async (req, res, next) => {
  try {
    const wallet = await storage.findOne("wallets", { userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet non trouvé",
      });
    }

    // Get recent movements
    const movements = await storage.findMany("movements", {
      userId: req.user.id,
    });
    const recentMovements = movements
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // Calculate statistics
    const totalIn = movements
      .filter((m) => m.type === "credit" && m.status === "completed")
      .reduce((sum, m) => sum + m.amount, 0);

    const totalOut = movements
      .filter((m) => m.type === "debit" && m.status === "completed")
      .reduce((sum, m) => sum + m.amount, 0);

    res.json({
      wallet: {
        ...wallet,
        statistics: {
          totalIn,
          totalOut,
          netFlow: totalIn - totalOut,
          transactionCount: movements.length,
        },
      },
      recentMovements,
    });
  } catch (error) {
    next(error);
  }
});

// Get wallet movements/transactions
router.get("/movements", async (req, res, next) => {
  try {
    const {
      type,
      status,
      limit = 50,
      offset = 0,
      startDate,
      endDate,
    } = req.query;

    let query = { userId: req.user.id };

    if (type) query.type = type;
    if (status) query.status = status;

    let movements = await storage.findMany("movements", query);

    // Filter by date range
    if (startDate || endDate) {
      movements = movements.filter((m) => {
        const movementDate = new Date(m.createdAt);
        if (startDate && movementDate < new Date(startDate)) return false;
        if (endDate && movementDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Sort by date (newest first)
    movements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const paginatedMovements = movements.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit),
    );

    res.json({
      movements: paginatedMovements,
      total: movements.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: movements.length > parseInt(offset) + parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Deposit money
router.post("/deposit", async (req, res, next) => {
  try {
    const depositSchema = Joi.object({
      amount: Joi.number().min(10).max(50000).required(),
      method: Joi.string().valid("bank_transfer", "sepa", "card").required(),
      reference: Joi.string(),
    });

    const { error, value } = depositSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.details.map((d) => d.message),
      });
    }

    const { amount, method, reference } = value;

    const wallet = await storage.findOne("wallets", { userId: req.user.id });

    // Simulate processing delay
    const isInstant = method === "card";
    const status = isInstant ? "completed" : "pending";

    // Create movement record
    const movement = await storage.create("movements", {
      userId: req.user.id,
      type: "credit",
      amount,
      description: `Dépôt par ${method === "card" ? "carte bancaire" : "virement bancaire"}`,
      method,
      reference: reference || `DEP-${Date.now()}`,
      status,
    });

    // Update wallet if instant
    if (isInstant) {
      await storage.updateById("wallets", wallet.userId, {
        balance: wallet.balance + amount,
      });
    } else {
      // Add to pending
      await storage.updateById("wallets", wallet.userId, {
        pendingIn: wallet.pendingIn + amount,
      });
    }

    // Create notification
    await storage.create("notifications", {
      userId: req.user.id,
      type: "wallet_deposit",
      title: isInstant ? "Dépôt effectué" : "Dépôt en cours",
      message: `Dépôt de ${amount.toLocaleString()}€ ${isInstant ? "effectué" : "en cours de traitement"}`,
      data: { movementId: movement.id, amount },
      read: false,
    });

    res.status(201).json({
      message: isInstant
        ? "Dépôt effectué avec succès"
        : "Dépôt en cours de traitement",
      movement,
      estimatedProcessingTime: isInstant ? "0h" : "24-48h",
    });
  } catch (error) {
    next(error);
  }
});

// Withdraw money
router.post("/withdraw", async (req, res, next) => {
  try {
    const withdrawSchema = Joi.object({
      amount: Joi.number().min(10).required(),
      method: Joi.string().valid("bank_transfer", "sepa").required(),
      bankAccount: Joi.object({
        iban: Joi.string().required(),
        bic: Joi.string(),
        name: Joi.string().required(),
      }).required(),
    });

    const { error, value } = withdrawSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.details.map((d) => d.message),
      });
    }

    const { amount, method, bankAccount } = value;

    const wallet = await storage.findOne("wallets", { userId: req.user.id });

    // Check available balance
    if (amount > wallet.balance) {
      return res.status(400).json({
        error: "Solde insuffisant",
      });
    }

    // Check minimum balance requirement (keep 100€)
    if (wallet.balance - amount < 100) {
      return res.status(400).json({
        error: "Vous devez conserver un solde minimum de 100€",
      });
    }

    // Create movement record
    const movement = await storage.create("movements", {
      userId: req.user.id,
      type: "debit",
      amount,
      description: `Retrait par ${method === "sepa" ? "virement SEPA" : "virement bancaire"}`,
      method,
      bankAccount,
      reference: `WTH-${Date.now()}`,
      status: "pending",
    });

    // Update wallet
    await storage.updateById("wallets", wallet.userId, {
      balance: wallet.balance - amount,
      pendingOut: wallet.pendingOut + amount,
    });

    // Create notification
    await storage.create("notifications", {
      userId: req.user.id,
      type: "wallet_withdrawal",
      title: "Retrait en cours",
      message: `Retrait de ${amount.toLocaleString()}€ en cours de traitement`,
      data: { movementId: movement.id, amount },
      read: false,
    });

    res.status(201).json({
      message: "Retrait en cours de traitement",
      movement,
      estimatedProcessingTime: "24-48h",
    });
  } catch (error) {
    next(error);
  }
});

// Get wallet statistics
router.get("/stats", async (req, res, next) => {
  try {
    const { period = "30d" } = req.query;

    let startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const movements = await storage.findMany("movements", {
      userId: req.user.id,
    });
    const periodMovements = movements.filter(
      (m) => new Date(m.createdAt) >= startDate && m.status === "completed",
    );

    // Calculate statistics
    const totalIn = periodMovements
      .filter((m) => m.type === "credit")
      .reduce((sum, m) => sum + m.amount, 0);

    const totalOut = periodMovements
      .filter((m) => m.type === "debit")
      .reduce((sum, m) => sum + m.amount, 0);

    // Group by day for chart data
    const dailyData = {};
    periodMovements.forEach((m) => {
      const day = new Date(m.createdAt).toISOString().split("T")[0];
      if (!dailyData[day]) {
        dailyData[day] = { in: 0, out: 0 };
      }
      dailyData[day][m.type === "credit" ? "in" : "out"] += m.amount;
    });

    const chartData = Object.entries(dailyData).map(([date, data]) => ({
      date,
      ...data,
      net: data.in - data.out,
    }));

    res.json({
      period,
      statistics: {
        totalIn,
        totalOut,
        netFlow: totalIn - totalOut,
        transactionCount: periodMovements.length,
        averageTransaction:
          periodMovements.length > 0
            ? Math.round((totalIn + totalOut) / periodMovements.length)
            : 0,
      },
      chartData,
    });
  } catch (error) {
    next(error);
  }
});

// Simulate incoming payment (for testing)
router.post("/simulate/incoming", async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        error: "Endpoint disponible uniquement en développement",
      });
    }

    const { amount, description } = req.body;

    const wallet = await storage.findOne("wallets", { userId: req.user.id });

    // Create movement
    await storage.create("movements", {
      userId: req.user.id,
      type: "credit",
      amount: amount || 1000,
      description: description || "Paiement test simulé",
      status: "completed",
    });

    // Update wallet
    await storage.updateById("wallets", wallet.userId, {
      balance: wallet.balance + (amount || 1000),
    });

    res.json({
      message: "Paiement simulé avec succès",
    });
  } catch (error) {
    next(error);
  }
});

// Process pending transactions (cron job simulation)
router.post("/process-pending", async (req, res, next) => {
  try {
    const pendingMovements = await storage.findMany("movements", {
      status: "pending",
    });
    const processedCount = Math.min(pendingMovements.length, 5); // Process max 5 at a time

    for (let i = 0; i < processedCount; i++) {
      const movement = pendingMovements[i];

      // Update movement status
      await storage.updateById("movements", movement.id, {
        status: "completed",
        processedAt: new Date().toISOString(),
      });

      // Update wallet
      const wallet = await storage.findOne("wallets", {
        userId: movement.userId,
      });

      if (movement.type === "credit") {
        await storage.updateById("wallets", wallet.userId, {
          balance: wallet.balance + movement.amount,
          pendingIn: Math.max(0, wallet.pendingIn - movement.amount),
        });
      } else {
        await storage.updateById("wallets", wallet.userId, {
          pendingOut: Math.max(0, wallet.pendingOut - movement.amount),
        });
      }

      // Create notification
      await storage.create("notifications", {
        userId: movement.userId,
        type: "transaction_completed",
        title: "Transaction finalisée",
        message: `${movement.type === "credit" ? "Dépôt" : "Retrait"} de ${movement.amount.toLocaleString()}€ finalisé`,
        data: { movementId: movement.id },
        read: false,
      });
    }

    res.json({
      message: `${processedCount} transactions traitées`,
      processed: processedCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
