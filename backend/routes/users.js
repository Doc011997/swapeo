import express from "express";
import Joi from "joi";
import storage from "../data/storage.js";

const router = express.Router();

// Get user profile
router.get("/profile", async (req, res, next) => {
  try {
    const { password, ...user } = req.user;

    // Get wallet info
    const wallet = await storage.findOne("wallets", { userId: user.id });

    res.json({
      user: {
        ...user,
        wallet,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put("/profile", async (req, res, next) => {
  try {
    const updateSchema = Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      phone: Joi.string(),
      company: Joi.string(),
      address: Joi.string(),
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.details.map((d) => d.message),
      });
    }

    const updatedUser = await storage.updateById("users", req.user.id, value);
    const { password, ...userResponse } = updatedUser;

    res.json({
      message: "Profil mis à jour",
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
});

// Update KYC status
router.post("/kyc/update", async (req, res, next) => {
  try {
    const { documents } = req.body;

    // Calculate KYC completion
    let kycStatus = req.user.kycStatus || 20;

    if (documents?.identity) kycStatus = Math.max(kycStatus, 40);
    if (documents?.address) kycStatus = Math.max(kycStatus, 60);
    if (documents?.business) kycStatus = Math.max(kycStatus, 80);
    if (documents?.identity && documents?.address && documents?.business) {
      kycStatus = 100;
    }

    const updatedUser = await storage.updateById("users", req.user.id, {
      kycStatus,
      isVerified: kycStatus >= 80,
      kycDocuments: documents,
    });

    const { password, ...userResponse } = updatedUser;

    res.json({
      message: "KYC mis à jour",
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
});

// Get user statistics
router.get("/stats", async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user swaps
    const swaps = await storage.findMany("swaps", {
      $or: [{ userId }, { counterpartyId: userId }],
    });

    const activeSwaps = swaps.filter((s) => s.status === "En cours").length;
    const totalVolume = swaps.reduce((sum, s) => sum + s.amount, 0);
    const participants = new Set(
      swaps.map((s) => s.counterpartyId || s.counterparty),
    ).size;
    const avgRate =
      swaps.length > 0
        ? swaps.reduce((sum, s) => sum + s.interestRate, 0) / swaps.length
        : 0;

    res.json({
      stats: {
        activeSwaps,
        totalVolume,
        participants,
        averageRate: avgRate.toFixed(1),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update user preferences
router.put("/preferences", async (req, res, next) => {
  try {
    const preferencesSchema = Joi.object({
      notifications: Joi.object({
        swapAccepted: Joi.boolean(),
        swapFound: Joi.boolean(),
        paymentReceived: Joi.boolean(),
        dailyEmail: Joi.boolean(),
      }),
      matching: Joi.object({
        autoAccept: Joi.boolean(),
        maxAmount: Joi.number().min(0),
        preferredDuration: Joi.array().items(Joi.number()),
        maxInterestRate: Joi.number().min(0).max(100),
      }),
    });

    const { error, value } = preferencesSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Préférences invalides",
        details: error.details.map((d) => d.message),
      });
    }

    const updatedUser = await storage.updateById("users", req.user.id, {
      preferences: value,
    });

    const { password, ...userResponse } = updatedUser;

    res.json({
      message: "Préférences mises à jour",
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
});

// Delete account
router.delete("/account", async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: "Mot de passe requis pour supprimer le compte",
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, req.user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Mot de passe incorrect",
      });
    }

    // Check for active swaps
    const activeSwaps = await storage.findMany("swaps", {
      userId: req.user.id,
      status: { $in: ["En cours", "Accepté"] },
    });

    if (activeSwaps.length > 0) {
      return res.status(400).json({
        error: "Impossible de supprimer le compte avec des swaps actifs",
      });
    }

    // Delete user data
    await storage.deleteById("users", req.user.id);
    await storage.deleteById("wallets", req.user.id);

    res.json({
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
