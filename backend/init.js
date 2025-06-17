import storage from "./data/storage.js";

async function initializeBackend() {
  console.log("🚀 Initialisation du backend Swapeo...");

  try {
    // Initialize storage system
    await storage.init();

    // Seed test data
    await storage.seedData();

    console.log("✅ Backend initialisé avec succès !");
    console.log("📊 Données de test créées");
    console.log("🔗 Prêt à recevoir les connexions");

    // Display test credentials
    console.log("\n🔐 Comptes de test disponibles :");
    console.log("📧 john@example.com / password123");
    console.log("📧 sarah@example.com / password123");

    console.log("\n🌐 Endpoints principaux :");
    console.log("- Health: GET /health");
    console.log("- Auth: POST /api/auth/login");
    console.log("- Swaps: GET /api/swaps");
    console.log("- Wallet: GET /api/wallet");
  } catch (error) {
    console.error("❌ Erreur initialisation:", error);
    process.exit(1);
  }
}

// Run initialization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeBackend();
}

export default initializeBackend;
