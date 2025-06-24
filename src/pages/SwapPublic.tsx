import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUpDown,
  Calculator,
  Store,
  Bell,
  Zap,
  Shield,
  TrendingUp,
  Users,
  LogIn,
  Eye,
  EyeOff,
  Search,
  Filter,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  Euro,
  Percent,
  Building,
  Globe,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  Award,
  Target,
  Gift,
  Sparkles,
  Timer,
  Info,
  RefreshCw,
  Plus,
  ArrowRight,
  ChevronRight,
  X,
  MapPin,
  Handshake,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  company?: string;
  kycStatus?: string;
  balance?: number;
  totalInvested?: number;
  totalEarned?: number;
  trustScore?: number;
  level?: number;
  xp?: number;
}

interface Swap {
  id: string;
  type: "demande" | "offre";
  amount: number;
  duration: number;
  interestRate: number;
  counterparty: string;
  status: string;
  progress: number;
  createdAt: string;
  description?: string;
  daysRemaining?: number;
  matchingScore?: number;
  category?: string;
  riskLevel?: "low" | "medium" | "high";
  verified?: boolean;
  purpose?: string;
  guarantees?: string;
  repaymentSchedule?: string;
  earlyRepayment?: boolean;
  insurance?: boolean;
  createdBy?: string;
  createdByCompany?: string;
  createdByTrustScore?: number;
  estimatedReturn?: number;
  totalInterest?: number;
  monthlyPayment?: number;
  nextPaymentDate?: string | null;
  lastUpdated?: string;
  features?: string[];
  location?: string;
  minInvestment?: number;
  maxInvestment?: number;
  rating?: number;
  reviews?: number;
  tags?: string[];
}

interface Notification {
  id: string;
  type: "swap" | "payment" | "system" | "message";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const SwapPublic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("marketplace");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    amount: 10000,
    duration: 12,
    rate: 5.5,
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("swapeo_user");
      const storedToken = localStorage.getItem("swapeo_token");

      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          loadUserData();
        } catch (error) {
          console.error(
            "Erreur lors du parsing des données utilisateur:",
            error,
          );
          localStorage.removeItem("swapeo_user");
          localStorage.removeItem("swapeo_token");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loadUserData = () => {
    // Simulation des données de swaps pour les utilisateurs connectés
    const mockSwaps: Swap[] = [
      {
        id: "swap-1",
        type: "offre",
        amount: 25000,
        duration: 18,
        interestRate: 6.2,
        counterparty: "TechStart Solutions",
        status: "active",
        progress: 75,
        createdAt: "2024-01-15",
        description: "Financement pour expansion internationale",
        daysRemaining: 127,
        matchingScore: 94,
        category: "Technology",
        riskLevel: "low",
        verified: true,
        purpose: "Expansion internationale",
        guarantees: "Garantie bancaire + Assurance",
        repaymentSchedule: "Mensuel",
        earlyRepayment: true,
        insurance: true,
        createdBy: "Sarah Chen",
        createdByCompany: "TechStart Solutions",
        createdByTrustScore: 96,
        estimatedReturn: 3875,
        totalInterest: 3875,
        monthlyPayment: 1597,
        nextPaymentDate: "2024-02-15",
        lastUpdated: "2024-01-20",
        features: [
          "Garantie bancaire",
          "Assurance incluse",
          "Remboursement anticipé",
        ],
        location: "Paris, France",
        minInvestment: 1000,
        maxInvestment: 25000,
        rating: 4.8,
        reviews: 124,
        tags: ["Tech", "Croissance", "International"],
      },
      {
        id: "swap-2",
        type: "demande",
        amount: 15000,
        duration: 12,
        interestRate: 5.8,
        counterparty: "GreenEnergy Corp",
        status: "pending",
        progress: 45,
        createdAt: "2024-01-18",
        description: "Projet de panneaux solaires résidentiels",
        daysRemaining: 95,
        matchingScore: 87,
        category: "Energy",
        riskLevel: "medium",
        verified: true,
        purpose: "Énergies renouvelables",
        guarantees: "Contrats clients confirmés",
        repaymentSchedule: "Trimestriel",
        earlyRepayment: false,
        insurance: true,
        createdBy: "Marc Dubois",
        createdByCompany: "GreenEnergy Corp",
        createdByTrustScore: 89,
        estimatedReturn: 1740,
        totalInterest: 1740,
        monthlyPayment: 1395,
        nextPaymentDate: "2024-04-18",
        lastUpdated: "2024-01-19",
        features: [
          "Contrats confirmés",
          "Secteur en croissance",
          "Impact environnemental",
        ],
        location: "Lyon, France",
        minInvestment: 500,
        maxInvestment: 15000,
        rating: 4.5,
        reviews: 87,
        tags: ["Vert", "Durable", "Innovation"],
      },
      {
        id: "swap-3",
        type: "offre",
        amount: 50000,
        duration: 24,
        interestRate: 7.1,
        counterparty: "RestaurantChain Plus",
        status: "new",
        progress: 12,
        createdAt: "2024-01-20",
        description: "Ouverture de 3 nouveaux restaurants",
        daysRemaining: 180,
        matchingScore: 91,
        category: "Food & Beverage",
        riskLevel: "medium",
        verified: true,
        purpose: "Expansion réseau restaurants",
        guarantees: "Fonds propres + Caution dirigeant",
        repaymentSchedule: "Mensuel",
        earlyRepayment: true,
        insurance: false,
        createdBy: "Julie Martin",
        createdByCompany: "RestaurantChain Plus",
        createdByTrustScore: 92,
        estimatedReturn: 8520,
        totalInterest: 8520,
        monthlyPayment: 2439,
        nextPaymentDate: null,
        lastUpdated: "2024-01-20",
        features: [
          "Marque établie",
          "Emplacements premium",
          "Équipe expérimentée",
        ],
        location: "Marseille, France",
        minInvestment: 2000,
        maxInvestment: 50000,
        rating: 4.6,
        reviews: 203,
        tags: ["Restaurant", "Franchise", "Expansion"],
      },
    ];

    const mockNotifications: Notification[] = [
      {
        id: "notif-1",
        type: "swap",
        title: "Nouveau match trouvé !",
        description:
          "TechStart Solutions correspond à vos critères d'investissement",
        time: "Il y a 2h",
        read: false,
        actionUrl: "/swap/swap-1",
      },
      {
        id: "notif-2",
        type: "payment",
        title: "Paiement reçu",
        description: "1 597€ d'intérêts de GreenEnergy Corp",
        time: "Hier",
        read: false,
      },
      {
        id: "notif-3",
        type: "system",
        title: "Nouvel utilisateur vérifié",
        description: "RestaurantChain Plus a rejoint votre réseau",
        time: "Il y a 2 jours",
        read: true,
      },
    ];

    setSwaps(mockSwaps);
    setNotifications(mockNotifications);
  };

  const filteredSwaps = swaps.filter((swap) => {
    const matchesSearch =
      swap.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.purpose?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      swap.category?.toLowerCase() === filterCategory.toLowerCase();
    const matchesRisk = filterRisk === "all" || swap.riskLevel === filterRisk;

    return matchesSearch && matchesCategory && matchesRisk;
  });

  const calculateReturn = (amount: number, rate: number, duration: number) => {
    const monthlyRate = rate / 100 / 12;
    const totalReturn = amount * monthlyRate * duration;
    const monthlyPayment = (amount + totalReturn) / duration;
    return { totalReturn, monthlyPayment };
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-lime-400 bg-lime-500/10 border-lime-500/20";
      case "medium":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "high":
        return "text-pink-400 bg-pink-500/10 border-pink-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-lime-400 bg-lime-500/10 border-lime-500/20";
      case "pending":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "new":
        return "text-violet-400 bg-violet-500/10 border-violet-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-violet-900 to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-violet-900 to-purple-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <ArrowUpDown className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  Swapeo Public
                </h1>
                <p className="text-xs text-gray-400">Marketplace de swaps</p>
              </div>
            </Link>

            {/* Navigation et Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications.filter((n) => !n.read).length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-bounce" />
                      )}
                    </Button>

                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute right-0 top-12 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50"
                      >
                        <div className="p-4 border-b border-white/10">
                          <h3 className="font-semibold text-white">
                            Notifications
                          </h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-white/5 hover:bg-white/5 ${!notif.read ? "bg-violet-500/5" : ""}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notif.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {notif.time}
                                  </p>
                                </div>
                                {!notif.read && (
                                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-1" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 ring-2 ring-violet-500/50">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500 text-white text-sm">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user?.company || user?.role}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                  >
                    <Link to="/dashboard">
                      <Target className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white"
                  >
                    <Link to="/register">S'inscrire</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                  >
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Connexion
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          /* Vue publique pour les visiteurs non connectés */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-cyan-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 p-8 sm:p-12 mb-12">
              <div className="relative z-10">
                <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-6">
                  Marketplace de Swaps
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Découvrez les opportunités d'investissement et de financement
                  entre entreprises. Connectez-vous pour accéder aux swaps,
                  calculateur avancé et marketplace complète.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white px-8 py-3"
                    onClick={() => setShowLoginModal(true)}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Accéder au Marketplace
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3"
                  >
                    <Link to="/register">
                      <Plus className="h-5 w-5 mr-2" />
                      Créer un compte
                    </Link>
                  </Button>
                </div>

                {/* Statistiques publiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                      €2.4M+
                    </div>
                    <p className="text-gray-400 mt-2">Volume total échangé</p>
                  </div>
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                      1,250+
                    </div>
                    <p className="text-gray-400 mt-2">Swaps réalisés</p>
                  </div>
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                      95%
                    </div>
                    <p className="text-gray-400 mt-2">Taux de satisfaction</p>
                  </div>
                </div>
              </div>

              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Fonctionnalités pour membres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6 hover:bg-black/30 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Store className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Marketplace
                  </h3>
                  <p className="text-gray-400">
                    Explorez les opportunités de swaps entre entreprises avec
                    matching intelligent
                  </p>
                </div>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6 hover:bg-black/30 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Calculateur Avancé
                  </h3>
                  <p className="text-gray-400">
                    Simulez vos investissements et financements avec précision
                  </p>
                </div>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6 hover:bg-black/30 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Notifications Smart
                  </h3>
                  <p className="text-gray-400">
                    Recevez des alertes personnalisées sur les meilleures
                    opportunités
                  </p>
                </div>
              </Card>
            </div>

            {/* Call to action */}
            <Card className="bg-gradient-to-r from-violet-600/10 via-cyan-600/10 to-pink-600/10 backdrop-blur-sm border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Prêt à commencer ?
              </h2>
              <p className="text-gray-300 mb-6">
                Rejoignez notre communauté d'entrepreneurs et investisseurs pour
                découvrir de nouvelles opportunités.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                  onClick={() => setShowLoginModal(true)}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Se connecter
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                >
                  <Link to="/register">
                    <Users className="h-5 w-5 mr-2" />
                    Rejoindre la communauté
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Vue complète pour les utilisateurs connectés */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Tabs de navigation */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border border-white/10">
                <TabsTrigger
                  value="marketplace"
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-cyan-500"
                >
                  <Store className="h-4 w-4" />
                  <span className="hidden sm:inline">Marketplace</span>
                </TabsTrigger>
                <TabsTrigger
                  value="calculator"
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-pink-500"
                >
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Calculateur</span>
                </TabsTrigger>
                <TabsTrigger
                  value="watchlist"
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Watchlist</span>
                </TabsTrigger>
              </TabsList>

              {/* Marketplace Tab */}
              <TabsContent value="marketplace" className="space-y-6">
                {/* Filtres et recherche */}
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher des swaps..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="energy">Energy</SelectItem>
                          <SelectItem value="food & beverage">
                            Food & Beverage
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterRisk} onValueChange={setFilterRisk}>
                        <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Risque" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="high">Élevé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Liste des swaps */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredSwaps.map((swap) => (
                    <motion.div
                      key={swap.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6 hover:bg-black/30 transition-all duration-300 group-hover:border-violet-500/30">
                        <div className="space-y-4">
                          {/* Header du swap */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={`${swap.type === "offre" ? "bg-lime-500/10 text-lime-400 border-lime-500/20" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"}`}
                                >
                                  {swap.type === "offre" ? "Offre" : "Demande"}
                                </Badge>
                                <Badge
                                  className={getRiskColor(
                                    swap.riskLevel || "medium",
                                  )}
                                >
                                  {swap.riskLevel === "low"
                                    ? "Faible"
                                    : swap.riskLevel === "medium"
                                      ? "Moyen"
                                      : "Élevé"}
                                </Badge>
                                {swap.verified && (
                                  <CheckCircle className="h-4 w-4 text-lime-400" />
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                                {swap.counterparty}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {swap.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 text-gray-400 hover:text-pink-400"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 text-gray-400 hover:text-cyan-400"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Informations financières */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">Montant</p>
                              <p className="text-lg font-bold text-white">
                                {swap.amount.toLocaleString()}€
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Taux</p>
                              <p className="text-lg font-bold text-lime-400">
                                {swap.interestRate}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Durée</p>
                              <p className="text-sm text-white">
                                {swap.duration} mois
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Matching</p>
                              <p className="text-sm text-cyan-400">
                                {swap.matchingScore}%
                              </p>
                            </div>
                          </div>

                          {/* Tags et informations supplémentaires */}
                          {swap.tags && (
                            <div className="flex flex-wrap gap-2">
                              {swap.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-white/20 text-gray-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Rating et actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex items-center gap-4">
                              {swap.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-white">
                                    {swap.rating}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ({swap.reviews})
                                  </span>
                                </div>
                              )}
                              {swap.location && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <MapPin className="h-3 w-3" />
                                  {swap.location}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                              >
                                <Info className="h-4 w-4 mr-1" />
                                Détails
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                              >
                                <Handshake className="h-4 w-4 mr-1" />
                                Matcher
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {filteredSwaps.length === 0 && (
                  <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Aucun swap trouvé
                    </h3>
                    <p className="text-gray-400">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </Card>
                )}
              </TabsContent>

              {/* Calculator Tab */}
              <TabsContent value="calculator" className="space-y-6">
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Calculator className="h-6 w-6 mr-3 text-cyan-400" />
                    Calculateur de Swap
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Paramètres */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-white mb-2 block">
                          Montant (€)
                        </Label>
                        <Input
                          type="number"
                          value={calculatorValues.amount}
                          onChange={(e) =>
                            setCalculatorValues({
                              ...calculatorValues,
                              amount: parseInt(e.target.value) || 0,
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">
                          Durée (mois)
                        </Label>
                        <Input
                          type="number"
                          value={calculatorValues.duration}
                          onChange={(e) =>
                            setCalculatorValues({
                              ...calculatorValues,
                              duration: parseInt(e.target.value) || 0,
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">
                          Taux d'intérêt (%)
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={calculatorValues.rate}
                          onChange={(e) =>
                            setCalculatorValues({
                              ...calculatorValues,
                              rate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    {/* Résultats */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-violet-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Résultats
                        </h3>

                        {(() => {
                          const results = calculateReturn(
                            calculatorValues.amount,
                            calculatorValues.rate,
                            calculatorValues.duration,
                          );
                          return (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">
                                  Intérêts totaux:
                                </span>
                                <span className="text-xl font-bold text-lime-400">
                                  {results.totalReturn.toLocaleString()}€
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">
                                  Paiement mensuel:
                                </span>
                                <span className="text-lg font-semibold text-cyan-400">
                                  {results.monthlyPayment.toLocaleString()}€
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">
                                  Total remboursé:
                                </span>
                                <span className="text-lg font-semibold text-white">
                                  {(
                                    calculatorValues.amount +
                                    results.totalReturn
                                  ).toLocaleString()}
                                  €
                                </span>
                              </div>

                              <div className="pt-4 border-t border-white/10">
                                <p className="text-xs text-gray-400">
                                  Rendement annuel:{" "}
                                  {(
                                    (results.totalReturn /
                                      calculatorValues.amount) *
                                    (12 / calculatorValues.duration) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600">
                        <Search className="h-4 w-4 mr-2" />
                        Trouver des swaps compatibles
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Watchlist Tab */}
              <TabsContent value="watchlist" className="space-y-6">
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Heart className="h-6 w-6 mr-3 text-pink-400" />
                    Mes swaps favoris
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {swaps.slice(0, 2).map((swap) => (
                      <Card
                        key={swap.id}
                        className="bg-black/10 backdrop-blur-sm border-white/5 p-4 hover:bg-black/20 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge
                              className={
                                swap.type === "offre"
                                  ? "bg-lime-500/10 text-lime-400"
                                  : "bg-cyan-500/10 text-cyan-400"
                              }
                            >
                              {swap.type === "offre" ? "Offre" : "Demande"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-pink-400 hover:text-pink-300"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>

                          <div>
                            <h3 className="font-semibold text-white">
                              {swap.counterparty}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {swap.amount.toLocaleString()}€ -{" "}
                              {swap.interestRate}%
                            </p>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                          >
                            Voir détails
                          </Button>
                        </div>
                      </Card>
                    ))}

                    <Card className="bg-black/10 backdrop-blur-sm border-white/5 border-dashed p-4 flex items-center justify-center">
                      <div className="text-center">
                        <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Aucun favori</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Ajoutez des swaps à votre watchlist
                        </p>
                      </div>
                    </Card>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>

      {/* Modal de connexion pour visiteurs */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Accès membre requis
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Connectez-vous pour accéder au marketplace complet, calculateur
              avancé et notifications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                onClick={handleLogin}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
              >
                <Link to="/register">
                  <Plus className="h-4 w-4 mr-2" />
                  S'inscrire
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">
                🔒 Plateforme sécurisée avec vérification KYC
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SwapPublic;
