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
          description: "124.50��� d'intérêts crédités",
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

    // Simulation d'envoi d'invitation
    setMessage(
      `Invitation envoyée à ${inviteForm.firstName} ${inviteForm.lastName}`,
    );

    // Réinitialiser le formulaire
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

    // Réinitialiser le formulaire
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

    // Messages d'exemple
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

            <div className="flex items-center space-x-1 sm:space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </Button>

                {/* Panel de notifications */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
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
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${user.firstName}`}
                  />
                  <AvatarFallback>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.company}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Message d'état */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800">{message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMessage("")}
                className="h-6 w-6 text-blue-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Onglets de navigation */}
        <Tabs
          value={activeSection}
          onValueChange={setActiveSection}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Aperçu</span>
              <span className="sm:hidden">Vue</span>
            </TabsTrigger>
            <TabsTrigger
              value="swaps"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Handshake className="h-4 w-4" />
              <span>Swaps</span>
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Portefeuille</span>
              <span className="sm:hidden">Wallet</span>
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Contacts</span>
            </TabsTrigger>
          </TabsList>

          {/* Contenu des onglets */}
          <TabsContent value="overview" className="space-y-6">
            {/* Section Hero avec stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card principale de bienvenue */}
              <div className="lg:col-span-2">
                <Card className="p-6 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        Bienvenue, {user.firstName} !
                      </h2>
                      <p className="text-violet-100">
                        Votre espace de gestion Swapeo
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Handshake className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-violet-100 text-sm">Solde total</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(animatedBalance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-violet-100 text-sm">Swaps actifs</p>
                      <p className="text-2xl font-bold">
                        {swaps.filter((s) => s.status === "active").length}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Stats rapides */}
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
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
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Note Moyenne
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.stats?.avgRating || 4.8}★
                      </p>
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
            </div>

            {/* Actions rapides */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions Rapides
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <Button
                  onClick={() => setShowCreateSwap(true)}
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white p-3 sm:p-4 h-auto flex-col"
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Créer</span>
                  <span className="hidden lg:inline sm:text-sm">un Swap</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/swap")}
                  className="border-green-200 hover:bg-green-50 p-3 sm:p-4 h-auto flex-col transition-all duration-300 hover:scale-105"
                >
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 text-green-600" />
                  <span className="text-xs sm:text-sm">Chercher</span>
                  <span className="hidden lg:inline sm:text-sm">
                    Opportunités
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50 p-3 sm:p-4 h-auto flex-col"
                  onClick={() => setShowInviteDialog(true)}
                >
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 text-purple-600" />
                  <span className="text-xs sm:text-sm">Inviter</span>
                  <span className="hidden lg:inline sm:text-sm">Contacts</span>
                </Button>
              </div>
            </Card>

            {/* Liste des swaps récents */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Swaps Récents
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSection("swaps")}
                >
                  Voir tout
                </Button>
              </div>
              <div className="space-y-4">
                {swaps.slice(0, 3).map((swap) => (
                  <motion.div
                    key={swap.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          swap.status === "active"
                            ? "bg-green-500"
                            : swap.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {swap.type === "offre" ? "Offre de" : "Demande de"}{" "}
                          {formatCurrency(swap.amount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {swap.counterparty} • {swap.interestRate}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
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
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Notifications récentes */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications Récentes
              </h3>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
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
                ))}
              </div>
            </Card>
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
                      <p className="text-sm text-gray-600 mb-1">Description</p>
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

          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Solde principal */}
              <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Solde du portefeuille
                    </h2>
                    <div className="flex items-center space-x-2">
                      <p className="text-3xl font-bold">
                        {hideBalance
                          ? "•••••"
                          : formatCurrency(animatedBalance)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setHideBalance(!hideBalance)}
                        className="text-white hover:bg-white/20"
                      >
                        {hideBalance ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Wallet className="h-12 w-12 opacity-80" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <ArrowDownRight className="h-4 w-4 mr-2" />
                    Déposer
                  </Button>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Retirer
                  </Button>
                </div>
              </Card>

              {/* Stats rapides */}
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Déposé
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(walletData.totalDeposited)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Retiré
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(walletData.totalWithdrawn)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Euro className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Gains Totaux
                      </p>
                      <p className="text-xl font-bold text-gray-900">
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

          <TabsContent value="contacts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Mes Contacts</h2>
              <Button
                onClick={() => setShowAddContactDialog(true)}
                className="bg-gradient-to-r from-violet-600 to-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Contact
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <Card
                  key={contact.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${contact.name}`}
                      />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-600">{contact.company}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Score de confiance</span>
                      <span className="font-medium">
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
                        <span className="font-medium">
                          {formatDate(contact.lastContact)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openChat(contact)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>

                  {contact.category && (
                    <div className="mt-3">
                      <Badge className="bg-blue-100 text-blue-700">
                        {contact.category}
                      </Badge>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogue de création de swap */}
      <Dialog open={showCreateSwap} onOpenChange={setShowCreateSwap}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Créer un nouveau swap
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer votre proposition de swap
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type de swap</Label>
                <Select
                  value={swapForm.type}
                  onValueChange={(value) =>
                    setSwapForm({ ...swapForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demande">
                      Demande de financement
                    </SelectItem>
                    <SelectItem value="offre">Offre de financement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={swapForm.category}
                  onValueChange={(value) =>
                    setSwapForm({ ...swapForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technologie</SelectItem>
                    <SelectItem value="energy">Énergie</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Commerce</SelectItem>
                    <SelectItem value="manufacturing">Industrie</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="amount">Montant (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={swapForm.amount}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="duration">Durée (mois)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="12"
                  value={swapForm.duration}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, duration: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Taux d'intérêt (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="3.5"
                  value={swapForm.interestRate}
                  onChange={(e) =>
                    setSwapForm({ ...swapForm, interestRate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purpose">Objectif du financement</Label>
              <Input
                id="purpose"
                placeholder="Ex: Expansion commerciale, fonds de roulement..."
                value={swapForm.purpose}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, purpose: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre projet, vos besoins ou votre offre..."
                value={swapForm.description}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="guarantees">Garanties proposées</Label>
              <Textarea
                id="guarantees"
                placeholder="Décrivez les garanties que vous proposez..."
                value={swapForm.guarantees}
                onChange={(e) =>
                  setSwapForm({ ...swapForm, guarantees: e.target.value })
                }
                rows={3}
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
                className="bg-gradient-to-r from-violet-600 to-cyan-600"
              >
                Créer le swap
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'invitation */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un contact</DialogTitle>
            <DialogDescription>
              Invitez quelqu'un à rejoindre Swapeo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={inviteForm.firstName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={inviteForm.lastName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="message">Message personnalisé (optionnel)</Label>
              <Textarea
                id="message"
                placeholder="Ajouter un message personnel..."
                value={inviteForm.message}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, message: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleInviteContact}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un contact</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau contact à votre réseau
            </DialogDescription>
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
            className="fixed right-4 bottom-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col"
          >
            {/* Header du chat */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${chatContact.name}`}
                  />
                  <AvatarFallback>
                    {chatContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{chatContact.name}</p>
                  <p className="text-xs text-gray-500">{chatContact.company}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.sender === "me"
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{msg.message}</p>
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
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  placeholder="Tapez votre message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={sendChatMessage}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Send className="h-4 w-4" />
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Analyse Algorithmique
            </DialogTitle>
            <DialogDescription className="text-center">
              Votre swap est en cours d'analyse par notre algorithme IA
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Indicateur de progression circulaire */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysisProgress / 100)}`}
                    className="text-violet-600 transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {analysisResult ? (
                    analysisResult === "approved" ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    )
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Calculator className="h-8 w-8 text-violet-600" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Pourcentage */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(analysisProgress)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">{analysisStep}</p>
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
                          ? "text-lime-400"
                          : "text-red-400"
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
