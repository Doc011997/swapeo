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

const DashboardComplete = () => {
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
  const [newSwap, setNewSwap] = useState({
    type: "",
    amount: "",
    duration: "",
    description: "",
    category: "",
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

  const loadSwaps = async () => {
    try {
      const response = await fetch("https://swapeo.netlify.app/api/swaps", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const apiSwaps = data.swaps || [];
        setSwaps(apiSwaps);
        updateUserStats(apiSwaps);
        return;
      }
    } catch (error) {
      console.log("API indisponible, chargement des données demo");
    }

    // Fallback to demo data
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
      {
        id: "SW-003",
        type: "demande",
        amount: 25000,
        duration: 8,
        interestRate: 4.1,
        counterparty: "Sophie Dubois",
        status: "En recherche",
        progress: 15,
        createdAt: "2024-01-22",
        description: "Développement logiciel - MVP",
        daysRemaining: 45,
        matchingScore: 89,
        category: "Tech",
        riskLevel: "medium",
        verified: true,
      },
      {
        id: "SW-004",
        type: "offre",
        amount: 5000,
        duration: 3,
        interestRate: 2.5,
        counterparty: "Paul Martin",
        status: "En négociation",
        progress: 30,
        createdAt: "2024-01-20",
        description: "Rénovation atelier - outils",
        daysRemaining: 22,
        matchingScore: 92,
        category: "Artisanat",
        riskLevel: "low",
        verified: true,
      },
    ];
    setSwaps(demoSwaps);
    updateUserStats(demoSwaps);
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch(
        "https://swapeo.netlify.app/api/wallet/transactions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        return;
      }
    } catch (error) {
      console.log("API indisponible, chargement des données demo");
    }

    // Fallback to demo data
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
      {
        id: "TX-003",
        type: "withdraw",
        amount: 3000,
        description: "Retrait vers compte principal",
        date: "2024-01-16",
        status: "completed",
      },
      {
        id: "TX-004",
        type: "fee",
        amount: -15,
        description: "Frais de transaction",
        date: "2024-01-16",
        status: "completed",
      },
      {
        id: "TX-005",
        type: "deposit",
        amount: 5000,
        description: "Rechargement compte",
        date: "2024-01-12",
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
      {
        id: "C-002",
        name: "Thomas Kraft",
        company: "KraftCommerce",
        trustScore: 94,
        totalSwaps: 12,
        averageAmount: 8900,
        lastActive: "Il y a 1j",
        verified: true,
      },
      {
        id: "C-003",
        name: "Sophie Dubois",
        company: "TechStart SAS",
        trustScore: 89,
        totalSwaps: 4,
        averageAmount: 22000,
        lastActive: "Il y a 3h",
        verified: true,
      },
      {
        id: "C-004",
        name: "Paul Martin",
        company: "Atelier Bois",
        trustScore: 92,
        totalSwaps: 6,
        averageAmount: 6500,
        lastActive: "Il y a 5h",
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
      {
        id: "N-002",
        type: "message",
        title: "Nouveau message",
        description: "Sophie Dubois souhaite négocier les conditions",
        time: "Il y a 4h",
        read: false,
      },
      {
        id: "N-003",
        type: "system",
        title: "Votre score de confiance a augmenté",
        description: "Félicitations ! Votre trust score est maintenant de 85%",
        time: "Il y a 1j",
        read: true,
      },
      {
        id: "N-004",
        type: "swap",
        title: "Échéance dans 7 jours",
        description: "N'oubliez pas le remboursement pour SW-001",
        time: "Il y a 2j",
        read: true,
      },
    ];
    setNotifications(demoNotifications);
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
          category: newSwap.category,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("🎉 Votre swap a été créé avec succès !");

        // Refresh all data immediately
        await refreshAllData();

        setShowCreateSwap(false);
        setNewSwap({
          type: "",
          amount: "",
          duration: "",
          description: "",
          category: "",
        });
      } else {
        throw new Error("Erreur API");
      }
    } catch (error) {
      // Fallback to demo mode
      const demoSwap: Swap = {
        id: `swap-${Date.now()}`,
        type: newSwap.type as "demande" | "offre",
        amount: parseInt(newSwap.amount),
        duration: parseInt(newSwap.duration),
        interestRate: newSwap.type === "demande" ? 3.5 : 3.0,
        counterparty: "Recherche en cours...",
        status: "En recherche",
        progress: 0,
        createdAt: new Date().toISOString(),
        description: newSwap.description,
        daysRemaining: parseInt(newSwap.duration) * 30,
        matchingScore: Math.floor(Math.random() * 15) + 85,
        category: newSwap.category,
        riskLevel: "low",
        verified: false,
      };

      setSwaps([demoSwap, ...swaps]);
      updateUserStats([demoSwap, ...swaps]);
      setShowCreateSwap(false);
      setNewSwap({
        type: "",
        amount: "",
        duration: "",
        description: "",
        category: "",
      });
      setMessage("🎉 Swap créé en mode DEMO !");
    }

    setTimeout(() => setMessage(""), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("swapeo_token");
    localStorage.removeItem("swapeo_user");
    window.location.href = "/";
  };

  // Real-time data refresh functions
  const refreshAllData = async () => {
    await Promise.all([
      loadSwaps(),
      loadTransactions(),
      loadContacts(),
      loadNotifications(),
      refreshUserProfile(),
    ]);
  };

  const refreshUserProfile = async () => {
    try {
      const response = await fetch(
        "https://swapeo.netlify.app/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("swapeo_user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.log("Erreur lors du refresh du profil");
    }
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

  const handleWalletDeposit = async (
    amount: number,
    method: string = "bank_transfer",
  ) => {
    try {
      const response = await fetch(
        "https://swapeo.netlify.app/api/wallet/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
          },
          body: JSON.stringify({ amount, method }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Dépôt de ${amount}€ effectué avec succès !`);

        // Update user wallet immediately
        const updatedUser = {
          ...user,
          wallet: {
            ...user.wallet,
            balance: data.newBalance,
            totalDeposited: user.wallet.totalDeposited + amount,
          },
        };
        setUser(updatedUser);
        localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));

        // Refresh all data
        await refreshAllData();
      } else {
        throw new Error("Erreur API");
      }
    } catch (error) {
      // Demo mode fallback
      const fees = method === "card" ? Math.max(amount * 0.025, 2) : 0;
      const netAmount = amount - fees;

      const updatedUser = {
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance + netAmount,
          totalDeposited: user.wallet.totalDeposited + amount,
        },
      };
      setUser(updatedUser);
      localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));

      // Add demo transaction
      const demoTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: "deposit",
        amount: netAmount,
        description: `Dépôt par ${method === "card" ? "carte" : "virement"}`,
        date: new Date().toISOString(),
        status: "completed",
      };
      setTransactions([demoTransaction, ...transactions]);

      setMessage(`✅ Dépôt DEMO de ${netAmount}€ effectué !`);
    }

    setTimeout(() => setMessage(""), 4000);
  };

  const handleWalletWithdraw = async (amount: number) => {
    try {
      const response = await fetch(
        "https://swapeo.netlify.app/api/wallet/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("swapeo_token")}`,
          },
          body: JSON.stringify({ amount }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Retrait de ${amount}€ effectué avec succès !`);

        // Update user wallet immediately
        const updatedUser = {
          ...user,
          wallet: {
            ...user.wallet,
            balance: data.newBalance,
            totalWithdrawn: user.wallet.totalWithdrawn + amount,
          },
        };
        setUser(updatedUser);
        localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));

        // Refresh all data
        await refreshAllData();
      } else {
        throw new Error("Erreur API");
      }
    } catch (error) {
      // Demo mode fallback
      const fees = Math.max(amount * 0.005, 1);

      if (amount + fees > user.wallet.balance) {
        setMessage("❌ Solde insuffisant pour ce retrait");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const updatedUser = {
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance - amount - fees,
          totalWithdrawn: user.wallet.totalWithdrawn + amount,
        },
      };
      setUser(updatedUser);
      localStorage.setItem("swapeo_user", JSON.stringify(updatedUser));

      // Add demo transactions
      const withdrawTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: "withdraw",
        amount: -amount,
        description: "Retrait vers compte bancaire",
        date: new Date().toISOString(),
        status: "completed",
      };

      const feeTransaction: Transaction = {
        id: `tx-${Date.now()}-fee`,
        type: "fee",
        amount: -fees,
        description: "Frais de retrait",
        date: new Date().toISOString(),
        status: "completed",
      };

      setTransactions([withdrawTransaction, feeTransaction, ...transactions]);
      setMessage(`✅ Retrait DEMO de ${amount}€ effectué !`);
    }

    setTimeout(() => setMessage(""), 4000);
  };

  const addFictiveContact = () => {
    const fictiveContacts = [
      {
        name: "Alexandre Dubois",
        company: "TechVision Startup",
        trustScore: 91,
        category: "Tech",
      },
      {
        name: "Camille Moreau",
        company: "Green Food Co",
        trustScore: 87,
        category: "Restauration",
      },
      {
        name: "Julien Bernard",
        company: "Artisan Plus",
        trustScore: 93,
        category: "Artisanat",
      },
      {
        name: "Emma Rousseau",
        company: "Digital Market",
        trustScore: 89,
        category: "E-commerce",
      },
      {
        name: "Lucas Martin",
        company: "Innovation Lab",
        trustScore: 95,
        category: "Tech",
      },
    ];

    const availableContacts = fictiveContacts.filter(
      (fc) => !contacts.some((c) => c.name === fc.name),
    );

    if (availableContacts.length === 0) {
      setMessage("❌ Tous les contacts fictifs ont déjà été ajoutés");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-700 border-green-200";
      case "Terminé":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "En recherche":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "En négociation":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
            {/* Logo */}
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

            {/* Recherche */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher swaps, contacts..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
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

                {/* Dropdown Notifications */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                              !notif.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                  notif.type === "swap"
                                    ? "bg-green-500"
                                    : notif.type === "message"
                                      ? "bg-blue-500"
                                      : notif.type === "system"
                                        ? "bg-purple-500"
                                        : "bg-gray-500"
                                }`}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notif.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {notif.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <Button variant="ghost" className="w-full text-sm">
                          Voir toutes les notifications
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profil */}
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
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg">
              {message}
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid mb-8">
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
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
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
                          +{stats.averageReturn.toFixed(1)}% rendement moyen
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 border-l-4 border-l-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Gains totaux</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.totalEarnings)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Rendement moyen: {stats.averageReturn.toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 border-l-4 border-l-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Score de confiance
                      </p>
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
              </motion.div>
            </div>

            {/* Actions rapides et activité récente */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actions rapides */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions rapides
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowCreateSwap(true)}
                      className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      Créer un nouveau swap
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={addFictiveContact}
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Ajouter un contact
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleWalletDeposit(1000)}
                    >
                      <Upload className="h-4 w-4 mr-3" />
                      Ajouter 1000€
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleWalletWithdraw(500)}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-3" />
                      Retirer 500€
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Activité récente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-2"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Activité récente
                    </h3>
                    <Button variant="ghost" size="sm">
                      Voir tout
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {swaps.slice(0, 4).map((swap, index) => (
                      <div
                        key={swap.id}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            swap.status === "Actif"
                              ? "bg-green-500"
                              : swap.status === "Terminé"
                                ? "bg-blue-500"
                                : swap.status === "En recherche"
                                  ? "bg-yellow-500"
                                  : "bg-purple-500"
                          }`}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {swap.counterparty
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {swap.counterparty}
                            </p>
                            <Badge
                              className={`text-xs ${getStatusColor(swap.status)}`}
                            >
                              {swap.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600">
                              {formatCurrency(swap.amount)} • {swap.duration}m
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(swap.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Échéances et recommandations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prochaines échéances */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prochaines échéances
                    </h3>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {swaps
                      .filter((s) => s.daysRemaining && s.daysRemaining > 0)
                      .slice(0, 3)
                      .map((swap) => (
                        <div
                          key={swap.id}
                          className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {swap.counterparty}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(swap.amount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-yellow-700">
                              {swap.daysRemaining}j restants
                            </p>
                            <p className="text-xs text-gray-500">
                              {swap.interestRate}% taux
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </motion.div>

              {/* Recommandations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recommandations
                    </h3>
                    <Target className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">
                            Diversifiez votre portefeuille
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            Explorez de nouveaux secteurs pour réduire les
                            risques
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-900">
                            Optimisez vos rendements
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            3 nouvelles opportunités à 4.2% disponibles
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Section Swaps */}
          <TabsContent value="swaps" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mes Swaps</h2>
                <p className="text-gray-600">
                  Gérez tous vos échanges financiers
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select
                  value={selectedTimeRange}
                  onValueChange={setSelectedTimeRange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 jours</SelectItem>
                    <SelectItem value="30d">30 jours</SelectItem>
                    <SelectItem value="90d">3 mois</SelectItem>
                    <SelectItem value="1y">1 an</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowCreateSwap(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau swap
                </Button>
              </div>
            </div>

            {/* Filtres */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Filtres :
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Tous",
                    "Actifs",
                    "En recherche",
                    "Terminés",
                    "En négociation",
                  ].map((filter) => (
                    <Button
                      key={filter}
                      variant={filter === "Tous" ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Liste des swaps */}
            <div className="grid gap-4">
              {swaps.map((swap, index) => (
                <motion.div
                  key={swap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {swap.counterparty
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {swap.counterparty}
                            </h3>
                            {swap.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            <Badge
                              className={`text-xs ${getStatusColor(swap.status)}`}
                            >
                              {swap.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {swap.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {swap.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Shield
                                className={`h-3 w-3 ${getRiskColor(swap.riskLevel || "low")}`}
                              />
                              <span
                                className={`text-xs ${getRiskColor(swap.riskLevel || "low")}`}
                              >
                                Risque{" "}
                                {swap.riskLevel === "low"
                                  ? "faible"
                                  : swap.riskLevel === "medium"
                                    ? "modéré"
                                    : "élevé"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(swap.amount)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">
                            Match: {swap.matchingScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Durée</p>
                        <p className="font-medium text-gray-900">
                          {swap.duration} mois
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Taux d'intérêt</p>
                        <p className="font-medium text-green-600">
                          {swap.interestRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Échéance</p>
                        <p className="font-medium text-gray-900">
                          {swap.daysRemaining
                            ? `${swap.daysRemaining}j`
                            : "Terminé"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Créé le</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(swap.createdAt)}
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                        <Button size="sm">
                          Voir détails
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
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

            {/* Vue d'ensemble du wallet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium opacity-90">
                      Solde total
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold">
                        {hideBalance
                          ? "••••••"
                          : formatCurrency(animatedBalance)}
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
                      <span className="text-sm font-medium">+2.8%</span>
                    </div>
                    <p className="text-sm opacity-75">ce mois</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm opacity-75">Dépôts totaux</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(walletData.totalDeposited)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Retraits totaux</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(walletData.totalWithdrawn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Gains nets</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(stats.totalEarnings)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-6">
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
                          Alimentez votre portefeuille Swapeo
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
                        <div>
                          <Label>Méthode de paiement</Label>
                          <Select>
                            <SelectTrigger className="mt-1" id="deposit-method">
                              <SelectValue placeholder="Choisir une méthode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank_transfer">
                                Virement bancaire
                              </SelectItem>
                              <SelectItem value="card">
                                Carte bancaire
                              </SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          className="w-full bg-blue-500 hover:bg-blue-600"
                          onClick={() => {
                            const amountInput = document.getElementById(
                              "deposit-amount",
                            ) as HTMLInputElement;
                            const amount = parseInt(amountInput?.value || "0");
                            if (amount > 0) {
                              handleWalletDeposit(amount, "bank_transfer");
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
                          Transférez vers votre compte bancaire
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

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions rapides
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-3" />
                    Télécharger relevé
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Gérer cartes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-3" />
                    Paramètres wallet
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-3" />
                    Sécurité
                  </Button>
                </div>
              </Card>
            </div>

            {/* Historique des transactions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Historique des transactions
                </h3>
                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedTimeRange}
                    onValueChange={setSelectedTimeRange}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 jours</SelectItem>
                      <SelectItem value="30d">30 jours</SelectItem>
                      <SelectItem value="90d">3 mois</SelectItem>
                      <SelectItem value="1y">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
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
                          {transaction.type === "deposit"
                            ? "Dépôt"
                            : transaction.type === "withdraw"
                              ? "Retrait"
                              : transaction.type === "interest"
                                ? "Intérêts"
                                : "Frais"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
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
                      <Badge
                        className={`text-xs ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Terminé"
                          : transaction.status === "pending"
                            ? "En cours"
                            : "Échoué"}
                      </Badge>
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
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Inviter par email
                </Button>
              </div>
            </div>

            {/* Stats réseau */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm text-gray-600">Partenariats actifs</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-gray-600">Score moyen réseau</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">+18%</p>
                <p className="text-sm text-gray-600">Croissance ce mois</p>
              </Card>
            </div>

            {/* Liste des contacts */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mes contacts
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Rechercher..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filtrer
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {contacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                            <span className="text-xs text-gray-500">
                              Moy. {formatCurrency(contact.averageAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {contact.lastActive}
                        </span>
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
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Section Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                <p className="text-gray-600">Analysez vos performances</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select
                  value={selectedTimeRange}
                  onValueChange={setSelectedTimeRange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 jours</SelectItem>
                    <SelectItem value="30d">30 jours</SelectItem>
                    <SelectItem value="90d">3 mois</SelectItem>
                    <SelectItem value="1y">1 an</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export rapport
                </Button>
              </div>
            </div>

            {/* Métriques clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ROI Total
                  </h3>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-green-600">+12.4%</p>
                  <p className="text-sm text-gray-600">
                    Retour sur investissement
                  </p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+2.1% vs mois dernier</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Temps moyen
                  </h3>
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-blue-600">2.3j</p>
                  <p className="text-sm text-gray-600">Pour trouver un match</p>
                  <div className="flex items-center text-green-600">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-sm">-0.5j vs mois dernier</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Taux de succès
                  </h3>
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.successRate.toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-600">Swaps réussis</p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+5% vs mois dernier</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Graphiques et analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Évolution du portefeuille
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Graphique interactif à venir
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Répartition par secteur
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Graphique sectoriel à venir</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Insights et recommandations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Insights automatiques
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Performance excellente
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Votre ROI de 12.4% est supérieur de 3.2% à la moyenne de
                        la plateforme.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">
                        Opportunité détectée
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        Le secteur Tech montre une croissance de +15%.
                        Considérez augmenter votre exposition.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900">
                        Échéance proche
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        3 remboursements sont attendus dans les 7 prochains
                        jours pour un total de 18,500€.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Création de Swap */}
      <Dialog open={showCreateSwap} onOpenChange={setShowCreateSwap}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau swap</DialogTitle>
            <DialogDescription>
              Créez votre demande ou offre de financement avec tous les détails
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      💰 Demande de financement
                    </SelectItem>
                    <SelectItem value="offre">
                      🏦 Offre de financement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700">Catégorie</Label>
                <Select
                  value={newSwap.category}
                  onValueChange={(value) =>
                    setNewSwap({ ...newSwap, category: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisissez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tech & Digital</SelectItem>
                    <SelectItem value="restauration">Restauration</SelectItem>
                    <SelectItem value="commerce">Commerce & Retail</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="industrie">Industrie</SelectItem>
                    <SelectItem value="artisanat">Artisanat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Montant (€)</Label>
                  <Input
                    type="number"
                    placeholder="10 000"
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
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-700">Description détaillée</Label>
                <Textarea
                  placeholder="Décrivez votre projet, l'utilisation des fonds, les garanties..."
                  value={newSwap.description}
                  onChange={(e) =>
                    setNewSwap({ ...newSwap, description: e.target.value })
                  }
                  className="mt-1 h-32 resize-none"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Estimation automatique
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Taux estimé:</span>
                    <span className="font-medium text-blue-900">
                      {newSwap.type === "demande" ? "3.5%" : "3.0%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Score de matching:</span>
                    <span className="font-medium text-blue-900">85-95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">
                      Temps de match estimé:
                    </span>
                    <span className="font-medium text-blue-900">2-4 jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={() => setShowCreateSwap(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateSwap}
              disabled={
                !newSwap.type ||
                !newSwap.amount ||
                !newSwap.duration ||
                !newSwap.category
              }
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer le swap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardComplete;
