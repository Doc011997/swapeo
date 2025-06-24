import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-white font-bold text-2xl">SWAPEO</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-gray-400">Accédez à votre espace Swapeo</p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded text-center ${
                  message.includes("✅")
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 pr-10"
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
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            {/* Test accounts */}
            <div className="space-y-3">
              <p className="text-gray-400 text-sm text-center">
                Comptes de test :
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs border-slate-600 hover:bg-slate-700"
                  onClick={() =>
                    handleQuickLogin(
                      "john@example.com",
                      "password123",
                      "emprunteur",
                    )
                  }
                  disabled={loading}
                >
                  Test Emprunteur
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs border-slate-600 hover:bg-slate-700"
                  onClick={() =>
                    handleQuickLogin(
                      "sarah@example.com",
                      "password123",
                      "financeur",
                    )
                  }
                  disabled={loading}
                >
                  Test Financeur
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-blue-400 hover:underline">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginSimple;
