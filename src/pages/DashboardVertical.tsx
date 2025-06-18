import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Wallet,
  Clock,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  LogOut,
  Eye,
  Filter,
  Search,
  Check,
  X,
  Upload,
  Download,
  Zap,
  Target,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  FileText,
  Shield,
  User,
  Calendar,
  Euro,
  Percent,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import InteractiveLogo from "@/components/InteractiveLogo";
import DynamicBackground from "@/components/DynamicBackground";

interface Swap {
  id: string;
  type: "emprunt" | "prêt" | "demande" | "offre";
  amount: number;
  duration: number;
  interestRate: number;
  counterparty: string;
  status: string;
  progress: number;
  createdAt: string;
  endDate?: string;
  trustScore: number;
  description?: string;
}

const DashboardVertical = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [showCreateSwap, setShowCreateSwap] = useState(false);
  const [newSwap, setNewSwap] = useState({
    type: "",
    amount: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("swapeo_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      loadSwaps();
    } else {
      window.location.href = "/login";
    }
    setLoading(false);
  }, []);

  const loadSwaps = async () => {
    try {
      const response = await fetch("https://swapeo.netlify.app/api/swaps", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSwaps(data.swaps || []);
      }
    } catch (error) {
      console.log("Erreur chargement swaps:", error);
      // Utiliser des données par défaut
      setSwaps([
        {
          id: "SWP-001",
          type: "emprunt",
          amount: 50000,
          duration: 6,
          interestRate: 3.2,
          counterparty: "TechStart SAS",
          status: "En cours",
          progress: 75,
          createdAt: "2024-01-15",
          endDate: "2024-07-15",
          trustScore: 94,
          description: "Financement pour expansion",
        },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("swapeo_token");
    localStorage.removeItem("swapeo_user");
    setMessage("À bientôt !");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleDeposit = async () => {
    try {
      const response = await fetch(
        "https://swapeo.netlify.app/api/wallet/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
          },
          body: JSON.stringify({ amount: 10000 }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        const updatedUser = { ...user };
        if (!updatedUser.wallet) updatedUser.wallet = { balance: 0 };
        updatedUser.wallet.balance = data.newBalance;
        setUser(updatedUser);
        localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ ${data.error}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Erreur lors du dépôt");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await fetch(
        "https://swapeo.netlify.app/api/wallet/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
          },
          body: JSON.stringify({ amount: 5000 }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        const updatedUser = { ...user };
        if (!updatedUser.wallet) updatedUser.wallet = { balance: 0 };
        updatedUser.wallet.balance = data.newBalance;
        setUser(updatedUser);
        localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ ${data.error}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Erreur lors du retrait");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCreateSwap = async () => {
    try {
      const response = await fetch("https://swapeo.netlify.app/api/swaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
        },
        body: JSON.stringify({
          type: newSwap.type,
          amount: parseInt(newSwap.amount),
          duration: parseInt(newSwap.duration),
          description: newSwap.description,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${data.message}`);

        // Ajouter le nouveau swap à la liste
        const createdSwap: Swap = {
          ...data.swap,
          counterparty: "En recherche",
          status: "Actif",
          progress: 0,
          trustScore: user.trustScore || 85,
        };

        setSwaps([createdSwap, ...swaps]);
        setShowCreateSwap(false);
        setNewSwap({ type: "", amount: "", duration: "", description: "" });
        setActiveTab("swaps");

        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ ${data.error}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Erreur lors de la création");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen swapeo-gradient flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const walletData = user?.wallet || {
    balance: 25000,
    totalDeposited: 50000,
    totalWithdrawn: 25000,
  };

  return (
    <div className="min-h-screen swapeo-gradient relative">
      <DynamicBackground />

      {/* Header */}
      <div className="relative z-20 border-b border-swapeo-slate/30 swapeo-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <InteractiveLogo />
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="mr-2 h-6 w-6 text-swapeo-primary animate-pulse" />
                  Dashboard Swapeo
                </h1>
                <p className="text-swapeo-accent">
                  Bienvenue {user.firstName} {user.lastName} - {user.role}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {message && (
                <div
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    message.includes("✅")
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-swapeo-accent hover:text-white"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="swapeo-button-outline"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Layout Vertical */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Gauche */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profil Card */}
            <Card className="swapeo-card p-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-swapeo-primary to-swapeo-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-swapeo-accent text-sm">{user.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-swapeo-accent text-sm">Statut KYC</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm">Vérifié</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-swapeo-accent text-sm">
                    Trust Score
                  </span>
                  <span className="text-swapeo-primary font-semibold">
                    {user.trustScore || 85}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-swapeo-accent text-sm">Rôle</span>
                  <Badge
                    className={
                      user.role === "emprunteur"
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        : "bg-green-500/20 text-green-400 border-green-500/30"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Wallet Card */}
            <Card className="swapeo-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Mon Wallet</h3>
                <Wallet className="h-5 w-5 text-swapeo-primary" />
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-1">
                  {walletData.balance.toLocaleString()} €
                </div>
                <div className="text-swapeo-accent text-sm">
                  Solde disponible
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button
                  className="w-full swapeo-button"
                  onClick={handleDeposit}
                >
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Déposer (10k€)
                </Button>
                <Button
                  variant="outline"
                  className="w-full swapeo-button-outline"
                  onClick={handleWithdraw}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Retirer (5k€)
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-swapeo-accent">Total déposé</span>
                  <span className="text-green-400 font-medium">
                    +{(walletData.totalDeposited || 0).toLocaleString()}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-swapeo-accent">Total retiré</span>
                  <span className="text-red-400 font-medium">
                    -{(walletData.totalWithdrawn || 0).toLocaleString()}€
                  </span>
                </div>
              </div>
            </Card>

            {/* Stats rapides */}
            <Card className="swapeo-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-swapeo-accent text-sm">
                      Swaps actifs
                    </span>
                  </div>
                  <span className="text-white font-semibold">
                    {swaps.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="text-swapeo-accent text-sm">
                      En attente
                    </span>
                  </div>
                  <span className="text-white font-semibold">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Euro className="h-4 w-4 text-swapeo-primary" />
                    <span className="text-swapeo-accent text-sm">Volume</span>
                  </div>
                  <span className="text-white font-semibold">127K€</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Contenu Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Actions Rapides */}
            <Card className="swapeo-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-swapeo-primary animate-pulse" />
                Actions Rapides
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="swapeo-button h-16"
                  onClick={() => setShowCreateSwap(true)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Nouveau Swap
                </Button>
                <Button
                  variant="outline"
                  className="swapeo-button-outline h-16"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher
                </Button>
                <Button
                  variant="outline"
                  className="swapeo-button-outline h-16"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Matching
                </Button>
                <Button
                  variant="outline"
                  className="swapeo-button-outline h-16"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
              </div>
            </Card>

            {/* Création de Swap Modal */}
            {showCreateSwap && (
              <Card className="swapeo-card p-6 border-swapeo-primary/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Plus className="mr-2 h-5 w-5 text-swapeo-primary" />
                  Créer un Nouveau Swap
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-swapeo-accent">Type de swap</Label>
                      <Select
                        value={newSwap.type}
                        onValueChange={(value) =>
                          setNewSwap({ ...newSwap, type: value })
                        }
                      >
                        <SelectTrigger className="bg-swapeo-navy border-swapeo-slate/30 text-white">
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="demande">
                            Demande de financement
                          </SelectItem>
                          <SelectItem value="offre">
                            Offre de financement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-swapeo-accent">Montant (€)</Label>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={newSwap.amount}
                        onChange={(e) =>
                          setNewSwap({ ...newSwap, amount: e.target.value })
                        }
                        className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label className="text-swapeo-accent">Durée (mois)</Label>
                      <Input
                        type="number"
                        placeholder="6"
                        value={newSwap.duration}
                        onChange={(e) =>
                          setNewSwap({ ...newSwap, duration: e.target.value })
                        }
                        className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-swapeo-accent">Description</Label>
                    <Textarea
                      placeholder="Décrivez votre besoin ou offre de financement..."
                      value={newSwap.description}
                      onChange={(e) =>
                        setNewSwap({ ...newSwap, description: e.target.value })
                      }
                      className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 h-32"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    variant="outline"
                    className="swapeo-button-outline"
                    onClick={() => setShowCreateSwap(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="swapeo-button"
                    onClick={handleCreateSwap}
                    disabled={
                      !newSwap.type || !newSwap.amount || !newSwap.duration
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le Swap
                  </Button>
                </div>
              </Card>
            )}

            {/* Liste des Swaps */}
            <Card className="swapeo-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-swapeo-primary animate-pulse" />
                  Mes Swaps ({swaps.length})
                </h3>
                <Button
                  variant="outline"
                  className="swapeo-button-outline"
                  onClick={() => setShowCreateSwap(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau
                </Button>
              </div>

              <div className="space-y-4">
                {swaps.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-swapeo-accent mb-4">
                      Aucun swap pour le moment
                    </div>
                    <Button
                      className="swapeo-button"
                      onClick={() => setShowCreateSwap(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Créer votre premier swap
                    </Button>
                  </div>
                ) : (
                  swaps.map((swap, index) => (
                    <div
                      key={swap.id || index}
                      className="p-4 bg-swapeo-navy/50 rounded-lg border border-swapeo-slate/20 hover:border-swapeo-primary/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-white font-semibold text-lg">
                            {swap.id}
                          </div>
                          <div className="text-swapeo-accent text-sm">
                            {swap.counterparty}
                          </div>
                        </div>
                        <Badge
                          className={
                            swap.status === "En cours" ||
                            swap.status === "Actif"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : swap.status === "En attente"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-green-500/20 text-green-400 border-green-500/30"
                          }
                        >
                          {swap.status}
                        </Badge>
                      </div>

                      <div className="text-2xl font-bold text-white mb-2">
                        {swap.amount.toLocaleString()}€
                      </div>

                      <div className="text-sm text-swapeo-accent mb-3">
                        <span className="mr-4">📅 {swap.duration} mois</span>
                        <span className="mr-4">
                          📈 {swap.interestRate || 3.5}%
                        </span>
                        <span>🛡️ Trust: {swap.trustScore}%</span>
                      </div>

                      {swap.description && (
                        <div className="text-swapeo-accent text-sm mb-3">
                          {swap.description}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <Progress
                          value={swap.progress || 0}
                          className="flex-1 mr-4 h-2"
                        />
                        <span className="text-swapeo-accent text-sm">
                          {swap.progress || 0}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardVertical;
