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
import jsPDF from "jspdf";

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
  // Détails complets
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
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    message: "",
  });
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<Swap | null>(null);
  const [showSwapDetails, setShowSwapDetails] = useState(false);
  const [newSwapId, setNewSwapId] = useState<string | null>(null);
  const [newSwap, setNewSwap] = useState({
    type: "",
    amount: "",
    duration: "",
    description: "",
  });

  // Stats calculées
  const [stats, setStats] = useState({
    totalSwaps: 0,
    activeSwaps: 0,
    totalEarnings: 0,
    averageReturn: 0,
    successRate: 0,
    trustScore: 0,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("swapeo_user");
    const savedToken = localStorage.getItem("swapeo_token");

    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        if (!userData.firstName || !userData.email) {
          localStorage.removeItem("swapeo_user");
          localStorage.removeItem("swapeo_token");
          window.location.href = "/login";
          return;
        }

        setUser(userData);
        loadAllData();
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

  const loadAllData = () => {
    loadSwaps();
    loadTransactions();
    loadContacts();
    loadNotifications();
  };

  const loadSwaps = () => {
    const demoSwaps: Swap[] = [
      {
        id: "SW-001",
        type: "demande",
        amount: 15000,
        duration: 6,
        interestRate: 3.2,
        counterparty: "Marie Laurent",
        status: "Actif",
        progress: 75,
        createdAt: "2024-01-15",
        description: "Extension restaurant - nouveaux équipements",
        daysRemaining: 8,
        matchingScore: 96,
        category: "Restauration",
        riskLevel: "low",
        verified: true,
      },
      {
        id: "SW-002",
        type: "offre",
        amount: 8000,
        duration: 4,
        interestRate: 2.8,
        counterparty: "Thomas Kraft",
        status: "Terminé",
        progress: 100,
        createdAt: "2024-01-10",
        description: "Stock e-commerce - saison haute",
        daysRemaining: 0,
        matchingScore: 94,
        category: "E-commerce",
        riskLevel: "low",
        verified: true,
      },
    ];
    setSwaps(demoSwaps);
    updateUserStats(demoSwaps);
  };

  const loadTransactions = () => {
    const demoTransactions: Transaction[] = [
      {
        id: "TX-001",
        type: "deposit",
        amount: 10000,
        description: "Dépôt initial",
        date: "2024-01-20",
        status: "completed",
      },
      {
        id: "TX-002",
        type: "interest",
        amount: 224,
        description: "Intérêts reçus - SW-002",
        date: "2024-01-18",
        status: "completed",
      },
    ];
    setTransactions(demoTransactions);
  };

  const loadContacts = () => {
    const demoContacts: Contact[] = [
      {
        id: "C-001",
        name: "Marie Laurent",
        company: "Le Bistrot Moderne",
        trustScore: 96,
        totalSwaps: 8,
        averageAmount: 12500,
        lastActive: "Il y a 2h",
        verified: true,
      },
    ];
    setContacts(demoContacts);
  };

  const loadNotifications = () => {
    const demoNotifications: Notification[] = [
      {
        id: "N-001",
        type: "swap",
        title: "Nouveau remboursement reçu",
        description: "Thomas Kraft a remboursé 2 240€ pour SW-002",
        time: "Il y a 2h",
        read: false,
      },
    ];
    setNotifications(demoNotifications);
  };

  const updateUserStats = (updatedSwaps: Swap[]) => {
    const totalSwaps = updatedSwaps.length;
    const activeSwaps = updatedSwaps.filter((s) => s.status === "Actif").length;
    const completedSwaps = updatedSwaps.filter((s) => s.status === "Terminé");
    const totalEarnings = completedSwaps.reduce(
      (sum, swap) => sum + (swap.amount * swap.interestRate) / 100,
      0,
    );
    const averageReturn =
      completedSwaps.length > 0
        ? completedSwaps.reduce((sum, swap) => sum + swap.interestRate, 0) /
          completedSwaps.length
        : 0;
    const successRate =
      totalSwaps > 0 ? (completedSwaps.length / totalSwaps) * 100 : 0;

    setStats({
      totalSwaps,
      activeSwaps,
      totalEarnings,
      averageReturn,
      successRate,
      trustScore: user?.trustScore || 85,
    });
  };

  const handleCreateSwap = () => {
    try {
      // Validation simple et rapide
      if (
        !newSwap.type ||
        !newSwap.amount ||
        !newSwap.duration ||
        !newSwap.description
      ) {
        setMessage("❌ Veuillez remplir tous les champs");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const amount = parseInt(newSwap.amount);
      const duration = parseInt(newSwap.duration);

      if (isNaN(amount) || amount < 1000) {
        setMessage("❌ Montant minimum: 1 000€");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      if (isNaN(duration) || duration < 1) {
        setMessage("❌ Durée minimum: 1 mois");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const currentDate = new Date();
      const interestRate = newSwap.type === "demande" ? 3.5 : 3.0;

      // Générer des données automatiques intelligentes
      const categories = [
        "Tech & Digital",
        "Commerce",
        "Services",
        "Restauration",
        "Industrie",
      ];
      const purposes = [
        "Développement",
        "Équipement",
        "Stock",
        "Expansion",
        "Innovation",
      ];
      const guarantees = [
        "Caution personnelle",
        "Garantie bancaire",
        "Nantissement",
        "Hypothèque",
      ];

      const demoSwap: Swap = {
        id: `SW-${Date.now()}`,
        type: newSwap.type as "demande" | "offre",
        amount: amount,
        duration: duration,
        interestRate: interestRate,
        counterparty: "Recherche en cours...",
        status: "En recherche",
        progress: 0,
        createdAt: currentDate.toISOString(),
        description: newSwap.description,
        daysRemaining: duration * 30,
        matchingScore: Math.floor(Math.random() * 15) + 85,
        category: categories[Math.floor(Math.random() * categories.length)],
        riskLevel: amount > 20000 ? "medium" : "low",
        verified: false,
        // Données générées automatiquement
        purpose: purposes[Math.floor(Math.random() * purposes.length)],
        guarantees: guarantees[Math.floor(Math.random() * guarantees.length)],
        repaymentSchedule: "monthly",
        earlyRepayment: true,
        insurance: amount > 15000,
        createdBy: `${user.firstName} ${user.lastName}`,
        createdByCompany: user.company || "Particulier",
        createdByTrustScore: user.trustScore || 85,
        estimatedReturn: Math.round((amount * interestRate) / 100),
        totalInterest: Math.round(
          (amount * interestRate * duration) / (100 * 12),
        ),
        monthlyPayment: Math.round(
          (amount * (1 + interestRate / 100)) / duration,
        ),
        nextPaymentDate: null,
        lastUpdated: currentDate.toISOString(),
      };

      // Mise à jour immédiate avec animation
      const updatedSwaps = [demoSwap, ...swaps];
      setSwaps(updatedSwaps);
      updateUserStats(updatedSwaps);

      // Réinitialisation du formulaire
      setShowCreateSwap(false);
      setNewSwap({
        type: "",
        amount: "",
        duration: "",
        description: "",
      });

      // Confirmation immédiate détaillée
      const successMessage = `✅ SUCCÈS ! Votre swap "${demoSwap.description}" de ${formatCurrency(amount)} sur ${duration} mois a été créé avec l'ID: ${demoSwap.id}`;
      setMessage(successMessage);
      setTimeout(() => setMessage(""), 8000);

      // Redirection immédiate vers l'onglet swaps pour voir le nouveau swap
      setActiveSection("swaps");

      // Marquer le nouveau swap pour le mettre en évidence
      setNewSwapId(demoSwap.id);
      setTimeout(() => {
        setNewSwapId(null);
      }, 8000);
    } catch (error) {
      console.error("Erreur création swap:", error);
      setMessage("❌ Erreur. Veuillez réessayer.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const viewSwapDetails = (swap: Swap) => {
    setSelectedSwap(swap);
    setShowSwapDetails(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Actif":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "En recherche":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Terminé":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRepaymentScheduleText = (schedule: string) => {
    switch (schedule) {
      case "monthly":
        return "Mensuel";
      case "quarterly":
        return "Trimestriel";
      case "end":
        return "En fin de période";
      default:
        return "Mensuel";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("swapeo_token");
    localStorage.removeItem("swapeo_user");
    window.location.href = "/";
  };

  const handleWalletDeposit = (amount: number) => {
    const updatedUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        totalDeposited: user.wallet.totalDeposited + amount,
      },
    };
    setUser(updatedUser);
    localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));

    const demoTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "deposit",
      amount: amount,
      description: `Dépôt de ${amount}€`,
      date: new Date().toISOString(),
      status: "completed",
    };
    setTransactions([demoTransaction, ...transactions]);

    setMessage(`✅ Dépôt de ${amount}€ effectué avec succès !`);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleWalletWithdraw = (amount: number) => {
    if (amount > user.wallet.balance) {
      setMessage("❌ Solde insuffisant pour ce retrait");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const updatedUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance - amount,
        totalWithdrawn: user.wallet.totalWithdrawn + amount,
      },
    };
    setUser(updatedUser);
    localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));

    const demoTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "withdraw",
      amount: -amount,
      description: `Retrait de ${amount}€`,
      date: new Date().toISOString(),
      status: "completed",
    };
    setTransactions([demoTransaction, ...transactions]);

    setMessage(`✅ Retrait de ${amount}€ effectué avec succès !`);
    setTimeout(() => setMessage(""), 4000);
  };

  const addFictiveContact = () => {
    const fictiveContacts = [
      {
        name: "Alexandre Dubois",
        company: "TechVision Startup",
        trustScore: 91,
      },
      { name: "Camille Moreau", company: "Green Food Co", trustScore: 87 },
      { name: "Julien Bernard", company: "Artisan Plus", trustScore: 93 },
      { name: "Emma Rousseau", company: "Digital Market", trustScore: 89 },
      { name: "Lucas Martin", company: "Innovation Lab", trustScore: 95 },
    ];

    const availableContacts = fictiveContacts.filter(
      (fc) => !contacts.some((c) => c.name === fc.name),
    );

    if (availableContacts.length === 0) {
      setMessage("❌ Tous les contacts fictifs ont été ajoutés");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const randomContact =
      availableContacts[Math.floor(Math.random() * availableContacts.length)];

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: randomContact.name,
      company: randomContact.company,
      avatar: "",
      trustScore: randomContact.trustScore,
      totalSwaps: Math.floor(Math.random() * 15) + 1,
      averageAmount: Math.floor(Math.random() * 20000) + 5000,
      lastActive: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      ).toISOString(),
      verified: true,
    };

    setContacts([newContact, ...contacts]);
    setMessage(`✅ ${randomContact.name} ajouté(e) à votre réseau !`);
    setTimeout(() => setMessage(""), 4000);
  };

  const generateInvoicePDF = (transaction: Transaction) => {
    setGeneratingPDF(true);

    setTimeout(() => {
      const pdf = new jsPDF();

      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(59, 130, 246);
      pdf.text("SWAPEO", 20, 30);

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Facture de transaction", 20, 50);

      // User info
      pdf.text(`Client: ${user.firstName} ${user.lastName}`, 20, 70);
      pdf.text(`Email: ${user.email}`, 20, 80);

      // Transaction details
      pdf.text("Détails de la transaction:", 20, 100);
      pdf.text(`ID: ${transaction.id}`, 20, 115);
      pdf.text(`Description: ${transaction.description}`, 20, 125);
      pdf.text(`Montant: ${transaction.amount}€`, 20, 135);
      pdf.text(
        `Date: ${new Date(transaction.date).toLocaleDateString("fr-FR")}`,
        20,
        145,
      );
      pdf.text(
        `Statut: ${transaction.status === "completed" ? "Terminé" : "En cours"}`,
        20,
        155,
      );

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Cette facture a été générée automatiquement", 20, 280);

      pdf.save(`Facture_${transaction.id}.pdf`);

      setGeneratingPDF(false);
      setMessage("✅ Facture PDF téléchargée !");
      setTimeout(() => setMessage(""), 3000);
    }, 1000);
  };

  const handleInviteUser = () => {
    setMessage(`✅ Invitation envoyée à ${inviteForm.email} !`);
    setShowInviteDialog(false);
    setInviteForm({ email: "", firstName: "", lastName: "", message: "" });
    setTimeout(() => setMessage(""), 4000);
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
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Swapeo</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
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
                        {stats.trustScore}%
                      </span>
                    </div>
                  </div>
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

      {/* Message de feedback */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className={`${
                message.includes("SUCCÈS") || message.includes("✅")
                  ? "bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 text-green-800 shadow-xl"
                  : message.includes("❌")
                    ? "bg-red-50 border border-red-200 text-red-800 shadow-lg"
                    : "bg-blue-50 border border-blue-200 text-blue-800 shadow-lg"
              } px-8 py-4 rounded-xl max-w-lg`}
            >
              <div className="flex items-center space-x-2">
                {message.includes("SUCCÈS") || message.includes("✅") ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : message.includes("❌") ? (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                ) : (
                  <Info className="h-6 w-6 text-blue-600" />
                )}
                <span className="font-medium text-sm">{message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <Tabs
          value={activeSection}
          onValueChange={setActiveSection}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid mb-8">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="swaps" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Swaps</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Portefeuille</span>
            </TabsTrigger>
            <TabsTrigger
              value="network"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Réseau</span>
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Solde total</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {hideBalance
                          ? "••••••"
                          : formatCurrency(animatedBalance)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setHideBalance(!hideBalance)}
                      >
                        {hideBalance ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center text-green-600 mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        +{stats.averageReturn.toFixed(1)}% rendement
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Swaps actifs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeSwaps}
                    </p>
                    <p className="text-sm text-gray-500">
                      sur {stats.totalSwaps} total
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Gains totaux</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.totalEarnings)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rendement: {stats.averageReturn.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Score de confiance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.trustScore}%
                    </p>
                    <div className="flex items-center text-green-600 mt-1">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="text-sm">Excellent</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setShowCreateSwap(true)}
                  className="flex flex-col items-center space-y-2 h-20 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Nouveau swap</span>
                </Button>
                <Button
                  onClick={addFictiveContact}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-20"
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Ajouter contact</span>
                </Button>
                <Button
                  onClick={() => handleWalletDeposit(1000)}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-20"
                >
                  <ArrowDownRight className="h-6 w-6" />
                  <span className="text-sm">Ajouter 1000€</span>
                </Button>
                <Button
                  onClick={() => handleWalletWithdraw(500)}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-20"
                >
                  <ArrowUpRight className="h-6 w-6" />
                  <span className="text-sm">Retirer 500€</span>
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Section Swaps */}
          <TabsContent value="swaps" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Mes Swaps
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800 font-semibold">
                    {swaps.length} swap{swaps.length > 1 ? "s" : ""}
                  </Badge>
                  {newSwapId && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center space-x-1"
                    >
                      <Badge className="bg-green-100 text-green-800 animate-pulse">
                        ✨ Nouveau !
                      </Badge>
                    </motion.div>
                  )}
                </div>
                <p className="text-gray-600">
                  Gérez tous vos échanges financiers
                </p>
              </div>
              <Button
                onClick={() => setShowCreateSwap(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau swap
              </Button>
            </div>

            <div className="grid gap-4">
              {swaps.map((swap, index) => (
                <motion.div
                  key={swap.id}
                  initial={
                    swap.id === newSwapId ? { scale: 0.95, opacity: 0 } : false
                  }
                  animate={
                    swap.id === newSwapId ? { scale: 1, opacity: 1 } : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className={`p-6 hover:shadow-lg transition-all duration-300 ${
                      swap.id === newSwapId
                        ? "border-2 border-green-400 bg-green-50 shadow-lg ring-2 ring-green-200"
                        : ""
                    }`}
                  >
                    {swap.id === newSwapId && (
                      <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-800 font-medium">
                            ✨ Nouveau swap créé avec succès !
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {swap.counterparty === "Recherche en cours..."
                              ? `Créé par ${swap.createdBy || user?.firstName + " " + user?.lastName}`
                              : swap.counterparty}
                          </h3>
                          {swap.counterparty === "Recherche en cours..." && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-600"
                            >
                              Vous
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {swap.description}
                        </p>
                        {swap.createdBy &&
                          swap.counterparty === "Recherche en cours..." && (
                            <p className="text-xs text-gray-500 mt-1">
                              📅 Créé le{" "}
                              {new Date(swap.createdAt).toLocaleDateString(
                                "fr-FR",
                              )}
                            </p>
                          )}
                      </div>
                      <Badge
                        className={`${
                          swap.status === "Actif"
                            ? "bg-green-100 text-green-700"
                            : swap.status === "Terminé"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {swap.status}
                      </Badge>
                    </div>

                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      {formatCurrency(swap.amount)}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Durée</p>
                        <p className="font-medium">{swap.duration} mois</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Taux</p>
                        <p className="font-medium text-green-600">
                          {swap.interestRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Échéance</p>
                        <p className="font-medium">
                          {swap.daysRemaining || 0}j
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progression</span>
                        <span>{swap.progress}%</span>
                      </div>
                      <Progress value={swap.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => viewSwapDetails(swap)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Voir détails
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contacter
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Section Portefeuille */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Portefeuille
                </h2>
                <p className="text-gray-600">Gérez vos fonds et transactions</p>
              </div>
            </div>

            <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium opacity-90">
                    Solde total
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold">
                      {hideBalance ? "••••••" : formatCurrency(animatedBalance)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setHideBalance(!hideBalance)}
                    >
                      {hideBalance ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-200">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      +{stats.averageReturn.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm opacity-75">rendement</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <ArrowDownRight className="h-4 w-4 mr-2" />
                      Ajouter des fonds
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ajouter des fonds</DialogTitle>
                      <DialogDescription>
                        Alimentez votre portefeuille
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Montant à ajouter</Label>
                        <Input
                          type="number"
                          placeholder="1000"
                          className="mt-1"
                          id="deposit-amount"
                        />
                      </div>
                      <Button
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                          const amountInput = document.getElementById(
                            "deposit-amount",
                          ) as HTMLInputElement;
                          const amount = parseInt(amountInput?.value || "0");
                          if (amount > 0) {
                            handleWalletDeposit(amount);
                            amountInput.value = "";
                          }
                        }}
                      >
                        Confirmer l'ajout
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Retirer des fonds
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Retirer des fonds</DialogTitle>
                      <DialogDescription>
                        Transférez vers votre compte
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Montant à retirer</Label>
                        <Input
                          type="number"
                          placeholder="500"
                          max={walletData.balance}
                          className="mt-1"
                          id="withdraw-amount"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Disponible: {formatCurrency(walletData.balance)}
                        </p>
                      </div>
                      <Button
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                          const amountInput = document.getElementById(
                            "withdraw-amount",
                          ) as HTMLInputElement;
                          const amount = parseInt(amountInput?.value || "0");
                          if (amount > 0) {
                            handleWalletWithdraw(amount);
                            amountInput.value = "";
                          }
                        }}
                      >
                        Confirmer le retrait
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            {/* Historique des transactions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Historique des transactions
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const pdf = new jsPDF();
                    pdf.text("Relevé de compte Swapeo", 20, 30);
                    pdf.text(
                      `Client: ${user.firstName} ${user.lastName}`,
                      20,
                      50,
                    );
                    pdf.text(
                      `Solde: ${formatCurrency(walletData.balance)}`,
                      20,
                      70,
                    );
                    pdf.save("Releve_Swapeo.pdf");
                    setMessage("✅ Relevé PDF téléchargé !");
                    setTimeout(() => setMessage(""), 3000);
                  }}
                  disabled={generatingPDF}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {generatingPDF ? "Génération..." : "Export PDF"}
                </Button>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "deposit"
                            ? "bg-green-100"
                            : transaction.type === "withdraw"
                              ? "bg-red-100"
                              : transaction.type === "interest"
                                ? "bg-blue-100"
                                : "bg-gray-100"
                        }`}
                      >
                        {transaction.type === "deposit" && (
                          <ArrowDownRight className="h-5 w-5 text-green-600" />
                        )}
                        {transaction.type === "withdraw" && (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        )}
                        {transaction.type === "interest" && (
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        )}
                        {transaction.type === "fee" && (
                          <Minus className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <p
                          className={`font-semibold ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </p>
                        {transaction.status === "completed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => generateInvoicePDF(transaction)}
                            disabled={generatingPDF}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Section Réseau */}
          <TabsContent value="network" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mon Réseau</h2>
                <p className="text-gray-600">Vos partenaires de confiance</p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={addFictiveContact}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter contact fictif
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Inviter par email
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.length}
                </p>
                <p className="text-sm text-gray-600">Contacts actifs</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Handshake className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Partenariats</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-gray-600">Score moyen</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">+18%</p>
                <p className="text-sm text-gray-600">Croissance</p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mes contacts
              </h3>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">
                            {contact.name}
                          </h4>
                          {contact.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {contact.company}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-gray-600">
                              {contact.trustScore}%
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {contact.totalSwaps} swaps
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Nouveau swap
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Création Swap - Version Simplifiée */}
      <Dialog open={showCreateSwap} onOpenChange={setShowCreateSwap}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">🚀 Nouveau Swap</DialogTitle>
            <DialogDescription>
              Créez votre swap en quelques secondes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>Type de swap</Label>
              <Select
                value={newSwap.type}
                onValueChange={(value) =>
                  setNewSwap({ ...newSwap, type: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choisissez..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demande">
                    💰 Je recherche des fonds
                  </SelectItem>
                  <SelectItem value="offre">💳 J'offre des fonds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Montant</Label>
                <Input
                  type="number"
                  placeholder="10 000"
                  value={newSwap.amount}
                  onChange={(e) =>
                    setNewSwap({ ...newSwap, amount: e.target.value })
                  }
                  className="mt-2"
                  min="1000"
                />
                <p className="text-xs text-gray-500 mt-1">Min. 1 000€</p>
              </div>
              <div>
                <Label>Durée</Label>
                <Input
                  type="number"
                  placeholder="6"
                  value={newSwap.duration}
                  onChange={(e) =>
                    setNewSwap({ ...newSwap, duration: e.target.value })
                  }
                  className="mt-2"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">En mois</p>
              </div>
            </div>

            <div>
              <Label>Description rapide</Label>
              <Textarea
                placeholder="Ex: Développement e-commerce, achat équipement..."
                value={newSwap.description}
                onChange={(e) =>
                  setNewSwap({ ...newSwap, description: e.target.value })
                }
                className="mt-2 h-16 resize-none"
              />
            </div>

            {newSwap.amount && newSwap.duration && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-100"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taux estimé:</span>
                  <span className="font-semibold text-blue-600">
                    {newSwap.type === "demande" ? "3.5%" : "3.0%"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Intérêts totaux:</span>
                  <span className="font-semibold text-green-600">
                    ~
                    {Math.round(
                      (parseInt(newSwap.amount) *
                        3.2 *
                        parseInt(newSwap.duration)) /
                        (100 * 12),
                    )}
                    €
                  </span>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleCreateSwap}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-12 text-base font-medium transition-all duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              Créer le swap
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Invitation */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter une personne</DialogTitle>
            <DialogDescription>
              Invitez quelqu'un à rejoindre votre réseau Swapeo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input
                  type="text"
                  placeholder="Jean"
                  value={inviteForm.firstName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, firstName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Nom</Label>
                <Input
                  type="text"
                  placeholder="Dupont"
                  value={inviteForm.lastName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, lastName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="jean.dupont@example.com"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>Message personnalisé (optionnel)</Label>
              <Textarea
                placeholder="Je t'invite à rejoindre Swapeo..."
                value={inviteForm.message}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, message: e.target.value })
                }
                className="mt-1 h-20 resize-none"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                📧 Aperçu de l'invitation
              </h4>
              <div className="text-sm text-blue-800">
                <p>
                  <strong>À:</strong> {inviteForm.firstName}{" "}
                  {inviteForm.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {inviteForm.email}
                </p>
                <p>
                  <strong>De:</strong> {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleInviteUser}
                disabled={
                  !inviteForm.email ||
                  !inviteForm.firstName ||
                  !inviteForm.lastName
                }
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                Envoyer l'invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Détails du Swap */}
      <Dialog open={showSwapDetails} onOpenChange={setShowSwapDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedSwap && getStatusIcon(selectedSwap.status)}
              <span>Détails du Swap {selectedSwap?.id}</span>
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur ce swap financier
            </DialogDescription>
          </DialogHeader>

          {selectedSwap && (
            <div className="space-y-6">
              {/* En-tête du swap */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatCurrency(selectedSwap.amount)}
                    </h3>
                    <p className="text-gray-600">Montant</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-blue-600">
                      {selectedSwap.interestRate}%
                    </h3>
                    <p className="text-gray-600">Taux d'intérêt</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-purple-600">
                      {selectedSwap.duration} mois
                    </h3>
                    <p className="text-gray-600">Durée</p>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    Informations générales
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge
                        className={
                          selectedSwap.type === "demande"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }
                      >
                        {selectedSwap.type === "demande"
                          ? "💰 Demande de financement"
                          : "🏦 Offre de financement"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedSwap.status)}
                        <span className="font-medium">
                          {selectedSwap.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-medium">
                        {selectedSwap.category || "Non spécifiée"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Niveau de risque:</span>
                      <span
                        className={`font-medium ${
                          selectedSwap.riskLevel === "low"
                            ? "text-green-600"
                            : selectedSwap.riskLevel === "medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {selectedSwap.riskLevel === "low"
                          ? "Faible"
                          : selectedSwap.riskLevel === "medium"
                            ? "Modéré"
                            : "Élevé"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score de matching:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">
                          {selectedSwap.matchingScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-500" />
                    Créateur du swap
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {selectedSwap.createdBy
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {selectedSwap.createdBy || "Utilisateur"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedSwap.createdByCompany || "Entreprise"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trust Score:</span>
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-green-600">
                          {selectedSwap.createdByTrustScore || 85}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contrepartie:</span>
                      <span className="font-medium">
                        {selectedSwap.counterparty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vérifié:</span>
                      {selectedSwap.verified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Description et objectifs */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                  Description et objectifs
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Description du projet:
                    </p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedSwap.description || "Aucune description fournie"}
                    </p>
                  </div>
                  {selectedSwap.purpose && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Objectif des fonds:
                      </p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedSwap.purpose}
                      </p>
                    </div>
                  )}
                  {selectedSwap.guarantees && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Garanties proposées:
                      </p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedSwap.guarantees}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Conditions financières */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-500" />
                    Conditions financières
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remboursement:</span>
                      <span className="font-medium">
                        {getRepaymentScheduleText(
                          selectedSwap.repaymentSchedule || "monthly",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Remboursement anticipé:
                      </span>
                      <span
                        className={`font-medium ${selectedSwap.earlyRepayment ? "text-green-600" : "text-red-600"}`}
                      >
                        {selectedSwap.earlyRepayment
                          ? "Autorisé"
                          : "Non autorisé"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assurance:</span>
                      <span
                        className={`font-medium ${selectedSwap.insurance ? "text-green-600" : "text-gray-600"}`}
                      >
                        {selectedSwap.insurance ? "Incluse" : "Non incluse"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Intérêts totaux estimés:
                      </span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(selectedSwap.totalInterest || 0)}
                      </span>
                    </div>
                    {selectedSwap.monthlyPayment && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mensualité:</span>
                        <span className="font-medium text-purple-600">
                          {formatCurrency(selectedSwap.monthlyPayment)}
                        </span>
                      </div>
                    )}
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
                      <span className="font-medium">
                        {formatDate(selectedSwap.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Dernière mise à jour:
                      </span>
                      <span className="font-medium">
                        {formatDate(
                          selectedSwap.lastUpdated || selectedSwap.createdAt,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jours restants:</span>
                      <span className="font-medium text-orange-600">
                        {selectedSwap.daysRemaining || 0} jours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progression:</span>
                      <span className="font-medium">
                        {selectedSwap.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Avancement</span>
                      <span>{selectedSwap.progress}%</span>
                    </div>
                    <Progress value={selectedSwap.progress} className="h-3" />
                  </div>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter PDF
                  </Button>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowSwapDetails(false)}
                  >
                    Fermer
                  </Button>
                  {selectedSwap.status === "En recherche" && (
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <Handshake className="h-4 w-4 mr-2" />
                      Accepter le swap
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCompleteFixed;
