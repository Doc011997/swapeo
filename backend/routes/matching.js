import express from "express";
import storage from "../data/storage.js";
import { calculateMatchingScore } from "../utils/calculator.js";

const router = express.Router();

// Get compatible swaps for matching
router.get("/compatible", async (req, res, next) => {
  try {
    const {
      amount,
      duration,
      type,
      maxInterestRate,
      minInterestRate,
      limit = 20,
    } = req.query;

    // Determine opposite type for matching
    const oppositeType = type === "demande" ? "offre" : "demande";

    // Get all available swaps of opposite type
    let availableSwaps = await storage.findMany("swaps", {
      status: "En recherche",
      type: oppositeType,
    });

    // Exclude user's own swaps
    availableSwaps = availableSwaps.filter(
      (swap) => swap.userId !== req.user.id,
    );

    // Apply filters
    if (amount) {
      const amountNum = parseInt(amount);
      const tolerance = 0.2; // 20% tolerance
      availableSwaps = availableSwaps.filter((swap) => {
        const diff = Math.abs(swap.amount - amountNum) / amountNum;
        return diff <= tolerance;
      });
    }

    if (duration) {
      const durationNum = parseInt(duration);
      availableSwaps = availableSwaps.filter((swap) => {
        return Math.abs(swap.duration - durationNum) <= 3; // 3 months tolerance
      });
    }

    if (maxInterestRate && type === "demande") {
      availableSwaps = availableSwaps.filter(
        (swap) => swap.interestRate <= parseFloat(maxInterestRate),
      );
    }

    if (minInterestRate && type === "offre") {
      availableSwaps = availableSwaps.filter(
        (swap) => swap.interestRate >= parseFloat(minInterestRate),
      );
    }

    // Get user details for each swap
    const swapsWithUserData = await Promise.all(
      availableSwaps.map(async (swap) => {
        const swapUser = await storage.findById("users", swap.userId);
        const { password, ...userPublic } = swapUser;

        // Calculate matching score
        const mockUserSwap = {
          amount: parseInt(amount) || 0,
          duration: parseInt(duration) || 0,
          interestRate: parseFloat(maxInterestRate || minInterestRate) || 0,
          type,
        };

        const matchingScore =
          amount && duration
            ? calculateMatchingScore(mockUserSwap, swap, req.user, swapUser)
            : Math.random() * 40 + 60; // Random score between 60-100

        return {
          ...swap,
          user: {
            id: userPublic.id,
            firstName: userPublic.firstName,
            lastName: userPublic.lastName,
            trustScore: userPublic.trustScore,
            memberSince: userPublic.memberSince,
            isVerified: userPublic.isVerified,
          },
          matchingScore: Math.round(matchingScore),
          compatibility: getCompatibilityLevel(matchingScore),
        };
      }),
    );

    // Sort by matching score
    swapsWithUserData.sort((a, b) => b.matchingScore - a.matchingScore);

    // Apply limit
    const limitedSwaps = swapsWithUserData.slice(0, parseInt(limit));

    // Calculate matching statistics
    const stats = {
      totalAvailable: availableSwaps.length,
      highCompatibility: swapsWithUserData.filter((s) => s.matchingScore >= 80)
        .length,
      mediumCompatibility: swapsWithUserData.filter(
        (s) => s.matchingScore >= 60 && s.matchingScore < 80,
      ).length,
      averageMatchingScore:
        swapsWithUserData.length > 0
          ? Math.round(
              swapsWithUserData.reduce((sum, s) => sum + s.matchingScore, 0) /
                swapsWithUserData.length,
            )
          : 0,
    };

    res.json({
      swaps: limitedSwaps,
      statistics: stats,
      filters: {
        amount: amount ? parseInt(amount) : null,
        duration: duration ? parseInt(duration) : null,
        type,
        maxInterestRate: maxInterestRate ? parseFloat(maxInterestRate) : null,
        minInterestRate: minInterestRate ? parseFloat(minInterestRate) : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get AI-suggested matches for user
router.get("/suggestions", async (req, res, next) => {
  try {
    // Get user's recent swap preferences
    const userSwaps = await storage.findMany("swaps", { userId: req.user.id });
    const userWallet = await storage.findOne("wallets", {
      userId: req.user.id,
    });

    // Calculate user preferences based on history
    const preferences = calculateUserPreferences(
      userSwaps,
      req.user,
      userWallet,
    );

    // Find matching swaps based on preferences
    const oppositeType = req.user.role === "emprunteur" ? "offre" : "demande";
    let availableSwaps = await storage.findMany("swaps", {
      status: "En recherche",
      type: oppositeType,
    });

    // Exclude user's own swaps
    availableSwaps = availableSwaps.filter(
      (swap) => swap.userId !== req.user.id,
    );

    // Score and rank suggestions
    const suggestions = await Promise.all(
      availableSwaps.map(async (swap) => {
        const swapUser = await storage.findById("users", swap.userId);
        const { password, ...userPublic } = swapUser;

        // Calculate multiple scoring factors
        const amountScore = calculateAmountScore(
          swap.amount,
          preferences.preferredAmount,
        );
        const durationScore = calculateDurationScore(
          swap.duration,
          preferences.preferredDuration,
        );
        const rateScore = calculateRateScore(
          swap.interestRate,
          preferences.preferredRate,
        );
        const trustScore = swapUser.trustScore || 50;

        // Weighted final score
        const finalScore = Math.round(
          amountScore * 0.3 +
            durationScore * 0.25 +
            rateScore * 0.25 +
            trustScore * 0.2,
        );

        return {
          ...swap,
          user: {
            id: userPublic.id,
            firstName: userPublic.firstName,
            lastName: userPublic.lastName,
            trustScore: userPublic.trustScore,
            memberSince: userPublic.memberSince,
            isVerified: userPublic.isVerified,
          },
          aiScore: finalScore,
          reasons: generateMatchingReasons(swap, preferences, swapUser),
          priority: getPriorityLevel(finalScore),
        };
      }),
    );

    // Sort by AI score and take top suggestions
    suggestions.sort((a, b) => b.aiScore - a.aiScore);
    const topSuggestions = suggestions.slice(0, 10);

    res.json({
      suggestions: topSuggestions,
      userPreferences: preferences,
      totalAnalyzed: availableSwaps.length,
      recommendationEngine: {
        version: "1.0",
        lastUpdated: new Date().toISOString(),
        factors: [
          "amount_compatibility",
          "duration_match",
          "interest_rate",
          "trust_score",
        ],
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get matching statistics
router.get("/stats", async (req, res, next) => {
  try {
    const allSwaps = await storage.findMany("swaps", {});
    const activeSwaps = allSwaps.filter((s) => s.status === "En recherche");

    // Calculate matching rates
    const matchedSwaps = allSwaps.filter((s) =>
      ["Accepté", "En cours", "Terminé"].includes(s.status),
    );
    const matchingRate =
      allSwaps.length > 0 ? (matchedSwaps.length / allSwaps.length) * 100 : 0;

    // Average time to match (simulate)
    const averageMatchTime = "3.2h";

    // Success rate
    const completedSwaps = allSwaps.filter((s) => s.status === "Terminé");
    const successRate =
      matchedSwaps.length > 0
        ? (completedSwaps.length / matchedSwaps.length) * 100
        : 0;

    // Active by type
    const activeOffers = activeSwaps.filter((s) => s.type === "offre").length;
    const activeDemands = activeSwaps.filter(
      (s) => s.type === "demande",
    ).length;

    res.json({
      statistics: {
        matchingRate: Math.round(matchingRate * 10) / 10,
        averageMatchTime,
        successRate: Math.round(successRate * 10) / 10,
        totalActiveSwaps: activeSwaps.length,
        activeOffers,
        activeDemands,
        totalVolume: activeSwaps.reduce((sum, s) => sum + s.amount, 0),
        averageAmount:
          activeSwaps.length > 0
            ? Math.round(
                activeSwaps.reduce((sum, s) => sum + s.amount, 0) /
                  activeSwaps.length,
              )
            : 0,
      },
      breakdown: {
        byAmount: calculateAmountBreakdown(activeSwaps),
        byDuration: calculateDurationBreakdown(activeSwaps),
        byRate: calculateRateBreakdown(activeSwaps),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Auto-match algorithm (can be triggered manually or by cron)
router.post("/auto-match", async (req, res, next) => {
  try {
    const activeSwaps = await storage.findMany("swaps", {
      status: "En recherche",
    });
    const matches = [];
    const processed = new Set();

    for (const swap1 of activeSwaps) {
      if (processed.has(swap1.id)) continue;

      const oppositeType = swap1.type === "demande" ? "offre" : "demande";
      const potentialMatches = activeSwaps.filter(
        (swap2) =>
          swap2.type === oppositeType &&
          !processed.has(swap2.id) &&
          swap2.userId !== swap1.userId,
      );

      for (const swap2 of potentialMatches) {
        const user1 = await storage.findById("users", swap1.userId);
        const user2 = await storage.findById("users", swap2.userId);

        const matchingScore = calculateMatchingScore(
          swap1,
          swap2,
          user1,
          user2,
        );

        // Auto-match if score is very high (90+)
        if (matchingScore >= 90) {
          matches.push({
            swap1: swap1.id,
            swap2: swap2.id,
            score: matchingScore,
            users: [user1.id, user2.id],
          });

          // Create notifications for both users
          await storage.create("notifications", {
            userId: user1.id,
            type: "auto_match_found",
            title: "Match automatique trouvé ! 🎯",
            message: `Un swap parfaitement compatible a été trouvé (score: ${matchingScore}%)`,
            data: {
              swapId: swap1.id,
              matchedSwapId: swap2.id,
              matchingScore,
            },
            read: false,
          });

          await storage.create("notifications", {
            userId: user2.id,
            type: "auto_match_found",
            title: "Match automatique trouvé ! 🎯",
            message: `Un swap parfaitement compatible a été trouvé (score: ${matchingScore}%)`,
            data: {
              swapId: swap2.id,
              matchedSwapId: swap1.id,
              matchingScore,
            },
            read: false,
          });

          processed.add(swap1.id);
          processed.add(swap2.id);
          break;
        }
      }
    }

    res.json({
      message: `Auto-matching terminé: ${matches.length} matches trouvés`,
      matches,
      processedSwaps: processed.size,
      totalActiveSwaps: activeSwaps.length,
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions
function getCompatibilityLevel(score) {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

function getPriorityLevel(score) {
  if (score >= 85) return "urgent";
  if (score >= 70) return "high";
  if (score >= 55) return "medium";
  return "low";
}

function calculateUserPreferences(userSwaps, user, wallet) {
  if (userSwaps.length === 0) {
    // Default preferences based on user profile
    return {
      preferredAmount: user.role === "financeur" ? 50000 : 25000,
      preferredDuration: 6,
      preferredRate: 3.2,
      maxAmount: wallet.monthlyLimit,
    };
  }

  const avgAmount =
    userSwaps.reduce((sum, s) => sum + s.amount, 0) / userSwaps.length;
  const avgDuration =
    userSwaps.reduce((sum, s) => sum + s.duration, 0) / userSwaps.length;
  const avgRate =
    userSwaps.reduce((sum, s) => sum + s.interestRate, 0) / userSwaps.length;

  return {
    preferredAmount: Math.round(avgAmount),
    preferredDuration: Math.round(avgDuration),
    preferredRate: Math.round(avgRate * 10) / 10,
    maxAmount: wallet.monthlyLimit,
  };
}

function calculateAmountScore(swapAmount, preferredAmount) {
  const diff = Math.abs(swapAmount - preferredAmount) / preferredAmount;
  return Math.max(0, 100 * (1 - diff));
}

function calculateDurationScore(swapDuration, preferredDuration) {
  const diff = Math.abs(swapDuration - preferredDuration);
  return Math.max(0, 100 * (1 - diff / 12));
}

function calculateRateScore(swapRate, preferredRate) {
  const diff = Math.abs(swapRate - preferredRate);
  return Math.max(0, 100 * (1 - diff / 5));
}

function generateMatchingReasons(swap, preferences, swapUser) {
  const reasons = [];

  const amountDiff =
    Math.abs(swap.amount - preferences.preferredAmount) /
    preferences.preferredAmount;
  if (amountDiff < 0.1) reasons.push("Montant parfaitement adapté");
  else if (amountDiff < 0.2) reasons.push("Montant compatible");

  const durationDiff = Math.abs(swap.duration - preferences.preferredDuration);
  if (durationDiff <= 1) reasons.push("Durée idéale");
  else if (durationDiff <= 3) reasons.push("Durée acceptable");

  if (swapUser.trustScore >= 90) reasons.push("Très haute confiance");
  else if (swapUser.trustScore >= 80) reasons.push("Haute confiance");

  if (swapUser.isVerified) reasons.push("Profil vérifié");

  return reasons;
}

function calculateAmountBreakdown(swaps) {
  const ranges = {
    small: swaps.filter((s) => s.amount < 10000).length,
    medium: swaps.filter((s) => s.amount >= 10000 && s.amount < 50000).length,
    large: swaps.filter((s) => s.amount >= 50000).length,
  };
  return ranges;
}

function calculateDurationBreakdown(swaps) {
  const ranges = {
    short: swaps.filter((s) => s.duration <= 3).length,
    medium: swaps.filter((s) => s.duration > 3 && s.duration <= 12).length,
    long: swaps.filter((s) => s.duration > 12).length,
  };
  return ranges;
}

function calculateRateBreakdown(swaps) {
  const ranges = {
    low: swaps.filter((s) => s.interestRate < 3).length,
    medium: swaps.filter((s) => s.interestRate >= 3 && s.interestRate <= 5)
      .length,
    high: swaps.filter((s) => s.interestRate > 5).length,
  };
  return ranges;
}

export default router;
