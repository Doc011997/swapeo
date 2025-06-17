import express from "express";
import bcrypt from "bcryptjs";
import Joi from "joi";
import storage from "../data/storage.js";
import { generateToken } from "../middleware/auth.js";

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid("emprunteur", "financeur").required(),
  siret: Joi.string().length(14).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.details.map((d) => d.message),
      });
    }

    const { email, password, firstName, lastName, role, siret } = value;

    // Check if user exists
    const existingUser = await storage.findOne("users", { email });
    if (existingUser) {
      return res.status(400).json({
        error: "Un compte avec cet email existe déjà",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await storage.create("users", {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      siret,
      isVerified: false,
      kycStatus: 20,
      trustScore: 50,
      memberSince: new Date().getFullYear().toString(),
    });

    // Create wallet
    await storage.create("wallets", {
      userId: user.id,
      balance: 0,
      monthlyLimit: role === "financeur" ? 100000 : 50000,
      monthlyUsed: 0,
      pendingIn: 0,
      pendingOut: 0,
    });

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      message: "Compte créé avec succès",
      user: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.details.map((d) => d.message),
      });
    }

    const { email, password } = value;

    // Find user
    const user = await storage.findOne("users", { email });
    if (!user) {
      return res.status(401).json({
        error: "Email ou mot de passe incorrect",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Email ou mot de passe incorrect",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: "Connexion réussie",
      user: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get("/me", async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        error: "Token manquant",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "swapeo_secret_key_2024",
    );
    const user = await storage.findById("users", decoded.userId);

    if (!user) {
      return res.status(404).json({
        error: "Utilisateur non trouvé",
      });
    }

    const { password, ...userResponse } = user;
    res.json({ user: userResponse });
  } catch (error) {
    next(error);
  }
});

// Password reset request
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // In real implementation, send email
  res.json({
    message: "Si cet email existe, vous recevrez un lien de réinitialisation",
  });
});

// Verify email
router.post("/verify-email", async (req, res) => {
  const { token } = req.body;

  // In real implementation, verify email token
  res.json({
    message: "Email vérifié avec succès",
  });
});

export default router;
