import express from "express";
import storage from "../data/storage.js";
import { adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get dashboard statistics
router.get("/dashboard", async (req, res, next) => {
  try {
    const users = await storage.findMany("users", {});
    const swaps = await storage.findMany("swaps", {});
    const wallets = await storage.findMany("wallets", {});
    const movements = await storage.findMany("movements", {});

    // User statistics
    const totalUsers = users.length;
    const verifiedUsers = users.filter((u) => u.isVerified).length;
    const emprunteurs = users.filter((u) => u.role === "emprunteur").length;
    const financeurs = users.filter((u) => u.role === "financeur").length;

    // Swap statistics
    const totalSwaps = swaps.length;
    const activeSwaps = swaps.filter((s) => s.status === "En cours").length;
    const completedSwaps = swaps.filter((s) => s.status === "Terminé").length;
    const totalVolume = swaps.reduce((sum, s) => sum + s.amount, 0);

    // Financial statistics
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const totalTransactions = movements.filter(
      (m) => m.status === "completed",
    ).length;
    const totalTransactionVolume = movements
      .filter((m) => m.status === "completed")
      .reduce((sum, m) => sum + m.amount, 0);

    // Platform fees collected
    const platformFees = swaps.reduce((sum, s) => {
      if (s.status === "Terminé") {
        return sum + s.amount * 0.01; // 1% platform fee
      }
      return sum;
    }, 0);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = users.filter(
      (u) => new Date(u.createdAt) >= thirtyDaysAgo,
    ).length;
    const recentSwaps = swaps.filter(
      (s) => new Date(s.createdAt) >= thirtyDaysAgo,
    ).length;

    res.json({
      overview: {
        totalUsers,
        verifiedUsers,
        totalSwaps,
        activeSwaps,
        totalVolume,
        platformFees: Math.round(platformFees),
      },
      userStats: {
        total: totalUsers,
        verified: verifiedUsers,
        emprunteurs,
        financeurs,
        verificationRate:
          totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
      },
      swapStats: {
        total: totalSwaps,
        active: activeSwaps,
        completed: completedSwaps,
        successRate:
          totalSwaps > 0 ? Math.round((completedSwaps / totalSwaps) * 100) : 0,
        averageAmount:
          totalSwaps > 0 ? Math.round(totalVolume / totalSwaps) : 0,
      },
      financialStats: {
        totalBalance: Math.round(totalBalance),
        totalTransactions,
        transactionVolume: Math.round(totalTransactionVolume),
        platformRevenue: Math.round(platformFees),
      },
      recentActivity: {
        newUsers: recentUsers,
        newSwaps: recentSwaps,
        growth: {
          users:
            totalUsers > recentUsers
              ? Math.round((recentUsers / (totalUsers - recentUsers)) * 100)
              : 0,
          swaps:
            totalSwaps > recentSwaps
              ? Math.round((recentSwaps / (totalSwaps - recentSwaps)) * 100)
              : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all users with pagination
router.get("/users", async (req, res, next) => {
  try {
    const { search, role, verified, limit = 50, offset = 0 } = req.query;

    let users = await storage.findMany("users", {});

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower),
      );
    }

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    if (verified !== undefined) {
      users = users.filter((u) => u.isVerified === (verified === "true"));
    }

    // Remove passwords
    users = users.map((u) => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    // Apply pagination
    const paginatedUsers = users.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit),
    );

    res.json({
      users: paginatedUsers,
      total: users.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: users.length > parseInt(offset) + parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get user details
router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await storage.findById("users", req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "Utilisateur non trouvé",
      });
    }

    const { password, ...userWithoutPassword } = user;

    // Get user's wallet
    const wallet = await storage.findOne("wallets", { userId: user.id });

    // Get user's swaps
    const swaps = await storage.findMany("swaps", { userId: user.id });

    // Get user's movements
    const movements = await storage.findMany("movements", { userId: user.id });

    res.json({
      user: userWithoutPassword,
      wallet,
      swaps,
      movements: movements.slice(0, 10), // Latest 10 movements
      statistics: {
        totalSwaps: swaps.length,
        activeSwaps: swaps.filter((s) => s.status === "En cours").length,
        completedSwaps: swaps.filter((s) => s.status === "Terminé").length,
        totalVolume: swaps.reduce((sum, s) => sum + s.amount, 0),
        totalTransactions: movements.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update user verification status
router.patch("/users/:id/verification", async (req, res, next) => {
  try {
    const { isVerified, kycStatus, trustScore } = req.body;

    const updateData = {};
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (kycStatus !== undefined) updateData.kycStatus = kycStatus;
    if (trustScore !== undefined) updateData.trustScore = trustScore;

    const updatedUser = await storage.updateById(
      "users",
      req.params.id,
      updateData,
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: "Utilisateur non trouvé",
      });
    }

    // Create notification for user
    await storage.create("notifications", {
      userId: req.params.id,
      type: "verification_update",
      title: "Statut de vérification mis à jour",
      message: `Votre statut de vérification a été ${isVerified ? "approuvé" : "mis à jour"}`,
      data: { kycStatus, trustScore },
      read: false,
    });

    const { password, ...userResponse } = updatedUser;
    res.json({
      message: "Statut de vérification mis à jour",
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
});

// Get all swaps with admin details
router.get("/swaps", async (req, res, next) => {
  try {
    const { status, type, userId, limit = 50, offset = 0 } = req.query;

    let swaps = await storage.findMany("swaps", {});

    // Apply filters
    if (status) swaps = swaps.filter((s) => s.status === status);
    if (type) swaps = swaps.filter((s) => s.type === type);
    if (userId) swaps = swaps.filter((s) => s.userId === userId);

    // Enrich with user data
    const swapsWithUserData = await Promise.all(
      swaps.map(async (swap) => {
        const user = await storage.findById("users", swap.userId);
        const { password, ...userData } = user;

        let counterpartyData = null;
        if (swap.counterpartyId) {
          const counterparty = await storage.findById(
            "users",
            swap.counterpartyId,
          );
          const { password: _, ...cpData } = counterparty;
          counterpartyData = cpData;
        }

        return {
          ...swap,
          user: userData,
          counterpartyUser: counterpartyData,
        };
      }),
    );

    // Apply pagination
    const paginatedSwaps = swapsWithUserData.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit),
    );

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

// Manual swap intervention
router.patch("/swaps/:id/intervene", async (req, res, next) => {
  try {
    const { action, reason, newStatus } = req.body;

    const swap = await storage.findById("swaps", req.params.id);
    if (!swap) {
      return res.status(404).json({
        error: "Swap non trouvé",
      });
    }

    let updateData = {};

    switch (action) {
      case "suspend":
        updateData = {
          status: "Suspendu",
          suspendedAt: new Date().toISOString(),
          suspensionReason: reason,
        };
        break;
      case "approve":
        updateData = {
          status: newStatus || "En cours",
          approvedAt: new Date().toISOString(),
          approvedBy: req.user.id,
        };
        break;
      case "cancel":
        updateData = {
          status: "Annulé",
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
        };
        break;
      default:
        return res.status(400).json({
          error: "Action invalide",
        });
    }

    const updatedSwap = await storage.updateById(
      "swaps",
      req.params.id,
      updateData,
    );

    // Create notifications for involved users
    const notificationMessage = {
      suspend: "Votre swap a été temporairement suspendu",
      approve: "Votre swap a été approuvé par l'équipe",
      cancel: "Votre swap a été annulé",
    }[action];

    await storage.create("notifications", {
      userId: swap.userId,
      type: "admin_intervention",
      title: "Intervention administrative",
      message: notificationMessage + (reason ? ` - Raison: ${reason}` : ""),
      data: { swapId: swap.id, action, reason },
      read: false,
    });

    if (swap.counterpartyId) {
      await storage.create("notifications", {
        userId: swap.counterpartyId,
        type: "admin_intervention",
        title: "Intervention administrative",
        message: notificationMessage,
        data: { swapId: swap.id, action, reason },
        read: false,
      });
    }

    res.json({
      message: `Action ${action} effectuée avec succès`,
      swap: updatedSwap,
    });
  } catch (error) {
    next(error);
  }
});

// Get platform analytics
router.get("/analytics", async (req, res, next) => {
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

    const users = await storage.findMany("users", {});
    const swaps = await storage.findMany("swaps", {});
    const movements = await storage.findMany("movements", {});

    // Filter by period
    const periodUsers = users.filter((u) => new Date(u.createdAt) >= startDate);
    const periodSwaps = swaps.filter((s) => new Date(s.createdAt) >= startDate);
    const periodMovements = movements.filter(
      (m) => new Date(m.createdAt) >= startDate,
    );

    // Daily breakdown
    const dailyStats = {};
    const currentDate = new Date(startDate);
    const endDate = new Date();

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      dailyStats[dateStr] = {
        newUsers: 0,
        newSwaps: 0,
        swapVolume: 0,
        transactions: 0,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Populate daily stats
    periodUsers.forEach((u) => {
      const date = new Date(u.createdAt).toISOString().split("T")[0];
      if (dailyStats[date]) dailyStats[date].newUsers++;
    });

    periodSwaps.forEach((s) => {
      const date = new Date(s.createdAt).toISOString().split("T")[0];
      if (dailyStats[date]) {
        dailyStats[date].newSwaps++;
        dailyStats[date].swapVolume += s.amount;
      }
    });

    periodMovements.forEach((m) => {
      const date = new Date(m.createdAt).toISOString().split("T")[0];
      if (dailyStats[date]) dailyStats[date].transactions++;
    });

    const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      ...stats,
    }));

    res.json({
      period,
      analytics: {
        overview: {
          newUsers: periodUsers.length,
          newSwaps: periodSwaps.length,
          totalVolume: periodSwaps.reduce((sum, s) => sum + s.amount, 0),
          transactions: periodMovements.length,
        },
        userGrowth: {
          rate:
            users.length > periodUsers.length
              ? Math.round(
                  (periodUsers.length / (users.length - periodUsers.length)) *
                    100,
                )
              : 0,
          trend: "up", // Could be calculated based on previous period
        },
        swapMetrics: {
          averageAmount:
            periodSwaps.length > 0
              ? Math.round(
                  periodSwaps.reduce((sum, s) => sum + s.amount, 0) /
                    periodSwaps.length,
                )
              : 0,
          averageDuration:
            periodSwaps.length > 0
              ? Math.round(
                  periodSwaps.reduce((sum, s) => sum + s.duration, 0) /
                    periodSwaps.length,
                )
              : 0,
          successRate:
            periodSwaps.length > 0
              ? Math.round(
                  (periodSwaps.filter((s) => s.status === "Terminé").length /
                    periodSwaps.length) *
                    100,
                )
              : 0,
        },
      },
      chartData,
    });
  } catch (error) {
    next(error);
  }
});

// System health check
router.get("/health", async (req, res, next) => {
  try {
    const users = await storage.findMany("users", {});
    const swaps = await storage.findMany("swaps", {});
    const movements = await storage.findMany("movements", {});

    // Check for issues
    const issues = [];

    // Check for stuck swaps
    const stuckSwaps = swaps.filter((s) => {
      const daysSinceCreation =
        (Date.now() - new Date(s.createdAt)) / (1000 * 60 * 60 * 24);
      return s.status === "En recherche" && daysSinceCreation > 7;
    });

    if (stuckSwaps.length > 0) {
      issues.push(
        `${stuckSwaps.length} swaps en recherche depuis plus de 7 jours`,
      );
    }

    // Check for pending movements
    const pendingMovements = movements.filter((m) => m.status === "pending");
    const oldPendingMovements = pendingMovements.filter((m) => {
      const hoursSinceCreation =
        (Date.now() - new Date(m.createdAt)) / (1000 * 60 * 60);
      return hoursSinceCreation > 48;
    });

    if (oldPendingMovements.length > 0) {
      issues.push(
        `${oldPendingMovements.length} mouvements en attente depuis plus de 48h`,
      );
    }

    res.json({
      status: issues.length === 0 ? "healthy" : "warning",
      issues,
      metrics: {
        totalUsers: users.length,
        activeSwaps: swaps.filter((s) =>
          ["En recherche", "En cours"].includes(s.status),
        ).length,
        pendingMovements: pendingMovements.length,
        systemLoad: "normal", // Could be real system metrics
      },
      lastChecked: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
