import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import storage from "../data/storage.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
try {
  await fs.access(uploadsDir);
} catch {
  await fs.mkdir(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${req.user.id}-${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Allow only images and PDFs
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers JPG, PNG et PDF sont autorisés"));
    }
  },
});

// Upload KYC documents
router.post(
  "/kyc",
  upload.fields([
    { name: "identity", maxCount: 2 },
    { name: "address", maxCount: 1 },
    { name: "business", maxCount: 2 },
  ]),
  async (req, res, next) => {
    try {
      const files = req.files;
      const uploadedDocuments = {};

      // Process uploaded files
      for (const [fieldName, fileArray] of Object.entries(files)) {
        uploadedDocuments[fieldName] = fileArray.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          url: `/uploads/${file.filename}`,
        }));
      }

      // Update user's KYC documents
      const currentUser = await storage.findById("users", req.user.id);
      const existingDocs = currentUser.kycDocuments || {};

      // Merge with existing documents
      const updatedDocs = { ...existingDocs };
      for (const [type, docs] of Object.entries(uploadedDocuments)) {
        updatedDocs[type] = docs;
      }

      // Calculate new KYC status
      let kycStatus = 20; // Base status
      if (updatedDocs.identity) kycStatus = Math.max(kycStatus, 40);
      if (updatedDocs.address) kycStatus = Math.max(kycStatus, 60);
      if (updatedDocs.business) kycStatus = Math.max(kycStatus, 80);

      // Full verification if all documents are provided
      if (updatedDocs.identity && updatedDocs.address && updatedDocs.business) {
        kycStatus = 100;
      }

      // Update user
      const updatedUser = await storage.updateById("users", req.user.id, {
        kycDocuments: updatedDocs,
        kycStatus,
        isVerified: kycStatus >= 80,
        lastKycUpdate: new Date().toISOString(),
      });

      // Create notification
      await storage.create("notifications", {
        userId: req.user.id,
        type: "kyc_documents_uploaded",
        title: "Documents KYC téléchargés",
        message: `Documents ${Object.keys(uploadedDocuments).join(", ")} téléchargés avec succès. Statut KYC: ${kycStatus}%`,
        data: {
          uploadedTypes: Object.keys(uploadedDocuments),
          kycStatus,
        },
        read: false,
      });

      const { password, ...userResponse } = updatedUser;

      res.status(201).json({
        message: "Documents téléchargés avec succès",
        uploadedDocuments,
        user: userResponse,
        kycStatus,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get user's uploaded documents
router.get("/kyc", async (req, res, next) => {
  try {
    const user = await storage.findById("users", req.user.id);
    const documents = user.kycDocuments || {};

    // Add download URLs and metadata
    const documentsWithUrls = {};
    for (const [type, docs] of Object.entries(documents)) {
      documentsWithUrls[type] = docs.map((doc) => ({
        ...doc,
        downloadUrl: `/api/upload/download/${path.basename(doc.url)}`,
      }));
    }

    res.json({
      documents: documentsWithUrls,
      kycStatus: user.kycStatus,
      isVerified: user.isVerified,
      lastUpdate: user.lastKycUpdate,
    });
  } catch (error) {
    next(error);
  }
});

// Download document (with access control)
router.get("/download/:filename", async (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    // Check if file belongs to the user
    if (!filename.startsWith(req.user.id + "-")) {
      return res.status(403).json({
        error: "Accès non autorisé à ce fichier",
      });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        error: "Fichier non trouvé",
      });
    }

    // Send file
    res.download(filePath);
  } catch (error) {
    next(error);
  }
});

// Delete document
router.delete("/kyc/:type/:filename", async (req, res, next) => {
  try {
    const { type, filename } = req.params;

    const user = await storage.findById("users", req.user.id);
    const documents = user.kycDocuments || {};

    if (!documents[type]) {
      return res.status(404).json({
        error: "Type de document non trouvé",
      });
    }

    // Find and remove the document
    const updatedDocs = { ...documents };
    updatedDocs[type] = updatedDocs[type].filter(
      (doc) => path.basename(doc.url) !== filename,
    );

    // If no documents left of this type, remove the type
    if (updatedDocs[type].length === 0) {
      delete updatedDocs[type];
    }

    // Recalculate KYC status
    let kycStatus = 20;
    if (updatedDocs.identity) kycStatus = Math.max(kycStatus, 40);
    if (updatedDocs.address) kycStatus = Math.max(kycStatus, 60);
    if (updatedDocs.business) kycStatus = Math.max(kycStatus, 80);

    if (updatedDocs.identity && updatedDocs.address && updatedDocs.business) {
      kycStatus = 100;
    }

    // Update user
    await storage.updateById("users", req.user.id, {
      kycDocuments: updatedDocs,
      kycStatus,
      isVerified: kycStatus >= 80,
    });

    // Delete physical file
    try {
      const filePath = path.join(uploadsDir, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.log("Erreur suppression fichier:", error.message);
    }

    res.json({
      message: "Document supprimé avec succès",
      kycStatus,
    });
  } catch (error) {
    next(error);
  }
});

// Upload profile picture
router.post(
  "/profile-picture",
  upload.single("picture"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Aucun fichier fourni",
        });
      }

      const profilePicture = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
        url: `/uploads/${req.file.filename}`,
      };

      // Update user profile
      const updatedUser = await storage.updateById("users", req.user.id, {
        profilePicture,
      });

      const { password, ...userResponse } = updatedUser;

      res.status(201).json({
        message: "Photo de profil mise à jour",
        profilePicture,
        user: userResponse,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get upload statistics
router.get("/stats", async (req, res, next) => {
  try {
    const users = await storage.findMany("users", {});

    // Calculate KYC completion statistics
    const kycStats = {
      notStarted: users.filter((u) => (u.kycStatus || 0) < 40).length,
      inProgress: users.filter(
        (u) => (u.kycStatus || 0) >= 40 && (u.kycStatus || 0) < 100,
      ).length,
      completed: users.filter((u) => (u.kycStatus || 0) === 100).length,
    };

    // Document type statistics
    const docStats = {
      identity: users.filter((u) => u.kycDocuments?.identity).length,
      address: users.filter((u) => u.kycDocuments?.address).length,
      business: users.filter((u) => u.kycDocuments?.business).length,
    };

    // Calculate total storage used
    let totalStorage = 0;
    users.forEach((user) => {
      if (user.kycDocuments) {
        Object.values(user.kycDocuments).forEach((docs) => {
          docs.forEach((doc) => {
            totalStorage += doc.size || 0;
          });
        });
      }
      if (user.profilePicture) {
        totalStorage += user.profilePicture.size || 0;
      }
    });

    res.json({
      kycCompletion: kycStats,
      documentTypes: docStats,
      storage: {
        totalUsed: totalStorage,
        totalUsedMB: Math.round((totalStorage / (1024 * 1024)) * 100) / 100,
        averagePerUser:
          users.length > 0 ? Math.round(totalStorage / users.length) : 0,
      },
      recentUploads: users
        .filter((u) => u.lastKycUpdate)
        .sort((a, b) => new Date(b.lastKycUpdate) - new Date(a.lastKycUpdate))
        .slice(0, 10)
        .map((u) => ({
          userId: u.id,
          name: `${u.firstName} ${u.lastName}`,
          lastUpdate: u.lastKycUpdate,
          kycStatus: u.kycStatus,
        })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
