import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, users, wallet, swaps } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Settings,
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
  type: "emprunt" | "prêt" | "offre" | "demande";
  amount: number;
  duration: number;
  interestRate: number;
  counterparty: string;
  status:
    | "En recherche"
    | "Trouvé"
    | "Accepté"
    | "En cours"
    | "Terminé"
    | "Rejeté";
  progress: number;
  createdAt: string;
  endDate?: string;
  trustScore?: number;
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

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
        updatedUser.wallet.balance = data.newBalance;
        setUser(updatedUser);
        localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Erreur lors du dépôt");
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
        updatedUser.wallet.balance = data.newBalance;
        setUser(updatedUser);
        localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Erreur lors du retrait");
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

  const [wallet] = useState({
    balance: 245890,
    monthlyChange: 2.43,
    monthlyLimit: 50000,
    monthlyUsed: 12400,
    pendingIn: 15000,
    pendingOut: 8500,
  });

  const [swaps] = useState<Swap[]>([
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
    {
      id: "SWP-003",
      type: "emprunt",
      amount: 75000,
      duration: 12,
      interestRate: 3.6,
      counterparty: "InnoTech SA",
      status: "Terminé",
      progress: 100,
      createdAt: "2023-12-01",
      endDate: "2024-12-01",
      trustScore: 98,
    },
  ]);

  const [movements] = useState<Movement[]>([
    {
      id: "MOV-001",
      type: "credit",
      amount: 15000,
      description: "Paiement swap SWP-001 - VendorX SA",
      date: "2024-01-18",
      status: "completed",
      swapId: "SWP-001",
    },
    {
      id: "MOV-002",
      type: "debit",
      amount: 30000,
      description: "Swap SWP-001 - TechOne SAS",
      date: "2024-01-17",
      status: "completed",
      swapId: "SWP-001",
    },
    {
      id: "MOV-003",
      type: "credit",
      amount: 100000,
      description: "Dépôt initial",
      date: "2024-01-15",
      status: "completed",
    },
  ]);

  const [availableSwaps] = useState<Swap[]>([
    {
      id: "AVAIL-001",
      type: "offre",
      amount: 30000,
      duration: 4,
      interestRate: 2.9,
      counterparty: "Entrepreneur A",
      status: "En recherche",
      progress: 0,
      createdAt: "2024-01-22",
      trustScore: 89,
    },
    {
      id: "AVAIL-002",
      type: "demande",
      amount: 45000,
      duration: 6,
      interestRate: 3.4,
      counterparty: "Entrepreneur B",
      status: "En recherche",
      progress: 0,
      createdAt: "2024-01-21",
      trustScore: 92,
    },
    {
      id: "AVAIL-003",
      type: "offre",
      amount: 20000,
      duration: 2,
      interestRate: 2.5,
      counterparty: "Entrepreneur C",
      status: "En recherche",
      progress: 0,
      createdAt: "2024-01-20",
      trustScore: 86,
    },
  ]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isVisible, setIsVisible] = useState(false);
  const [newSwap, setNewSwap] = useState({
    type: "demande" as "demande" | "offre",
    amount: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const calculateSwapDetails = (
    amount: number,
    duration: number,
    rate: number,
  ) => {
    const interest = (amount * rate * duration) / 100 / 12;
    const platformFee = amount * 0.01;
    const total = amount + interest + platformFee;
    return { interest, platformFee, total };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminé":
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "En cours":
      case "Accepté":
        return "bg-swapeo-primary/20 text-swapeo-primary";
      case "En attente":
      case "En recherche":
        return "bg-yellow-500/20 text-yellow-400";
      case "Rejeté":
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const stats = [
    {
      title: "Swaps Actifs",
      value: swaps.filter((s) => s.status === "En cours").length,
      change: "+2 ce mois",
      icon: TrendingUp,
      color: "text-swapeo-primary",
      bgColor: "bg-swapeo-primary/20",
    },
    {
      title: "Volume Total",
      value: `${(swaps.reduce((acc, s) => acc + s.amount, 0) / 1000).toFixed(1)}K€`,
      change: "+12% ce mois",
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Participants",
      value: new Set(swaps.map((s) => s.counterparty)).size,
      change: "+6 ce mois",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Taux Moyen",
      value: `${(swaps.reduce((acc, s) => acc + s.interestRate, 0) / swaps.length).toFixed(1)}%`,
      change: "-0.2% ce mois",
      icon: Percent,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
  ];

  return (
    <div className="min-h-screen swapeo-gradient relative overflow-hidden">
      <DynamicBackground />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-72 h-full glass-effect border-r border-swapeo-slate/20 z-40 backdrop-blur-xl">
        {/* Logo */}
        <div className="p-6 border-b border-swapeo-slate/20">
          <InteractiveLogo
            size="md"
            showText={true}
            className="animate-slide-in-from-left"
          />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {[
            {
              id: "dashboard",
              icon: TrendingUp,
              label: "Dashboard",
              badge: null,
            },
            {
              id: "create-swap",
              icon: Plus,
              label: "Créer un Swap",
              badge: "Nouveau",
            },
            {
              id: "matching",
              icon: Target,
              label: "Matching",
              badge: availableSwaps.length,
            },
            { id: "swaps", icon: Activity, label: "Mes Swaps", badge: null },
            { id: "wallet", icon: Wallet, label: "Wallet", badge: null },
            {
              id: "profile",
              icon: User,
              label: "Profil",
              badge: user.kycStatus < 100 ? "!" : null,
            },
            {
              id: "notifications",
              icon: Bell,
              label: "Notifications",
              badge: "3",
            },
            {
              id: "settings",
              icon: Settings,
              label: "Paramètres",
              badge: null,
            },
          ].map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group
                animate-slide-in-from-left hover-lift
                ${
                  activeTab === item.id
                    ? "bg-swapeo-primary/20 text-swapeo-primary neon-border"
                    : "text-gray-300 hover:bg-swapeo-navy-light hover:text-white"
                }
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center space-x-3">
                <item.icon
                  className={`h-5 w-5 ${activeTab === item.id ? "animate-pulse" : "group-hover:animate-pulse"}`}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  className={`
                  ${item.badge === "!" ? "bg-red-500" : "bg-swapeo-primary"}
                  text-white text-xs animate-pulse
                `}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="swapeo-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-swapeo-primary to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user.firstName[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{user.firstName}</div>
                <div className="text-gray-400 text-sm">{user.role}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 min-h-screen relative z-10">
        {/* Header */}
        <header className="glass-effect border-b border-swapeo-slate/20 p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <div
              className={`transition-all duration-1000 ${isVisible ? "animate-slide-in-from-left" : "opacity-0"}`}
            >
              <h1 className="text-3xl font-bold text-white mb-1 flex items-center">
                Bienvenue, {user.firstName}
                <Sparkles className="ml-2 h-6 w-6 text-swapeo-primary animate-spin-slow" />
              </h1>
              <p className="text-gray-400">
                Voici un aperçu de votre activité sur la plateforme
              </p>
            </div>
            <div
              className={`flex items-center space-x-4 transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-from-right" : "opacity-0"}`}
            >
              <Button
                variant="outline"
                className="glass-effect neon-border group"
                onClick={() => setActiveTab("create-swap")}
              >
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                Créer un Swap
              </Button>
              <Button
                className="swapeo-button group"
                onClick={() => setActiveTab("matching")}
              >
                <Target className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Matching
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* Dashboard Overview */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className={`
                      swapeo-card p-6 group hover-tilt
                      transition-all duration-700
                      ${isVisible ? "animate-slide-in-from-bottom" : "opacity-0"}
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon
                          className={`h-6 w-6 ${stat.color} animate-pulse`}
                        />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-swapeo-primary transition-colors" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      {stat.title}
                    </div>
                    <div className="text-xs text-swapeo-primary">
                      {stat.change}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Swaps */}
                <Card className="lg:col-span-2 swapeo-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-swapeo-primary animate-pulse" />
                      Swaps Récents
                    </h3>
                    <Button
                      variant="ghost"
                      className="text-swapeo-primary hover:bg-swapeo-primary/10"
                      onClick={() => setActiveTab("swaps")}
                    >
                      Voir tout
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {swaps.slice(0, 3).map((swap, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 glass-effect rounded-lg border border-swapeo-slate/20 group hover:scale-105 hover:neon-border transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              swap.type === "prêt" || swap.type === "offre"
                                ? "bg-green-500/20"
                                : "bg-blue-500/20"
                            }`}
                          >
                            {swap.type === "prêt" || swap.type === "offre" ? (
                              <ArrowUpRight className="h-6 w-6 text-green-400" />
                            ) : (
                              <ArrowDownRight className="h-6 w-6 text-blue-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium flex items-center">
                              {swap.amount.toLocaleString()}€
                              <Badge className="ml-2 text-xs bg-swapeo-primary/20 text-swapeo-primary">
                                {swap.duration}m
                              </Badge>
                            </div>
                            <div className="text-gray-400 text-sm">
                              {swap.counterparty}
                            </div>
                            <div className="text-xs text-gray-500">
                              {swap.id}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`mb-2 ${getStatusColor(swap.status)}`}
                          >
                            {swap.status}
                          </Badge>
                          <div className="w-24 bg-swapeo-navy rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-swapeo-primary to-blue-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${swap.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {swap.progress}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-6 swapeo-button group"
                    onClick={() => setActiveTab("create-swap")}
                  >
                    <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    Créer un nouveau swap
                  </Button>
                </Card>

                {/* Wallet Principal */}
                <Card className="swapeo-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Wallet className="mr-2 h-5 w-5 text-swapeo-primary animate-pulse" />
                      Wallet Principal
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setActiveTab("wallet")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-swapeo-primary to-blue-500 mb-2 animate-text-glow">
                      {wallet.balance.toLocaleString()} €
                    </div>
                    <div className="text-green-400 text-sm mb-4 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 mr-1" />+
                      {wallet.monthlyChange}% ce mois
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <Button
                        className="swapeo-button"
                        onClick={() => setActiveTab("wallet")}
                      >
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                        Déposer
                      </Button>
                      <Button
                        variant="outline"
                        className="glass-effect neon-border"
                        onClick={() => setActiveTab("wallet")}
                      >
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        Retirer
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Statut du compte</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Limite mensuelle</span>
                      <span className="text-white">
                        {wallet.monthlyLimit.toLocaleString()} €
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Utilisé ce mois</span>
                      <span className="text-white">
                        {wallet.monthlyUsed.toLocaleString()} €
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Utilisation mensuelle</span>
                        <span>
                          {Math.round(
                            (wallet.monthlyUsed / wallet.monthlyLimit) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(wallet.monthlyUsed / wallet.monthlyLimit) * 100}
                        className="h-2 bg-swapeo-navy"
                      />
                    </div>
                  </div>

                  <div className="glass-effect border border-swapeo-primary/20 rounded-lg p-4 neon-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bell className="h-4 w-4 text-swapeo-primary animate-pulse" />
                      <span className="text-swapeo-primary font-medium text-sm">
                        Notifications
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs">
                      Nouveau swap accepté : +
                      {wallet.pendingIn.toLocaleString()}€ de TechStart SAS en
                      attente de confirmation
                    </p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Create Swap */}
            <TabsContent value="create-swap" className="space-y-6">
              <Card className="swapeo-card p-8 max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                  <Plus className="h-8 w-8 text-swapeo-primary mr-3 animate-pulse" />
                  <h2 className="text-3xl font-bold text-white">
                    Créer un Nouveau Swap
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Settings className="h-5 w-5 text-swapeo-primary mr-2" />
                      Configuration du Swap
                    </h3>

                    {/* Type Selection */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">
                        Type de swap
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            id: "demande",
                            label: "Demande de liquidité",
                            desc: "J'ai besoin de fonds",
                          },
                          {
                            id: "offre",
                            label: "Offre de liquidité",
                            desc: "J'offre des fonds",
                          },
                        ].map((type) => (
                          <button
                            key={type.id}
                            onClick={() =>
                              setNewSwap((prev) => ({
                                ...prev,
                                type: type.id as any,
                              }))
                            }
                            className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                              newSwap.type === type.id
                                ? "border-swapeo-primary bg-swapeo-primary/10 text-white"
                                : "border-swapeo-slate/30 bg-swapeo-navy hover:border-swapeo-primary/50 text-gray-300"
                            }`}
                          >
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm opacity-80">
                              {type.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <Label
                        htmlFor="amount"
                        className="text-gray-300 mb-2 block"
                      >
                        Montant (€)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="ex: 50 000"
                        value={newSwap.amount}
                        onChange={(e) =>
                          setNewSwap((prev) => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        className="bg-swapeo-navy border-swapeo-slate/30 text-white text-lg p-4 focus:border-swapeo-primary"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <Label
                        htmlFor="duration"
                        className="text-gray-300 mb-2 block"
                      >
                        Durée (mois)
                      </Label>
                      <select
                        value={newSwap.duration}
                        onChange={(e) =>
                          setNewSwap((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                        className="w-full bg-swapeo-navy border border-swapeo-slate/30 rounded-lg p-4 text-white text-lg focus:border-swapeo-primary focus:outline-none"
                      >
                        <option value="">Sélectionner la durée</option>
                        {[1, 2, 3, 4, 5, 6, 9, 12, 18, 24].map((months) => (
                          <option key={months} value={months}>
                            {months} mois
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Interest Rate */}
                    <div className="glass-effect p-4 rounded-lg border border-swapeo-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">
                          Taux d'intérêt suggéré
                        </span>
                        <Zap className="h-4 w-4 text-swapeo-primary animate-pulse" />
                      </div>
                      <div className="text-2xl font-bold text-swapeo-primary">
                        3.2%
                      </div>
                      <div className="text-xs text-gray-400">
                        Basé sur les conditions actuelles du marché
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-gray-300 mb-2 block"
                      >
                        Description (optionnelle)
                      </Label>
                      <textarea
                        id="description"
                        rows={3}
                        placeholder="Décrivez votre besoin ou votre offre..."
                        value={newSwap.description}
                        onChange={(e) =>
                          setNewSwap((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full bg-swapeo-navy border border-swapeo-slate/30 rounded-lg p-4 text-white focus:border-swapeo-primary focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Eye className="h-5 w-5 text-blue-400 mr-2" />
                      Aperçu
                    </h3>

                    {newSwap.amount && newSwap.duration ? (
                      <Card className="glass-effect p-6 neon-border">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Type</span>
                            <Badge className="bg-swapeo-primary/20 text-swapeo-primary">
                              {newSwap.type === "demande" ? "Demande" : "Offre"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Montant</span>
                            <span className="text-white font-bold text-lg">
                              {parseInt(newSwap.amount).toLocaleString()}€
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Durée</span>
                            <span className="text-white">
                              {newSwap.duration} mois
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Taux</span>
                            <span className="text-swapeo-primary font-bold">
                              3.2%
                            </span>
                          </div>

                          <Separator className="bg-swapeo-slate/30" />

                          {(() => {
                            const amount = parseInt(newSwap.amount);
                            const duration = parseInt(newSwap.duration);
                            const { interest, platformFee, total } =
                              calculateSwapDetails(amount, duration, 3.2);

                            return (
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">
                                    Intérêts
                                  </span>
                                  <span className="text-white">
                                    +{interest.toLocaleString()}€
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">
                                    Frais Swapeo (1%)
                                  </span>
                                  <span className="text-white">
                                    +{platformFee.toLocaleString()}€
                                  </span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg border-t border-swapeo-slate/30 pt-3">
                                  <span className="text-white">
                                    Total à{" "}
                                    {newSwap.type === "demande"
                                      ? "rembourser"
                                      : "recevoir"}
                                  </span>
                                  <span className="text-swapeo-primary">
                                    {total.toLocaleString()}€
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </Card>
                    ) : (
                      <Card className="glass-effect p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">
                          Remplissez les champs pour voir l'aperçu
                        </p>
                      </Card>
                    )}

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">
                        Comment ça marche ?
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-swapeo-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-swapeo-primary text-xs font-bold">
                              1
                            </span>
                          </div>
                          <p className="text-gray-300">
                            Votre swap sera publié sur la plateforme
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-swapeo-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-swapeo-primary text-xs font-bold">
                              2
                            </span>
                          </div>
                          <p className="text-gray-300">
                            Notre IA trouve automatiquement les correspondances
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-swapeo-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-swapeo-primary text-xs font-bold">
                              3
                            </span>
                          </div>
                          <p className="text-gray-300">
                            Validation mutuelle et transfert sécurisé
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full swapeo-button text-lg py-4 group"
                      disabled={!newSwap.amount || !newSwap.duration}
                    >
                      <Zap className="mr-2 h-5 w-5 group-hover:animate-spin" />
                      Publier le Swap
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Matching */}
            <TabsContent value="matching" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Target className="mr-3 h-8 w-8 text-swapeo-primary animate-pulse" />
                  Swaps Compatibles
                </h2>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="glass-effect">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                  </Button>
                  <Button variant="outline" className="glass-effect">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Actualiser
                  </Button>
                </div>
              </div>

              {/* Matching Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Taux de matching",
                    value: "89%",
                    icon: Target,
                    color: "text-swapeo-primary",
                  },
                  {
                    label: "Délai moyen",
                    value: "3.2h",
                    icon: Clock,
                    color: "text-blue-400",
                  },
                  {
                    label: "Taux de succès",
                    value: "96%",
                    icon: CheckCircle,
                    color: "text-green-400",
                  },
                  {
                    label: "Disponibles",
                    value: `${availableSwaps.length}/100`,
                    icon: Activity,
                    color: "text-purple-400",
                  },
                ].map((stat, index) => (
                  <Card key={index} className="swapeo-card p-4 text-center">
                    <stat.icon
                      className={`h-6 w-6 ${stat.color} mx-auto mb-2 animate-pulse`}
                    />
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </Card>
                ))}
              </div>

              {/* Available Swaps */}
              <div className="space-y-4">
                {availableSwaps.map((swap, index) => (
                  <Card key={index} className="swapeo-card p-6 hover-lift">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-swapeo-primary to-blue-500 rounded-xl flex items-center justify-center">
                          <Euro className="h-8 w-8 text-white" />
                        </div>

                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">
                              {swap.amount.toLocaleString()}€
                            </h3>
                            <Badge
                              className={`${
                                swap.type === "offre"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {swap.type === "offre" ? "Offre" : "Demande"}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {swap.duration} mois
                            </span>
                            <span className="flex items-center">
                              <Percent className="h-4 w-4 mr-1" />
                              {swap.interestRate}%
                            </span>
                            <span className="flex items-center">
                              <Shield className="h-4 w-4 mr-1" />
                              Score: {swap.trustScore}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right mr-4">
                          <div className="text-white font-medium">
                            {swap.counterparty}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Publié le{" "}
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button className="swapeo-button group">
                          <Check className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                          Accepter
                        </Button>
                        <Button variant="outline" className="glass-effect">
                          <Eye className="mr-2 h-4 w-4" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* My Swaps */}
            <TabsContent value="swaps" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Activity className="mr-3 h-8 w-8 text-swapeo-primary animate-pulse" />
                  Gestion des Swaps
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un swap..."
                      className="pl-10 bg-swapeo-navy border-swapeo-slate/30 text-white"
                    />
                  </div>
                  <Button variant="outline" className="glass-effect">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                  </Button>
                </div>
              </div>

              {/* Swaps Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Swaps",
                    value: swaps.length,
                    icon: BarChart3,
                  },
                  {
                    label: "Actifs",
                    value: swaps.filter((s) => s.status === "En cours").length,
                    icon: Activity,
                  },
                  {
                    label: "Volume Total",
                    value: `${Math.round(swaps.reduce((acc, s) => acc + s.amount, 0) / 1000)}K€`,
                    icon: Euro,
                  },
                  {
                    label: "Taux Moyen",
                    value: `${(swaps.reduce((acc, s) => acc + s.interestRate, 0) / swaps.length).toFixed(1)}%`,
                    icon: Percent,
                  },
                ].map((stat, index) => (
                  <Card key={index} className="swapeo-card p-4 text-center">
                    <stat.icon className="h-6 w-6 text-swapeo-primary mx-auto mb-2 animate-pulse" />
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </Card>
                ))}
              </div>

              {/* Swaps List */}
              <div className="space-y-4">
                {swaps.map((swap, index) => (
                  <Card key={index} className="swapeo-card p-6 hover-lift">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-swapeo-primary to-blue-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">
                            {swap.id.split("-")[1]}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">
                              {swap.amount.toLocaleString()}€
                            </h3>
                            <Badge className={getStatusColor(swap.status)}>
                              {swap.status}
                            </Badge>
                            <Badge
                              className={`${
                                swap.type === "prêt" || swap.type === "offre"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {swap.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span>{swap.counterparty}</span>
                            <span>Durée: {swap.duration} mois</span>
                            <span>Taux: {swap.interestRate}%</span>
                            {swap.trustScore && (
                              <span>Score: {swap.trustScore}%</span>
                            )}
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                              <span>Progression</span>
                              <span>{swap.progress}%</span>
                            </div>
                            <div className="w-48 bg-swapeo-navy rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-swapeo-primary to-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${swap.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button className="swapeo-button">
                          <Eye className="mr-2 h-4 w-4" />
                          Détails
                        </Button>
                        {swap.status === "En cours" && (
                          <Button variant="outline" className="glass-effect">
                            <FileText className="mr-2 h-4 w-4" />
                            Échéancier
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Wallet */}
            <TabsContent value="wallet" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Wallet className="mr-3 h-8 w-8 text-swapeo-primary animate-pulse" />
                  Wallet
                </h2>
                <div className="flex items-center space-x-4">
                  <Button className="swapeo-button">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Balance */}
                <Card className="lg:col-span-2 swapeo-card p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Solde Principal
                    </h3>
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-swapeo-primary via-blue-500 to-purple-500 mb-4 animate-text-glow">
                      {wallet.balance.toLocaleString()} €
                    </div>
                    <div className="flex items-center justify-center text-green-400 text-lg">
                      <TrendingUp className="h-5 w-5 mr-2" />+
                      {wallet.monthlyChange}% ce mois
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <Button className="swapeo-button h-16 text-lg">
                      <ArrowDownRight className="mr-2 h-6 w-6" />
                      Déposer
                    </Button>
                    <Button
                      variant="outline"
                      className="glass-effect h-16 text-lg"
                    >
                      <ArrowUpRight className="mr-2 h-6 w-6" />
                      Retirer
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <Card className="glass-effect p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          +{wallet.pendingIn.toLocaleString()}€
                        </div>
                        <div className="text-gray-400 text-sm">
                          En attente d'arrivée
                        </div>
                      </div>
                    </Card>
                    <Card className="glass-effect p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400 mb-1">
                          -{wallet.pendingOut.toLocaleString()}€
                        </div>
                        <div className="text-gray-400 text-sm">
                          En attente de sortie
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>

                {/* Wallet Stats */}
                <Card className="swapeo-card p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-swapeo-primary" />
                    Statistiques
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Limite mensuelle</span>
                        <span className="text-white">
                          {Math.round(
                            (wallet.monthlyUsed / wallet.monthlyLimit) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(wallet.monthlyUsed / wallet.monthlyLimit) * 100}
                        className="h-2 bg-swapeo-navy"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{wallet.monthlyUsed.toLocaleString()}€</span>
                        <span>{wallet.monthlyLimit.toLocaleString()}€</span>
                      </div>
                    </div>

                    <Separator className="bg-swapeo-slate/30" />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compte vérifié</span>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">IBAN associé</span>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Virement SEPA</span>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Transaction History */}
              <Card className="swapeo-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-swapeo-primary animate-pulse" />
                    Historique des Mouvements
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="glass-effect"
                      size="sm"
                    >
                      Tous les types
                    </Button>
                    <Button
                      variant="outline"
                      className="glass-effect"
                      size="sm"
                    >
                      Tous les statuts
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {movements.map((movement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 glass-effect rounded-lg border border-swapeo-slate/20 group hover:neon-border transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            movement.type === "credit"
                              ? "bg-green-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          {movement.type === "credit" ? (
                            <ArrowDownRight className="h-6 w-6 text-green-400" />
                          ) : (
                            <ArrowUpRight className="h-6 w-6 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {movement.description}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {new Date(movement.date).toLocaleDateString()}
                            {movement.swapId && ` • ${movement.swapId}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            movement.type === "credit"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {movement.type === "credit" ? "+" : "-"}
                          {movement.amount.toLocaleString()}€
                        </div>
                        <Badge className={getStatusColor(movement.status)}>
                          {movement.status === "completed"
                            ? "Terminé"
                            : movement.status === "pending"
                              ? "En cours"
                              : "Échoué"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <User className="mr-3 h-8 w-8 text-swapeo-primary animate-pulse" />
                  Profil Utilisateur
                </h2>
                <Button className="swapeo-button">
                  <Settings className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <Card className="lg:col-span-2 swapeo-card p-8">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-swapeo-primary to-blue-500 rounded-full flex items-center justify-center neon-border">
                      <span className="text-white font-bold text-3xl">
                        {user.firstName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-400">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className="bg-swapeo-primary/20 text-swapeo-primary">
                          {user.role}
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          Membre depuis {user.memberSince}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xl font-semibold text-white mb-4">
                      Informations Personnelles
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          Prénom
                        </Label>
                        <Input
                          value={user.firstName}
                          className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                          disabled
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">Nom</Label>
                        <Input
                          value={user.lastName}
                          className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                          disabled
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          Email
                        </Label>
                        <Input
                          value={user.email}
                          className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                          disabled
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          Téléphone
                        </Label>
                        <Input
                          placeholder="+33 1 23 45 67 89"
                          className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          SIRET
                        </Label>
                        <Input
                          value={user.siret}
                          className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                          disabled
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          Date de naissance
                        </Label>
                        <Input
                          type="date"
                          className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <Button className="swapeo-button">
                        Sauvegarder les modifications
                      </Button>
                      <Button variant="outline" className="glass-effect">
                        Modifier le mot de passe
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Supprimer le compte
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Verification Status */}
                <Card className="swapeo-card p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-swapeo-primary" />
                    Statut de Vérification
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-swapeo-primary mb-2">
                        {user.kycStatus}%
                      </div>
                      <Progress
                        value={user.kycStatus}
                        className="h-3 bg-swapeo-navy mb-2"
                      />
                      <div className="text-gray-400 text-sm">
                        Profil complété
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Identité vérifiée",
                        status: "completed",
                        icon: CheckCircle,
                      },
                      {
                        label: "Document entreprise",
                        status: "completed",
                        icon: CheckCircle,
                      },
                      {
                        label: "Compte sécurisé",
                        status: "completed",
                        icon: CheckCircle,
                      },
                      {
                        label: "Vérification KYC",
                        status: "pending",
                        icon: Clock,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-300">{item.label}</span>
                        <item.icon
                          className={`h-5 w-5 ${
                            item.status === "completed"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-swapeo-slate/30">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Documents KYC
                    </h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full glass-effect">
                        <Upload className="mr-2 h-4 w-4" />
                        Pièce d'identité
                      </Button>
                      <Button variant="outline" className="w-full glass-effect">
                        <Upload className="mr-2 h-4 w-4" />
                        Justificatif de domicile
                      </Button>
                      <Button variant="outline" className="w-full glass-effect">
                        <Upload className="mr-2 h-4 w-4" />
                        Extrait KBIS
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Bell className="mr-3 h-8 w-8 text-swapeo-primary animate-pulse" />
                  Notifications
                </h2>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="glass-effect">
                    Marquer toutes comme lues
                  </Button>
                  <Button className="swapeo-button">Paramètres</Button>
                </div>
              </div>

              <Tabs defaultValue="toutes" className="space-y-6">
                <TabsList className="bg-swapeo-navy border border-swapeo-slate/30">
                  <TabsTrigger value="toutes">Toutes (6)</TabsTrigger>
                  <TabsTrigger value="non-lues">Non lues (2)</TabsTrigger>
                  <TabsTrigger value="swaps">Swaps</TabsTrigger>
                  <TabsTrigger value="systeme">Système</TabsTrigger>
                </TabsList>

                <TabsContent value="toutes" className="space-y-4">
                  {[
                    {
                      type: "swap",
                      title: "Swap accepté ✅",
                      message:
                        "Votre demande de liquidité de 50 000€ avec TechOne SAS a été acceptée. Les fonds seront transférés dans 24h.",
                      time: "il y a 2h",
                      unread: true,
                    },
                    {
                      type: "matching",
                      title: "Nouveau matching disponible ⚡",
                      message:
                        "3 nouvelles opportunités de swap correspondent à vos critères. Consultez les maintenant!",
                      time: "il y a 4h",
                      unread: true,
                    },
                    {
                      type: "payment",
                      title: "Paiement reçu",
                      message:
                        "Vous avez reçu un paiement de 25 000€ pour votre prêt principal.",
                      time: "il y a 1 jour",
                      unread: false,
                    },
                    {
                      type: "security",
                      title: "Connexion sécurisée",
                      message:
                        "Une nouvelle connexion à votre compte depuis Paris, France. Si ce n'est pas vous, révoquez la connexion.",
                      time: "il y a 2 jours",
                      unread: false,
                    },
                    {
                      type: "reminder",
                      title: "Nouveau mémorandum",
                      message:
                        "Rappelez-vous de mettre à jour votre statut de remboursement et vos détails de performances de créance.",
                      time: "il y a 3 jours",
                      unread: false,
                    },
                    {
                      type: "kyc",
                      title: "Mise à jour KYC",
                      message:
                        "Votre vérification KYC a été mise à jour avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités.",
                      time: "il y a 1 semaine",
                      unread: false,
                    },
                  ].map((notification, index) => (
                    <Card
                      key={index}
                      className={`swapeo-card p-6 hover-lift ${notification.unread ? "neon-border" : ""}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            notification.type === "swap"
                              ? "bg-swapeo-primary/20"
                              : notification.type === "matching"
                                ? "bg-blue-500/20"
                                : notification.type === "payment"
                                  ? "bg-green-500/20"
                                  : notification.type === "security"
                                    ? "bg-orange-500/20"
                                    : notification.type === "reminder"
                                      ? "bg-purple-500/20"
                                      : "bg-gray-500/20"
                          }`}
                        >
                          <Bell
                            className={`h-6 w-6 ${
                              notification.type === "swap"
                                ? "text-swapeo-primary"
                                : notification.type === "matching"
                                  ? "text-blue-400"
                                  : notification.type === "payment"
                                    ? "text-green-400"
                                    : notification.type === "security"
                                      ? "text-orange-400"
                                      : notification.type === "reminder"
                                        ? "text-purple-400"
                                        : "text-gray-400"
                            } animate-pulse`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">
                              {notification.title}
                            </h4>
                            <span className="text-gray-400 text-sm">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                          {notification.unread && (
                            <div className="mt-3">
                              <Button size="sm" className="swapeo-button">
                                Voir les détails
                              </Button>
                            </div>
                          )}
                        </div>

                        {notification.unread && (
                          <div className="w-3 h-3 bg-swapeo-primary rounded-full animate-pulse" />
                        )}
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Settings className="mr-3 h-8 w-8 text-swapeo-primary animate-pulse" />
                  Paramètres
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Parameters */}
                <Card className="swapeo-card p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <User className="mr-2 h-5 w-5 text-swapeo-primary" />
                    Paramètres du Compte
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          Prénom
                        </Label>
                        <Input
                          value={user.firstName}
                          className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">Nom</Label>
                        <Input
                          value={user.lastName}
                          className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block">Email</Label>
                      <Input
                        value={user.email}
                        className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block">
                        Entreprise
                      </Label>
                      <Input
                        placeholder="TechOne SAS"
                        className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                      />
                    </div>

                    <Button className="swapeo-button">
                      Sauvegarder les modifications
                    </Button>
                  </div>
                </Card>

                {/* Account Status */}
                <Card className="swapeo-card p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-swapeo-primary" />
                    Statut du Compte
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Vérification</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        Vérifié
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Limite mensuelle</span>
                      <span className="text-white">50 000€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Score de confiance</span>
                      <span className="text-swapeo-primary font-bold">
                        {user.trustScore}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full glass-effect">
                      Augmenter la limite
                    </Button>
                    <Button variant="outline" className="w-full glass-effect">
                      Télécharger les documents
                    </Button>
                  </div>
                </Card>

                {/* Security Settings */}
                <Card className="swapeo-card p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-orange-400" />
                    Sécurité
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">
                        Modifier le mot de passe
                      </Label>
                      <Input
                        type="password"
                        placeholder="Mot de passe actuel"
                        className="bg-swapeo-navy border-swapeo-slate/30 text-white mb-3"
                      />
                      <Input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        className="bg-swapeo-navy border-swapeo-slate/30 text-white mb-3"
                      />
                      <Input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        className="bg-swapeo-navy border-swapeo-slate/30 text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                      <div>
                        <div className="text-white font-medium">
                          Authentification à deux facteurs
                        </div>
                        <div className="text-gray-400 text-sm">
                          Sécurisez votre compte avec 2FA
                        </div>
                      </div>
                      <Button size="sm" className="swapeo-button">
                        Activer
                      </Button>
                    </div>

                    <Button className="w-full swapeo-button">
                      Mettre à jour la sécurité
                    </Button>
                  </div>
                </Card>

                {/* Notification Settings */}
                <Card className="swapeo-card p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-blue-400" />
                    Notifications
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Swaps acceptés",
                        desc: "Quand un swap est accepté",
                        enabled: true,
                      },
                      {
                        label: "Swaps trouvés",
                        desc: "Nouveaux matchings disponibles",
                        enabled: true,
                      },
                      {
                        label: "Paiements reçus",
                        desc: "Notifications de paiements",
                        enabled: true,
                      },
                      {
                        label: "Email quotidien",
                        desc: "Résumé quotidien par email",
                        enabled: false,
                      },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 glass-effect rounded-lg"
                      >
                        <div>
                          <div className="text-white font-medium">
                            {setting.label}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {setting.desc}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className={
                            setting.enabled ? "swapeo-button" : "glass-effect"
                          }
                          variant={setting.enabled ? "default" : "outline"}
                        >
                          {setting.enabled ? "Activé" : "Désactivé"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Danger Zone */}
              <Card className="swapeo-card p-6 border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Zone Dangereuse
                </h3>

                <div className="space-y-4">
                  <div className="glass-effect p-4 rounded-lg border border-red-500/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">
                          Supprimer mon compte
                        </div>
                        <div className="text-gray-400 text-sm">
                          Cette action est irréversible. Toutes vos données
                          seront supprimées.
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Supprimer mon compte
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
