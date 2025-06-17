import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Storage {
  constructor() {
    this.dataDir = path.join(__dirname, "db");
    this.init();
  }

  async init() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }

    // Initialize data files
    const collections = [
      "users",
      "swaps",
      "wallets",
      "movements",
      "notifications",
    ];

    for (const collection of collections) {
      const filePath = path.join(this.dataDir, `${collection}.json`);
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
      }
    }
  }

  async read(collection) {
    try {
      const filePath = path.join(this.dataDir, `${collection}.json`);
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Erreur lecture ${collection}:`, error);
      return [];
    }
  }

  async write(collection, data) {
    try {
      const filePath = path.join(this.dataDir, `${collection}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Erreur écriture ${collection}:`, error);
      return false;
    }
  }

  async findById(collection, id) {
    const data = await this.read(collection);
    return data.find((item) => item.id === id);
  }

  async findOne(collection, query) {
    const data = await this.read(collection);
    return data.find((item) => {
      return Object.keys(query).every((key) => item[key] === query[key]);
    });
  }

  async findMany(collection, query = {}) {
    const data = await this.read(collection);
    if (Object.keys(query).length === 0) return data;

    return data.filter((item) => {
      return Object.keys(query).every((key) => {
        if (typeof query[key] === "object" && query[key].$in) {
          return query[key].$in.includes(item[key]);
        }
        return item[key] === query[key];
      });
    });
  }

  async create(collection, item) {
    const data = await this.read(collection);
    const newItem = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item,
    };
    data.push(newItem);
    await this.write(collection, data);
    return newItem;
  }

  async updateById(collection, id, updates) {
    const data = await this.read(collection);
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) return null;

    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.write(collection, data);
    return data[index];
  }

  async deleteById(collection, id) {
    const data = await this.read(collection);
    const filteredData = data.filter((item) => item.id !== id);
    await this.write(collection, filteredData);
    return filteredData.length < data.length;
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Seed initial data
  async seedData() {
    console.log("🌱 Initialisation des données de test...");

    // Create test users
    const users = await this.read("users");
    if (users.length === 0) {
      const testUsers = [
        {
          id: "user_john",
          email: "john@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "emprunteur",
          siret: "12345678901234",
          isVerified: true,
          kycStatus: 85,
          trustScore: 96,
          memberSince: "2024",
        },
        {
          id: "user_sarah",
          email: "sarah@example.com",
          firstName: "Sarah",
          lastName: "Martin",
          role: "financeur",
          siret: "98765432109876",
          isVerified: true,
          kycStatus: 100,
          trustScore: 94,
          memberSince: "2024",
        },
      ];

      for (const user of testUsers) {
        await this.create("users", user);
      }
    }

    // Create test wallets
    const wallets = await this.read("wallets");
    if (wallets.length === 0) {
      await this.create("wallets", {
        userId: "user_john",
        balance: 245890,
        monthlyLimit: 50000,
        monthlyUsed: 12400,
        pendingIn: 15000,
        pendingOut: 8500,
      });

      await this.create("wallets", {
        userId: "user_sarah",
        balance: 180000,
        monthlyLimit: 75000,
        monthlyUsed: 8900,
        pendingIn: 0,
        pendingOut: 25000,
      });
    }

    // Create test swaps
    const swaps = await this.read("swaps");
    if (swaps.length === 0) {
      const testSwaps = [
        {
          id: "SWP-001",
          userId: "user_john",
          type: "demande",
          amount: 50000,
          duration: 6,
          interestRate: 3.2,
          counterpartyId: "user_sarah",
          counterparty: "TechStart SAS",
          status: "En cours",
          progress: 75,
          trustScore: 94,
          endDate: "2024-07-15",
        },
        {
          id: "SWP-002",
          userId: "user_john",
          type: "demande",
          amount: 25000,
          duration: 3,
          interestRate: 2.8,
          counterparty: "Digital Studio Ltd",
          status: "En attente",
          progress: 25,
          trustScore: 88,
        },
      ];

      for (const swap of testSwaps) {
        await this.create("swaps", swap);
      }
    }

    console.log("✅ Données de test initialisées");
  }
}

export default new Storage();
