import express from "express";
import Joi from "joi";
import storage from "../data/storage.js";
import { calculateSwapDetails } from "../utils/calculator.js";

const router = express.Router();

// Get user swaps
router.get("/", async (req, res, next) => {
  try {
    const { status, type, limit = 50, offset = 0 } = req.query;

    let query = {
      $or: [{ userId: req.user.id }, { counterpartyId: req.user.id }],
    };

    if (status) query.status = status;
    if (type) query.type = type;

    const swaps = await storage.findMany("swaps", query);

    // Apply pagination
    const paginatedSwaps = swaps
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .map((swap) => ({
        ...swap,
        isOwner: swap.userId === req.user.id,
      }));

    res.json({
      swaps: paginatedSwaps,
      total: swaps.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: swaps.length > parseInt(offset) + parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create new swap
router.post("/", async (req, res, next) => {
  try {
    const swapSchema = Joi.object({
      type: Joi.string().valid("demande", "offre").required(),
      amount: Joi.number().min(1000).max(500000).required(),
      duration: Joi.number().min(1).max(24).required(),
      description: Joi.string().max(500),
      maxInterestRate: Joi.number().min(0).max(20),
      minInterestRate: Joi.number().min(0).max(20),
    });

    const { error, value } = swapSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.details.map((d) => d.message),
      });
    }

    // Check user wallet limits
    const wallet = await storage.findOne("wallets", { userId: req.user.id });
    if (
      value.type === "demande" &&
      value.amount > wallet.monthlyLimit - wallet.monthlyUsed
    ) {
      return res.status(400).json({
        error: "Montant supérieur à votre limite mensuelle disponible",
      });
    }

    if (value.type === "offre" && value.amount > wallet.balance) {
      return res.status(400).json({
        error: "Solde insuffisant pour cette offre",
      });
    }

    // Calculate suggested interest rate
    const suggestedRate = calculateSuggestedRate(
      value.amount,
      value.duration,
      value.type,
    );

    // Generate swap ID
    const swapId = `SWP-${Date.now().toString().slice(-6)}`;

    const swap = await storage.create("swaps", {
      id: swapId,
      userId: req.user.id,
      ...value,
      interestRate:
        value.maxInterestRate || value.minInterestRate || suggestedRate,
      suggestedRate,
      status: "En recherche",
      progress: 0,
      views: 0,
      applications: [],
    });

    // Create notification for potential matches
    await createMatchingNotification(swap);

    res.status(201).json({
      message: "Swap créé avec succès",
      swap,
    });
  } catch (error) {
    next(error);
  }
});

// Get swap details
router.get("/:id", async (req, res, next) => {
  try {
    const swap = await storage.findById("swaps", req.params.id);

    if (!swap) {
      return res.status(404).json({
        error: "Swap non trouvé",
      });
    }

    // Check if user has access
    if (swap.userId !== req.user.id && swap.counterpartyId !== req.user.id) {
      return res.status(403).json({
        error: "Accès non autorisé",
      });
    }

    // Increment view count
    await storage.updateById("swaps", req.params.id, {
      views: (swap.views || 0) + 1,
    });

    // Calculate swap financial details
    const details = calculateSwapDetails(
      swap.amount,
      swap.duration,
      swap.interestRate,
    );

    res.json({
      swap: {
        ...swap,
        details,
        isOwner: swap.userId === req.user.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Apply to a swap
router.post("/:id/apply", async (req, res, next) => {
  try {
    const swap = await storage.findById("swaps", req.params.id);

    if (!swap) {
      return res.status(404).json({
        error: "Swap non trouvé",
      });
    }

    if (swap.userId === req.user.id) {
      return res.status(400).json({
        error: "Vous ne pouvez pas candidater à votre propre swap",
      });
    }

    if (swap.status !== "En recherche") {
      return res.status(400).json({
        error: "Ce swap n'est plus disponible",
      });
    }

    // Check if already applied
    const applications = swap.applications || [];
    if (applications.some((app) => app.userId === req.user.id)) {
      return res.status(400).json({
        error: "Vous avez déjà candidaté à ce swap",
      });
    }

    // Add application
    applications.push({
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      appliedAt: new Date().toISOString(),
      status: "pending",
    });

    await storage.updateById("swaps", req.params.id, {
      applications,
      status: applications.length === 1 ? "Trouvé" : swap.status,
    });

    // Create notification for swap owner
    await storage.create("notifications", {
      userId: swap.userId,
      type: "swap_application",
      title: "Nouvelle candidature",
      message: `${req.user.firstName} ${req.user.lastName} a candidaté à votre swap de ${swap.amount.toLocaleString()}€`,
      data: { swapId: swap.id },
      read: false,
    });

    res.json({
      message: "Candidature envoyée avec succès",
    });
  } catch (error) {
    next(error);
  }
});

// Accept/Reject application
router.post("/:id/applications/:userId/:action", async (req, res, next) => {
  try {
    const { action } = req.params;
    const swap = await storage.findById("swaps", req.params.id);

    if (!swap || swap.userId !== req.user.id) {
      return res.status(404).json({
        error: "Swap non trouvé ou accès non autorisé",
      });
    }

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        error: "Action invalide",
      });
    }

    const applications = swap.applications || [];
    const applicationIndex = applications.findIndex(
      (app) => app.userId === req.params.userId,
    );

    if (applicationIndex === -1) {
      return res.status(404).json({
        error: "Candidature non trouvée",
      });
    }

    if (action === "accept") {
      // Accept this application and reject others
      applications.forEach((app, index) => {
        app.status = index === applicationIndex ? "accepted" : "rejected";
      });

      const acceptedUser = await storage.findById("users", req.params.userId);

      await storage.updateById("swaps", req.params.id, {
        applications,
        counterpartyId: req.params.userId,
        counterparty: `${acceptedUser.firstName} ${acceptedUser.lastName}`,
        status: "Accepté",
        progress: 10,
        acceptedAt: new Date().toISOString(),
      });

      // Create notification for accepted user
      await storage.create("notifications", {
        userId: req.params.userId,
        type: "swap_accepted",
        title: "Swap accepté ✅",
        message: `Votre candidature pour le swap de ${swap.amount.toLocaleString()}€ a été acceptée !`,
        data: { swapId: swap.id },
        read: false,
      });

      // Update wallets (simulate transaction)
      await processSwapTransaction(swap, req.params.userId);
    } else {
      applications[applicationIndex].status = "rejected";
      await storage.updateById("swaps", req.params.id, { applications });
    }

    res.json({
      message: `Candidature ${action === "accept" ? "acceptée" : "rejetée"} avec succès`,
    });
  } catch (error) {
    next(error);
  }
});

// Update swap status
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "En recherche",
      "Trouvé",
      "Accepté",
      "En cours",
      "Terminé",
      "Annulé",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Statut invalide",
      });
    }

    const swap = await storage.findById("swaps", req.params.id);

    if (
      !swap ||
      (swap.userId !== req.user.id && swap.counterpartyId !== req.user.id)
    ) {
      return res.status(404).json({
        error: "Swap non trouvé ou accès non autorisé",
      });
    }

    let updateData = { status };

    // Calculate progress based on status
    switch (status) {
      case "En cours":
        updateData.progress = 25;
        updateData.startedAt = new Date().toISOString();
        break;
      case "Terminé":
        updateData.progress = 100;
        updateData.completedAt = new Date().toISOString();
        break;
      case "Annulé":
        updateData.progress = 0;
        updateData.cancelledAt = new Date().toISOString();
        break;
    }

    const updatedSwap = await storage.updateById(
      "swaps",
      req.params.id,
      updateData,
    );

    res.json({
      message: "Statut mis à jour",
      swap: updatedSwap,
    });
  } catch (error) {
    next(error);
  }
});

// Calculate suggested interest rate
function calculateSuggestedRate(amount, duration, type) {
  let baseRate = 3.2; // Base rate

  // Adjust based on amount (higher amounts get lower rates)
  if (amount > 100000) baseRate -= 0.5;
  if (amount < 10000) baseRate += 0.5;

  // Adjust based on duration (longer durations get higher rates)
  if (duration > 12) baseRate += 0.3;
  if (duration < 3) baseRate -= 0.2;

  // Adjust based on type (offers typically have lower rates)
  if (type === "offre") baseRate -= 0.2;

  return Math.max(1.5, Math.min(8.0, parseFloat(baseRate.toFixed(1))));
}

// Create matching notification
async function createMatchingNotification(swap) {
  // Find potential matches
  const oppositeType = swap.type === "demande" ? "offre" : "demande";
  const potentialMatches = await storage.findMany("users", {
    role: swap.type === "demande" ? "financeur" : "emprunteur",
  });

  // Create notifications for potential matches
  for (const user of potentialMatches.slice(0, 5)) {
    // Limit to 5 notifications
    if (user.id !== swap.userId) {
      await storage.create("notifications", {
        userId: user.id,
        type: "new_matching_opportunity",
        title: "Nouveau matching disponible ⚡",
        message: `Un nouveau swap de ${swap.amount.toLocaleString()}€ correspond à vos critères`,
        data: { swapId: swap.id },
        read: false,
      });
    }
  }
}

// Process swap transaction
async function processSwapTransaction(swap, acceptedUserId) {
  const borrowerWallet = await storage.findOne("wallets", {
    userId: swap.type === "demande" ? swap.userId : acceptedUserId,
  });
  const lenderWallet = await storage.findOne("wallets", {
    userId: swap.type === "demande" ? acceptedUserId : swap.userId,
  });

  if (swap.type === "demande") {
    // Borrower receives money, lender sends money
    await storage.updateById("wallets", borrowerWallet.userId, {
      balance: borrowerWallet.balance + swap.amount,
      monthlyUsed: borrowerWallet.monthlyUsed + swap.amount,
    });

    await storage.updateById("wallets", lenderWallet.userId, {
      balance: lenderWallet.balance - swap.amount,
    });
  } else {
    // Opposite for offers
    await storage.updateById("wallets", lenderWallet.userId, {
      balance: lenderWallet.balance + swap.amount,
      monthlyUsed: lenderWallet.monthlyUsed + swap.amount,
    });

    await storage.updateById("wallets", borrowerWallet.userId, {
      balance: borrowerWallet.balance - swap.amount,
    });
  }

  // Create movement records
  const { interest, platformFee, total } = calculateSwapDetails(
    swap.amount,
    swap.duration,
    swap.interestRate,
  );

  await storage.create("movements", {
    userId: borrowerWallet.userId,
    type: "credit",
    amount: swap.amount,
    description: `Réception swap ${swap.id}`,
    swapId: swap.id,
    status: "completed",
  });

  await storage.create("movements", {
    userId: lenderWallet.userId,
    type: "debit",
    amount: swap.amount,
    description: `Envoi swap ${swap.id}`,
    swapId: swap.id,
    status: "completed",
  });
}

export default router;
