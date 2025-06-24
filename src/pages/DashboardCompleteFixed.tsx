import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  TrendingDown,
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
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  Filter,
  Download,
  Upload,
  Send,
  Copy,
  ExternalLink,
  MapPin,
  Briefcase,
  DollarSign,
  Percent,
  Timer,
  Building,
  CreditCard,
  Globe,
  Link,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Phone,
  Video,
  Archive,
  Trash2,
  Edit,
  Share2,
  Bookmark,
  Flag,
  Minus,
  Handshake,
  Calculator,
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
}

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "interest" | "fee";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface Contact {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  avatar?: string;
  trustScore: number;
  totalSwaps: number;
  averageAmount: number;
  lastActive: string;
  verified: boolean;
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

const DashboardCompleteFixed = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCreateSwap, setShowCreateSwap] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSwapDetails, setShowSwapDetails] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<Swap | null>(null);
  const [newSwapForm, setNewSwapForm] = useState({
    type: "",
    amount: "",
    duration: "",
    interestRate: "",
    description: "",
    category: "",
    purpose: "",
    guarantees: "",
    repaymentSchedule: "monthly",
    earlyRepayment: false,
    insurance: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("swapeo_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      const demoSwaps: Swap[] = [
        {
          id: "SW-001",
          type: "demande",
          amount: 25000,
          duration: 12,
          interestRate: 3.5,
          counterparty: "TechStart Pro",
          status: "Actif",
          progress: 45,
          createdAt: "2024-01-15",
          description: "Financement équipement informatique",
          category: "Équipement",
          purpose:
            "Achat de matériel informatique pour développer notre activité",
          guarantees: "Matériel informatique + caution personnelle",
          repaymentSchedule: "monthly",
          earlyRepayment: true,
          insurance: true,
          createdBy: `${userData.firstName} ${userData.lastName}`,
          createdByCompany: userData.company,
          createdByTrustScore: userData.trustScore,
          estimatedReturn: 875,
          totalInterest: 875,
          monthlyPayment: 2156,
          nextPaymentDate: "2024-03-15",
          lastUpdated: "2024-01-20",
        },
        {
          id: "SW-002",
          type: "offre",
          amount: 15000,
          duration: 6,
          interestRate: 4.2,
          counterparty: "Green Solutions",
          status: "En recherche",
          progress: 0,
          createdAt: "2024-01-10",
          description: "Investissement dans startup écologique",
          category: "Investissement",
          purpose: "Financement croissance entreprise écologique",
          guarantees: "Garantie bancaire + assurance crédit",
          repaymentSchedule: "quarterly",
          earlyRepayment: false,
          insurance: true,
          createdBy: `${userData.firstName} ${userData.lastName}`,
          createdByCompany: userData.company,
          createdByTrustScore: userData.trustScore,
          estimatedReturn: 315,
          totalInterest: 315,
          monthlyPayment: 0,
          nextPaymentDate: null,
          lastUpdated: "2024-01-12",
        },
      ];

      const demoTransactions: Transaction[] = [
        {
          id: "TX-001",
          type: "deposit",
          amount: 5000,
          description: "Dépôt initial",
          date: "2024-01-15",
          status: "completed",
        },
        {
          id: "TX-002",
          type: "interest",
          amount: 125,
          description: "Intérêts SW-001",
          date: "2024-01-20",
          status: "completed",
        },
      ];

      const demoContacts: Contact[] = [
        {
          id: "C-001",
          name: "Marie Dupont",
          company: "TechStart Pro",
          email: "marie@techstart.fr",
          phone: "+33 6 12 34 56 78",
          trustScore: 94,
          totalSwaps: 8,
          averageAmount: 18500,
          lastActive: "Il y a 2 jours",
          verified: true,
        },
        {
          id: "C-002",
          name: "Jean Martin",
          company: "Green Solutions",
          email: "jean@greensol.fr",
          trustScore: 89,
          totalSwaps: 5,
          averageAmount: 22000,
          lastActive: "Il y a 1 semaine",
          verified: true,
        },
      ];

      const demoNotifications: Notification[] = [
        {
          id: "N-001",
          type: "swap",
          title: "Nouveau swap proposé",
          description: "Marie Dupont vous propose un swap de 25 000€",
          time: "Il y a 2h",
          read: false,
        },
        {
          id: "N-002",
          type: "payment",
          title: "Paiement reçu",
          description: "Intérêts de 125€ crédités sur votre compte",
          time: "Il y a 1 jour",
          read: true,
        },
      ];

      setSwaps(demoSwaps);
      setTransactions(demoTransactions);
      setContacts(demoContacts);
      setNotifications(demoNotifications);

      setTimeout(() => {
        setAnimatedBalance(userData.wallet?.balance || 42847);
        setLoading(false);
      }, 1000);
    } else {
      window.location.href = "/";
    }
  }, []);

  const handleCreateSwap = () => {
    if (
      !newSwapForm.type ||
      !newSwapForm.amount ||
      !newSwapForm.duration ||
      !newSwapForm.description ||
      !newSwapForm.category ||
      !newSwapForm.purpose ||
      !newSwapForm.guarantees
    ) {
      setMessage("❌ Veuillez remplir tous les champs requis");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const newSwap: Swap = {
      id: `SW-${Date.now().toString().slice(-3)}`,
      type: newSwapForm.type as "demande" | "offre",
      amount: parseInt(newSwapForm.amount),
      duration: parseInt(newSwapForm.duration),
      interestRate: parseFloat(newSwapForm.interestRate) || 3.5,
      counterparty: "En recherche...",
      status: "En recherche",
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0],
      description: newSwapForm.description,
      category: newSwapForm.category,
      purpose: newSwapForm.purpose,
      guarantees: newSwapForm.guarantees,
      repaymentSchedule: newSwapForm.repaymentSchedule,
      earlyRepayment: newSwapForm.earlyRepayment,
      insurance: newSwapForm.insurance,
      createdBy: `${user.firstName} ${user.lastName}`,
      createdByCompany: user.company,
      createdByTrustScore: user.trustScore,
      estimatedReturn:
        (parseInt(newSwapForm.amount) *
          (parseFloat(newSwapForm.interestRate) || 3.5)) /
        100,
      totalInterest:
        (parseInt(newSwapForm.amount) *
          (parseFloat(newSwapForm.interestRate) || 3.5)) /
        100,
      monthlyPayment:
        newSwapForm.type === "demande"
          ? parseInt(newSwapForm.amount) / parseInt(newSwapForm.duration)
          : 0,
      nextPaymentDate:
        newSwapForm.type === "demande"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : null,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setSwaps([newSwap, ...swaps]);
    setShowCreateSwap(false);
    setNewSwapForm({
      type: "",
      amount: "",
      duration: "",
      interestRate: "",
      description: "",
      category: "",
      purpose: "",
      guarantees: "",
      repaymentSchedule: "monthly",
      earlyRepayment: false,
      insurance: false,
    });

    setMessage(
      `✅ Swap créé avec succès ! Montant: ${parseInt(newSwapForm.amount).toLocaleString()}€ - ID: ${newSwap.id}`,
    );
    setTimeout(() => setMessage(""), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem("swapeo_token");
    localStorage.removeItem("swapeo_user");
    window.location.href = "/";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement de votre espace...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  const walletData = user?.wallet || {
    balance: 42847,
    totalDeposited: 50000,
    totalWithdrawn: 7153,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Handshake className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SWAPEO</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </Button>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-sm sm:text-base">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center text-green-600">
                      <Star className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">
                        {user.trustScore || 85}%
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Message de feedback */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg border rounded-lg p-4 max-w-md w-full mx-4"
          >
            <p className="text-center font-medium">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="swaps">Mes Swaps</TabsTrigger>
            <TabsTrigger value="wallet">Portefeuille</TabsTrigger>
            <TabsTrigger value="network">Réseau</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Solde Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(walletData.balance)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Handshake className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Swaps Actifs
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {swaps.filter((s) => s.status === "Actif").length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-lime-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Rendement Moy.
                    </p>
                    <p className="text-2xl font-bold text-gray-900">3.8%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Contacts
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contacts.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions Rapides
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => setShowCreateSwap(true)}
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white p-4 h-auto flex-col"
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Créer un Swap</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-lime-200 hover:bg-lime-50 p-4 h-auto flex-col"
                >
                  <Search className="h-6 w-6 mb-2 text-lime-600" />
                  <span>Rechercher des Opportunités</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-pink-200 hover:bg-pink-50 p-4 h-auto flex-col"
                >
                  <Users className="h-6 w-6 mb-2 text-pink-600" />
                  <span>Inviter des Contacts</span>
                </Button>
              </div>
            </Card>

            {/* Liste des swaps récents */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mes Swaps Récents
                </h3>
                <Button variant="ghost" size="sm">
                  Voir tout <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {swaps.slice(0, 3).map((swap) => (
                  <div
                    key={swap.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedSwap(swap);
                      setShowSwapDetails(true);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          swap.type === "demande"
                            ? "bg-orange-100"
                            : "bg-lime-100"
                        }`}
                      >
                        {swap.type === "demande" ? (
                          <ArrowDownRight
                            className={`h-5 w-5 ${
                              swap.type === "demande"
                                ? "text-orange-600"
                                : "text-lime-600"
                            }`}
                          />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-lime-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {swap.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(swap.amount)} • {swap.duration} mois
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          swap.status === "Actif"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {swap.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {swap.interestRate}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Mes Swaps */}
          <TabsContent value="swaps" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mes Swaps</h2>
                <p className="text-gray-600">Gérez vos swaps financiers</p>
              </div>
              <Button
                onClick={() => setShowCreateSwap(true)}
                className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Swap
              </Button>
            </div>

            <div className="grid gap-6">
              {swaps.map((swap) => (
                <Card
                  key={swap.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          swap.type === "demande"
                            ? "bg-orange-100"
                            : "bg-lime-100"
                        }`}
                      >
                        {swap.type === "demande" ? (
                          <ArrowDownRight className="h-6 w-6 text-orange-600" />
                        ) : (
                          <ArrowUpRight className="h-6 w-6 text-lime-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {swap.description}
                          </h3>
                          <Badge
                            className={
                              swap.type === "demande"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-lime-100 text-lime-700"
                            }
                          >
                            {swap.type === "demande" ? "Demande" : "Offre"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Montant:</span>{" "}
                            {formatCurrency(swap.amount)}
                          </div>
                          <div>
                            <span className="font-medium">Durée:</span>{" "}
                            {swap.duration} mois
                          </div>
                          <div>
                            <span className="font-medium">Taux:</span>{" "}
                            {swap.interestRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge
                        className={
                          swap.status === "Actif"
                            ? "bg-green-100 text-green-700"
                            : swap.status === "En recherche"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }
                      >
                        {swap.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSwap(swap);
                          setShowSwapDetails(true);
                        }}
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                  {swap.status === "Actif" && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progression</span>
                        <span>{swap.progress}%</span>
                      </div>
                      <Progress value={swap.progress} className="h-2" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Portefeuille */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Mon Portefeuille
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Gérez vos finances
                </p>
              </div>
            </div>

            {/* Carte principale du portefeuille */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-200" />
                    <h3 className="text-sm sm:text-lg font-semibold">
                      Portefeuille Principal
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-cyan-200 hover:text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8"
                    onClick={() => setHideBalance(!hideBalance)}
                  >
                    {hideBalance ? (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
                <div className="mb-4 sm:mb-6">
                  <p className="text-cyan-200 text-xs sm:text-sm mb-1">
                    Solde disponible
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold">
                    {hideBalance ? "••••••" : formatCurrency(animatedBalance)}
                  </p>
                </div>
                <div className="flex space-x-2 sm:space-x-3">
                  <Button
                    size="sm"
                    className="bg-lime-500/30 hover:bg-lime-500/40 text-white border-0 text-xs sm:text-sm px-2 sm:px-4"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Ajouter des fonds</span>
                    <span className="sm:hidden">Ajouter</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-pink-500/20 hover:bg-pink-500/30 text-white border-pink-300/40 text-xs sm:text-sm px-2 sm:px-4"
                  >
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Retirer</span>
                    <span className="sm:hidden">Retrait</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <ArrowDownRight className="h-4 w-4 sm:h-6 sm:w-6 text-cyan-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(walletData.totalDeposited)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Total déposé</p>
              </Card>
              <Card className="p-4 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <ArrowUpRight className="h-4 w-4 sm:h-6 sm:w-6 text-lime-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(walletData.totalWithdrawn)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Total retiré</p>
              </Card>
              <Card className="p-4 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-violet-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    walletData.balance -
                      walletData.totalDeposited +
                      walletData.totalWithdrawn,
                  )}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Gains nets</p>
              </Card>
            </div>

            {/* Historique des transactions */}
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Historique des transactions
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Exporter</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          transaction.type === "deposit"
                            ? "bg-cyan-100"
                            : transaction.type === "withdraw"
                              ? "bg-pink-100"
                              : transaction.type === "interest"
                                ? "bg-lime-100"
                                : "bg-orange-100"
                        }`}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
                        ) : transaction.type === "withdraw" ? (
                          <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                        ) : transaction.type === "interest" ? (
                          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-lime-600" />
                        ) : (
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-semibold text-sm sm:text-base ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Réseau */}
          <TabsContent value="network" className="space-y-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Mon Réseau
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Vos partenaires de confiance
                </p>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Ajouter un contact</span>
                  <span className="sm:hidden">Ajouter contact</span>
                </Button>
                <Button variant="outline" className="text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Contact aléatoire</span>
                  <span className="sm:hidden">Aléatoire</span>
                </Button>
                <Button variant="outline" className="text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Inviter par email</span>
                  <span className="sm:hidden">Inviter</span>
                </Button>
              </div>
            </div>

            {/* Statistiques du réseau */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
              <Card className="p-3 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-cyan-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {contacts.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Contacts actifs
                </p>
              </Card>
              <Card className="p-3 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Handshake className="h-4 w-4 sm:h-6 sm:w-6 text-lime-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  12
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Partenariats</p>
              </Card>
              <Card className="p-3 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Star className="h-4 w-4 sm:h-6 sm:w-6 text-violet-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  94%
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Score moyen</p>
              </Card>
              <Card className="p-3 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  +18%
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Croissance</p>
              </Card>
            </div>

            {/* Liste des contacts */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mes contacts
              </h3>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">
                            {contact.name}
                          </p>
                          {contact.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {contact.company}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">
                            {contact.trustScore}% • {contact.totalSwaps} swaps
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contacter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal Création de Swap */}
      <Dialog open={showCreateSwap} onOpenChange={setShowCreateSwap}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau swap</DialogTitle>
            <DialogDescription>
              Définissez les paramètres de votre swap financier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de swap</Label>
                <Select
                  value={newSwapForm.type}
                  onValueChange={(value) =>
                    setNewSwapForm({ ...newSwapForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demande">
                      Demande de financement
                    </SelectItem>
                    <SelectItem value="offre">
                      Offre d'investissement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="25000"
                  value={newSwapForm.amount}
                  onChange={(e) =>
                    setNewSwapForm({ ...newSwapForm, amount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (mois)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="12"
                  value={newSwapForm.duration}
                  onChange={(e) =>
                    setNewSwapForm({ ...newSwapForm, duration: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestRate">Taux d'intérêt (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="3.5"
                  value={newSwapForm.interestRate}
                  onChange={(e) =>
                    setNewSwapForm({
                      ...newSwapForm,
                      interestRate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={newSwapForm.category}
                onValueChange={(value) =>
                  setNewSwapForm({ ...newSwapForm, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Équipement">Équipement</SelectItem>
                  <SelectItem value="Immobilier">Immobilier</SelectItem>
                  <SelectItem value="Stocks">Stocks</SelectItem>
                  <SelectItem value="Expansion">Expansion</SelectItem>
                  <SelectItem value="Investissement">Investissement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Ex: Financement équipement informatique"
                value={newSwapForm.description}
                onChange={(e) =>
                  setNewSwapForm({
                    ...newSwapForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Objectif détaillé</Label>
              <Textarea
                id="purpose"
                placeholder="Décrivez l'utilisation prévue des fonds..."
                value={newSwapForm.purpose}
                onChange={(e) =>
                  setNewSwapForm({ ...newSwapForm, purpose: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantees">Garanties proposées</Label>
              <Textarea
                id="guarantees"
                placeholder="Décrivez les garanties que vous proposez..."
                value={newSwapForm.guarantees}
                onChange={(e) =>
                  setNewSwapForm({ ...newSwapForm, guarantees: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateSwap(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateSwap}
                className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
              >
                Créer le swap
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Détails du Swap */}
      <Dialog open={showSwapDetails} onOpenChange={setShowSwapDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du Swap #{selectedSwap?.id}</DialogTitle>
          </DialogHeader>
          {selectedSwap && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                    Informations financières
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedSwap.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span className="font-semibold">
                        {selectedSwap.duration} mois
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taux d'intérêt:</span>
                      <span className="font-semibold">
                        {selectedSwap.interestRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Intérêts totaux:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(selectedSwap.totalInterest || 0)}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                    Planning et échéances
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créé le:</span>
                      <span className="font-semibold">
                        {formatDate(selectedSwap.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prochain paiement:</span>
                      <span className="font-semibold">
                        {selectedSwap.nextPaymentDate
                          ? formatDate(selectedSwap.nextPaymentDate)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paiement mensuel:</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedSwap.monthlyPayment || 0)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  Description et objectifs
                </h4>
                <p className="text-gray-700 mb-4">{selectedSwap.description}</p>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">
                      Objectif:
                    </h5>
                    <p className="text-gray-600">{selectedSwap.purpose}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">
                      Garanties:
                    </h5>
                    <p className="text-gray-600">{selectedSwap.guarantees}</p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSwapDetails(false)}
                >
                  Fermer
                </Button>
                <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                  Contacter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCompleteFixed;
