import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
}

interface Movement {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "pending" | "completed" | "failed";
  swapId?: string;
}

const DashboardFixed = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Récupérer l'utilisateur depuis localStorage
    const savedUser = localStorage.getItem("swapeo_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Rediriger vers login si pas connecté
      window.location.href = "/login";
    }
    setLoading(false);
  }, []);

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
        // Mettre à jour l'utilisateur local
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
        // Mettre à jour l'utilisateur local
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

  // Utiliser les données du wallet de l'utilisateur
  const walletData = user?.wallet || {
    balance: 25000,
    totalDeposited: 50000,
    totalWithdrawn: 25000,
  };

  const swaps: Swap[] = [
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
    },
    {
      id: "SWP-002",
      type: "prêt",
      amount: 25000,
      duration: 3,
      interestRate: 2.8,
      counterparty: "Digital Studio Ltd",
      status: "En attente",
      progress: 25,
      createdAt: "2024-01-20",
      trustScore: 88,
    },
  ];

  const movements: Movement[] = [
    {
      id: "MOV-001",
      type: "credit",
      amount: 50000,
      description: "Swap avec TechStart SAS",
      date: "2024-01-15",
      status: "completed",
      swapId: "SWP-001",
    },
    {
      id: "MOV-002",
      type: "debit",
      amount: 1250,
      description: "Frais Swapeo (2.5%)",
      date: "2024-01-15",
      status: "completed",
      swapId: "SWP-001",
    },
  ];

  const stats = [
    {
      title: "Solde Total",
      value: `${walletData.balance.toLocaleString()}€`,
      change: "+2.43% ce mois",
      icon: Wallet,
      color: "text-swapeo-primary",
    },
    {
      title: "Swaps Actifs",
      value: "3",
      change: "+1 cette semaine",
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      title: "Trust Score",
      value: `${user.trustScore || 85}%`,
      change: "+5 pts ce mois",
      icon: Shield,
      color: "text-blue-400",
    },
    {
      title: "Rendement",
      value: "4.2%",
      change: "APR moyen",
      icon: Target,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen swapeo-gradient relative">
      <DynamicBackground />

      {/* Header */}
      <div className="relative z-20 border-b border-swapeo-slate/30 glass-effect">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <InteractiveLogo />
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="mr-2 h-6 w-6 text-swapeo-primary animate-pulse" />
                  Dashboard Swapeo
                </h1>
                <p className="text-gray-400">
                  Bienvenue {user.firstName} {user.lastName} - {user.role}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {message && (
                <div
                  className={`px-3 py-1 rounded text-sm ${
                    message.includes("✅")
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="glass-effect neon-border"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-5 glass-effect">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="swaps">Swaps</TabsTrigger>
            <TabsTrigger value="matching">Matching</TabsTrigger>
            <TabsTrigger value="settings">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="swapeo-card p-6 group hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-swapeo-navy">
                      <stat.icon
                        className={`h-6 w-6 ${stat.color} animate-pulse`}
                      />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-swapeo-primary transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">{stat.title}</div>
                  <div className="text-xs text-swapeo-primary">
                    {stat.change}
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="swapeo-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-swapeo-primary animate-pulse" />
                Actions Rapides
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="swapeo-button h-16" onClick={handleDeposit}>
                  <ArrowDownRight className="mr-2 h-5 w-5" />
                  Déposer
                </Button>
                <Button className="swapeo-button h-16" onClick={handleWithdraw}>
                  <ArrowUpRight className="mr-2 h-5 w-5" />
                  Retirer
                </Button>
                <Button variant="outline" className="glass-effect h-16">
                  <Plus className="mr-2 h-5 w-5" />
                  Nouveau Swap
                </Button>
                <Button variant="outline" className="glass-effect h-16">
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-8">
            {/* Wallet Overview */}
            <Card className="swapeo-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-swapeo-primary" />
                Mon Wallet
              </h3>

              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-white mb-2">
                  {walletData.balance.toLocaleString()} €
                </div>
                <div className="text-gray-400">Solde disponible</div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <Button
                  className="swapeo-button h-16 text-lg"
                  onClick={handleDeposit}
                >
                  <ArrowDownRight className="mr-2 h-6 w-6" />
                  Déposer (10 000€)
                </Button>
                <Button
                  variant="outline"
                  className="glass-effect h-16 text-lg"
                  onClick={handleWithdraw}
                >
                  <ArrowUpRight className="mr-2 h-6 w-6" />
                  Retirer (5 000€)
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    +{(walletData.totalDeposited || 0).toLocaleString()}€
                  </div>
                  <div className="text-gray-400 text-sm">Total déposé</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    -{(walletData.totalWithdrawn || 0).toLocaleString()}€
                  </div>
                  <div className="text-gray-400 text-sm">Total retiré</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="swaps" className="space-y-8">
            <Card className="swapeo-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Activity className="mr-2 h-5 w-5 text-swapeo-primary" />
                Mes Swaps
              </h3>

              <div className="space-y-4">
                {swaps.map((swap) => (
                  <div
                    key={swap.id}
                    className="p-4 glass-effect rounded-lg border border-swapeo-slate/20"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-white font-semibold">
                          {swap.id}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {swap.counterparty}
                        </div>
                      </div>
                      <Badge
                        className={
                          swap.status === "En cours"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {swap.status}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {swap.amount.toLocaleString()}€
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      {swap.duration} mois • {swap.interestRate}% • Trust Score:{" "}
                      {swap.trustScore}%
                    </div>
                    <Progress value={swap.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="matching" className="space-y-8">
            <Card className="swapeo-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Users className="mr-2 h-5 w-5 text-swapeo-primary" />
                Matching Intelligent
              </h3>
              <div className="text-center py-8">
                <div className="text-gray-400">
                  Fonctionnalité de matching disponible bientôt !
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <Card className="swapeo-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <User className="mr-2 h-5 w-5 text-swapeo-primary" />
                Mon Profil
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Prénom</label>
                    <div className="text-white">{user.firstName}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Nom</label>
                    <div className="text-white">{user.lastName}</div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <div className="text-white">{user.email}</div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm">Rôle</label>
                  <div className="text-white">
                    <Badge
                      className={
                        user.role === "emprunteur"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-green-500/20 text-green-400"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm">Statut KYC</label>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Vérifié</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardFixed;
