// SwapService - Service de gestion des swaps marketplace
export interface MarketplaceSwap {
  id: string;
  type: "demande" | "offre";
  amount: number;
  duration: number; // en mois
  rate: number; // taux d'intérêt
  description: string;
  purpose?: string;
  guarantees?: string;
  category?: string;
  riskLevel: "low" | "medium" | "high";
  createdById: string;
  createdByCompany: string;
  trustScore: number; // 0-100
  createdAt: Date;
  public: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  algorithmScore?: number; // 0-100
  matchingScore?: number; // 0-100
}

class SwapServiceClass {
  private swaps: MarketplaceSwap[] = [];

  constructor() {
    this.initializeDefaultSwaps();
  }

  private initializeDefaultSwaps() {
    // Quelques swaps par défaut pour démonstration
    this.swaps = [
      {
        id: "swap_demo_1",
        type: "offre",
        amount: 15000,
        duration: 12,
        rate: 3.5,
        description: "Financement pour expansion commerciale",
        purpose: "Expansion commerciale",
        guarantees: "Garantie sur chiffre d'affaires",
        category: "Énergie",
        riskLevel: "low",
        createdById: "user_demo_1",
        createdByCompany: "TechStart Solutions",
        trustScore: 92,
        createdAt: new Date("2024-03-01"),
        public: true,
        approvalStatus: "approved",
        algorithmScore: 87,
        matchingScore: 94,
      },
      {
        id: "swap_demo_2",
        type: "demande",
        amount: 25000,
        duration: 18,
        rate: 4.2,
        description: "Besoin de liquidités pour développement",
        purpose: "Fonds de roulement",
        guarantees: "Caution solidaire dirigeants",
        category: "Restauration",
        riskLevel: "medium",
        createdById: "user_demo_2",
        createdByCompany: "GreenEnergy Corp",
        trustScore: 88,
        createdAt: new Date("2024-03-10"),
        public: true,
        approvalStatus: "approved",
        algorithmScore: 84,
        matchingScore: 89,
      },
      {
        id: "swap_demo_3",
        type: "offre",
        amount: 8000,
        duration: 6,
        rate: 2.8,
        description: "Prêt court terme pour startup",
        purpose: "Développement produit",
        guarantees: "Nantissement fonds de commerce",
        category: "Technology",
        riskLevel: "high",
        createdById: "user_demo_3",
        createdByCompany: "RestaurantChain Plus",
        trustScore: 76,
        createdAt: new Date("2024-01-15"),
        public: true,
        approvalStatus: "approved",
        algorithmScore: 79,
        matchingScore: 82,
      },
    ];
  }

  // Récupérer tous les swaps publics approuvés
  getMarketplaceSwaps(): MarketplaceSwap[] {
    return this.swaps.filter(
      (swap) => swap.public && swap.approvalStatus === "approved",
    );
  }

  // Ajouter un nouveau swap au marketplace
  async addSwapToMarketplace(
    swapData: Omit<
      MarketplaceSwap,
      "id" | "createdAt" | "approvalStatus" | "algorithmScore"
    >,
  ): Promise<string> {
    const newSwap: MarketplaceSwap = {
      ...swapData,
      id: `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      approvalStatus: "pending",
      algorithmScore: 0,
    };

    this.swaps.push(newSwap);
    return newSwap.id;
  }

  // Démarrer le processus d'approbation algorithmique
  async startApprovalProcess(swapId: string): Promise<void> {
    const swap = this.swaps.find((s) => s.id === swapId);
    if (!swap) {
      throw new Error("Swap non trouvé");
    }

    // Simulation d'analyse algorithmique
    const score = this.calculateAlgorithmScore(swap);
    swap.algorithmScore = score;

    // Auto-approval pour tous les swaps (comme demandé)
    swap.approvalStatus = "approved";
    swap.public = true;
  }

  // Calculer le score algorithmique
  private calculateAlgorithmScore(swap: MarketplaceSwap): number {
    let score = 0;

    // Score basé sur le trust score (30%)
    score += (swap.trustScore / 100) * 30;

    // Score basé sur la complétude des données (50%)
    let completeness = 0;
    if (swap.description && swap.description.length > 10) completeness += 20;
    if (swap.purpose) completeness += 15;
    if (swap.guarantees) completeness += 15;
    score += completeness;

    // Score basé sur les paramètres optimaux (20%)
    if (swap.amount >= 1000 && swap.amount <= 1000000) score += 10;
    if (swap.duration >= 1 && swap.duration <= 60) score += 5;
    if (swap.rate >= 0.5 && swap.rate <= 15) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  // Accepter un swap (le retirer du marketplace)
  acceptSwap(swapId: string): boolean {
    const swapIndex = this.swaps.findIndex((s) => s.id === swapId);
    if (swapIndex === -1) return false;

    this.swaps.splice(swapIndex, 1);
    return true;
  }

  // Filtrer les swaps
  filterSwaps(filters: {
    type?: "demande" | "offre";
    minAmount?: number;
    maxAmount?: number;
    maxDuration?: number;
    category?: string;
    riskLevel?: "low" | "medium" | "high";
  }): MarketplaceSwap[] {
    let filtered = this.getMarketplaceSwaps();

    if (filters.type) {
      filtered = filtered.filter((swap) => swap.type === filters.type);
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter((swap) => swap.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter((swap) => swap.amount <= filters.maxAmount!);
    }

    if (filters.maxDuration !== undefined) {
      filtered = filtered.filter(
        (swap) => swap.duration <= filters.maxDuration!,
      );
    }

    if (filters.category) {
      filtered = filtered.filter((swap) => swap.category === filters.category);
    }

    if (filters.riskLevel) {
      filtered = filtered.filter(
        (swap) => swap.riskLevel === filters.riskLevel,
      );
    }

    return filtered;
  }

  // Obtenir un swap par ID
  getSwapById(swapId: string): MarketplaceSwap | undefined {
    return this.swaps.find((swap) => swap.id === swapId);
  }

  // Mettre à jour un swap
  updateSwap(swapId: string, updates: Partial<MarketplaceSwap>): boolean {
    const swapIndex = this.swaps.findIndex((s) => s.id === swapId);
    if (swapIndex === -1) return false;

    this.swaps[swapIndex] = { ...this.swaps[swapIndex], ...updates };
    return true;
  }

  // Obtenir les statistiques du marketplace
  getMarketplaceStats() {
    const allSwaps = this.getMarketplaceSwaps();
    const offers = allSwaps.filter((s) => s.type === "offre");
    const demands = allSwaps.filter((s) => s.type === "demande");

    return {
      totalSwaps: allSwaps.length,
      totalOffers: offers.length,
      totalDemands: demands.length,
      totalAmount: allSwaps.reduce((sum, swap) => sum + swap.amount, 0),
      averageRate:
        allSwaps.length > 0
          ? allSwaps.reduce((sum, swap) => sum + swap.rate, 0) / allSwaps.length
          : 0,
      averageDuration:
        allSwaps.length > 0
          ? allSwaps.reduce((sum, swap) => sum + swap.duration, 0) /
            allSwaps.length
          : 0,
    };
  }
}

// Instance singleton du service
export const SwapService = new SwapServiceClass();

// Export par défaut
export default SwapService;
