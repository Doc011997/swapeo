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
  ChevronLeft,
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
  Home,
  SwapHorizontal,
  X,
  Menu,
  MoreHorizontal,
  Heart,
  Flame,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  daysRemaining?: number;
}

const DashboardUltra = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [compatibleSwaps, setCompatibleSwaps] = useState<Swap[]>([]);
  const [showCreateSwap, setShowCreateSwap] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [currentSwapIndex, setCurrentSwapIndex] = useState(0);
  const [currentCompatibleIndex, setCurrentCompatibleIndex] = useState(0);
  const [trustScore, setTrustScore] = useState(0);
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
      loadCompatibleSwaps();
    } else {
      window.location.href = "/login";
    }
    setLoading(false);
  }, []);

  // Animation du solde
  useEffect(() => {
    if (user?.wallet?.balance) {
      const duration = 2000;
      const increment = user.wallet.balance / (duration / 50);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= user.wallet.balance) {
          setAnimatedBalance(user.wallet.balance);
          clearInterval(timer);
        } else {
          setAnimatedBalance(Math.floor(current));
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [user?.wallet?.balance]);

  // Animation du trust score
  useEffect(() => {
    if (user?.trustScore) {
      const timer = setTimeout(() => {
        const duration = 1500;
        const increment = user.trustScore / (duration / 50);
        let current = 0;
        const scoreTimer = setInterval(() => {
          current += increment;
          if (current >= user.trustScore) {
            setTrustScore(user.trustScore);
            clearInterval(scoreTimer);
          } else {
            setTrustScore(Math.floor(current));
          }
        }, 50);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user?.trustScore]);

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
          daysRemaining: 3,
        },
        {
          id: "SWP-002",
          type: "prêt",
          amount: 25000,
          duration: 3,
          interestRate: 2.8,
          counterparty: "Digital Studio",
          status: "En attente",
          progress: 25,
          createdAt: "2024-01-20",
          description: "Prêt pont",
          matchingScore: 88,
          daysRemaining: 12,
        },
      ]);
    }
  };

  const loadCompatibleSwaps = () => {
    setCompatibleSwaps([
      {
        id: "COMP-001",
        type: "offre",
        amount: 30000,
        duration: 4,
        interestRate: 3.5,
        counterparty: "InnovateCorp",
        status: "Disponible",
        progress: 0,
        createdAt: "2024-01-22",
        matchingScore: 96,
      },
      {
        id: "COMP-002",
        type: "offre",
        amount: 75000,
        duration: 8,
        interestRate: 4.1,
        counterparty: "GrowthFund",
        status: "Disponible",
        progress: 0,
        createdAt: "2024-01-21",
        matchingScore: 89,
      },
      {
        id: "COMP-003",
        type: "offre",
        amount: 45000,
        duration: 6,
        interestRate: 3.8,
        counterparty: "CapitalFlow",
        status: "Disponible",
        progress: 0,
        createdAt: "2024-01-20",
        matchingScore: 92,
      },
    ]);
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
          counterparty: "En recherche",
          status: "Actif",
          progress: 0,
          matchingScore: Math.floor(Math.random() * 20) + 80,
        };
        setSwaps([createdSwap, ...swaps]);
        setShowCreateSwap(false);
        setNewSwap({ type: "", amount: "", duration: "", description: "" });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Erreur lors de la création");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("swapeo_token");
    localStorage.removeItem("swapeo_user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Préparation de votre espace...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  const walletData = user?.wallet || {
    balance: 125847,
    totalDeposited: 200000,
    totalWithdrawn: 74153,
  };

  const getMotivationMessage = () => {
    const messages = [
      `👋 Bienvenue ${user.firstName}, votre prochain remboursement est dans ${swaps[0]?.daysRemaining || 3} jours.`,
      `🚀 ${user.firstName}, vous avez généré +3.7% de rendement ce mois !`,
      `💪 Excellent ${user.firstName}, votre trust score continue de grimper !`,
      `⭐ ${user.firstName}, ${compatibleSwaps.length} nouvelles opportunités vous attendent !`,
    ];
    return messages[
      Math.floor(Date.now() / (1000 * 60 * 60 * 6)) % messages.length
    ];
  };

  const renderNavIcon = (icon: any, isActive: boolean) => {
    const IconComponent = icon;
    return (
      <motion.div
        className={`p-3 rounded-2xl transition-all duration-300 ${
          isActive
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
            : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconComponent className="h-6 w-6" />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Background dégradé animé */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header dynamique */}
      <motion.header
        className="relative z-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Avatar avec score de confiance */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center relative">
                  <span className="text-white font-bold text-lg">
                    {user.firstName?.[0]}
                  </span>
                  {/* Score de confiance en badge */}
                  <motion.div
                    className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    {Math.floor(trustScore / 10)}
                  </motion.div>
                </div>
              </motion.div>

              <div>
                <h1 className="text-lg font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm text-gray-400">{user.role}</p>
              </div>
            </div>

            {/* Notifications */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white rounded-xl"
              >
                <Bell className="h-6 w-6" />
              </Button>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Notification dynamique */}
          <motion.div
            className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-blue-300 font-medium">
              💼 {compatibleSwaps.length} swaps compatibles disponibles
            </p>
          </motion.div>

          {/* Message de motivation */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-xs text-gray-400 mb-1">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <p className="text-sm text-gray-300">{getMotivationMessage()}</p>
          </motion.div>
        </div>
      </motion.header>

      {/* Contenu principal */}
      <main className="relative z-10 max-w-md mx-auto px-6 py-6 pb-24">
        {/* Message de feedback */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className={`mb-6 p-4 rounded-2xl border ${
                message.includes("✅")
                  ? "bg-green-500/20 border-green-500/30 text-green-300"
                  : "bg-red-500/20 border-red-500/30 text-red-300"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bloc Wallet animé */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Solde total</h2>
              <motion.button
                onClick={() => setHideBalance(!hideBalance)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-700 rounded-xl text-gray-400 hover:text-white"
              >
                {hideBalance ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </motion.button>
            </div>

            {/* Solde animé */}
            <div className="mb-6">
              <motion.div
                className="text-4xl font-bold text-white mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {hideBalance
                  ? "••••••"
                  : `${animatedBalance.toLocaleString()} €`}
              </motion.div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-medium">+3.7%</span>
                </div>
                <span className="text-gray-400 text-sm">rendement moyen</span>
              </div>
            </div>

            {/* Progress bar des fonds */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Fonds utilisés</span>
                <span>
                  {Math.floor(
                    (walletData.totalWithdrawn / walletData.totalDeposited) *
                      100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (walletData.totalWithdrawn / walletData.totalDeposited) * 100
                }
                className="h-3 bg-gray-700"
              />
              <motion.div
                className="text-xs text-gray-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                💡 Rendement moyen de tes swaps : +3,7 % sur 2 mois
              </motion.div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-medium transition-colors"
              >
                <RefreshCw className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Recharger</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-2xl font-medium transition-colors"
              >
                <Upload className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Retirer</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateSwap(true)}
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-medium transition-colors"
              >
                <Plus className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Créer swap</span>
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Section Swaps en cours - Carrousel horizontal */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Swaps en cours</h3>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setCurrentSwapIndex(Math.max(0, currentSwapIndex - 1))
                }
                className="p-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white disabled:opacity-50"
                disabled={currentSwapIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setCurrentSwapIndex(
                    Math.min(swaps.length - 1, currentSwapIndex + 1),
                  )
                }
                className="p-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white disabled:opacity-50"
                disabled={currentSwapIndex >= swaps.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {swaps.length > 0 ? (
            <motion.div
              key={currentSwapIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-800 border-gray-700 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-white">
                      {swaps[currentSwapIndex]?.id}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {swaps[currentSwapIndex]?.counterparty}
                    </p>
                  </div>
                  <Badge
                    className={`${
                      swaps[currentSwapIndex]?.status === "En cours"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : swaps[currentSwapIndex]?.status === "En attente"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }`}
                  >
                    {swaps[currentSwapIndex]?.status}
                  </Badge>
                </div>

                <div className="text-3xl font-bold text-white mb-2">
                  {swaps[currentSwapIndex]?.amount.toLocaleString()} €
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Durée</span>
                    <div className="text-white font-medium">
                      {swaps[currentSwapIndex]?.duration} mois
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Taux</span>
                    <div className="text-white font-medium">
                      {swaps[currentSwapIndex]?.interestRate}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Échéance</span>
                    <div className="text-white font-medium">
                      {swaps[currentSwapIndex]?.daysRemaining}j
                    </div>
                  </div>
                </div>

                {/* Mini timeline */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progression</span>
                    <span>{swaps[currentSwapIndex]?.progress}%</span>
                  </div>
                  <Progress
                    value={swaps[currentSwapIndex]?.progress || 0}
                    className="h-2 bg-gray-700"
                  />
                </div>

                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                  {swaps[currentSwapIndex]?.status === "En cours"
                    ? "Voir détails"
                    : "Effectuer remboursement"}
                </Button>
              </Card>
            </motion.div>
          ) : (
            <Card className="bg-gray-800 border-gray-700 rounded-3xl p-6 text-center">
              <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Aucun swap en cours</p>
              <Button
                onClick={() => setShowCreateSwap(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              >
                Créer votre premier swap
              </Button>
            </Card>
          )}
        </motion.div>

        {/* Graphiques de performance */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Score de confiance radial */}
            <Card className="bg-gray-800 border-gray-700 rounded-3xl p-6 text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={188.4}
                    strokeDashoffset={188.4}
                    className="text-blue-500"
                    initial={{ strokeDashoffset: 188.4 }}
                    animate={{
                      strokeDashoffset: 188.4 - (188.4 * trustScore) / 100,
                    }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {trustScore}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Trust Score</p>
            </Card>

            {/* Mini KPI */}
            <div className="space-y-2">
              <Card className="bg-gray-800 border-gray-700 rounded-2xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Rendement</span>
                  <span className="text-sm font-bold text-green-400">
                    +3.7%
                  </span>
                </div>
              </Card>
              <Card className="bg-gray-800 border-gray-700 rounded-2xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Matching</span>
                  <span className="text-sm font-bold text-blue-400">2.3j</span>
                </div>
              </Card>
              <Card className="bg-gray-800 border-gray-700 rounded-2xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Sécurité</span>
                  <span className="text-sm font-bold text-purple-400">A+</span>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Matchmaking express */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Swaps compatibles
            </h3>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-blue-400"
            >
              <Target className="h-5 w-5" />
            </motion.div>
          </div>

          {compatibleSwaps.length > 0 && (
            <motion.div
              key={currentCompatibleIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-white">
                      {compatibleSwaps[currentCompatibleIndex]?.counterparty}
                    </h4>
                    <p className="text-sm text-blue-300">
                      Match:{" "}
                      {compatibleSwaps[currentCompatibleIndex]?.matchingScore}%
                    </p>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-yellow-400"
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </motion.div>
                </div>

                <div className="text-2xl font-bold text-white mb-2">
                  {compatibleSwaps[
                    currentCompatibleIndex
                  ]?.amount.toLocaleString()}{" "}
                  €
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-blue-300">Durée: </span>
                    <span className="text-white">
                      {compatibleSwaps[currentCompatibleIndex]?.duration} mois
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300">Taux: </span>
                    <span className="text-white">
                      {compatibleSwaps[currentCompatibleIndex]?.interestRate}%
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() =>
                      setCurrentCompatibleIndex(
                        (currentCompatibleIndex + 1) % compatibleSwaps.length,
                      )
                    }
                    variant="outline"
                    className="flex-1 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 rounded-xl"
                  >
                    Suivant
                  </Button>
                  <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl">
                    Accepter
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Navigation inférieure - Type mobile app */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.button
              onClick={() => setActiveNavItem("home")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {renderNavIcon(Home, activeNavItem === "home")}
            </motion.button>

            <motion.button
              onClick={() => setActiveNavItem("swaps")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              {renderNavIcon(Activity, activeNavItem === "swaps")}
              {swaps.some((s) => s.status === "En attente") && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => setShowCreateSwap(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {renderNavIcon(Plus, activeNavItem === "create")}
            </motion.button>

            <motion.button
              onClick={() => setActiveNavItem("wallet")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {renderNavIcon(Wallet, activeNavItem === "wallet")}
            </motion.button>

            <motion.button
              onClick={() => setActiveNavItem("profile")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {renderNavIcon(User, activeNavItem === "profile")}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Modal Création de Swap */}
      <AnimatePresence>
        {showCreateSwap && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowCreateSwap(false)}
            />
            <motion.div
              className="relative bg-gray-900 rounded-t-3xl border-t border-gray-700 w-full max-w-md max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Nouveau swap</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCreateSwap(false)}
                    className="text-gray-400 hover:text-white rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Type de swap</Label>
                    <Select
                      value={newSwap.type}
                      onValueChange={(value) =>
                        setNewSwap({ ...newSwap, type: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
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
                      <Label className="text-gray-300">Montant (€)</Label>
                      <Input
                        type="number"
                        placeholder="50 000"
                        value={newSwap.amount}
                        onChange={(e) =>
                          setNewSwap({ ...newSwap, amount: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 text-white rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Durée (mois)</Label>
                      <Input
                        type="number"
                        placeholder="6"
                        value={newSwap.duration}
                        onChange={(e) =>
                          setNewSwap({ ...newSwap, duration: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 text-white rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      placeholder="Décrivez votre besoin..."
                      value={newSwap.description}
                      onChange={(e) =>
                        setNewSwap({ ...newSwap, description: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white rounded-xl h-24 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleCreateSwap}
                    disabled={
                      !newSwap.type || !newSwap.amount || !newSwap.duration
                    }
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Créer le swap
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardUltra;
