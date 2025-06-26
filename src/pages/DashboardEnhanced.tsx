import { useState, useEffect, useMemo } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  Activity,
  User,
  Clock,
  X,
  Info,
  RefreshCw,
  Calendar,
  FileText,
  BarChart3,
  Filter,
  Download,
  Send,
  Copy,
  MessageCircle,
  Phone,
  Edit,
  Share2,
  Handshake,
  Menu,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Grid,
  List,
  Loader2,
  DollarSign,
  Percent,
  Trophy,
  MousePointer2,
  Gauge,
  LineChart,
  Layers,
  Sparkles,
  Zap,
  Target,
  Building,
  Globe,
  Shield,
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
  lastContact?: string;
  swapsCount?: number;
  trustScore?: number;
  avatar?: string;
  notes?: string;
  category?: string;
  status?: "active" | "pending" | "blocked";
  tags?: string[];
  preferredContactMethod?: "email" | "phone" | "message";
  timezone?: string;
  linkedinUrl?: string;
  companySize?: string;
  industry?: string;
  position?: string;
  addedDate?: string;
  lastSwapDate?: string;
  totalSwapVolume?: number;
  rating?: number;
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

const DashboardEnhanced = () => {
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
  const [showNotifications, setShowNotifications] = useState(false);

  // États pour les nouvelles fonctionnalités
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "amount" | "date" | "status" | "progress"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // États pour le modal de détails de swap
  const [showSwapDetails, setShowSwapDetails] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<Swap | null>(null);

  // États pour le chat
  const [showChat, setShowChat] = useState(false);
  const [chatContact, setChatContact] = useState<Contact | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");

  // États pour l'ajout de contact
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    notes: "",
    category: "",
  });

  // États pour le formulaire de création de swap
  const [swapForm, setSwapForm] = useState({
    type: "demande",
    amount: "",
    duration: "",
    interestRate: "",
    description: "",
    purpose: "",
    guarantees: "",
    category: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  // Données filtrées et triées avec useMemo pour les performances
  const filteredAndSortedSwaps = useMemo(() => {
    let filtered = swaps.filter((swap) => {
      const matchesSearch =
        swap.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swap.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swap.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || swap.status === filterStatus;
      const matchesCategory =
        selectedCategory === "all" || swap.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Tri
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
          break;
        case "date":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "progress":
          aVal = a.progress || 0;
          bVal = b.progress || 0;
          break;
        default:
          return 0;
      }

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [swaps, searchTerm, sortBy, sortOrder, filterStatus, selectedCategory]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Simulation de chargement des données utilisateur
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        id: "user123",
        firstName: "Marie",
        lastName: "Dubois",
        email: "marie.dubois@techstart.fr",
        company: "TechStart Solutions",
        joinDate: "2024-01-15",
        wallet: {
          balance: 42847,
          totalDeposited: 50000,
          totalWithdrawn: 7153,
        },
        stats: {
          totalSwaps: 23,
          successRate: 94,
          avgRating: 4.8,
          totalEarnings: 3847,
        },
      };

      setUser(userData);

      // Animation du balance
      let start = 0;
      const target = userData.wallet.balance;
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeProgress);

        setAnimatedBalance(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);

      // Chargement des swaps avec données enrichies
      const mockSwaps: Swap[] = [
        {
          id: "swap1",
          type: "offre",
          amount: 15000,
          duration: 12,
          interestRate: 3.5,
          counterparty: "GreenEnergy Corp",
          status: "active",
          progress: 75,
          createdAt: "2024-03-01",
          description: "Financement pour expansion",
          daysRemaining: 92,
          category: "Énergie",
          riskLevel: "low",
          verified: true,
          purpose: "Expansion commerciale",
          estimatedReturn: 525,
          totalInterest: 525,
          monthlyPayment: 1275,
          nextPaymentDate: "2024-04-15",
        },
        {
          id: "swap2",
          type: "demande",
          amount: 25000,
          duration: 18,
          interestRate: 4.2,
          counterparty: "RestaurantChain Plus",
          status: "pending",
          progress: 0,
          createdAt: "2024-03-10",
          description: "Besoin de liquidités pour nouveau restaurant",
          category: "Restauration",
          riskLevel: "medium",
          verified: true,
          purpose: "Fonds de roulement",
          estimatedReturn: 1890,
          totalInterest: 1890,
          monthlyPayment: 1493,
        },
        {
          id: "swap3",
          type: "offre",
          amount: 8000,
          duration: 6,
          interestRate: 2.8,
          counterparty: "StartupInnovation",
          status: "completed",
          progress: 100,
          createdAt: "2024-01-15",
          description: "Prêt court terme pour développement",
          category: "Technology",
          riskLevel: "high",
          verified: false,
          purpose: "Développement produit",
          estimatedReturn: 112,
          totalInterest: 112,
          monthlyPayment: 1352,
        },
        {
          id: "swap4",
          type: "demande",
          amount: 35000,
          duration: 24,
          interestRate: 3.8,
          counterparty: "ManufacturingPlus",
          status: "active",
          progress: 45,
          createdAt: "2024-02-20",
          description: "Modernisation équipements",
          category: "Industrie",
          riskLevel: "low",
          verified: true,
          purpose: "Investissement équipement",
          daysRemaining: 412,
          estimatedReturn: 3192,
          totalInterest: 3192,
          monthlyPayment: 1591,
          nextPaymentDate: "2024-04-20",
        },
      ];

      setSwaps(mockSwaps);

      // Chargement des transactions
      const mockTransactions: Transaction[] = [
        {
          id: "tx1",
          type: "interest",
          amount: 124.5,
          description: "Intérêts du swap #swap1",
          date: "2024-03-15",
          status: "completed",
        },
        {
          id: "tx2",
          type: "deposit",
          amount: 5000,
          description: "Dépôt sur compte",
          date: "2024-03-14",
          status: "completed",
        },
        {
          id: "tx3",
          type: "withdraw",
          amount: 2000,
          description: "Retrait vers compte bancaire",
          date: "2024-03-12",
          status: "pending",
        },
        {
          id: "tx4",
          type: "interest",
          amount: 89.75,
          description: "Intérêts du swap #swap4",
          date: "2024-03-10",
          status: "completed",
        },
      ];

      setTransactions(mockTransactions);

      // Chargement des contacts
      const mockContacts: Contact[] = [
        {
          id: "contact1",
          name: "Jean Martin",
          company: "FinanceFirst",
          email: "j.martin@financefirst.com",
          phone: "+33 1 23 45 67 89",
          lastContact: "2024-03-10",
          swapsCount: 5,
          trustScore: 92,
          category: "Finance",
          status: "active",
          rating: 4.8,
          totalSwapVolume: 85000,
        },
        {
          id: "contact2",
          name: "Sophie Laurent",
          company: "EcoSolutions",
          email: "s.laurent@ecosolutions.fr",
          phone: "+33 1 34 56 78 90",
          lastContact: "2024-03-05",
          swapsCount: 7,
          trustScore: 96,
          category: "Énergie",
          status: "active",
          rating: 4.9,
          totalSwapVolume: 125000,
        },
        {
          id: "contact3",
          name: "Pierre Durand",
          company: "TechStart",
          email: "p.durand@techstart.com",
          phone: "+33 1 45 67 89 01",
          lastContact: "2024-02-28",
          swapsCount: 3,
          trustScore: 88,
          category: "Technology",
          status: "active",
          rating: 4.6,
          totalSwapVolume: 42000,
        },
      ];

      setContacts(mockContacts);

      // Chargement des notifications
      const mockNotifications: Notification[] = [
        {
          id: "notif1",
          type: "swap",
          title: "Nouveau swap disponible",
          description: "Un swap de 15k€ correspond à vos critères",
          time: "Il y a 2h",
          read: false,
        },
        {
          id: "notif2",
          type: "payment",
          title: "Paiement reçu",
          description: "124.50€ d'intérêts crédités",
          time: "Il y a 5h",
          read: false,
        },
        {
          id: "notif3",
          type: "system",
          title: "Mise à jour sécurité",
          description: "Nouvelles mesures de sécurité activées",
          time: "Hier",
          read: true,
        },
        {
          id: "notif4",
          type: "message",
          title: "Nouveau message",
          description: "Sophie Laurent a envoyé un message",
          time: "Il y a 1h",
          read: false,
        },
      ];

      setNotifications(mockNotifications);

      // Chargement des données de performance
      const mockPerformanceData = [
        { month: "Jan", gains: 1200, swaps: 4, volume: 15000 },
        { month: "Fév", gains: 1450, swaps: 6, volume: 22000 },
        { month: "Mar", gains: 1850, swaps: 8, volume: 35000 },
        { month: "Avr", gains: 2100, swaps: 5, volume: 28000 },
        { month: "Mai", gains: 2400, swaps: 7, volume: 31000 },
        { month: "Jun", gains: 2850, swaps: 9, volume: 42000 },
      ];

      setPerformanceData(mockPerformanceData);

      // Statistiques rapides calculées
      const totalVolume = mockSwaps.reduce((sum, swap) => sum + swap.amount, 0);
      const avgInterestRate =
        mockSwaps.reduce((sum, swap) => sum + swap.interestRate, 0) /
        mockSwaps.length;
      const activeSwapsCount = mockSwaps.filter(
        (s) => s.status === "active",
      ).length;
      const pendingSwapsCount = mockSwaps.filter(
        (s) => s.status === "pending",
      ).length;
      const completedSwapsCount = mockSwaps.filter(
        (s) => s.status === "completed",
      ).length;
      const successRate =
        mockSwaps.length > 0
          ? (completedSwapsCount / mockSwaps.length) * 100
          : 0;

      setQuickStats({
        totalVolume,
        avgInterestRate: avgInterestRate || 0,
        activeSwapsCount,
        pendingSwapsCount,
        completedSwapsCount,
        successRate,
        monthlyGrowth: 12.5,
        totalEarnings: 3847,
        avgSwapDuration: 12,
        riskDistribution: {
          low: mockSwaps.filter((s) => s.riskLevel === "low").length,
          medium: mockSwaps.filter((s) => s.riskLevel === "medium").length,
          high: mockSwaps.filter((s) => s.riskLevel === "high").length,
        },
      });
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setMessage("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchissement des données
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulation
    await loadUserData();
    setIsRefreshing(false);
    setMessage("Données mises à jour !");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCreateSwap = async () => {
    try {
      if (!swapForm.amount || !swapForm.duration || !swapForm.interestRate) {
        setMessage("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const newSwap: Swap = {
        id: `swap_${Date.now()}`,
        type: swapForm.type as "demande" | "offre",
        amount: parseInt(swapForm.amount),
        duration: parseInt(swapForm.duration),
        interestRate: parseFloat(swapForm.interestRate),
        counterparty: "En attente de correspondance",
        status: "pending",
        progress: 0,
        createdAt: new Date().toISOString().split("T")[0],
        description: swapForm.description,
        purpose: swapForm.purpose,
        guarantees: swapForm.guarantees,
        category: swapForm.category,
        riskLevel: "medium",
        verified: false,
      };

      setSwaps([newSwap, ...swaps]);
      setMessage("Swap créé avec succès !");

      setSwapForm({
        type: "demande",
        amount: "",
        duration: "",
        interestRate: "",
        description: "",
        purpose: "",
        guarantees: "",
        category: "",
      });

      setShowCreateSwap(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setMessage("Erreur lors de la création du swap");
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
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)}sem`;
    return `Il y a ${Math.floor(diffDays / 30)}mois`;
  };

  const openSwapDetails = (swap: Swap) => {
    setSelectedSwap(swap);
    setShowSwapDetails(true);
  };

  const closeSwapDetails = () => {
    setShowSwapDetails(false);
    setSelectedSwap(null);
  };

  const openChat = (contact?: Contact) => {
    if (contact) {
      setChatContact(contact);
      // Messages d'exemple pour le contact
      const exampleMessages = [
        {
          id: 1,
          sender: contact.name,
          message:
            "Bonjour ! J'ai vu votre proposition de swap, c'est intéressant.",
          timestamp: "14:30",
        },
        {
          id: 2,
          sender: "me",
          message:
            "Bonjour ! Merci pour votre intérêt. Souhaitez-vous plus de détails ?",
          timestamp: "14:32",
        },
        {
          id: 3,
          sender: contact.name,
          message: "Oui, pouvez-vous m'expliquer les conditions exactes ?",
          timestamp: "14:35",
        },
      ];
      setChatMessages(exampleMessages);
    } else {
      // Chat général pour un swap
      setChatContact({
        id: "general",
        name: "Support Swapeo",
        company: "Swapeo",
        category: "Support",
        status: "active",
      });
      setChatMessages([
        {
          id: 1,
          sender: "Support Swapeo",
          message: "Bonjour ! Comment puis-je vous aider avec ce swap ?",
          timestamp: "maintenant",
        },
      ]);
    }
    setShowChat(true);
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "me",
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage("");

    // Réponse automatique après 2 secondes
    setTimeout(() => {
      const responses = [
        "Merci pour votre message !",
        "C'est une excellente proposition.",
        "Je vais étudier cela et vous revenir rapidement.",
        "Parfait, nous sommes sur la même longueur d'onde.",
        "Pouvons-nous planifier un appel pour approfondir ?",
      ];

      const autoResponse = {
        id: chatMessages.length + 2,
        sender: chatContact!.name,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => [...prev, autoResponse]);
    }, 2000);
  };

  const handleAddContact = async () => {
    try {
      if (
        !contactForm.firstName ||
        !contactForm.lastName ||
        !contactForm.company
      ) {
        setMessage("Veuillez remplir au moins le nom, prénom et l'entreprise");
        return;
      }

      const newContact: Contact = {
        id: `contact_${Date.now()}`,
        name: `${contactForm.firstName} ${contactForm.lastName}`,
        company: contactForm.company,
        email: contactForm.email,
        phone: contactForm.phone,
        notes: contactForm.notes,
        category: contactForm.category || "Général",
        status: "active",
        swapsCount: 0,
        trustScore: 75,
        addedDate: new Date().toISOString().split("T")[0],
        rating: 0,
        totalSwapVolume: 0,
      };

      setContacts([newContact, ...contacts]);
      setMessage(`Contact ${newContact.name} ajouté avec succès`);

      setContactForm({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phone: "",
        notes: "",
        category: "",
      });

      setShowAddContactDialog(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Erreur lors de l'ajout du contact:", error);
      setMessage("Erreur lors de l'ajout du contact");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-violet-50/30 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-lg"></div>
          <p className="text-gray-700 text-xl font-medium">
            Chargement de votre espace...
          </p>
          <p className="text-gray-500 text-sm mt-2">Préparation du dashboard</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-violet-50/30">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50 safe-area-inset-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 min-h-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Handshake className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                  SWAPEO
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Dashboard Pro
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                  SWAPEO
                </h1>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-12 w-12 hover:bg-violet-50 rounded-xl touch-manipulation"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label={`Notifications ${notifications.filter((n) => !n.read).length > 0 ? `(${notifications.filter((n) => !n.read).length} non lues)` : ""}`}
                >
                  <Bell className="h-6 w-6 text-gray-600" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg min-w-[24px]"
                    >
                      {notifications.filter((n) => !n.read).length}
                    </motion.span>
                  )}
                </Button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Bell className="h-5 w-5 mr-2 text-violet-500" />
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 border-b border-gray-50 hover:bg-violet-50/50 cursor-pointer transition-colors duration-200 ${
                              !notification.read ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full mt-2 ${
                                  notification.type === "swap"
                                    ? "bg-violet-500"
                                    : notification.type === "payment"
                                      ? "bg-green-500"
                                      : notification.type === "message"
                                        ? "bg-blue-500"
                                        : "bg-gray-500"
                                } shadow-sm`}
                              ></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {notification.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-violet-200">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${user.firstName}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.company}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-red-50 text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex items-center space-x-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 hover:bg-violet-50"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                    >
                      {notifications.filter((n) => !n.read).length}
                    </motion.span>
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="h-10 w-10 hover:bg-violet-50"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>

              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="absolute right-4 top-16 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 z-50 p-4"
                  >
                    <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${user.firstName}`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.company}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Button
                        onClick={() => setShowCreateSwap(true)}
                        className="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white h-14 flex-col rounded-xl shadow-lg"
                      >
                        <Plus className="h-5 w-5 mb-1" />
                        <span className="text-xs font-semibold">
                          Créer Swap
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="border-2 border-green-200 hover:bg-green-50 h-14 flex-col rounded-xl"
                      >
                        <RefreshCw className="h-5 w-5 mb-1 text-green-600" />
                        <span className="text-xs font-semibold text-gray-900">
                          Actualiser
                        </span>
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 h-12 rounded-xl"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Se déconnecter
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Message d'état */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-blue-800 font-medium">{message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMessage("")}
                className="h-8 w-8 text-blue-600 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search and Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans les swaps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white/80 border-gray-200 rounded-xl focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Actualiser
                </Button>
              </div>

              {/* Filters and Controls */}
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-3 rounded-xl"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Statut
                      </Label>
                      <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                      >
                        <SelectTrigger className="h-8 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="active">Actifs</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="completed">Terminés</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Catégorie
                      </Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="h-8 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes catégories</SelectItem>
                          <SelectItem value="Énergie">Énergie</SelectItem>
                          <SelectItem value="Restauration">
                            Restauration
                          </SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Industrie">Industrie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-3 rounded-xl"
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("date");
                        setSortOrder("desc");
                      }}
                    >
                      Plus récents
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("date");
                        setSortOrder("asc");
                      }}
                    >
                      Plus anciens
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("amount");
                        setSortOrder("desc");
                      }}
                    >
                      Montant (décroissant)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("amount");
                        setSortOrder("asc");
                      }}
                    >
                      Montant (croissant)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("progress");
                        setSortOrder("desc");
                      }}
                    >
                      Progression
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="hidden sm:flex items-center border border-gray-200 rounded-xl p-1 bg-white/50">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Analytics Dashboard */}
        {quickStats && Object.keys(quickStats).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6"
          >
            <Card className="p-6 bg-gradient-to-r from-violet-50 via-white to-cyan-50 border border-violet-200/50 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-violet-500" />
                    Analytics & Performance
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Vue d'ensemble de vos performances
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 jours</SelectItem>
                      <SelectItem value="30d">30 jours</SelectItem>
                      <SelectItem value="90d">3 mois</SelectItem>
                      <SelectItem value="1y">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-violet-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      +{quickStats.monthlyGrowth}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(quickStats.totalVolume)}
                  </p>
                  <p className="text-sm text-gray-600">Volume total</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Percent className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-xs text-blue-600 font-medium">
                      Avg
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {quickStats.avgInterestRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Taux moyen</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-xs text-purple-600 font-medium">
                      {quickStats.successRate.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {quickStats.completedSwapsCount}
                  </p>
                  <p className="text-sm text-gray-600">Swaps réussis</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-cyan-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="text-xs text-cyan-600 font-medium">
                      ROI
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(quickStats.totalEarnings)}
                  </p>
                  <p className="text-sm text-gray-600">Gains totaux</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Onglets de navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs
            value={activeSection}
            onValueChange={setActiveSection}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-2xl p-2 sticky top-20 sm:top-24 z-30 max-w-sm mx-auto sm:max-w-md">
              <TabsTrigger
                value="overview"
                className="flex items-center justify-center rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 h-12 w-full touch-manipulation group relative"
                title="Aperçu"
              >
                <div className="relative">
                  <Home className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -inset-1 bg-violet-400/20 rounded-lg opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="swaps"
                className="flex items-center justify-center rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 h-12 w-full touch-manipulation group relative"
                title="Swaps"
              >
                <div className="relative">
                  <Handshake className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -inset-1 bg-indigo-400/20 rounded-lg opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="wallet"
                className="flex items-center justify-center rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 h-12 w-full touch-manipulation group relative"
                title="Portefeuille"
              >
                <div className="relative">
                  <Wallet className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -inset-1 bg-green-400/20 rounded-lg opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="flex items-center justify-center rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 h-12 w-full touch-manipulation group relative"
                title="Contacts"
              >
                <div className="relative">
                  <Users className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -inset-1 bg-blue-400/20 rounded-lg opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Contenu des onglets */}
            <TabsContent value="overview" className="space-y-6 sm:space-y-8">
              {/* Section Hero avec stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Card principale de bienvenue */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="p-6 sm:p-8 bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 text-white relative overflow-hidden shadow-2xl border-0 rounded-3xl">
                      {/* Enhanced Background effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-transparent to-cyan-500/30" />
                      <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/15 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 bg-cyan-300/25 rounded-full blur-2xl" />

                      <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                          <div className="mb-6 sm:mb-0">
                            <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
                              Bienvenue, {user.firstName} ! 👋
                            </h2>
                            <p className="text-violet-100 text-base sm:text-xl font-medium">
                              Votre espace de gestion Swapeo
                            </p>
                          </div>
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/25 backdrop-blur-sm rounded-3xl flex items-center justify-center self-start sm:self-auto shadow-xl">
                            <Handshake className="h-10 w-10 sm:h-12 sm:w-12" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10">
                            <p className="text-white/90 text-sm sm:text-base font-semibold mb-2">
                              Solde total
                            </p>
                            <p className="text-xl sm:text-3xl font-bold mb-2 leading-tight">
                              {formatCurrency(animatedBalance)}
                            </p>
                            <div className="flex items-center text-green-200 text-sm sm:text-base font-medium">
                              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                              +12.5% ce mois
                            </div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10">
                            <p className="text-white/90 text-sm sm:text-base font-semibold mb-2">
                              Swaps actifs
                            </p>
                            <p className="text-xl sm:text-3xl font-bold mb-2 leading-tight">
                              {
                                filteredAndSortedSwaps.filter(
                                  (s) => s.status === "active",
                                ).length
                              }
                            </p>
                            <div className="flex items-center text-cyan-200 text-sm sm:text-base font-medium">
                              <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                              {
                                filteredAndSortedSwaps.filter(
                                  (s) => s.status === "pending",
                                ).length
                              }{" "}
                              en attente
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>

                {/* Stats rapides */}
                <div className="space-y-3 sm:space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Card className="p-4 sm:p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl border-0 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/25 rounded-xl flex items-center justify-center">
                          <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-emerald-200" />
                      </div>
                      <p className="text-lg sm:text-2xl font-bold leading-tight">
                        {user.stats.successRate}%
                      </p>
                      <p className="text-emerald-100 text-sm font-medium">
                        Taux de succès
                      </p>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card className="p-4 sm:p-5 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl border-0 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/25 rounded-xl flex items-center justify-center">
                          <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <Sparkles className="h-5 w-5 text-orange-200" />
                      </div>
                      <p className="text-lg sm:text-2xl font-bold leading-tight">
                        {user.stats.avgRating}/5
                      </p>
                      <p className="text-orange-100 text-sm font-medium">
                        Note moyenne
                      </p>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl border-0 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/25 rounded-xl flex items-center justify-center">
                          <Handshake className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <Target className="h-5 w-5 text-blue-200" />
                      </div>
                      <p className="text-lg sm:text-2xl font-bold leading-tight">
                        {user.stats.totalSwaps}
                      </p>
                      <p className="text-blue-100 text-sm font-medium">
                        Total swaps
                      </p>
                    </Card>
                  </motion.div>
                </div>
              </div>

              {/* Actions Rapides */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-3xl">
                  <div className="flex items-center mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Actions Rapides
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <Button
                      onClick={() => setShowCreateSwap(true)}
                      className="h-16 sm:h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border-0"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Plus className="h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm sm:text-base">
                          Nouveau Swap
                        </span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16 sm:h-20 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Search className="h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm sm:text-base">
                          Marketplace
                        </span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16 sm:h-20 border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-400 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Download className="h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm sm:text-base">
                          Rapports
                        </span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16 sm:h-20 border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm sm:text-base">
                          Inviter
                        </span>
                      </div>
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Swaps Récents Améliorés */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-3xl">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                        <Handshake className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Swaps Récents
                      </h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSection("swaps")}
                      className="border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 focus:ring-4 focus:ring-indigo-200 rounded-xl px-4 py-2 font-semibold touch-manipulation"
                      aria-label="Voir tous les swaps"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir tout
                    </Button>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {filteredAndSortedSwaps.slice(0, 3).map((swap, index) => (
                      <motion.div
                        key={swap.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        className="group"
                      >
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-white/90 to-gray-50/90 rounded-2xl hover:from-violet-50/90 hover:to-cyan-50/90 transition-all duration-300 hover:shadow-lg border-2 border-gray-200/50 hover:border-violet-300/50 backdrop-blur-md">
                          {/* Mobile: Stack vertical, Desktop: Side by side */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4 sm:space-x-5">
                              <div className="relative flex-shrink-0">
                                <div
                                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-lg ${
                                    swap.status === "active"
                                      ? "bg-green-500 shadow-green-500/40"
                                      : swap.status === "pending"
                                        ? "bg-yellow-500 shadow-yellow-500/40"
                                        : "bg-gray-400 shadow-gray-400/40"
                                  } ${swap.status === "active" ? "animate-pulse" : ""}`}
                                ></div>
                                {swap.status === "active" && (
                                  <div className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full animate-ping opacity-30"></div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors duration-300 text-base sm:text-lg leading-tight">
                                  {swap.type === "offre"
                                    ? "💼 Offre de"
                                    : "🎯 Demande de"}{" "}
                                  <span className="text-violet-600">
                                    {formatCurrency(swap.amount)}
                                  </span>
                                </p>
                                <p className="text-sm sm:text-base text-gray-700 group-hover:text-gray-800 font-medium mt-1">
                                  {swap.counterparty} • {swap.interestRate}%
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    Durée: {swap.duration} mois
                                  </p>
                                  {swap.category && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-2 py-0"
                                    >
                                      {swap.category}
                                    </Badge>
                                  )}
                                  {swap.riskLevel && (
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        swap.riskLevel === "low"
                                          ? "bg-green-400"
                                          : swap.riskLevel === "medium"
                                            ? "bg-yellow-400"
                                            : "bg-red-400"
                                      }`}
                                      title={`Risque ${swap.riskLevel}`}
                                    ></div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Enhanced right side with more info */}
                            <div className="flex items-center justify-between sm:block sm:text-right space-x-2 sm:space-x-0">
                              <Badge
                                className={`font-medium border-0 text-xs ${
                                  swap.status === "active"
                                    ? "bg-green-100 text-green-700 shadow-sm"
                                    : swap.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700 shadow-sm"
                                      : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {swap.status === "active"
                                  ? "✅ Actif"
                                  : swap.status === "pending"
                                    ? "⏳ En attente"
                                    : "✓ Terminé"}
                              </Badge>
                              {swap.status === "active" && (
                                <>
                                  <p className="text-xs text-green-600 font-medium sm:mt-1">
                                    {swap.daysRemaining || 45}j restants
                                  </p>
                                  {swap.progress !== undefined && (
                                    <div className="w-16 sm:w-20 mt-1">
                                      <Progress
                                        value={swap.progress}
                                        className="h-1"
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 mt-1"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => openSwapDetails(swap)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Voir détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Messages
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Documents
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredAndSortedSwaps.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <Handshake className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium text-lg">
                        {searchTerm ||
                        filterStatus !== "all" ||
                        selectedCategory !== "all"
                          ? "Aucun swap ne correspond à vos critères"
                          : "Aucun swap pour le moment"}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        {searchTerm ||
                        filterStatus !== "all" ||
                        selectedCategory !== "all"
                          ? "Essayez de modifier vos filtres de recherche"
                          : "Créez votre premier swap pour commencer"}
                      </p>
                      {(searchTerm ||
                        filterStatus !== "all" ||
                        selectedCategory !== "all") && (
                        <Button
                          onClick={() => {
                            setSearchTerm("");
                            setFilterStatus("all");
                            setSelectedCategory("all");
                          }}
                          variant="outline"
                          className="mt-4"
                        >
                          Effacer les filtres
                        </Button>
                      )}
                    </motion.div>
                  )}

                  {filteredAndSortedSwaps.length > 3 && (
                    <div className="pt-4 border-t border-gray-200/50">
                      <Button
                        variant="ghost"
                        onClick={() => setActiveSection("swaps")}
                        className="w-full justify-center hover:bg-violet-50"
                      >
                        Voir tous les swaps ({filteredAndSortedSwaps.length})
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="swaps" className="space-y-6">
              {/* Enhanced Swaps Management */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Mes Swaps
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredAndSortedSwaps.length} swap
                    {filteredAndSortedSwaps.length !== 1 ? "s" : ""}
                    {(searchTerm ||
                      filterStatus !== "all" ||
                      selectedCategory !== "all") &&
                      " (filtré)"}
                  </p>
                </div>
                <Button
                  onClick={() => setShowCreateSwap(true)}
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Swap
                </Button>
              </div>

              {/* Enhanced Swaps Grid/List */}
              <div
                className={`${viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}`}
              >
                {filteredAndSortedSwaps.map((swap, index) => (
                  <motion.div
                    key={swap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${
                        swap.status === "active"
                          ? "border-l-green-500 bg-green-50/30"
                          : swap.status === "pending"
                            ? "border-l-yellow-500 bg-yellow-50/30"
                            : "border-l-gray-400 bg-gray-50/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              swap.status === "active"
                                ? "bg-green-500"
                                : swap.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-gray-400"
                            }`}
                          ></div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {swap.type === "offre"
                                ? "💼 Offre de"
                                : "🎯 Demande de"}{" "}
                              {formatCurrency(swap.amount)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {swap.counterparty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={
                              swap.status === "active"
                                ? "border-green-500 text-green-700"
                                : swap.status === "pending"
                                  ? "border-yellow-500 text-yellow-700"
                                  : "border-gray-500 text-gray-700"
                            }
                          >
                            {swap.status === "active"
                              ? "Actif"
                              : swap.status === "pending"
                                ? "En attente"
                                : "Terminé"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openSwapDetails(swap)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Messages
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Partager
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">Taux</p>
                          <p className="font-semibold text-violet-600">
                            {swap.interestRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Durée</p>
                          <p className="font-semibold">{swap.duration} mois</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Catégorie</p>
                          <p className="font-semibold">
                            {swap.category || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Créé</p>
                          <p className="font-semibold">
                            {formatShortDate(swap.createdAt)}
                          </p>
                        </div>
                      </div>

                      {swap.status === "active" &&
                        swap.progress !== undefined && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progression</span>
                              <span>{swap.progress}%</span>
                            </div>
                            <Progress value={swap.progress} className="h-2" />
                            {swap.daysRemaining && (
                              <p className="text-xs text-gray-500 mt-1">
                                {swap.daysRemaining} jours restants
                              </p>
                            )}
                          </div>
                        )}

                      {swap.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1 font-medium">
                            Description
                          </p>
                          <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                            {swap.description}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-1">
                          {swap.riskLevel && (
                            <div
                              className={`w-3 h-3 rounded-full ${
                                swap.riskLevel === "low"
                                  ? "bg-green-400"
                                  : swap.riskLevel === "medium"
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                              }`}
                              title={`Risque ${swap.riskLevel}`}
                            ></div>
                          )}
                          {swap.verified && (
                            <CheckCircle
                              className="h-4 w-4 text-green-500"
                              title="Vérifié"
                            />
                          )}
                          {swap.estimatedReturn && (
                            <span className="text-xs text-green-600 font-medium">
                              +{formatCurrency(swap.estimatedReturn)} gain
                              estimé
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => openSwapDetails(swap)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredAndSortedSwaps.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Handshake className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchTerm ||
                    filterStatus !== "all" ||
                    selectedCategory !== "all"
                      ? "Aucun swap trouvé"
                      : "Aucun swap créé"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ||
                    filterStatus !== "all" ||
                    selectedCategory !== "all"
                      ? "Essayez de modifier vos critères de recherche"
                      : "Commencez par créer votre premier swap"}
                  </p>
                  <div className="flex justify-center space-x-3">
                    {searchTerm ||
                    filterStatus !== "all" ||
                    selectedCategory !== "all" ? (
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("all");
                          setSelectedCategory("all");
                        }}
                        variant="outline"
                      >
                        Effacer les filtres
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowCreateSwap(true)}
                        className="bg-gradient-to-r from-violet-600 to-cyan-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer mon premier swap
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="wallet" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Solde principal amélioré */}
                <Card className="lg:col-span-2 p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-cyan-300/20 rounded-full blur-xl" />

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                      <div className="mb-4 sm:mb-0">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
                          <Wallet className="h-5 w-5 mr-2" />
                          Solde du portefeuille
                        </h2>
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl sm:text-3xl font-bold">
                            {hideBalance
                              ? "•••••"
                              : formatCurrency(animatedBalance)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setHideBalance(!hideBalance)}
                            className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                          >
                            {hideBalance ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                        >
                          <ArrowDownRight className="h-4 w-4 mr-2" />
                          Déposer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                        >
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Retirer
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4">
                        <p className="text-white/80 text-sm font-medium mb-1">
                          Total déposé
                        </p>
                        <p className="text-lg sm:text-xl font-bold">
                          {formatCurrency(walletData.totalDeposited)}
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4">
                        <p className="text-white/80 text-sm font-medium mb-1">
                          Total retiré
                        </p>
                        <p className="text-lg sm:text-xl font-bold">
                          {formatCurrency(walletData.totalWithdrawn)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Statistiques détaillées */}
                <div className="space-y-4">
                  <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-white/25 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <span className="text-xs bg-white/25 px-2 py-1 rounded-full">
                        Ce mois
                      </span>
                    </div>
                    <p className="text-2xl font-bold mb-1">
                      {formatCurrency(quickStats.totalEarnings || 0)}
                    </p>
                    <p className="text-green-100 text-sm">Gains totaux</p>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-white/25 rounded-lg flex items-center justify-center">
                        <LineChart className="h-5 w-5" />
                      </div>
                      <span className="text-xs bg-white/25 px-2 py-1 rounded-full">
                        ROI
                      </span>
                    </div>
                    <p className="text-2xl font-bold mb-1">
                      +
                      {(
                        ((quickStats.totalEarnings || 0) /
                          walletData.totalDeposited) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                    <p className="text-purple-100 text-sm">Rendement</p>
                  </Card>
                </div>
              </div>

              {/* Transactions récentes améliorées */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-violet-500" />
                    Transactions récentes
                  </h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>

                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === "deposit"
                              ? "bg-green-100"
                              : transaction.type === "withdraw"
                                ? "bg-red-100"
                                : transaction.type === "interest"
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                          }`}
                        >
                          {transaction.type === "deposit" ? (
                            <ArrowDownRight
                              className={`h-5 w-5 ${
                                transaction.type === "deposit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            />
                          ) : transaction.type === "withdraw" ? (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          ) : transaction.type === "interest" ? (
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                          ) : (
                            <DollarSign className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "deposit" ||
                            transaction.type === "interest"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" ||
                          transaction.type === "interest"
                            ? "+"
                            : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            transaction.status === "completed"
                              ? "border-green-500 text-green-700"
                              : transaction.status === "pending"
                                ? "border-yellow-500 text-yellow-700"
                                : "border-red-500 text-red-700"
                          }`}
                        >
                          {transaction.status === "completed"
                            ? "Terminé"
                            : transaction.status === "pending"
                              ? "En cours"
                              : "Échec"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4 sm:space-y-6">
              {/* Enhanced Contacts Management */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Mes Contacts
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {contacts.length} contact{contacts.length !== 1 ? "s" : ""}{" "}
                    dans votre réseau
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddContactDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Contact
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {contacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${contact.name}`}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                              {contact.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {contact.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {contact.company}
                            </p>
                            {contact.category && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {contact.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openChat(contact)}>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Envoyer message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              Appeler
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">Swaps</p>
                          <p className="font-semibold text-violet-600">
                            {contact.swapsCount || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">
                            Trust Score
                          </p>
                          <div className="flex items-center space-x-1">
                            <p className="font-semibold">
                              {contact.trustScore || 0}%
                            </p>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                (contact.trustScore || 0) >= 90
                                  ? "bg-green-400"
                                  : (contact.trustScore || 0) >= 70
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {contact.rating && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < contact.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">
                              ({contact.rating}/5)
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>
                          Dernier contact:{" "}
                          {formatShortDate(
                            contact.lastContact || new Date().toISOString(),
                          )}
                        </span>
                        {contact.totalSwapVolume && (
                          <span className="font-medium text-green-600">
                            {formatCurrency(contact.totalSwapVolume)}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openChat(contact)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Handshake className="h-4 w-4 mr-2" />
                          Swap
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {contacts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Aucun contact ajouté
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Commencez à construire votre réseau professionnel
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre premier contact
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Dialog de création de swap */}
      <Dialog open={showCreateSwap} onOpenChange={setShowCreateSwap}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Créer un nouveau swap
            </DialogTitle>
            <DialogDescription>
              Définissez les conditions de votre swap pour attirer les
              meilleures opportunités.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="type"
                  className="text-sm font-medium text-gray-700"
                >
                  Type de swap
                </Label>
                <Select
                  value={swapForm.type}
                  onValueChange={(value) =>
                    setSwapForm({ ...swapForm, type: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demande">
                      🎯 Demande de financement
                    </SelectItem>
                    <SelectItem value="offre">
                      💼 Offre de financement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Catégorie
                </Label>
                <Select
                  value={swapForm.category}
                  onValueChange={(value) =>
                    setSwapForm({ ...swapForm, category: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Énergie">🌱 Énergie</SelectItem>
                    <SelectItem value="Technology">💻 Technology</SelectItem>
                    <SelectItem value="Restauration">
                      🍽️ Restauration
                    </SelectItem>
                    <SelectItem value="Finance">🏦 Finance</SelectItem>
                    <SelectItem value="Industrie">🏭 Industrie</SelectItem>
                    <SelectItem value="Commerce">🛍️ Commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-700"
                >
                  Montant (€) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="ex: 50000"
                  value={swapForm.amount}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, amount: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium text-gray-700"
                >
                  Durée (mois) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="ex: 12"
                  value={swapForm.duration}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, duration: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="interestRate"
                  className="text-sm font-medium text-gray-700"
                >
                  Taux (%) *
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="ex: 3.5"
                  value={swapForm.interestRate}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, interestRate: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="purpose"
                className="text-sm font-medium text-gray-700"
              >
                Objectif du financement
              </Label>
              <Input
                id="purpose"
                placeholder="ex: Expansion commerciale, développement produit..."
                value={swapForm.purpose}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, purpose: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description détaillée
              </Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre projet, vos besoins ou votre offre en détail..."
                value={swapForm.description}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, description: e.target.value })
                }
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label
                htmlFor="guarantees"
                className="text-sm font-medium text-gray-700"
              >
                Garanties proposées
              </Label>
              <Textarea
                id="guarantees"
                placeholder="Décrivez les garanties que vous proposez..."
                value={swapForm.guarantees}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, guarantees: e.target.value })
                }
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateSwap(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateSwap}
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer le swap
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de détails de swap */}
      <Dialog open={showSwapDetails} onOpenChange={setShowSwapDetails}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedSwap && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      {selectedSwap.type === "offre" ? "💼" : "🎯"}
                      <span className="ml-2">
                        {selectedSwap.type === "offre"
                          ? "Offre de"
                          : "Demande de"}{" "}
                        {formatCurrency(selectedSwap.amount)}
                      </span>
                    </DialogTitle>
                    <DialogDescription className="text-lg mt-1">
                      {selectedSwap.counterparty}
                    </DialogDescription>
                  </div>
                  <Badge
                    className={`text-sm px-3 py-1 font-medium ${
                      selectedSwap.status === "active"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : selectedSwap.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {selectedSwap.status === "active"
                      ? "✅ Actif"
                      : selectedSwap.status === "pending"
                        ? "⏳ En attente"
                        : "✓ Terminé"}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-6">
                {/* Informations principales */}
                <Card className="p-6 bg-gradient-to-r from-violet-50 to-cyan-50 border border-violet-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-violet-600" />
                    Informations principales
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/70 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-medium">
                        Montant
                      </p>
                      <p className="text-xl font-bold text-violet-600">
                        {formatCurrency(selectedSwap.amount)}
                      </p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-medium">
                        Taux d'intérêt
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {selectedSwap.interestRate}%
                      </p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-medium">Durée</p>
                      <p className="text-xl font-bold text-blue-600">
                        {selectedSwap.duration} mois
                      </p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-medium">
                        Créé le
                      </p>
                      <p className="text-lg font-bold text-gray-700">
                        {formatDate(selectedSwap.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Progression et statut */}
                {selectedSwap.status === "active" &&
                  selectedSwap.progress !== undefined && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Gauge className="h-5 w-5 mr-2 text-blue-600" />
                        Progression du swap
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Avancement</span>
                            <span className="font-medium">
                              {selectedSwap.progress}%
                            </span>
                          </div>
                          <Progress
                            value={selectedSwap.progress}
                            className="h-3"
                          />
                        </div>
                        {selectedSwap.daysRemaining && (
                          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-blue-600 mr-2" />
                              <span className="font-medium text-blue-800">
                                Temps restant
                              </span>
                            </div>
                            <span className="text-blue-700 font-bold">
                              {selectedSwap.daysRemaining} jours
                            </span>
                          </div>
                        )}
                        {selectedSwap.nextPaymentDate && (
                          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-medium text-green-800">
                                Prochain paiement
                              </span>
                            </div>
                            <span className="text-green-700 font-bold">
                              {formatDate(selectedSwap.nextPaymentDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                {/* Détails financiers */}
                {(selectedSwap.estimatedReturn ||
                  selectedSwap.monthlyPayment) && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Détails financiers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedSwap.estimatedReturn && (
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <p className="text-sm text-green-700 font-medium">
                            Gain estimé
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            +{formatCurrency(selectedSwap.estimatedReturn)}
                          </p>
                        </div>
                      )}
                      {selectedSwap.monthlyPayment && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <p className="text-sm text-blue-700 font-medium">
                            Paiement mensuel
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(selectedSwap.monthlyPayment)}
                          </p>
                        </div>
                      )}
                      {selectedSwap.totalInterest && (
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <p className="text-sm text-purple-700 font-medium">
                            Total intérêts
                          </p>
                          <p className="text-2xl font-bold text-purple-600">
                            {formatCurrency(selectedSwap.totalInterest)}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Description et objectif */}
                {(selectedSwap.description || selectedSwap.purpose) && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-gray-600" />
                      Description du projet
                    </h3>
                    <div className="space-y-4">
                      {selectedSwap.purpose && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Objectif
                          </p>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {selectedSwap.purpose}
                          </p>
                        </div>
                      )}
                      {selectedSwap.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Description détaillée
                          </p>
                          <p className="text-gray-900 bg-gray-50 p-4 rounded-lg leading-relaxed">
                            {selectedSwap.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Garanties */}
                {selectedSwap.guarantees && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      Garanties proposées
                    </h3>
                    <p className="text-gray-900 bg-green-50 p-4 rounded-lg border border-green-200">
                      {selectedSwap.guarantees}
                    </p>
                  </Card>
                )}

                {/* Métadonnées */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    Informations complémentaires
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedSwap.category && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Catégorie
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {selectedSwap.category}
                        </Badge>
                      </div>
                    )}
                    {selectedSwap.riskLevel && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Niveau de risque
                        </p>
                        <div className="flex items-center mt-1">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                              selectedSwap.riskLevel === "low"
                                ? "bg-green-400"
                                : selectedSwap.riskLevel === "medium"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                            }`}
                          ></div>
                          <span className="text-sm font-medium capitalize">
                            {selectedSwap.riskLevel === "low"
                              ? "Faible"
                              : selectedSwap.riskLevel === "medium"
                                ? "Moyen"
                                : "Élevé"}
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedSwap.verified !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Vérification
                        </p>
                        <div className="flex items-center mt-1">
                          {selectedSwap.verified ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-sm font-medium text-green-700">
                                Vérifié
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium text-yellow-700">
                                En attente
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        ID du swap
                      </p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                        {selectedSwap.id}
                      </code>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    onClick={() => openChat()}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Envoyer un message
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  {selectedSwap.status === "pending" && (
                    <Button
                      variant="outline"
                      className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accepter
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de chat */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
          {chatContact && (
            <>
              <DialogHeader className="border-b pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${chatContact.name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                      {chatContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                      {chatContact.name}
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                      {chatContact.company}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === "me"
                          ? "bg-violet-600 text-white"
                          : "bg-white text-gray-900 shadow-sm border"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "me"
                            ? "text-violet-200"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Zone de saisie */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendChatMessage}
                    disabled={!chatMessage.trim()}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center space-x-2 mt-3">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Vidéo
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Fichier
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout de contact */}
      <Dialog
        open={showAddContactDialog}
        onOpenChange={setShowAddContactDialog}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Ajouter un nouveau contact
            </DialogTitle>
            <DialogDescription>
              Ajoutez un contact à votre réseau professionnel pour faciliter les
              échanges.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  Prénom *
                </Label>
                <Input
                  id="firstName"
                  placeholder="ex: Jean"
                  value={contactForm.firstName}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      firstName: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Nom *
                </Label>
                <Input
                  id="lastName"
                  placeholder="ex: Martin"
                  value={contactForm.lastName}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, lastName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="company"
                className="text-sm font-medium text-gray-700"
              >
                Entreprise *
              </Label>
              <Input
                id="company"
                placeholder="ex: TechStart Solutions"
                value={contactForm.company}
                onChange={(e) =>
                  setContactForm({ ...contactForm, company: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ex: jean.martin@example.com"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  placeholder="ex: +33 1 23 45 67 89"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Catégorie
              </Label>
              <Select
                value={contactForm.category}
                onValueChange={(value) =>
                  setContactForm({ ...contactForm, category: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner une catégorie..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finance">🏦 Finance</SelectItem>
                  <SelectItem value="Technology">💻 Technology</SelectItem>
                  <SelectItem value="Énergie">🌱 Énergie</SelectItem>
                  <SelectItem value="Restauration">🍽️ Restauration</SelectItem>
                  <SelectItem value="Industrie">🏭 Industrie</SelectItem>
                  <SelectItem value="Commerce">🛍️ Commerce</SelectItem>
                  <SelectItem value="Conseil">💼 Conseil</SelectItem>
                  <SelectItem value="Autre">📋 Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="notes"
                className="text-sm font-medium text-gray-700"
              >
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes sur ce contact..."
                value={contactForm.notes}
                onChange={(e) =>
                  setContactForm({ ...contactForm, notes: e.target.value })
                }
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAddContactDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddContact}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardEnhanced;
