import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await auth.login(formData.email, formData.password);

      // Stocker le token et les infos utilisateur
      auth.setToken(response.token);
      auth.setUser(response.user);

      toast({
        title: "Connexion réussie !",
        description: `Bienvenue ${response.user.firstName} !`,
      });

      // Rediriger vers le dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (
    email: string,
    password: string,
    role: string,
  ) => {
    setLoading(true);
    try {
      const response = await auth.login(email, password);
      auth.setToken(response.token);
      auth.setUser(response.user);

      toast({
        title: "Connexion réussie !",
        description: `Connecté en tant que ${role}`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen swapeo-gradient flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-swapeo-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-swapeo-purple/20 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-swapeo-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-white font-bold text-2xl">SWAPEO</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-gray-400">Accédez à votre espace Swapeo</p>
        </div>

        <Card className="swapeo-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 focus:border-swapeo-primary"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-gray-300">
                  Mot de passe
                </Label>
                <Link
                  to="#"
                  className="text-swapeo-primary text-sm hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 focus:border-swapeo-primary pr-10"
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

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-swapeo-primary bg-swapeo-navy border-swapeo-slate/30 rounded focus:ring-swapeo-primary focus:ring-2"
              />
              <Label htmlFor="remember" className="ml-2 text-gray-300 text-sm">
                Se souvenir de moi
              </Label>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              className="w-full swapeo-button group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {/* Role selection */}
            <div className="space-y-3">
              <p className="text-gray-400 text-sm text-center">
                Ou connectez-vous en tant que :
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="swapeo-button-outline text-xs"
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
                  className="swapeo-button-outline text-xs"
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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-swapeo-slate/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-swapeo-navy-light px-2 text-gray-400">
                  Ou
                </span>
              </div>
            </div>

            {/* Google login */}
            <Button variant="outline" className="w-full swapeo-button-outline">
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
              Continuer avec Google
            </Button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-swapeo-primary hover:underline"
              >
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            En vous connectant, vous acceptez nos{" "}
            <Link to="#" className="text-swapeo-primary hover:underline">
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link to="#" className="text-swapeo-primary hover:underline">
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
