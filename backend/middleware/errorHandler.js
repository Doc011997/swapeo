export const errorHandler = (err, req, res, next) => {
  console.error("Erreur:", err);

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token invalide",
      code: "INVALID_TOKEN",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expiré",
      code: "TOKEN_EXPIRED",
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Données invalides",
      details: err.details,
      code: "VALIDATION_ERROR",
    });
  }

  // File upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "Fichier trop volumineux (max 10MB)",
      code: "FILE_TOO_LARGE",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Erreur interne du serveur",
    code: err.code || "INTERNAL_ERROR",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
