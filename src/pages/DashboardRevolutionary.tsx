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
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  Zap,
  Target,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Shield,
  User,
  Calendar,
  Euro,
  Percent,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Star,
  Globe,
  Smartphone,
  Briefcase,
  TrendingDown,
  DollarSign,
  Banknote,
  Building,
  FileText,
  Settings,
  HelpCircle,
  MessageCircle,
  Send,
  Copy,
  ExternalLink,
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
  description?: string;
  matchingScore?: number;
}

const DashboardRevolutionary = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [showCreateSwap, setShowCreateSwap] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
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

    // Auto-rotate insights
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
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
          description: "Financement pour expansion",
          matchingScore: 94,
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

        const createdSwap: Swap = {
          ...data.swap,
          counterparty: "En recherche de match",
          status: "Actif",
          progress: 0,
          matchingScore: Math.floor(Math.random() * 20) + 80,
        };

        setSwaps([createdSwap, ...swaps]);
        setShowCreateSwap(false);
        setNewSwap({ type: "", amount: "", duration: "", description: "" });
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace...</p>
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

  const insights = [
    {
      title: "Opportunité détectée",
      description: "3 nouveaux swaps correspondent à votre profil",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Performance excellente",
      description: `Votre trust score de ${user.trustScore || 85}% vous place dans le top 10%`,
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Rendement optimisé",
      description: "Vos swaps génèrent 4.2% APY en moyenne",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const currentInsight = insights[activeInsight];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Subtle animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navigation */}
      <div className="relative z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Swapeo</h1>
                  <p className="text-xs text-gray-500">
                    {user.role} • ID: {user.id?.slice(-6)}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-1">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Swaps
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Analytics
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {message && (
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    message.includes("✅")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <Settings className="h-5 w-5" />
              </Button>

              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white font-medium text-sm">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bonjour {user.firstName} 👋
              </h1>
              <p className="text-gray-600">
                Voici un aperçu de vos finances Swapeo aujourd'hui
              </p>
            </div>

            <Button
              onClick={() => setShowCreateSwap(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nouveau Swap
            </Button>
          </div>

          {/* Smart Insight Card - Revolut Style */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-3xl border-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <currentInsight.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {currentInsight.title}
                  </h3>
                  <p className="text-blue-100">{currentInsight.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/70" />
            </div>

            {/* Insight indicators */}
            <div className="flex space-x-2 mt-4">
              {insights.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeInsight
                      ? "w-8 bg-white"
                      : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Balance Card - Coinbase Style */}
          <Card className="lg:col-span-2 bg-white rounded-3xl border-0 shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Solde total
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHideBalance(!hideBalance)}
                className="text-gray-500 hover:text-gray-700 rounded-full"
              >
                {hideBalance ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {hideBalance
                  ? "••••••"
                  : `${walletData.balance.toLocaleString()} €`}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-medium">+2.43%</span>
                </div>
                <span className="text-gray-500">ce mois</span>
              </div>
            </div>

            {/* Action Buttons - Revolut Style */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button
                onClick={handleDeposit}
                className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-medium"
              >
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Déposer
              </Button>
              <Button
                onClick={handleWithdraw}
                variant="outline"
                className="border-2 border-gray-200 hover:border-gray-300 py-4 rounded-2xl font-medium"
              >
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Retirer
              </Button>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {swaps.length}
                </div>
                <div className="text-sm text-gray-600">Swaps actifs</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  4.2%
                </div>
                <div className="text-sm text-gray-600">APY moyen</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {user.trustScore || 85}%
                </div>
                <div className="text-sm text-gray-600">Trust Score</div>
              </div>
            </div>
          </Card>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-white rounded-3xl border-0 shadow-xl p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">KYC Status</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">Vérifié</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rôle</span>
                  <Badge
                    className={
                      user.role === "emprunteur"
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : "bg-green-100 text-green-700 border-green-200"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trust Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${user.trustScore || 85}%` }}
                      />
                    </div>
                    <span className="font-medium text-gray-900">
                      {user.trustScore || 85}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white rounded-3xl border-0 shadow-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50 p-3 rounded-xl"
                >
                  <Search className="mr-3 h-4 w-4" />
                  Rechercher des matches
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50 p-3 rounded-xl"
                >
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Voir les analytics
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50 p-3 rounded-xl"
                >
                  <FileText className="mr-3 h-4 w-4" />
                  Exporter les données
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-50 p-3 rounded-xl"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Create Swap Modal */}
        {showCreateSwap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCreateSwap(false)}
            />
            <Card className="relative bg-white rounded-3xl border-0 shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Créer un nouveau swap
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateSwap(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-gray-700 font-medium">
                    Type de swap
                  </Label>
                  <Select
                    value={newSwap.type}
                    onValueChange={(value) =>
                      setNewSwap({ ...newSwap, type: value })
                    }
                  >
                    <SelectTrigger className="mt-2 border-2 border-gray-200 rounded-xl py-3">
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demande">
                        💰 Demande de financement
                      </SelectItem>
                      <SelectItem value="offre">
                        🏦 Offre de financement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Montant (€)
                    </Label>
                    <Input
                      type="number"
                      placeholder="50 000"
                      value={newSwap.amount}
                      onChange={(e) =>
                        setNewSwap({ ...newSwap, amount: e.target.value })
                      }
                      className="mt-2 border-2 border-gray-200 rounded-xl py-3"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Durée (mois)
                    </Label>
                    <Input
                      type="number"
                      placeholder="6"
                      value={newSwap.duration}
                      onChange={(e) =>
                        setNewSwap({ ...newSwap, duration: e.target.value })
                      }
                      className="mt-2 border-2 border-gray-200 rounded-xl py-3"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Décrivez votre besoin ou offre de financement..."
                    value={newSwap.description}
                    onChange={(e) =>
                      setNewSwap({ ...newSwap, description: e.target.value })
                    }
                    className="mt-2 border-2 border-gray-200 rounded-xl h-32 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateSwap(false)}
                    className="border-2 border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateSwap}
                    disabled={
                      !newSwap.type || !newSwap.amount || !newSwap.duration
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le swap
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Swaps Section */}
        <Card className="mt-8 bg-white rounded-3xl border-0 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Vos swaps ({swaps.length})
            </h2>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="border-2 border-gray-200 hover:border-gray-300 rounded-xl"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setShowCreateSwap(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau
              </Button>
            </div>
          </div>

          {swaps.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun swap pour le moment
              </h3>
              <p className="text-gray-600 mb-6">
                Créez votre premier swap pour commencer à échanger avec d'autres
                entreprises
              </p>
              <Button
                onClick={() => setShowCreateSwap(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Créer votre premier swap
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {swaps.map((swap, index) => (
                <div
                  key={swap.id || index}
                  className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          swap.type === "emprunt" || swap.type === "demande"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        {swap.type === "emprunt" || swap.type === "demande" ? (
                          <ArrowDownRight className="h-6 w-6 text-blue-600" />
                        ) : (
                          <ArrowUpRight className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {swap.id}
                        </h3>
                        <p className="text-gray-600">{swap.counterparty}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {swap.amount.toLocaleString()}€
                      </div>
                      <Badge
                        className={
                          swap.status === "En cours" || swap.status === "Actif"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : swap.status === "En attente"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-green-100 text-green-700 border-green-200"
                        }
                      >
                        {swap.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Durée:</span>
                      <span className="text-gray-900 font-medium ml-2">
                        {swap.duration} mois
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Taux:</span>
                      <span className="text-gray-900 font-medium ml-2">
                        {swap.interestRate || 3.5}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Match:</span>
                      <span className="text-gray-900 font-medium ml-2">
                        {swap.matchingScore || 85}%
                      </span>
                    </div>
                  </div>

                  {swap.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {swap.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${swap.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {swap.progress || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardRevolutionary;
