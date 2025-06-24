import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Loader2,
  User,
  Mail,
  Lock,
  Building,
  ArrowUpDown,
  Shield,
  TrendingUp,
  Users,
  Handshake,
  Star,
  CheckCircle,
  Zap,
  Globe,
  Crown,
  Gift,
  Target,
  Heart,
  X,
  Info,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "emprunteur" | "financeur" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    siret: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptMarketing: false,
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: "Profil", description: "Votre rôle sur Swapeo" },
    {
      number: 2,
      title: "Informations",
      description: "Vos données personnelles",
    },
    { number: 3, title: "Sécurité", description: "Mot de passe et validation" },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedRole !== null;
      case 2:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.company &&
          formData.siret
        );
      case 3:
        return (
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.acceptTerms
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 3 && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simulation de l'inscription en mode DEMO
      setTimeout(() => {
        const demoUser = {
          id: "demo-" + Date.now(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: selectedRole,
          company: formData.company,
          siret: formData.siret,
          kycStatus: "pending",
          balance: 0,
          totalInvested: 0,
          totalEarned: 0,
          trustScore: 85,
          joinedAt: new Date().toISOString(),
          level: 1,
          xp: 100,
        };

        const demoToken = "demo_token_" + Date.now();

        // Sauvegarder en localStorage (mode DEMO)
        localStorage.setItem("swapeo_token", demoToken);
        localStorage.setItem("swapeo_user", JSON.stringify(demoUser));

        setLoading(false);

        toast({
          title: "🎉 Inscription réussie !",
          description: `Bienvenue ${demoUser.firstName} ! Votre compte a été créé.`,
        });

        // Redirection après un délai pour montrer le toast
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-violet-900 to-purple-900 relative overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-lime-500/10 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-4xl">
          {/* Header avec logo et progression */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            {/* Logo */}
            <Link to="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <ArrowUpDown className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  SWAPEO
                </h1>
                <p className="text-xs text-gray-400">Fintech Platform</p>
              </div>
            </Link>

            {/* Étapes de progression */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        currentStep >= step.number
                          ? "bg-gradient-to-r from-violet-500 to-cyan-500 border-violet-500 text-white"
                          : "border-gray-500 text-gray-400"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="font-semibold">{step.number}</span>
                      )}
                    </motion.div>
                    <div className="hidden sm:block ml-3">
                      <p
                        className={`text-sm font-medium ${currentStep >= step.number ? "text-white" : "text-gray-400"}`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? "bg-gradient-to-r from-violet-500 to-cyan-500" : "bg-gray-600"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              className="h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500 rounded-full mx-auto max-w-md"
            />
          </motion.div>

          {/* Formulaire principal */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Étape 1: Sélection du rôle */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          Quel est votre objectif sur Swapeo ?
                        </h2>
                        <p className="text-gray-400">
                          Choisissez votre profil pour personnaliser votre
                          expérience
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option Emprunteur */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRole("emprunteur")}
                          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedRole === "emprunteur"
                              ? "border-violet-500 bg-violet-500/10"
                              : "border-white/10 bg-black/10 hover:border-violet-500/50"
                          }`}
                        >
                          {selectedRole === "emprunteur" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}

                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <TrendingUp className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              Emprunteur
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                              Je cherche du financement pour développer mon
                              entreprise
                            </p>

                            <div className="space-y-2 text-xs text-gray-300">
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-lime-400 mr-2" />
                                Financement rapide
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-lime-400 mr-2" />
                                Taux négociables
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-lime-400 mr-2" />
                                Processus simplifié
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Option Financeur */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRole("financeur")}
                          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedRole === "financeur"
                              ? "border-cyan-500 bg-cyan-500/10"
                              : "border-white/10 bg-black/10 hover:border-cyan-500/50"
                          }`}
                        >
                          {selectedRole === "financeur" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}

                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Target className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              Financeur
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                              Je souhaite investir et générer des revenus
                            </p>

                            <div className="space-y-2 text-xs text-gray-300">
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-lime-400 mr-2" />
                                Rendements attractifs
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-lime-400 mr-2" />
                                Diversification
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-lime-400 mr-2" />
                                Projets vérifiés
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {selectedRole && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-violet-600/10 via-cyan-600/10 to-pink-600/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-green-500 rounded-full flex items-center justify-center">
                              <Gift className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                🎉 Bonus de bienvenue de 100 XP !
                              </p>
                              <p className="text-xs text-gray-400">
                                Commencez votre aventure Swapeo avec des points
                                d'expérience
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Étape 2: Informations personnelles */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          Parlez-nous de vous
                        </h2>
                        <p className="text-gray-400">
                          Ces informations nous aident à sécuriser votre compte
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-white flex items-center">
                            <User className="h-4 w-4 mr-2 text-violet-400" />
                            Prénom *
                          </Label>
                          <Input
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            placeholder="John"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-violet-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white flex items-center">
                            <User className="h-4 w-4 mr-2 text-violet-400" />
                            Nom *
                          </Label>
                          <Input
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            placeholder="Doe"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-violet-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-cyan-400" />
                          Email professionnel *
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="john@entreprise.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white flex items-center">
                          <Building className="h-4 w-4 mr-2 text-pink-400" />
                          Nom de l'entreprise *
                        </Label>
                        <Input
                          value={formData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          placeholder="Mon Entreprise SARL"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-pink-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-lime-400" />
                          Numéro SIRET *
                        </Label>
                        <Input
                          value={formData.siret}
                          onChange={(e) =>
                            handleInputChange("siret", e.target.value)
                          }
                          placeholder="12345678901234"
                          maxLength={14}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-lime-500"
                        />
                        <p className="text-xs text-gray-400 flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          Requis pour la vérification KYC de votre entreprise
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Étape 3: Sécurité */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          Sécurisez votre compte
                        </h2>
                        <p className="text-gray-400">
                          Créez un mot de passe fort pour protéger vos données
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-white flex items-center">
                            <Lock className="h-4 w-4 mr-2 text-violet-400" />
                            Mot de passe *
                          </Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              placeholder="••••••••"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-violet-500 pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white flex items-center">
                            <Lock className="h-4 w-4 mr-2 text-cyan-400" />
                            Confirmer le mot de passe *
                          </Label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value,
                                )
                              }
                              placeholder="••••••••"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-cyan-500 pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {formData.confirmPassword &&
                            formData.password !== formData.confirmPassword && (
                              <p className="text-pink-400 text-xs flex items-center">
                                <X className="h-3 w-3 mr-1" />
                                Les mots de passe ne correspondent pas
                              </p>
                            )}
                          {formData.confirmPassword &&
                            formData.password === formData.confirmPassword && (
                              <p className="text-lime-400 text-xs flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mots de passe identiques
                              </p>
                            )}
                        </div>

                        {/* Critères du mot de passe */}
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <p className="text-white text-sm font-medium mb-3">
                            Critères du mot de passe :
                          </p>
                          <div className="space-y-2">
                            {[
                              {
                                criteria: "Au moins 8 caractères",
                                met: formData.password.length >= 8,
                              },
                              {
                                criteria: "Une majuscule",
                                met: /[A-Z]/.test(formData.password),
                              },
                              {
                                criteria: "Un chiffre",
                                met: /\d/.test(formData.password),
                              },
                              {
                                criteria: "Un caractère spécial",
                                met: /[!@#$%^&*]/.test(formData.password),
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center text-xs"
                              >
                                {item.met ? (
                                  <CheckCircle className="h-3 w-3 text-lime-400 mr-2" />
                                ) : (
                                  <div className="w-3 h-3 border border-gray-500 rounded-full mr-2" />
                                )}
                                <span
                                  className={
                                    item.met ? "text-lime-400" : "text-gray-400"
                                  }
                                >
                                  {item.criteria}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Conditions d'utilisation */}
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <input
                              id="terms"
                              type="checkbox"
                              checked={formData.acceptTerms}
                              onChange={(e) =>
                                handleInputChange(
                                  "acceptTerms",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 text-violet-500 bg-white/5 border-white/20 rounded focus:ring-violet-500 focus:ring-2 mt-1"
                            />
                            <Label
                              htmlFor="terms"
                              className="text-gray-300 text-sm"
                            >
                              J'accepte les{" "}
                              <Link
                                to="#"
                                className="text-violet-400 hover:text-violet-300 underline"
                              >
                                Conditions d'utilisation
                              </Link>{" "}
                              et la{" "}
                              <Link
                                to="#"
                                className="text-cyan-400 hover:text-cyan-300 underline"
                              >
                                Politique de confidentialité
                              </Link>{" "}
                              de Swapeo *
                            </Label>
                          </div>

                          <div className="flex items-start space-x-3">
                            <input
                              id="marketing"
                              type="checkbox"
                              checked={formData.acceptMarketing}
                              onChange={(e) =>
                                handleInputChange(
                                  "acceptMarketing",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 text-pink-500 bg-white/5 border-white/20 rounded focus:ring-pink-500 focus:ring-2 mt-1"
                            />
                            <Label
                              htmlFor="marketing"
                              className="text-gray-300 text-sm"
                            >
                              Je souhaite recevoir les actualités, offres
                              spéciales et conseils de Swapeo par email
                            </Label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Boutons de navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div>
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        className="text-gray-400 hover:text-white"
                      >
                        ← Précédent
                      </Button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep(currentStep)}
                        className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!validateStep(3) || loading}
                        className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création...
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            Créer mon compte
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>

              {/* Divider et connexion alternative */}
              {currentStep === 3 && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black/20 backdrop-blur-sm px-3 text-gray-400">
                        Ou
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    S'inscrire avec Google
                  </Button>
                </>
              )}

              {/* Lien de connexion */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Déjà membre de Swapeo ?{" "}
                  <Link
                    to="/login"
                    className="text-violet-400 hover:text-violet-300 underline font-medium"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Informations de sécurité */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-lime-400" />
                Données chiffrées
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-1 text-cyan-400" />
                Conforme RGPD
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-violet-400" />
                Vérification KYC
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
