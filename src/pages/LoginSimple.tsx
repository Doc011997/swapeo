import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Handshake,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Building,
  Star,
  CheckCircle,
  ArrowUpDown,
  Wallet,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LoginSimple = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("🔄 Connexion en cours...");

    // Connexion directe en mode DEMO (pas d'API)
    setTimeout(() => {
      const demoUser = {
        id: "demo-123",
        email: formData.email,
        firstName: "Demo",
        lastName: "User",
        role: "emprunteur",
        company: "Entreprise Demo",
        kycStatus: "verified",
        trustScore: 85,
        wallet: {
          balance: 12547,
          totalDeposited: 15000,
          totalWithdrawn: 2453,
        },
      };

      const demoToken = "demo-token-" + Date.now();

      localStorage.setItem("swapeo_token", demoToken);
      localStorage.setItem("swapeo_user", JSON.stringify(demoUser));

      setMessage("✅ Connexion réussie ! Bienvenue !");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

      setLoading(false);
    }, 1000);
  };

  const handleQuickLogin = async (
    email: string,
    password: string,
    role: string,
  ) => {
    setFormData({ email, password });
    setLoading(true);
    setMessage(`🔄 Connexion ${role}...`);

    // Connexion directe en mode DEMO (pas d'API)
    setTimeout(() => {
      const demoUsers = {
        emprunteur: {
          id: "demo-emprunteur",
          email: email,
          firstName: "John",
          lastName: "Dupont",
          role: "emprunteur",
          company: "Startup Tech",
          kycStatus: "verified",
          trustScore: 85,
          wallet: {
            balance: 12547,
            totalDeposited: 15000,
            totalWithdrawn: 2453,
          },
        },
        financeur: {
          id: "demo-financeur",
          email: email,
          firstName: "Sarah",
          lastName: "Martin",
          role: "financeur",
          company: "Investment Group",
          kycStatus: "verified",
          trustScore: 92,
          wallet: {
            balance: 45230,
            totalDeposited: 50000,
            totalWithdrawn: 4770,
          },
        },
      };

      const demoUser = demoUsers[role as keyof typeof demoUsers];
      const demoToken = "demo-token-" + Date.now();

      localStorage.setItem("swapeo_token", demoToken);
      localStorage.setItem("swapeo_user", JSON.stringify(demoUser));

      setMessage(`✅ Connecté en tant que ${role} !`);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);

      setLoading(false);
    }, 1000);
  };

  const stats = [
    {
      icon: Users,
      value: "2,847",
      label: "Utilisateurs actifs",
      color: "text-blue-400",
    },
    {
      icon: Handshake,
      value: "1,253",
      label: "Swaps réalisés",
      color: "text-emerald-400",
    },
    {
      icon: TrendingUp,
      value: "94%",
      label: "Taux de succès",
      color: "text-indigo-400",
    },
  ];

  const testimonials = [
    {
      name: "Marie L.",
      role: "Restauratrice",
      text: "Grâce à Swapeo, j'ai pu financer l'extension de mon restaurant en 48h !",
      avatar: "ML",
    },
    {
      name: "Alex D.",
      role: "Investisseur",
      text: "Une plateforme transparente qui me permet de diversifier mes investissements.",
      avatar: "AD",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/8 to-emerald-500/8 rounded-full blur-3xl"></div>

        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-32 text-blue-400/20"
        >
          <ArrowUpDown className="h-8 w-8" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-32 left-32 text-purple-400/20"
        >
          <Wallet className="h-10 w-10" />
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 text-green-400/20"
        >
          <Globe className="h-6 w-6" />
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding and info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo and brand */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Handshake className="h-6 w-6 text-white" />
                </div>
                <span className="text-white font-bold text-3xl">SWAPEO</span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                Révolutionnez vos
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  {" "}
                  échanges financiers
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                La première plateforme de swaps financiers directs entre
                entrepreneurs et investisseurs. Plus rapide, plus flexible, plus
                humain que les banques traditionnelles.
              </p>

              {/* Key features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-gray-300">Financement en 24-48h</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">
                    Sécurisé par la blockchain
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-gray-300">
                    Taux avantageux négociés
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm italic">
                    "{testimonial.text}"
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Handshake className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-2xl">SWAPEO</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Connectez-vous à votre espace
              </h2>
              <p className="text-gray-400 text-sm">
                La finance collaborative nouvelle génération
              </p>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl p-8">
              <div className="hidden lg:block text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Connexion
                </h2>
                <p className="text-gray-300">Accédez à votre tableau de bord</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg text-center border ${
                      message.includes("✅")
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : message.includes("❌")
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    {message}
                  </motion.div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200 font-medium">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-200 font-medium"
                  >
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white h-8 w-8"
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

                {/* Login button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-12 shadow-lg transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                  ) : (
                    <Handshake className="mr-2 h-5 w-5" />
                  )}
                  {loading ? "Connexion en cours..." : "Se connecter"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>

                {/* Demo accounts */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-transparent px-4 text-gray-400">
                        Comptes de démonstration
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 transition-all"
                      onClick={() =>
                        handleQuickLogin(
                          "john@example.com",
                          "password123",
                          "emprunteur",
                        )
                      }
                      disabled={loading}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      Entrepreneur
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 transition-all"
                      onClick={() =>
                        handleQuickLogin(
                          "sarah@example.com",
                          "password123",
                          "financeur",
                        )
                      }
                      disabled={loading}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Investisseur
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-8 text-center space-y-4">
                <p className="text-gray-300 text-sm">
                  Nouveau sur Swapeo ?{" "}
                  <Link
                    to="/register"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Créez votre compte gratuitement
                  </Link>
                </p>

                {/* Trust indicators */}
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Sécurisé SSL</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Certifié RGPD</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>4.9/5 Trustpilot</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginSimple;
