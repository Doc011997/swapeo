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
    email: "",
    phone: "",
    company: "",
    role: "",
  });
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<Swap | null>(null);
  const [showSwapDetails, setShowSwapDetails] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatContact, setChatContact] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
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
  const [highlightedSwapId, setHighlightedSwapId] = useState<string | null>(
    null,
  );

  // États gamification
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(
    null,
  );
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("swapeo_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Générer des swaps de démonstration personnalisés
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
          counterparty: "Recherche en cours...",
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
        {
          id: "SW-003",
          type: "demande",
          amount: 8000,
          duration: 18,
          interestRate: 2.8,
          counterparty: "Green Solutions",
          status: "Terminé",
          progress: 100,
          createdAt: "2023-12-01",
          description: "Rénovation écologique locale",
          category: "Immobilier",
          purpose: "Travaux de rénovation énergétique",
          guarantees: "Hypothèque + assurance habitation",
          repaymentSchedule: "monthly",
          earlyRepayment: true,
          insurance: true,
          createdBy: `${userData.firstName} ${userData.lastName}`,
          createdByCompany: userData.company,
          createdByTrustScore: userData.trustScore,
          estimatedReturn: 336,
          totalInterest: 336,
          monthlyPayment: 463,
          nextPaymentDate: null,
          lastUpdated: "2024-01-01",
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
          description: "Intérêts SW-001 - Janvier",
          date: "2024-01-31",
          status: "completed",
        },
        {
          id: "TX-003",
          type: "withdraw",
          amount: -500,
          description: "Retrait vers compte principal",
          date: "2024-01-20",
          status: "completed",
        },
        {
          id: "TX-004",
          type: "fee",
          amount: -15,
          description: "Frais de transaction",
          date: "2024-01-20",
          status: "completed",
        },
        {
          id: "TX-005",
          type: "interest",
          amount: 87,
          description: "Intérêts SW-002 - Décembre",
          date: "2023-12-31",
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
          phone: "+33 6 98 76 54 32",
          trustScore: 89,
          totalSwaps: 5,
          averageAmount: 22000,
          lastActive: "Il y a 1 semaine",
          verified: true,
        },
        {
          id: "C-003",
          name: "Sophie Bernard",
          company: "Eco Invest",
          email: "sophie@ecoinvest.fr",
          trustScore: 92,
          totalSwaps: 12,
          averageAmount: 15000,
          lastActive: "Il y a 3 jours",
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
        {
          id: "N-003",
          type: "system",
          title: "Mise à jour de sécurité",
          description: "Nouvelle authentification à deux facteurs disponible",
          time: "Il y a 3 jours",
          read: false,
        },
        {
          id: "N-004",
          type: "message",
          title: "Message de Jean Martin",
          description: "Proposition de collaboration sur un nouveau projet",
          time: "Il y a 1 semaine",
          read: true,
        },
      ];

      setSwaps(demoSwaps);
      setTransactions(demoTransactions);
      setContacts(demoContacts);
      setNotifications(demoNotifications);

      // Initialisation gamification
      initializeGamification(userData);

      // Animation du solde
      setTimeout(() => {
        setAnimatedBalance(userData.wallet?.balance || 42847);
        setLoading(false);
      }, 1000);
    } else {
      window.location.href = "/";
    }
  }, []);

  // Fonctions de gamification
  const initializeGamification = (userData: any) => {
    // Calcul du niveau utilisateur
    const totalXP = 1250; // Basé sur l'activité
    const currentLevel = Math.floor(totalXP / 500) + 1;
    const currentXP = totalXP % 500;

    setUserLevel({
      level: currentLevel,
      title: getLevelTitle(currentLevel),
      currentXP,
      requiredXP: 500,
      totalXP,
      benefits: getLevelBenefits(currentLevel),
    });

    // Achievements débloqués
    const unlockedAchievements: Achievement[] = [
      {
        id: "first-swap",
        name: "Premier Swap",
        description: "Créez votre premier swap",
        icon: "🎯",
        category: "swap",
        rarity: "common",
        unlockedAt: "2024-01-15",
      },
      {
        id: "network-builder",
        name: "Bâtisseur de Réseau",
        description: "Ajoutez 5 contacts à votre réseau",
        icon: "🤝",
        category: "network",
        rarity: "common",
        unlockedAt: "2024-01-20",
      },
      {
        id: "first-deposit",
        name: "Premier Dépôt",
        description: "Effectuez votre premier dépôt",
        icon: "💰",
        category: "finance",
        rarity: "common",
        unlockedAt: "2024-01-10",
      },
    ];

    // Achievements en cours
    const inProgressAchievements: Achievement[] = [
      {
        id: "swap-master",
        name: "Maître des Swaps",
        description: "Complétez 10 swaps avec succès",
        icon: "🏆",
        category: "swap",
        rarity: "rare",
        progress: 3,
        maxProgress: 10,
      },
      {
        id: "big-trader",
        name: "Gros Trader",
        description: "Échangez plus de 100 000€",
        icon: "💎",
        category: "finance",
        rarity: "epic",
        progress: 45000,
        maxProgress: 100000,
      },
    ];

    setAchievements([...unlockedAchievements, ...inProgressAchievements]);

    // Quêtes quotidiennes
    setDailyQuests([
      {
        id: "daily-login",
        title: "Connexion Quotidienne",
        description: "Connectez-vous aujourd'hui",
        type: "login",
        target: 1,
        current: 1,
        reward: 50,
        xpReward: 25,
        completed: true,
        icon: "🔥",
      },
      {
        id: "check-swaps",
        title: "Vérifiez vos Swaps",
        description: "Consultez 3 swaps aujourd'hui",
        type: "swap",
        target: 3,
        current: 1,
        reward: 75,
        xpReward: 35,
        completed: false,
        icon: "👀",
      },
      {
        id: "contact-someone",
        title: "Prenez Contact",
        description: "Envoyez un message à un contact",
        type: "contact",
        target: 1,
        current: 0,
        reward: 100,
        xpReward: 50,
        completed: false,
        icon: "💬",
      },
    ]);

    setStreakDays(12);
    setTotalPoints(2840);
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return "🏆 Expert Swapeo";
    if (level >= 7) return "💎 Trader Avancé";
    if (level >= 5) return "⭐ Swapper Confirmé";
    if (level >= 3) return "🚀 Entrepreneur";
    return "🌱 Débutant";
  };

  const getLevelBenefits = (level: number) => {
    const benefits = ["Accès au chat prioritaire"];
    if (level >= 3) benefits.push("Frais réduits de 5%");
    if (level >= 5) benefits.push("Accès aux swaps premium");
    if (level >= 7) benefits.push("Conseiller personnel dédié");
    if (level >= 10) benefits.push("Accès aux événements VIP");
    return benefits;
  };

  const addXP = (amount: number, action: string) => {
    if (!userLevel) return;

    const newTotalXP = userLevel.totalXP + amount;
    const newCurrentXP = userLevel.currentXP + amount;
    const newLevel = Math.floor(newTotalXP / 500) + 1;

    if (newLevel > userLevel.level) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 4000);
    }

    setUserLevel({
      ...userLevel,
      currentXP: newCurrentXP % 500,
      totalXP: newTotalXP,
      level: newLevel,
      title: getLevelTitle(newLevel),
      benefits: getLevelBenefits(newLevel),
    });

    setMessage(`✨ +${amount} XP pour ${action} !`);
    setTimeout(() => setMessage(""), 3000);
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find((a) => a.id === achievementId);
    if (achievement && !achievement.unlockedAt) {
      const updatedAchievement = {
        ...achievement,
        unlockedAt: new Date().toISOString(),
      };
      setAchievements((prev) =>
        prev.map((a) => (a.id === achievementId ? updatedAchievement : a)),
      );
      setNewAchievement(updatedAchievement);
      setShowAchievementModal(true);
      setTimeout(() => setShowAchievementModal(false), 5000);
    }
  };

  const completeQuest = (questId: string) => {
    setDailyQuests((prev) =>
      prev.map((quest) =>
        quest.id === questId
          ? { ...quest, completed: true, current: quest.target }
          : quest,
      ),
    );

    const quest = dailyQuests.find((q) => q.id === questId);
    if (quest && !quest.completed) {
      addXP(quest.xpReward, quest.title);
      setTotalPoints((prev) => prev + quest.reward);
    }
  };

  // Fonction d'analyse algorithmique animée
  const startAlgorithmAnalysis = (swapId: string) => {
    setCreatedSwapId(swapId);
    setShowAlgorithmAnalysis(true);
    setAnalysisProgress(0);
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
      progress += Math.random() * 15 + 5; // Progression aléatoire mais cohérente

      if (progress > 100) {
        progress = 100;
        clearInterval(interval);

        // Accepter automatiquement tous les swaps
        const isApproved = true;
        setAnalysisResult(isApproved ? "approved" : "rejected");

        setTimeout(() => {
          setShowAlgorithmAnalysis(false);
          setAnalysisProgress(0);
          setAnalysisStep("");

          if (isApproved) {
            setMessage(
              `🎉 Swap ${swapId} approuvé ! Il est maintenant visible dans le marketplace.`,
            );
          } else {
            setMessage(
              `❌ Swap ${swapId} rejeté par l'algorithme. Vérifiez vos critères.`,
            );
          }

          setTimeout(() => setMessage(""), 5000);
        }, 2000);

        return;
      }

      setAnalysisProgress(progress);

      // Changer d'étape toutes les quelques itérations
      if (progress > (currentStep + 1) * 20 && currentStep < steps.length - 1) {
        currentStep++;
      }

      setAnalysisStep(steps[currentStep]);
    }, 200); // Mise à jour toutes les 200ms
  };

  const handleCreateSwap = () => {
    // Validation des champs requis
    const requiredFields = [
      "type",
      "amount",
      "duration",
      "description",
      "category",
      "purpose",
      "guarantees",
    ];

    const missingFields = requiredFields.filter(
      (field) => !newSwapForm[field as keyof typeof newSwapForm],
    );

    if (missingFields.length > 0) {
      setMessage("❌ Veuillez remplir tous les champs requis");

      // Highlight des champs manquants avec effet visuel
      missingFields.forEach((field) => {
        const element = document.getElementById(field);
        if (element) {
          element.style.border = "2px solid red";
          setTimeout(() => {
            element.style.border = "";
          }, 3000);
        }
      });

      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Cr��er le nouveau swap
    const newSwap: Swap = {
      id: `SW-${Date.now().toString().slice(-3)}`,
      type: newSwapForm.type as "demande" | "offre",
      amount: parseInt(newSwapForm.amount),
      duration: parseInt(newSwapForm.duration),
      interestRate: parseFloat(newSwapForm.interestRate) || 3.5,
      counterparty: "Recherche en cours...",
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

    // Ajouter au début de la liste locale du dashboard
    setSwaps([newSwap, ...swaps]);

    // Ajouter le swap au marketplace global pour que tous les utilisateurs le voient
    try {
      SwapService.addSwapToMarketplace({
        type: newSwap.type,
        amount: newSwap.amount,
        duration: newSwap.duration,
        interestRate: newSwap.interestRate,
        counterparty:
          newSwap.createdByCompany || newSwap.createdBy || "Entreprise",
        status: "new", // Statut marketplace différent du dashboard
        progress: 0,
        description: newSwap.description,
        category: newSwap.category,
        riskLevel: newSwap.amount > 30000 ? "medium" : "low",
        verified: true,
        purpose: newSwap.purpose,
        guarantees: newSwap.guarantees,
        repaymentSchedule: newSwap.repaymentSchedule,
        earlyRepayment: newSwap.earlyRepayment,
        insurance: newSwap.insurance,
        createdBy: newSwap.createdBy,
        createdByCompany: newSwap.createdByCompany,
        createdByTrustScore: newSwap.createdByTrustScore,
        estimatedReturn: newSwap.estimatedReturn,
        totalInterest: newSwap.totalInterest,
        monthlyPayment: newSwap.monthlyPayment,
        nextPaymentDate: newSwap.nextPaymentDate,
        createdById: user.id, // ID de l'utilisateur créateur
      });

      console.log("✅ Swap ajouté au marketplace global");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout au marketplace:", error);
    }

    // Fermer le modal et réinitialiser le formulaire
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

    // Message de confirmation avec détails
    setMessage(`✅ Swap créé avec succès ! ID: ${newSwap.id}`);

    // Démarrer l'analyse algorithmique après un court délai
    setTimeout(() => {
      startAlgorithmAnalysis(newSwap.id);
    }, 1500);

    // Highlight du nouveau swap et redirection vers l'onglet Swaps
    setHighlightedSwapId(newSwap.id);
    setActiveSection("swaps");

    // Gamification
    addXP(100, "création de swap");
    completeQuest("check-swaps");

    // Vérifier achievements
    const userSwaps = swaps.filter((s) =>
      s.createdBy?.includes(user.firstName),
    );
    if (userSwaps.length === 0) {
      unlockAchievement("first-swap");
    }

    // Supprimer le highlight après 8 secondes
    setTimeout(() => {
      setHighlightedSwapId(null);
      setMessage("");
    }, 8000);
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

    // Ajouter à l'historique des transactions
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

    // Ajouter à l'historique des transactions
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
      { name: "Émilie Rousseau", company: "Digital Agency", trustScore: 88 },
      { name: "Lucas Petit", company: "Eco Solutions", trustScore: 90 },
    ];

    const randomContact =
      fictiveContacts[Math.floor(Math.random() * fictiveContacts.length)];

    const newContact: Contact = {
      id: `C-${Date.now()}`,
      name: randomContact.name,
      company: randomContact.company,
      trustScore: randomContact.trustScore,
      totalSwaps: Math.floor(Math.random() * 15) + 1,
      averageAmount: Math.floor(Math.random() * 30000) + 5000,
      lastActive: "Nouveau contact",
      verified: Math.random() > 0.3,
    };

    setContacts([newContact, ...contacts]);
    setMessage(`✅ Contact ${randomContact.name} ajouté avec succès !`);
    setTimeout(() => setMessage(""), 3000);
  };

  const generateInvoicePDF = (transaction: Transaction) => {
    setGeneratingPDF(true);

    setTimeout(() => {
      const doc = new jsPDF();
      doc.text("Facture Swapeo", 20, 20);
      doc.text(`Transaction: ${transaction.id}`, 20, 40);
      doc.text(`Montant: ${transaction.amount}€`, 20, 60);
      doc.text(`Date: ${transaction.date}`, 20, 80);
      doc.text(`Description: ${transaction.description}`, 20, 100);
      doc.save(`facture-${transaction.id}.pdf`);

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

  const handleAddContact = () => {
    if (
      !contactForm.firstName ||
      !contactForm.lastName ||
      !contactForm.email ||
      !contactForm.company
    ) {
      setMessage("❌ Veuillez remplir les champs requis");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Vérifier si le contact existe déjà
    const existingContact = contacts.find((c) => c.email === contactForm.email);
    if (existingContact) {
      setMessage("❌ Ce contact existe déjà dans votre réseau");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const newContact: Contact = {
      id: `C-${Date.now()}`,
      name: `${contactForm.firstName} ${contactForm.lastName}`,
      company: contactForm.company,
      email: contactForm.email,
      phone: contactForm.phone || undefined,
      trustScore: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
      totalSwaps: 0,
      averageAmount: 0,
      lastActive: "Nouveau",
      verified: false,
    };

    setContacts([newContact, ...contacts]);
    setShowAddContactDialog(false);
    setContactForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      role: "",
    });

    setMessage(
      `✅ Contact ${newContact.name} ajouté avec succès à votre réseau !`,
    );

    // Gamification
    addXP(50, "ajout de contact");
    if (contacts.length >= 4) {
      unlockAchievement("network-builder");
    }

    setTimeout(() => setMessage(""), 4000);
  };

  const openChatWithContact = (contact: Contact, context?: string) => {
    setChatContact(contact);
    setShowChat(true);

    // Messages demo basés sur le contexte
    if (context === "swap") {
      setChatMessages([
        {
          id: 1,
          sender: "system",
          message: `Conversation initiée concernant votre swap`,
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: 2,
          sender: contact.name,
          message: `Bonjour ! J'ai vu votre proposition de swap, pouvons-nous en discuter ?`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } else {
      setChatMessages([
        {
          id: 1,
          sender: "system",
          message: `Conversation avec ${contact.name}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: 2,
          sender: contact.name,
          message: `Bonjour ! Comment allez-vous ?`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
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
        sender: chatContact.name,
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
              {/* Widget Level Mobile */}
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full px-3 py-1 border border-purple-200">
                <div className="text-xs font-bold text-purple-600">
                  {userLevel?.title}
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${userLevel ? (userLevel.currentXP / userLevel.requiredXP) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs font-bold text-blue-600">
                  Lv.{userLevel?.level}
                </div>
              </div>

              {/* Version Mobile Compacte */}
              <div className="sm:hidden flex items-center space-x-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full px-2 py-1">
                <span className="text-xs font-bold text-purple-600">
                  Lv.{userLevel?.level}
                </span>
                <div className="w-8 bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full"
                    style={{
                      width: `${userLevel ? (userLevel.currentXP / userLevel.requiredXP) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

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
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  notification.type === "swap"
                                    ? "bg-blue-100 text-blue-600"
                                    : notification.type === "payment"
                                      ? "bg-green-100 text-green-600"
                                      : notification.type === "message"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-orange-100 text-orange-600"
                                }`}
                              >
                                {notification.type === "swap" && (
                                  <Handshake className="h-4 w-4" />
                                )}
                                {notification.type === "payment" && (
                                  <Euro className="h-4 w-4" />
                                )}
                                {notification.type === "message" && (
                                  <MessageCircle className="h-4 w-4" />
                                )}
                                {notification.type === "system" && (
                                  <Settings className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {notification.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => setShowNotifications(false)}
                        >
                          Fermer
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-3">
                <Avatar className="w-7 h-7 sm:w-10 sm:h-10">
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-xs sm:text-base">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
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
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
              <span className="sm:hidden text-xs">Accueil</span>
            </TabsTrigger>
            <TabsTrigger
              value="swaps"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Handshake className="h-4 w-4" />
              <span className="hidden sm:inline">Mes Swaps</span>
              <span className="sm:hidden text-xs">Swaps</span>
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Portefeuille</span>
              <span className="sm:hidden text-xs">Wallet</span>
            </TabsTrigger>
            <TabsTrigger
              value="network"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Réseau</span>
              <span className="sm:hidden text-xs">Réseau</span>
            </TabsTrigger>
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

            {/* Section Gamification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progression et Niveau */}
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-purple-600" />
                    Votre Progression
                  </h3>
                  <Badge className="bg-purple-100 text-purple-700 font-bold">
                    {userLevel?.title}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Niveau {userLevel?.level}
                      </span>
                      <span className="text-sm text-purple-600 font-bold">
                        {userLevel?.currentXP}/{userLevel?.requiredXP} XP
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${userLevel ? (userLevel.currentXP / userLevel.requiredXP) * 100 : 0}%`,
                        }}
                      ></motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="text-lg font-bold text-orange-600">
                        {totalPoints}
                      </div>
                      <div className="text-xs text-gray-600">Points Total</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">
                        {streakDays}
                      </div>
                      <div className="text-xs text-gray-600">
                        Jours d'affilée
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quêtes Quotidiennes */}
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Quêtes Quotidiennes
                </h3>

                <div className="space-y-3">
                  {dailyQuests.map((quest) => (
                    <div key={quest.id} className="bg-white/70 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{quest.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {quest.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {quest.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {quest.completed ? (
                            <Badge className="bg-green-100 text-green-700">
                              ✓ Terminé
                            </Badge>
                          ) : (
                            <div className="text-xs text-gray-500">
                              {quest.current}/{quest.target}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${(quest.current / quest.target) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Achievements récents */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Achievements Récents
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAchievementModal(true)}
                  className="text-xs"
                >
                  Voir tout
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {achievements
                  .filter((a) => a.unlockedAt)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white/70 rounded-lg p-3 text-center"
                    >
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <h4 className="font-medium text-sm text-gray-900">
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {achievement.description}
                      </p>
                      <Badge
                        className={`mt-2 text-xs ${
                          achievement.rarity === "legendary"
                            ? "bg-purple-100 text-purple-700"
                            : achievement.rarity === "epic"
                              ? "bg-blue-100 text-blue-700"
                              : achievement.rarity === "rare"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Actions rapides */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Actions Rapides
              </h3>
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
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
                  Mes Swaps Récents
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection("swaps")}
                >
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
                          {formatCurrency(swap.amount)} • {swap.duration} mois •{" "}
                          {swap.createdBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
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
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  Mes Swaps
                </h2>
                <p className="text-gray-600 text-xs sm:text-base">
                  Gérez vos swaps financiers
                </p>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <Button
                  onClick={() => setShowCreateSwap(true)}
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-sm px-3 sm:px-4"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    Créer un nouveau swap
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="text-sm px-2 sm:px-4"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Actualiser</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4 overflow-hidden">
              {swaps.map((swap) => (
                <Card
                  key={swap.id}
                  className={`p-3 sm:p-6 hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    highlightedSwapId === swap.id
                      ? "ring-2 ring-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  {highlightedSwapId === swap.id && (
                    <div className="mb-4 p-2 bg-green-100 border border-green-300 rounded-lg text-center">
                      <span className="text-green-700 font-semibold text-sm">
                        ✨ Nouveau swap créé ✨
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 min-w-0">
                    <div className="flex items-start space-x-2 sm:space-x-4 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          swap.type === "demande"
                            ? "bg-orange-100"
                            : "bg-green-100"
                        }`}
                      >
                        {swap.type === "demande" ? (
                          <ArrowDownRight className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex flex-col space-y-1 sm:space-y-2 mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate flex-1 min-w-0">
                              {swap.description}
                            </h3>
                            <Badge
                              className={`flex-shrink-0 ${
                                swap.type === "demande"
                                  ? "bg-orange-100 text-orange-700 text-xs"
                                  : "bg-green-100 text-green-700 text-xs"
                              }`}
                            >
                              {swap.type === "demande" ? "Demande" : "Offre"}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                            <div className="truncate">
                              <span className="font-medium">Montant:</span>{" "}
                              <span className="text-green-600 font-semibold">
                                {formatCurrency(swap.amount)}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Taux:</span>{" "}
                              {swap.interestRate}%
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(swap.createdAt)}
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1 flex-shrink-0">
                              Vous
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 flex-shrink-0 w-auto">
                      <Badge
                        className={`text-xs flex items-center ${
                          swap.status === "Actif"
                            ? "bg-green-100 text-green-700"
                            : swap.status === "En recherche"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {getStatusIcon(swap.status)}
                        <span className="ml-1 hidden sm:inline">
                          {swap.status}
                        </span>
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSwap(swap);
                            setShowSwapDetails(true);
                          }}
                          className="text-xs px-2 h-7"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            const contact = contacts.find(
                              (c) => c.company === swap.counterparty,
                            );
                            if (contact) {
                              openChatWithContact(contact, "swap");
                            } else {
                              setMessage(
                                "Aucun contact trouvé pour ce partenaire",
                              );
                              setTimeout(() => setMessage(""), 3000);
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 h-7"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {swap.status === "Actif" && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1">
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
                    onClick={() => handleWalletDeposit(500)}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Ajouter des fonds</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-pink-500/20 hover:bg-pink-500/30 text-white border-pink-300/40 text-xs sm:text-sm px-2 sm:px-4"
                    onClick={() => handleWalletWithdraw(100)}
                  >
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Retirer</span>
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
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Exporter</span>
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
                      <div className="flex items-center space-x-2">
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
                        {transaction.status === "completed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 sm:w-auto sm:px-2 text-xs p-0 sm:p-1"
                            onClick={() => generateInvoicePDF(transaction)}
                            disabled={generatingPDF}
                          >
                            <Download className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">PDF</span>
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
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Mon Réseau
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Vos partenaires de confiance
                </p>
              </div>
              <div className="flex space-x-2 sm:space-x-3">
                <Button
                  onClick={() => setShowAddContactDialog(true)}
                  className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-sm px-2 sm:px-4"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Ajouter un contact</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={addFictiveContact}
                  className="text-sm px-2 sm:px-4"
                >
                  <Users className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Contact aléatoire</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(true)}
                  className="text-sm px-2 sm:px-4"
                >
                  <Mail className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Inviter par email</span>
                </Button>
              </div>
            </div>

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

            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mes contacts
              </h3>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                          <p className="font-medium text-gray-900 truncate">
                            {contact.name}
                          </p>
                          <div className="flex items-center space-x-1">
                            {contact.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                            {!contact.verified && (
                              <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {contact.company}
                        </p>
                        {contact.email && (
                          <p className="text-xs text-gray-500 truncate">
                            {contact.email}
                          </p>
                        )}
                        {contact.phone && (
                          <p className="text-xs text-gray-500">
                            {contact.phone}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">
                            {contact.trustScore}% • {contact.totalSwaps} swaps
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openChatWithContact(contact)}
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <MessageCircle className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Contacter</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Tous les modals et dialogues restent identiques... */}
      {/* Modal Création de Swap */}
      <Dialog open={showCreateSwap} onOpenChange={setShowCreateSwap}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau swap</DialogTitle>
            <DialogDescription>
              Définissez les paramètres de votre swap financier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de swap *</Label>
                <Select
                  value={newSwapForm.type}
                  onValueChange={(value) =>
                    setNewSwapForm({ ...newSwapForm, type: value })
                  }
                >
                  <SelectTrigger id="type">
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
                <Label htmlFor="amount">Montant (€) *</Label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (mois) *</Label>
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
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={newSwapForm.category}
                onValueChange={(value) =>
                  setNewSwapForm({ ...newSwapForm, category: value })
                }
              >
                <SelectTrigger id="category">
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
              <Label htmlFor="description">Description *</Label>
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
              <Label htmlFor="purpose">Objectif détaillé *</Label>
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
              <Label htmlFor="guarantees">Garanties proposées *</Label>
              <Textarea
                id="guarantees"
                placeholder="Décrivez les garanties que vous proposez..."
                value={newSwapForm.guarantees}
                onChange={(e) =>
                  setNewSwapForm({ ...newSwapForm, guarantees: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repaymentSchedule">
                Calendrier de remboursement
              </Label>
              <Select
                value={newSwapForm.repaymentSchedule}
                onValueChange={(value) =>
                  setNewSwapForm({ ...newSwapForm, repaymentSchedule: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                  <SelectItem value="end">En fin de période</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="earlyRepayment"
                  checked={newSwapForm.earlyRepayment}
                  onChange={(e) =>
                    setNewSwapForm({
                      ...newSwapForm,
                      earlyRepayment: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <Label htmlFor="earlyRepayment">
                  Autoriser le remboursement anticipé
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="insurance"
                  checked={newSwapForm.insurance}
                  onChange={(e) =>
                    setNewSwapForm({
                      ...newSwapForm,
                      insurance: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <Label htmlFor="insurance">Assurance incluse</Label>
              </div>
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
                <Calculator className="h-4 w-4 mr-2" />
                Créer le swap
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Détails du Swap */}
      <Dialog open={showSwapDetails} onOpenChange={setShowSwapDetails}>
        <DialogContent className="max-w-[98vw] sm:max-w-2xl lg:max-w-4xl max-h-[98vh] overflow-y-auto p-3 sm:p-6 m-2 sm:m-6">
          <DialogHeader className="pb-2 sm:pb-4 border-b border-gray-100">
            <div className="flex flex-col space-y-1 sm:space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <DialogTitle className="text-sm sm:text-base md:text-xl font-bold text-gray-900 flex items-center truncate pr-2">
                <span className="truncate">
                  Swap #{selectedSwap?.id?.slice(-6)}
                </span>
                <span className="hidden sm:inline ml-1">- Détails</span>
              </DialogTitle>
              <Badge
                className={`${
                  selectedSwap?.type === "demande"
                    ? "bg-orange-100 text-orange-700 border-orange-200"
                    : "bg-lime-100 text-lime-700 border-lime-200"
                } text-xs font-medium flex-shrink-0 self-start md:self-center`}
              >
                <span className="md:hidden">
                  {selectedSwap?.type === "demande" ? "💰" : "🏦"}
                </span>
                <span className="hidden md:inline">
                  {selectedSwap?.type === "demande" ? "💰 Demande" : "🏦 Offre"}
                </span>
              </Badge>
            </div>
          </DialogHeader>

          {selectedSwap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Informations principales */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-2 sm:p-4 rounded-lg sm:rounded-xl border border-violet-200">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-violet-700 mb-0.5 sm:mb-1 leading-tight">
                      {selectedSwap.amount > 999999
                        ? `${(selectedSwap.amount / 1000000).toFixed(1)}M€`
                        : selectedSwap.amount > 999
                          ? `${(selectedSwap.amount / 1000).toFixed(0)}k€`
                          : `${selectedSwap.amount.toLocaleString()}€`}
                    </div>
                    <p className="text-xs sm:text-sm text-violet-600">
                      Montant
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-2 sm:p-4 rounded-lg sm:rounded-xl border border-cyan-200">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-cyan-700 mb-0.5 sm:mb-1 leading-tight">
                      {selectedSwap.interestRate}%
                    </div>
                    <p className="text-xs sm:text-sm text-cyan-600">
                      <span className="hidden sm:inline">Taux d'intérêt</span>
                      <span className="sm:hidden">Taux</span>
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-lime-50 to-green-50 p-2 sm:p-4 rounded-lg sm:rounded-xl border border-lime-200">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-lime-700 mb-0.5 sm:mb-1 leading-tight">
                      {selectedSwap.duration}
                    </div>
                    <p className="text-xs sm:text-sm text-lime-600">Mois</p>
                  </div>
                </div>
              </div>

              {/* Description et détails */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center">
                    <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-violet-600 flex-shrink-0" />
                    <span className="truncate">Partenaire</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg break-words">
                    {selectedSwap.counterparty}
                  </p>
                </div>

                {selectedSwap.description && (
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center">
                      <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-cyan-600 flex-shrink-0" />
                      Description
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg leading-relaxed">
                      {selectedSwap.description}
                    </p>
                  </div>
                )}

                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-pink-600 flex-shrink-0" />
                      <span className="hidden sm:inline">
                        Informations temporelles
                      </span>
                      <span className="sm:hidden">Temporel</span>
                    </h3>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Créé le :</span>
                        <span className="text-gray-900 text-right">
                          {selectedSwap.createdAt}
                        </span>
                      </div>
                      {selectedSwap.daysRemaining && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            <span className="hidden sm:inline">
                              Jours restants :
                            </span>
                            <span className="sm:hidden">Restant :</span>
                          </span>
                          <span className="text-gray-900">
                            {selectedSwap.daysRemaining}j
                          </span>
                        </div>
                      )}
                      {selectedSwap.nextPaymentDate && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            <span className="hidden sm:inline">
                              Prochain paiement :
                            </span>
                            <span className="sm:hidden">Prochain :</span>
                          </span>
                          <span className="text-gray-900 text-right">
                            {selectedSwap.nextPaymentDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-lime-600 flex-shrink-0" />
                      Performance
                    </h3>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg space-y-1 sm:space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">Statut :</span>
                        <Badge
                          className={`text-xs ${
                            selectedSwap.status === "Actif"
                              ? "bg-lime-100 text-lime-700"
                              : selectedSwap.status === "En attente"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {selectedSwap.status}
                        </Badge>
                      </div>
                      {selectedSwap.progress !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span className="text-gray-600">Progression :</span>
                            <span className="text-gray-900">
                              {selectedSwap.progress}%
                            </span>
                          </div>
                          <Progress
                            value={selectedSwap.progress}
                            className="h-1.5 sm:h-2"
                          />
                        </div>
                      )}
                      {selectedSwap.matchingScore && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            <span className="hidden sm:inline">
                              Score de matching :
                            </span>
                            <span className="sm:hidden">Matching :</span>
                          </span>
                          <span className="text-cyan-600 font-semibold">
                            {selectedSwap.matchingScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations financières détaillées */}
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center">
                    <Euro className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600 flex-shrink-0" />
                    <span className="hidden sm:inline">Détails financiers</span>
                    <span className="sm:hidden">Financier</span>
                  </h3>
                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                    <div className="space-y-2 sm:space-y-3">
                      {selectedSwap.estimatedReturn && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            <span className="hidden sm:inline">
                              Rendement estimé :
                            </span>
                            <span className="sm:hidden">Rendement :</span>
                          </span>
                          <span className="text-green-600 font-semibold">
                            {selectedSwap.estimatedReturn > 999999
                              ? `${(selectedSwap.estimatedReturn / 1000000).toFixed(1)}M€`
                              : selectedSwap.estimatedReturn > 999
                                ? `${(selectedSwap.estimatedReturn / 1000).toFixed(0)}k€`
                                : `${selectedSwap.estimatedReturn.toLocaleString()}€`}
                          </span>
                        </div>
                      )}
                      {selectedSwap.totalInterest && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            <span className="hidden sm:inline">
                              Intérêts totaux :
                            </span>
                            <span className="sm:hidden">Intérêts :</span>
                          </span>
                          <span className="text-gray-900">
                            {selectedSwap.totalInterest > 999999
                              ? `${(selectedSwap.totalInterest / 1000000).toFixed(1)}M€`
                              : selectedSwap.totalInterest > 999
                                ? `${(selectedSwap.totalInterest / 1000).toFixed(0)}k€`
                                : `${selectedSwap.totalInterest.toLocaleString()}€`}
                          </span>
                        </div>
                      )}
                      {selectedSwap.monthlyPayment && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            <span className="hidden sm:inline">
                              Paiement mensuel :
                            </span>
                            <span className="sm:hidden">Mensuel :</span>
                          </span>
                          <span className="text-gray-900">
                            {selectedSwap.monthlyPayment > 999999
                              ? `${(selectedSwap.monthlyPayment / 1000000).toFixed(1)}M€`
                              : selectedSwap.monthlyPayment > 999
                                ? `${(selectedSwap.monthlyPayment / 1000).toFixed(0)}k€`
                                : `${selectedSwap.monthlyPayment.toLocaleString()}€`}
                          </span>
                        </div>
                      )}
                      {selectedSwap.riskLevel && (
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-gray-600">
                            <span className="hidden sm:inline">
                              Niveau de risque :
                            </span>
                            <span className="sm:hidden">Risque :</span>
                          </span>
                          <Badge
                            className={`text-xs ${
                              selectedSwap.riskLevel === "low"
                                ? "bg-green-100 text-green-700"
                                : selectedSwap.riskLevel === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {selectedSwap.riskLevel === "low"
                              ? "Faible"
                              : selectedSwap.riskLevel === "medium"
                                ? "Moyen"
                                : "Élevé"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Garanties et conditions */}
                {(selectedSwap.guarantees ||
                  selectedSwap.purpose ||
                  selectedSwap.repaymentSchedule) && (
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-600 flex-shrink-0" />
                      <span className="hidden sm:inline">
                        Conditions et garanties
                      </span>
                      <span className="sm:hidden">Garanties</span>
                    </h3>
                    <div className="bg-gray-50 p-2 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
                      {selectedSwap.purpose && (
                        <div>
                          <span className="text-gray-600 text-xs sm:text-sm font-medium">
                            Objectif :
                          </span>
                          <p className="text-gray-900 text-xs sm:text-sm mt-0.5 sm:mt-1 leading-relaxed">
                            {selectedSwap.purpose}
                          </p>
                        </div>
                      )}
                      {selectedSwap.guarantees && (
                        <div>
                          <span className="text-gray-600 text-xs sm:text-sm font-medium">
                            Garanties :
                          </span>
                          <p className="text-gray-900 text-xs sm:text-sm mt-0.5 sm:mt-1 leading-relaxed">
                            {selectedSwap.guarantees}
                          </p>
                        </div>
                      )}
                      {selectedSwap.repaymentSchedule && (
                        <div>
                          <span className="text-gray-600 text-xs sm:text-sm font-medium">
                            <span className="hidden sm:inline">
                              Calendrier de remboursement :
                            </span>
                            <span className="sm:hidden">Calendrier :</span>
                          </span>
                          <p className="text-gray-900 text-xs sm:text-sm mt-0.5 sm:mt-1">
                            {selectedSwap.repaymentSchedule}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                        {selectedSwap.earlyRepayment && (
                          <Badge
                            variant="outline"
                            className="text-xs border-green-300 text-green-700 px-1.5 py-0.5"
                          >
                            <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                            <span className="hidden sm:inline">
                              Remboursement anticipé autorisé
                            </span>
                            <span className="sm:hidden">Anticipé OK</span>
                          </Badge>
                        )}
                        {selectedSwap.insurance && (
                          <Badge
                            variant="outline"
                            className="text-xs border-blue-300 text-blue-700 px-1.5 py-0.5"
                          >
                            <Shield className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                            <span className="hidden sm:inline">
                              Assurance incluse
                            </span>
                            <span className="sm:hidden">Assuré</span>
                          </Badge>
                        )}
                        {selectedSwap.verified && (
                          <Badge
                            variant="outline"
                            className="text-xs border-violet-300 text-violet-700 px-1.5 py-0.5"
                          >
                            <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                            Vérifié
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col space-y-2 sm:space-y-3 md:flex-row md:justify-end md:space-y-0 md:space-x-3 pt-3 sm:pt-4 border-t border-gray-200"
              >
                <Button
                  variant="outline"
                  onClick={() => setShowSwapDetails(false)}
                  className="w-full md:w-auto h-10 sm:h-auto text-sm"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Fermer
                </Button>
                <Button
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 w-full md:w-auto h-10 sm:h-auto text-sm"
                  onClick={() => {
                    const contact = contacts.find(
                      (c) => c.company === selectedSwap.counterparty,
                    );
                    if (contact) {
                      openChatWithContact(contact, "swap");
                      setShowSwapDetails(false);
                    } else {
                      setMessage("Aucun contact trouvé pour ce partenaire");
                      setTimeout(() => setMessage(""), 3000);
                    }
                  }}
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    Contacter le partenaire
                  </span>
                  <span className="sm:hidden">Contacter</span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout de contact */}
      <Dialog
        open={showAddContactDialog}
        onOpenChange={setShowAddContactDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau contact</DialogTitle>
            <DialogDescription>
              Ajoutez un contact à votre réseau professionnel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={contactForm.firstName}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={contactForm.lastName}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                placeholder="+33 6 12 34 56 78"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Entreprise *</Label>
              <Input
                id="company"
                placeholder="Nom de l'entreprise"
                value={contactForm.company}
                onChange={(e) =>
                  setContactForm({ ...contactForm, company: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Poste</Label>
              <Input
                id="role"
                placeholder="Directeur, CEO, etc."
                value={contactForm.role}
                onChange={(e) =>
                  setContactForm({ ...contactForm, role: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAddContactDialog(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddContact}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'invitation par email */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un nouveau membre</DialogTitle>
            <DialogDescription>
              Invitez quelqu'un à rejoindre votre réseau Swapeo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inviteFirstName">Prénom</Label>
                <Input
                  id="inviteFirstName"
                  placeholder="Prénom"
                  value={inviteForm.firstName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteLastName">Nom</Label>
                <Input
                  id="inviteLastName"
                  placeholder="Nom"
                  value={inviteForm.lastName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email *</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="email@example.com"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteMessage">Message personnalisé</Label>
              <Textarea
                id="inviteMessage"
                placeholder="Ajoutez un message personnel..."
                value={inviteForm.message}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, message: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleInviteUser}>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer l'invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat flottant */}
      <AnimatePresence>
        {showChat && chatContact && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
          >
            {/* Header du chat */}
            <div className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-white text-violet-600 text-sm">
                      {chatContact.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{chatContact.name}</p>
                    <p className="text-xs text-cyan-200">
                      {chatContact.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-6 w-6"
                    onClick={() => setShowChat(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                <span>
                  Conversation sécurisée • Trust Score: {chatContact.trustScore}
                  %
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg text-sm ${
                      msg.sender === "me"
                        ? "bg-violet-600 text-white"
                        : msg.sender === "system"
                          ? "bg-gray-100 text-gray-600 text-center w-full"
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
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={sendChatMessage}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Level Up */}
      <AnimatePresence>
        {showLevelUp && userLevel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ y: -100, rotate: -10 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-center text-white shadow-2xl max-w-md mx-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl mb-6"
              >
                🏆
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-4"
              >
                LEVEL UP !
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2 mb-6"
              >
                <p className="text-xl">Niveau {userLevel.level}</p>
                <p className="text-lg font-semibold">{userLevel.title}</p>
                <p className="text-sm opacity-90">
                  Nouveaux avantages débloqués !
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                {userLevel.benefits.slice(-1).map((benefit, index) => (
                  <Badge
                    key={index}
                    className="bg-white/20 text-white border-white/30 mr-2"
                  >
                    ✨ {benefit}
                  </Badge>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'analyse algorithmique */}
      <Dialog open={showAlgorithmAnalysis} onOpenChange={() => {}}>
        <DialogContent className="max-w-md bg-black/90 backdrop-blur-xl border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center">
              <Zap className="h-6 w-6 mr-3 text-violet-400 animate-pulse" />
              Analyse Algorithmique
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Animation centrale */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                {/* Cercle de progression externe */}
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    className="text-gray-600"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - analysisProgress / 100)}`}
                    className="text-violet-500 transition-all duration-300 ease-out"
                  />
                </svg>

                {/* Cercle central avec icône/résultat */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {analysisResult === null ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center"
                    >
                      <Calculator className="h-6 w-6 text-white" />
                    </motion.div>
                  ) : analysisResult === "approved" ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.8 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-lime-500 to-green-500 flex items-center justify-center"
                    >
                      <CheckCircle className="h-6 w-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.8 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center"
                    >
                      <X className="h-6 w-6 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* Pourcentage */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="text-2xl font-bold text-white">
                    {Math.round(analysisProgress)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Étape actuelle */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                {analysisResult === null
                  ? "Analyse en cours..."
                  : analysisResult === "approved"
                    ? "🎉 Swap Approuvé !"
                    : "❌ Swap Rejeté"}
              </h3>
              <p className="text-gray-400">
                {analysisResult === null
                  ? analysisStep || "Préparation de l'analyse..."
                  : analysisResult === "approved"
                    ? "Votre swap est maintenant visible dans le marketplace"
                    : "Votre swap ne respecte pas nos critères de qualité"}
              </p>
            </div>

            {/* ID du swap */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Swap ID</p>
              <p className="text-violet-400 font-mono font-semibold">
                {createdSwapId}
              </p>
            </div>

            {/* Résultat détaillé */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  analysisResult === "approved"
                    ? "bg-lime-500/10 border border-lime-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {analysisResult === "approved" ? (
                    <CheckCircle className="h-5 w-5 text-lime-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <div>
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
                    <p className="text-xs text-gray-400">
                      {analysisResult === "approved"
                        ? "Score algorithmique: 87/100"
                        : "Score algorithmique: 42/100"}
                    </p>
                  </div>
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
