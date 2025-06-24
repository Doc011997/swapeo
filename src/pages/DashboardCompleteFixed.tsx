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
  Trophy,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import { SwapService } from "@/lib/swapService";

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
  const [showAlgorithmAnalysis, setShowAlgorithmAnalysis] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");
  const [createdSwapId, setCreatedSwapId] = useState("");
  const [analysisResult, setAnalysisResult] = useState<
    "approved" | "rejected" | null
  >(null);
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

  // États pour le chat
  const [showChat, setShowChat] = useState(false);
  const [chatContact, setChatContact] = useState<Contact | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");

  // États pour la navigation mobile
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

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

      // Chargement des swaps
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
          description: "Besoin de liquidités",
          category: "Restauration",
          riskLevel: "medium",
          verified: true,
          purpose: "Fonds de roulement",
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
          description: "Prêt court terme",
          category: "Technology",
          riskLevel: "high",
          verified: false,
          purpose: "Développement produit",
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
        },
        {
          id: "contact2",
          name: "Sophie Laurent",
          company: "EcoInvest",
          email: "s.laurent@ecoinvest.fr",
          phone: "+33 1 98 76 54 32",
          lastContact: "2024-03-08",
          swapsCount: 3,
          trustScore: 88,
          category: "Énergie",
          status: "active",
        },
        {
          id: "contact3",
          name: "Pierre Durand",
          company: "TechFlow",
          email: "p.durand@techflow.com",
          lastContact: "2024-03-05",
          swapsCount: 7,
          trustScore: 96,
          category: "Technology",
          status: "active",
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
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setMessage("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSwap = async () => {
    try {
      // Validation basique
      if (!swapForm.amount || !swapForm.duration || !swapForm.interestRate) {
        setMessage("Veuillez remplir tous les champs obligatoires");
        return;
      }

      // Création du swap
      const newSwap: Swap = {
        id: `swap_${Date.now()}`,
        type: swapForm.type as "demande" | "offre",
        amount: parseInt(swapForm.amount),
        duration: parseInt(swapForm.duration),
        interestRate: parseFloat(swapForm.interestRate),
        counterparty: "",
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

      // Ajouter le swap au service marketplace
      await SwapService.addSwapToMarketplace({
        id: newSwap.id,
        type: newSwap.type,
        amount: newSwap.amount,
        duration: newSwap.duration,
        rate: newSwap.interestRate,
        description: newSwap.description || "",
        purpose: newSwap.purpose || "",
        guarantees: newSwap.guarantees || "",
        category: newSwap.category || "",
        riskLevel: newSwap.riskLevel || "medium",
        createdById: user?.id || "",
        createdByCompany: user?.company || "",
        trustScore: user?.stats?.avgRating ? user.stats.avgRating * 20 : 85,
        public: true,
        approvalStatus: "pending",
      });

      // Ajouter à la liste locale
      setSwaps([newSwap, ...swaps]);

      // Démarrer l'analyse après 1.5 secondes
      setTimeout(() => {
        setCreatedSwapId(newSwap.id);
        startAlgorithmAnalysis(newSwap.id);
      }, 1500);

      // Fermer le dialogue
      setShowCreateSwap(false);

      // Réinitialiser le formulaire
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

      setMessage("Swap créé avec succès! Analyse en cours...");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setMessage("Erreur lors de la création du swap");
    }
  };

  const startAlgorithmAnalysis = (swapId: string) => {
    setShowAlgorithmAnalysis(true);
    setAnalysisProgress(0);
    setAnalysisStep("Initialisation de l'analyse...");
    setAnalysisResult(null);

    const steps = [
      "Vérification des données...",
      "Analyse du profil entreprise...",
      "Calcul du score de risque...",
      "Validation des garanties...",
      "Évaluation finale...",
    ];

    let currentStep = 0;
    let progress = 0;

    const interval = setInterval(() => {
      // Mise à jour du progrès
      progress += Math.random() * 15 + 5; // Incréments de 5-20%

      if (progress > 100) progress = 100;

      setAnalysisProgress(progress);

      // Changement d'étape
      if (progress > (currentStep + 1) * 20 && currentStep < steps.length - 1) {
        currentStep++;
        setAnalysisStep(steps[currentStep]);
      }

      // Fin de l'analyse
      if (progress >= 100) {
        clearInterval(interval);

        // Auto-approval (comme demandé par l'utilisateur)
        const isApproved = true;

        setTimeout(() => {
          setAnalysisResult(isApproved ? "approved" : "rejected");
          setAnalysisStep(
            isApproved ? "Swap approuvé et publié!" : "Swap non approuvé",
          );

          if (isApproved) {
            // Commencer le processus d'approbation
            SwapService.startApprovalProcess(swapId);
          }
        }, 500);
      }
    }, 200);
  };

  const handleInviteContact = () => {
    if (!inviteForm.email || !inviteForm.firstName || !inviteForm.lastName) {
      setMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setMessage(
      `Invitation envoyée à ${inviteForm.firstName} ${inviteForm.lastName}`,
    );

    setInviteForm({
      email: "",
      firstName: "",
      lastName: "",
      message: "",
    });

    setShowInviteDialog(false);
  };

  const handleAddContact = () => {
    if (
      !contactForm.firstName ||
      !contactForm.lastName ||
      !contactForm.company
    ) {
      setMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newContact: Contact = {
      id: `contact_${Date.now()}`,
      name: `${contactForm.firstName} ${contactForm.lastName}`,
      company: contactForm.company,
      email: contactForm.email,
      phone: contactForm.phone,
      notes: contactForm.notes,
      category: contactForm.category,
      status: "active",
      addedDate: new Date().toISOString().split("T")[0],
      trustScore: 75,
      swapsCount: 0,
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
  };

  const openChat = (contact: Contact) => {
    setChatContact(contact);
    setShowChat(true);

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
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "me",
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage("");

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
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, autoResponse]);
    }, 2000);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-violet-50/30 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-lg"></div>
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
      {/* Header */}
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
                                      : "bg-blue-500"
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
                <div className="hidden sm:block">
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

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Bell className="h-5 w-5 mr-2 text-violet-500" />
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
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
                                      : "bg-blue-500"
                                } shadow-sm`}
                              ></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">
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

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 hover:bg-violet-50 rounded-xl touch-manipulation"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-label="Menu principal"
                aria-expanded={showMobileMenu}
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl"
              >
                <div className="p-4 space-y-4">
                  {/* User Profile Mobile */}
                  <div className="flex items-center space-x-3 p-3 bg-violet-50/50 rounded-xl">
                    <Avatar className="h-12 w-12 ring-2 ring-violet-200">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${user.firstName}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.company}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions Mobile */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setShowCreateSwap(true)}
                      className="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white h-14 flex-col rounded-xl shadow-lg"
                    >
                      <Plus className="h-5 w-5 mb-1" />
                      <span className="text-xs font-semibold">Créer Swap</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/swap")}
                      className="border-2 border-green-200 hover:bg-green-50 h-14 flex-col rounded-xl"
                    >
                      <Search className="h-5 w-5 mb-1 text-green-600" />
                      <span className="text-xs font-semibold text-gray-900">
                        Marketplace
                      </span>
                    </Button>
                  </div>

                  {/* Logout Mobile */}
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 h-12 rounded-xl"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                                swaps.filter((s) => s.status === "active")
                                  .length
                              }
                            </p>
                            <div className="flex items-center text-cyan-200 text-sm sm:text-base font-medium">
                              <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                              {
                                swaps.filter((s) => s.status === "pending")
                                  .length
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
                    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-green-200/50 hover:shadow-lg transition-all duration-300 sm:hover:scale-105">
                      <div className="flex items-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                            Rendement Moy.
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            3.8%
                          </p>
                          <p className="text-xs text-green-600 font-medium">
                            +0.3% vs mois dernier
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-yellow-200/50 hover:shadow-lg transition-all duration-300 sm:hover:scale-105">
                      <div className="flex items-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Star className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                            Note Moyenne
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {user.stats?.avgRating || 4.8}★
                          </p>
                          <p className="text-xs text-yellow-600 font-medium">
                            Excellent profil
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-blue-200/50 hover:shadow-lg transition-all duration-300 sm:hover:scale-105">
                      <div className="flex items-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                            Contacts
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {contacts.length}
                          </p>
                          <p className="text-xs text-blue-600 font-medium">
                            Réseau actif
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>

              {/* Actions rapides */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-md border-violet-200/50 shadow-xl rounded-3xl">
                  <div className="flex items-center mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Actions Rapides
                    </h3>
                  </div>

                  {/* Mobile: Stack vertical, Desktop: Grid horizontal */}
                  <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
                    <Button
                      onClick={() => setShowCreateSwap(true)}
                      className="w-full bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 focus:from-violet-600 focus:to-purple-700 focus:ring-4 focus:ring-violet-200 text-white p-5 sm:p-6 h-auto flex items-center sm:flex-col rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 sm:hover:scale-105 group touch-manipulation"
                      aria-label="Créer un nouveau swap"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/25 rounded-2xl flex items-center justify-center mr-4 sm:mr-0 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span className="text-base font-bold block leading-tight">
                          Créer un Swap
                        </span>
                        <span className="text-sm opacity-90 sm:mt-1 block">
                          Nouvelle proposition
                        </span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/swap")}
                      className="w-full border-2 border-green-300 hover:bg-green-50 hover:border-green-400 focus:bg-green-50 focus:border-green-400 focus:ring-4 focus:ring-green-200 p-5 sm:p-6 h-auto flex items-center sm:flex-col rounded-2xl transition-all duration-300 sm:hover:scale-105 group bg-white/80 backdrop-blur-md shadow-lg touch-manipulation"
                      aria-label="Accéder au marketplace"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-2xl flex items-center justify-center mr-4 sm:mr-0 sm:mb-4 group-hover:scale-110 group-hover:bg-green-200 transition-all duration-300 shadow-md">
                        <Search className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span className="text-base font-bold text-gray-900 block leading-tight">
                          Marketplace
                        </span>
                        <span className="text-sm text-gray-700 sm:mt-1 block">
                          Chercher opportunités
                        </span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 focus:bg-blue-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 p-5 sm:p-6 h-auto flex items-center sm:flex-col rounded-2xl transition-all duration-300 sm:hover:scale-105 group bg-white/80 backdrop-blur-md shadow-lg touch-manipulation"
                      onClick={() => setShowInviteDialog(true)}
                      aria-label="Inviter de nouveaux contacts"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 sm:mr-0 sm:mb-4 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300 shadow-md">
                        <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span className="text-base font-bold text-gray-900 block leading-tight">
                          Inviter
                        </span>
                        <span className="text-sm text-gray-700 sm:mt-1 block">
                          Nouveaux contacts
                        </span>
                      </div>
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Liste des swaps récents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-md border-gray-200/50 shadow-xl rounded-3xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
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
                  <div className="space-y-3">
                    {swaps.slice(0, 3).map((swap, index) => (
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
                                <p className="text-xs sm:text-sm text-gray-500 sm:hidden mt-1">
                                  Durée: {swap.duration} mois
                                </p>
                              </div>
                            </div>

                            {/* Mobile: Full width, Desktop: Right aligned */}
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
                                <p className="text-xs text-green-600 font-medium sm:mt-1">
                                  {swap.daysRemaining || 45}j restants
                                </p>
                              )}
                              <p className="text-xs text-gray-500 hidden sm:block">
                                {swap.duration} mois
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {swaps.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Handshake className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        Aucun swap pour le moment
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Créez votre premier swap pour commencer
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="swaps" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Mes Swaps</h2>
                <Button
                  onClick={() => setShowCreateSwap(true)}
                  className="bg-gradient-to-r from-violet-600 to-cyan-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Swap
                </Button>
              </div>

              <div className="grid gap-6">
                {swaps.map((swap) => (
                  <Card key={swap.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            swap.status === "active"
                              ? "bg-green-500"
                              : swap.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                          }`}
                        ></div>
                        <h3 className="text-lg font-semibold">
                          {swap.type === "offre" ? "Offre de" : "Demande de"}{" "}
                          {formatCurrency(swap.amount)}
                        </h3>
                      </div>
                      <Badge
                        className={
                          swap.status === "active"
                            ? "bg-green-100 text-green-700"
                            : swap.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }
                      >
                        {swap.status === "active"
                          ? "Actif"
                          : swap.status === "pending"
                            ? "En attente"
                            : "Terminé"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Contrepartie</p>
                        <p className="font-medium">{swap.counterparty}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Taux d'intérêt</p>
                        <p className="font-medium">{swap.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Durée</p>
                        <p className="font-medium">{swap.duration} mois</p>
                      </div>
                    </div>

                    {swap.status === "active" && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>{swap.progress}%</span>
                        </div>
                        <Progress value={swap.progress} className="h-2" />
                      </div>
                    )}

                    {swap.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Description
                        </p>
                        <p className="text-sm">{swap.description}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Créé le {formatDate(swap.createdAt)}</span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Messages
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Solde principal */}
                <Card className="lg:col-span-2 p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white relative overflow-hidden">
                  {/* Background effects pour mobile */}
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-cyan-300/20 rounded-full blur-xl" />

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                      <div className="mb-4 sm:mb-0">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">
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
                      <Wallet className="h-10 w-10 sm:h-12 sm:w-12 opacity-80 self-start sm:self-auto" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Button className="bg-white/20 hover:bg-white/30 text-white border-0 h-12 sm:h-10 rounded-xl font-semibold">
                        <ArrowDownRight className="h-4 w-4 mr-2" />
                        Déposer
                      </Button>
                      <Button className="bg-white/20 hover:bg-white/30 text-white border-0 h-12 sm:h-10 rounded-xl font-semibold">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Retirer
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Stats rapides */}
                <div className="space-y-3 sm:space-y-4">
                  <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">
                          Total Déposé
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatCurrency(walletData.totalDeposited)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">
                          Total Retiré
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatCurrency(walletData.totalWithdrawn)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Euro className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">
                          Gains Totaux
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatCurrency(user.stats?.totalEarnings || 3847)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Historique des transactions */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Historique des Transactions
                  </h3>
                  <div className="flex space-x-2">
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
                        <SelectItem value="90d">90 jours</SelectItem>
                        <SelectItem value="1y">1 an</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === "deposit"
                              ? "bg-green-100"
                              : transaction.type === "withdraw"
                                ? "bg-red-100"
                                : "bg-blue-100"
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
                          ) : (
                            <Euro className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
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
                          className={
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {transaction.status === "completed"
                            ? "Terminé"
                            : transaction.status === "pending"
                              ? "En attente"
                              : "Échoué"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Mes Contacts
                </h2>
                <Button
                  onClick={() => setShowAddContactDialog(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-cyan-600 h-12 sm:h-10 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Contact
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {contacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-violet-100">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${contact.name}`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white font-bold text-sm">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {contact.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {contact.company}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Score confiance</span>
                        <span className="font-medium text-green-600">
                          {contact.trustScore || 85}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Swaps réalisés</span>
                        <span className="font-medium">
                          {contact.swapsCount || 0}
                        </span>
                      </div>
                      {contact.lastContact && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Dernier contact</span>
                          <span className="font-medium text-xs sm:text-sm">
                            {formatDate(contact.lastContact)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-10 rounded-xl border-violet-200 hover:bg-violet-50 touch-manipulation"
                        onClick={() => openChat(contact)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2 text-violet-600" />
                        <span className="text-violet-700 font-medium">
                          Message
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-10 rounded-xl border-blue-200 hover:bg-blue-50 touch-manipulation"
                      >
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-blue-700 font-medium">Email</span>
                      </Button>
                    </div>

                    {contact.category && (
                      <div className="mt-3">
                        <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                          {contact.category}
                        </Badge>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Empty state pour mobile */}
              {contacts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Aucun contact pour le moment
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Ajoutez votre premier contact pour commencer
                  </p>
                  <Button
                    onClick={() => setShowAddContactDialog(true)}
                    className="mt-4 bg-gradient-to-r from-violet-600 to-cyan-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un contact
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Dialogue de création de swap */}
      <Dialog open={showCreateSwap} onOpenChange={setShowCreateSwap}>
        <DialogContent className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto m-2 sm:m-auto">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold">
                  Créer un nouveau swap
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Remplissez les informations pour créer votre proposition
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateSwap(false)}
                className="sm:hidden h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-sm font-medium">
                  Type de swap
                </Label>
                <Select
                  value={swapForm.type}
                  onValueChange={(value) =>
                    setSwapForm({ ...swapForm, type: value })
                  }
                >
                  <SelectTrigger className="h-12 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demande">
                      💰 Demande de financement
                    </SelectItem>
                    <SelectItem value="offre">
                      💼 Offre de financement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Catégorie
                </Label>
                <Select
                  value={swapForm.category}
                  onValueChange={(value) =>
                    setSwapForm({ ...swapForm, category: value })
                  }
                >
                  <SelectTrigger className="h-12 mt-1">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">🖥️ Technologie</SelectItem>
                    <SelectItem value="energy">⚡ Énergie</SelectItem>
                    <SelectItem value="finance">🏦 Finance</SelectItem>
                    <SelectItem value="retail">🛍️ Commerce</SelectItem>
                    <SelectItem value="manufacturing">🏭 Industrie</SelectItem>
                    <SelectItem value="services">🔧 Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Montant (€)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={swapForm.amount}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, amount: e.target.value })
                  }
                  className="h-12 mt-1 text-base"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-sm font-medium">
                  Durée (mois)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="12"
                  value={swapForm.duration}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, duration: e.target.value })
                  }
                  className="h-12 mt-1 text-base"
                />
              </div>

              <div>
                <Label htmlFor="interestRate" className="text-sm font-medium">
                  Taux (%)
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="3.5"
                  value={swapForm.interestRate}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, interestRate: e.target.value })
                  }
                  className="h-12 mt-1 text-base"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purpose" className="text-sm font-medium">
                Objectif du financement
              </Label>
              <Input
                id="purpose"
                placeholder="Ex: Expansion commerciale, fonds de roulement..."
                value={swapForm.purpose}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, purpose: e.target.value })
                }
                className="h-12 mt-1 text-base"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description détaillée
              </Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre projet, vos besoins ou votre offre..."
                value={swapForm.description}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, description: e.target.value })
                }
                rows={4}
                className="mt-1 text-base resize-none"
              />
            </div>

            <div>
              <Label htmlFor="guarantees" className="text-sm font-medium">
                Garanties proposées
              </Label>
              <Textarea
                id="guarantees"
                placeholder="Décrivez les garanties que vous proposez..."
                value={swapForm.guarantees}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, guarantees: e.target.value })
                }
                rows={3}
                className="mt-1 text-base resize-none"
              />
            </div>

            {/* Mobile: Stack vertical, Desktop: Horizontal */}
            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowCreateSwap(false)}
                className="w-full sm:w-auto h-12 sm:h-10"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateSwap}
                className="w-full sm:w-auto h-12 sm:h-10 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer le swap
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'invitation */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="w-full max-w-md m-2 sm:m-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-bold">
                  Inviter un contact
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Invitez quelqu'un à rejoindre Swapeo
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInviteDialog(false)}
                className="sm:hidden h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  value={inviteForm.firstName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, firstName: e.target.value })
                  }
                  className="h-12 mt-1 text-base"
                  placeholder="Ex: Marie"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  value={inviteForm.lastName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, lastName: e.target.value })
                  }
                  className="h-12 mt-1 text-base"
                  placeholder="Ex: Dubois"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                className="h-12 mt-1 text-base"
                placeholder="marie.dubois@entreprise.com"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium">
                Message personnalisé (optionnel)
              </Label>
              <Textarea
                id="message"
                placeholder="Ajouter un message personnel..."
                value={inviteForm.message}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, message: e.target.value })
                }
                rows={3}
                className="mt-1 text-base resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(false)}
                className="w-full sm:w-auto h-12 sm:h-10"
              >
                Annuler
              </Button>
              <Button
                onClick={handleInviteContact}
                className="w-full sm:w-auto h-12 sm:h-10 bg-gradient-to-r from-violet-600 to-cyan-600"
              >
                <Mail className="h-4 w-4 mr-2" />
                Envoyer l'invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'ajout de contact */}
      <Dialog
        open={showAddContactDialog}
        onOpenChange={setShowAddContactDialog}
      >
        <DialogContent className="w-full max-w-md m-2 sm:m-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-bold">
                  Ajouter un contact
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Ajoutez un nouveau contact à votre réseau
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddContactDialog(false)}
                className="sm:hidden h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="contactFirstName">Prénom</Label>
                <Input
                  id="contactFirstName"
                  value={contactForm.firstName}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="contactLastName">Nom</Label>
                <Input
                  id="contactLastName"
                  value={contactForm.lastName}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactCompany">Entreprise</Label>
              <Input
                id="contactCompany"
                value={contactForm.company}
                onChange={(e) =>
                  setContactForm({ ...contactForm, company: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Téléphone</Label>
                <Input
                  id="contactPhone"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactCategory">Catégorie</Label>
              <Select
                value={contactForm.category}
                onValueChange={(value) =>
                  setContactForm({ ...contactForm, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="fournisseur">Fournisseur</SelectItem>
                  <SelectItem value="partenaire">Partenaire</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="financeur">Financeur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contactNotes">Notes</Label>
              <Textarea
                id="contactNotes"
                placeholder="Informations supplémentaires..."
                value={contactForm.notes}
                onChange={(e) =>
                  setContactForm({ ...contactForm, notes: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAddContactDialog(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddContact}>Ajouter le contact</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat */}
      <AnimatePresence>
        {showChat && chatContact && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-x-2 bottom-2 sm:right-4 sm:bottom-4 sm:left-auto w-auto sm:w-80 h-[calc(100vh-6rem)] sm:h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col"
          >
            {/* Header du chat */}
            <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-violet-50 to-cyan-50">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${chatContact.name}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs">
                    {chatContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {chatContact.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {chatContact.company}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(false)}
                className="h-8 w-8 flex-shrink-0 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gray-50/30">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-xs px-3 py-2 rounded-2xl text-sm ${
                      msg.sender === "me"
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="break-words">{msg.message}</p>
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
                </div>
              ))}
            </div>

            {/* Input de message */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2 sm:space-x-3">
                <Input
                  placeholder="Tapez votre message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  className="flex-1 h-10 sm:h-12 text-base rounded-full border-gray-300 focus:border-violet-500"
                />
                <Button
                  size="icon"
                  onClick={sendChatMessage}
                  disabled={!chatMessage.trim()}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'analyse algorithmique */}
      <Dialog
        open={showAlgorithmAnalysis}
        onOpenChange={setShowAlgorithmAnalysis}
      >
        <DialogContent className="w-full max-w-sm sm:max-w-md m-2 sm:m-auto">
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-lg sm:text-xl font-bold flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mr-2">
                <Calculator className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              Analyse IA
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Votre swap est analysé par notre algorithme IA
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Indicateur de progression circulaire */}
            <div className="flex justify-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                <svg
                  className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysisProgress / 100)}`}
                    className="text-violet-600 transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {analysisResult ? (
                    analysisResult === "approved" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center"
                      >
                        <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
                      </motion.div>
                    )
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-violet-100 rounded-full flex items-center justify-center"
                    >
                      <Calculator className="h-8 w-8 sm:h-10 sm:w-10 text-violet-600" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Pourcentage et étape */}
            <div className="text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                {Math.round(analysisProgress)}%
              </p>
              <p className="text-sm sm:text-base text-gray-600 px-4 leading-relaxed">
                {analysisStep}
              </p>
            </div>

            {/* Résultat final */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3"
              >
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {analysisResult === "approved" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <p
                      className={`font-semibold ${
                        analysisResult === "approved"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analysisResult === "approved"
                        ? "Validation réussie"
                        : "Validation échouée"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {analysisResult === "approved"
                      ? "Score algorithmique: 87/100"
                      : "Score algorithmique: 42/100"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Actions finales */}
            {analysisResult === "approved" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Button
                  onClick={() => (window.location.href = "/swap")}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Voir dans le Marketplace
                </Button>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCompleteFixed;
