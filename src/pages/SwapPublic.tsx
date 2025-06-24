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
  User,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { SwapService, MarketplaceSwap } from "@/lib/swapService";

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
  const [swaps, setSwaps] = useState<MarketplaceSwap[]>([]);
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
  const [showSwapDetails, setShowSwapDetails] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<MarketplaceSwap | null>(
    null,
  );
  const [matchingInProgress, setMatchingInProgress] = useState<string | null>(
    null,
  );
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
      } else {
        loadPublicSwaps();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loadUserData = () => {
    // Charger les swaps depuis le marketplace global
    const marketplaceSwaps = SwapService.getMarketplaceSwaps();
    setSwaps(marketplaceSwaps);

    // Simulation des notifications pour les utilisateurs connectés
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

    setNotifications(mockNotifications);
  };

  // Charger les swaps même pour les visiteurs non connectés (version réduite)
  const loadPublicSwaps = () => {
    const marketplaceSwaps = SwapService.getMarketplaceSwaps();
    // Limiter à 3 swaps pour les visiteurs
    setSwaps(marketplaceSwaps.slice(0, 3));
  };

  // Fonction pour matcher/accepter un swap
  const handleMatchSwap = async (swapId: string) => {
    if (!isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }

    setMatchingInProgress(swapId);

    try {
      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Supprimer le swap du marketplace
      const success = SwapService.acceptSwap(swapId, user.id);

      if (success) {
        // Mettre à jour la liste locale
        setSwaps((prevSwaps) => prevSwaps.filter((swap) => swap.id !== swapId));

        // Afficher une notification de succès
        setNotifications((prev) => [
          {
            id: `match-${Date.now()}`,
            type: "swap",
            title: "🎉 Match réalisé !",
            description: `Vous avez accepté le swap ${swapId}. Le créateur va être notifié.`,
            time: "À l'instant",
            read: false,
          },
          ...prev,
        ]);

        // Afficher le message dans l'interface
        alert(
          `✅ Swap ${swapId} accepté avec succès ! Le créateur sera contacté.`,
        );
      } else {
        alert("❌ Erreur lors de l'acceptation du swap");
      }
    } catch (error) {
      console.error("Erreur lors du matching:", error);
      alert("❌ Erreur lors de l'acceptation du swap");
    } finally {
      setMatchingInProgress(null);
    }
  };

  // Fonction pour recharger les swaps
  const refreshSwaps = () => {
    if (isAuthenticated) {
      loadUserData();
    } else {
      loadPublicSwaps();
    }
  };

  // Filtrer les swaps avec le service
  const filteredSwaps = SwapService.filterSwaps(
    swaps,
    searchTerm,
    filterCategory,
    filterRisk,
  );

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

  const openSwapDetails = (swap: MarketplaceSwap) => {
    setSelectedSwap(swap);
    setShowSwapDetails(true);
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

                {/* Aperçu des swaps pour les visiteurs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                  {swaps.slice(0, 3).map((swap) => (
                    <Card
                      key={swap.id}
                      className="bg-black/20 backdrop-blur-sm border-white/10 p-4 hover:bg-black/30 transition-all duration-300"
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
                          <Badge className="bg-violet-500/10 text-violet-400">
                            {swap.interestRate}%
                          </Badge>
                        </div>

                        <div>
                          <h3 className="font-semibold text-white text-sm">
                            {swap.counterparty}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {swap.amount.toLocaleString()}€ - {swap.duration}{" "}
                            mois
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowLoginModal(true)}
                          className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                        >
                          Voir détails
                        </Button>
                      </div>
                    </Card>
                  ))}
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
                      {swaps.length}+
                    </div>
                    <p className="text-gray-400 mt-2">Swaps disponibles</p>
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
          </motion.div>
        ) : (
          /* Vue complète pour les utilisateurs connectés */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header avec bouton de rafraîchissement */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                Marketplace ({swaps.length} swaps disponibles)
              </h1>
              <Button
                onClick={refreshSwaps}
                variant="outline"
                size="sm"
                className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>

            {/* Filtres et recherche */}
            <Card className="bg-black/20 backdrop-blur-sm border-white/10 p-6 mb-6">
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
                              className={`${
                                swap.type === "offre"
                                  ? "bg-lime-500/10 text-lime-400 border-lime-500/20"
                                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              }`}
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
                                {swap.rating.toFixed(1)}
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
                            onClick={() => openSwapDetails(swap)}
                            className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                          >
                            <Info className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleMatchSwap(swap.id)}
                            disabled={matchingInProgress === swap.id}
                            className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                          >
                            {matchingInProgress === swap.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Handshake className="h-4 w-4 mr-1" />
                            )}
                            {matchingInProgress === swap.id
                              ? "En cours..."
                              : "Matcher"}
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

      {/* Modal de détails du swap */}
      <Dialog open={showSwapDetails} onOpenChange={setShowSwapDetails}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedSwap && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
                  <Building className="h-6 w-6 mr-3 text-violet-400" />
                  {selectedSwap.counterparty}
                </DialogTitle>
                <DialogDescription className="text-gray-300 text-lg">
                  {selectedSwap.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                  <Button
                    onClick={() => handleMatchSwap(selectedSwap.id)}
                    disabled={matchingInProgress === selectedSwap.id}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                  >
                    {matchingInProgress === selectedSwap.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Handshake className="h-4 w-4 mr-2" />
                    )}
                    {matchingInProgress === selectedSwap.id
                      ? "Matching en cours..."
                      : "Matcher avec ce swap"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Ajouter aux favoris
                  </Button>
                  <Button
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SwapPublic;
