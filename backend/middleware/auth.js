import jwt from "jsonwebtoken";
import storage from "../data/storage.js";

const JWT_SECRET = process.env.JWT_SECRET || "swapeo_secret_key_2024";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Token d'authentification manquant",
        code: "NO_TOKEN",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await storage.findById("users", decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Token invalide",
      code: "INVALID_TOKEN",
    });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Accès administrateur requis",
      code: "ADMIN_REQUIRED",
    });
  }
  next();
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};
