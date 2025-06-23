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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  LogOut,
  Eye,
  EyeOff,
  Search,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Star,
  Euro,
  TrendingUp,
  Users,
  Shield,
  HelpCircle,
  Settings,
  Home,
  Activity,
  User,
  Clock,
  Zap,
  Heart,
  Gift,
  Award,
  Sparkles,
  Target,
  Coffee,
  BookOpen,
  PlayCircle,
  MessageCircle,
  PhoneCall,
  Mail,
  X,
  Info,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  simplified?: boolean;
}

const DashboardSimplePublic = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [showCreateSwap, setShowCreateSwap] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [newSwap, setNewSwap] = useState({
    type: "",
    amount: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("swapeo_user");
    const savedToken = localStorage.getItem("swapeo_token");

    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);

        // Vérifier que les données essentielles sont présentes
        if (!userData.firstName || !userData.email) {
          console.error("Données utilisateur incomplètes", userData);
          localStorage.removeItem("swapeo_user");
          localStorage.removeItem("swapeo_token");
          window.location.href = "/login";
          return;
        }

        setUser(userData);

        // Check if it's first time
        const hasSeenOnboarding = localStorage.getItem("swapeo_onboarding");
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
          localStorage.setItem("swapeo_onboarding", "true");
        }

        loadSwaps();
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        localStorage.removeItem("swapeo_user");
        localStorage.removeItem("swapeo_token");
        window.location.href = "/login";
        return;
      }
    } else {
      window.location.href = "/login";
    }
    setLoading(false);
  }, []);

  // Animation du solde
  useEffect(() => {
    if (user?.wallet?.balance) {
      const duration = 2000;
      const increment = user.wallet.balance / (duration / 100);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= user.wallet.balance) {
          setAnimatedBalance(user.wallet.balance);
          clearInterval(timer);
        } else {
          setAnimatedBalance(Math.floor(current));
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [user?.wallet?.balance]);

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
      } else {
        // Fallback vers données demo
        loadDemoSwaps();
      }
    } catch (error) {
      // API indisponible - utiliser données demo
      console.log("API indisponible, chargement des données demo");
      loadDemoSwaps();
    }
  };

  const loadDemoSwaps = () => {
    // Données exemple adaptées au rôle de l'utilisateur
    const baseSwaps = [
      {
        id: "SW-001",
        type: "demande" as const,
        amount: 5000,
        duration: 3,
        interestRate: 2.5,
        counterparty: "Marie L. - Restaurant",
        status: "Actif",
        progress: 60,
        createdAt: "2024-01-20",
        description: "Achat équipement cuisine",
        daysRemaining: 8,
        simplified: true,
      },
      {
        id: "SW-002",
        type: "offre" as const,
        amount: 2000,
        duration: 6,
        interestRate: 3.0,
        counterparty: "Thomas K. - E-commerce",
        status: "Terminé",
        progress: 100,
        createdAt: "2024-01-10",
        description: "Stock produits",
        daysRemaining: 0,
        simplified: true,
      },
      {
        id: "SW-003",
        type: "demande" as const,
        amount: 8000,
        duration: 4,
        interestRate: 3.2,
        counterparty: "Paul D. - Boulangerie",
        status: "En recherche",
        progress: 15,
        createdAt: "2024-01-22",
        description: "Rénovation magasin",
        daysRemaining: 25,
        simplified: true,
      },
    ];

    setSwaps(baseSwaps);
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
        setMessage("🎉 Votre demande a été créée avec succès !");
        const createdSwap: Swap = {
          ...data.swap,
          counterparty: "Recherche en cours...",
          status: "En recherche",
          progress: 0,
          simplified: true,
        };
        setSwaps([createdSwap, ...swaps]);
        setShowCreateSwap(false);
        setNewSwap({ type: "", amount: "", duration: "", description: "" });
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (error) {
      setMessage("❌ Une erreur s'est produite. Veuillez réessayer.");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Préparation de votre espace...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  const walletData = user?.wallet || {
    balance: 12547,
    totalDeposited: 15000,
    totalWithdrawn: 2453,
  };

  const getSimpleStatus = (status: string) => {
    switch (status) {
      case "En cours":
      case "Actif":
        return {
          text: "En cours",
          color: "bg-green-100 text-green-700",
          icon: Clock,
        };
      case "Terminé":
        return {
          text: "Terminé",
          color: "bg-blue-100 text-blue-700",
          icon: CheckCircle,
        };
      case "En recherche":
        return {
          text: "En recherche",
          color: "bg-yellow-100 text-yellow-700",
          icon: Search,
        };
      default:
        return {
          text: status,
          color: "bg-gray-100 text-gray-700",
          icon: AlertCircle,
        };
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "swaps":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mes Swaps</h2>
                <p className="text-gray-600">Vos échanges financiers</p>
              </div>
              <Button
                onClick={() => setShowCreateSwap(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau swap
              </Button>
            </div>

            <div className="grid gap-4">
              {swaps.map((swap, index) => {
                const statusInfo = getSimpleStatus(swap.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={swap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <StatusIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {swap.counterparty}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {swap.description}
                            </p>
                          </div>
                        </div>
                        <Badge className={statusInfo.color}>
                          {statusInfo.text}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Montant</p>
                          <p className="text-lg font-bold text-gray-900">
                            {swap.amount.toLocaleString()} €
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dur��e</p>
                          <p className="text-lg font-bold text-gray-900">
                            {swap.duration} mois
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Taux</p>
                          <p className="text-lg font-bold text-green-600">
                            {swap.interestRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Échéance</p>
                          <p className="text-lg font-bold text-gray-900">
                            {swap.daysRemaining
                              ? `${swap.daysRemaining}j`
                              : "Terminé"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progression</span>
                          <span>{swap.progress}%</span>
                        </div>
                        <Progress value={swap.progress} className="h-3" />
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        Voir les détails
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}

              {swaps.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucun swap pour l'instant
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Créez votre premier échange financier pour commencer
                  </p>
                  <Button
                    onClick={() => setShowCreateSwap(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer mon premier swap
                  </Button>
                </Card>
              )}
            </div>
          </div>
        );

      case "help":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Centre d'aide
              </h2>
              <p className="text-gray-600">Tout ce que vous devez savoir</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Guide du débutant
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Apprenez les bases de Swapeo en 5 minutes
                </p>
                <Button variant="outline" className="w-full">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Commencer le guide
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Chat en direct
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Parlez à notre équipe support
                </p>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ouvrir le chat
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <PhoneCall className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Assistance téléphone
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">Lun-Ven 9h-18h</p>
                <Button variant="outline" className="w-full">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  01 23 45 67 89
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                </div>
                <p className="text-gray-600 mb-4">Réponse sous 24h</p>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  contact@swapeo.fr
                </Button>
              </Card>
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    💡 Le saviez-vous ?
                  </h3>
                  <p className="text-blue-800">
                    Nos conseillers sont disponibles pour vous accompagner dans
                    votre première utilisation de Swapeo, sans frais
                    supplémentaires.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Section principale - Wallet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium opacity-90">
                      Votre solde
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold">
                        {hideBalance
                          ? "••••••"
                          : `${animatedBalance.toLocaleString()} €`}
                      </span>
                      <button
                        onClick={() => setHideBalance(!hideBalance)}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        {hideBalance ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-300">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+2.8%</span>
                    </div>
                    <p className="text-xs opacity-75">ce mois</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                        <ArrowDownRight className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Ajouter de l'argent</DialogTitle>
                        <DialogDescription>
                          Alimentez votre compte Swapeo
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Montant à ajouter</Label>
                          <Input
                            type="number"
                            placeholder="100"
                            className="mt-1"
                          />
                        </div>
                        <Button className="w-full bg-blue-500 hover:bg-blue-600">
                          Confirmer l'ajout
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Retirer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Retirer de l'argent</DialogTitle>
                        <DialogDescription>
                          Transférez vers votre compte bancaire
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Montant à retirer</Label>
                          <Input
                            type="number"
                            placeholder="50"
                            max={walletData.balance}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Disponible: {walletData.balance.toLocaleString()} €
                          </p>
                        </div>
                        <Button className="w-full bg-blue-500 hover:bg-blue-600">
                          Confirmer le retrait
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card
                  className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200"
                  onClick={() => setShowCreateSwap(true)}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Nouveau swap</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Créer un échange
                    </p>
                  </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Rechercher</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Trouver des swaps
                    </p>
                  </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Réseau</h4>
                    <p className="text-xs text-gray-600 mt-1">Voir contacts</p>
                  </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <HelpCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Aide</h4>
                    <p className="text-xs text-gray-600 mt-1">Support</p>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Aperçu swaps récents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Activité récente
                </h3>
                <Button
                  variant="ghost"
                  className="text-blue-600"
                  onClick={() => setActiveSection("swaps")}
                >
                  Voir tout
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {swaps.length > 0 ? (
                <div className="space-y-3">
                  {swaps.slice(0, 3).map((swap, index) => {
                    const statusInfo = getSimpleStatus(swap.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <Card key={swap.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <StatusIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {swap.counterparty}
                              </p>
                              <p className="text-sm text-gray-600">
                                {swap.amount.toLocaleString()} €
                              </p>
                            </div>
                          </div>
                          <Badge className={`${statusInfo.color} text-xs`}>
                            {statusInfo.text}
                          </Badge>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center bg-gray-50">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-6 w-6 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Aucune activité
                  </h4>
                  <p className="text-sm text-gray-600">
                    Créez votre premier swap pour commencer
                  </p>
                </Card>
              )}
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Swapeo</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    Membre depuis janvier 2024
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message de feedback */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className={`mb-6 p-4 rounded-2xl border ${
                message.includes("🎉")
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "home", label: "Accueil", icon: Home },
              { id: "swaps", label: "Mes Swaps", icon: Activity },
              { id: "help", label: "Aide", icon: HelpCircle },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeSection === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center space-x-2 pb-4 border-b-2 transition-all duration-200 ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TabIcon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu principal */}
        {renderSection()}
      </div>

      {/* Modal Création de Swap */}
      <Dialog open={showCreateSwap} onOpenChange={setShowCreateSwap}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouveau swap</DialogTitle>
            <DialogDescription>
              Créez votre demande ou offre de financement en quelques clics
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700">Type de swap</Label>
              <Select
                value={newSwap.type}
                onValueChange={(value) =>
                  setNewSwap({ ...newSwap, type: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choisissez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demande">
                    💰 J'ai besoin d'argent (demande)
                  </SelectItem>
                  <SelectItem value="offre">
                    🏦 Je peux prêter (offre)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Montant (€)</Label>
                <Input
                  type="number"
                  placeholder="1 000"
                  value={newSwap.amount}
                  onChange={(e) =>
                    setNewSwap({ ...newSwap, amount: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700">Durée (mois)</Label>
                <Input
                  type="number"
                  placeholder="6"
                  value={newSwap.duration}
                  onChange={(e) =>
                    setNewSwap({ ...newSwap, duration: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Description</Label>
              <Textarea
                placeholder="Décrivez brièvement votre besoin..."
                value={newSwap.description}
                onChange={(e) =>
                  setNewSwap({ ...newSwap, description: e.target.value })
                }
                className="mt-1 h-20 resize-none"
              />
            </div>

            <Button
              onClick={handleCreateSwap}
              disabled={!newSwap.type || !newSwap.amount || !newSwap.duration}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer le swap
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Onboarding */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">
              🎉 Bienvenue sur Swapeo !
            </DialogTitle>
            <DialogDescription className="text-center">
              Découvrez votre dashboard en quelques étapes simples
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Votre espace personnel est prêt !
              </h3>
              <p className="text-gray-600">
                Vous pouvez maintenant créer vos premiers swaps, gérer votre
                portefeuille et accéder à notre support en cas de besoin.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800">
                  Compte vérifié et sécurisé
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Protection 100% garantie
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Heart className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-purple-800">
                  Support dédié inclus
                </span>
              </div>
            </div>

            <Button
              onClick={() => setShowOnboarding(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Commencer à utiliser Swapeo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardSimplePublic;
