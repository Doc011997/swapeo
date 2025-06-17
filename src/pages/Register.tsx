import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "emprunteur" | "financeur" | null
  >(null);

  return (
    <div className="min-h-screen swapeo-gradient flex items-center justify-center py-12">
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
          <h1 className="text-2xl font-bold text-white mb-2">Inscription</h1>
          <p className="text-gray-400">
            Créez votre compte Swapeo gratuitement
          </p>
        </div>

        <Card className="swapeo-card p-8">
          <form className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-gray-300">Je souhaite :</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={
                    selectedRole === "emprunteur" ? "default" : "outline"
                  }
                  className={
                    selectedRole === "emprunteur"
                      ? "swapeo-button"
                      : "swapeo-button-outline"
                  }
                  onClick={() => setSelectedRole("emprunteur")}
                >
                  {selectedRole === "emprunteur" && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Emprunter
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "financeur" ? "default" : "outline"}
                  className={
                    selectedRole === "financeur"
                      ? "swapeo-button"
                      : "swapeo-button-outline"
                  }
                  onClick={() => setSelectedRole("financeur")}
                >
                  {selectedRole === "financeur" && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Financer
                </Button>
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 focus:border-swapeo-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 focus:border-swapeo-primary"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 focus:border-swapeo-primary"
              />
            </div>

            {/* SIRET */}
            <div className="space-y-2">
              <Label htmlFor="siret" className="text-gray-300">
                Numéro SIRET
              </Label>
              <Input
                id="siret"
                placeholder="12345678901234"
                className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 focus:border-swapeo-primary"
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
                  className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 focus:border-swapeo-primary pr-10"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-swapeo-navy border-swapeo-slate/30 text-white placeholder:text-gray-500 focus:border-swapeo-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 text-swapeo-primary bg-swapeo-navy border-swapeo-slate/30 rounded focus:ring-swapeo-primary focus:ring-2 mt-0.5"
              />
              <Label htmlFor="terms" className="text-gray-300 text-sm">
                J'accepte les{" "}
                <Link to="#" className="text-swapeo-primary hover:underline">
                  Conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link to="#" className="text-swapeo-primary hover:underline">
                  Politique de confidentialité
                </Link>
              </Label>
            </div>

            {/* Marketing consent */}
            <div className="flex items-start space-x-3">
              <input
                id="marketing"
                type="checkbox"
                className="w-4 h-4 text-swapeo-primary bg-swapeo-navy border-swapeo-slate/30 rounded focus:ring-swapeo-primary focus:ring-2 mt-0.5"
              />
              <Label htmlFor="marketing" className="text-gray-300 text-sm">
                Je souhaite recevoir les actualités et offres de Swapeo
              </Label>
            </div>

            {/* Register button */}
            <Button
              className="w-full swapeo-button group"
              disabled={!selectedRole}
            >
              Créer mon compte
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

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

            {/* Google register */}
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
              S'inscrire avec Google
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-swapeo-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </Card>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            🔒 Vos données sont protégées et chiffrées
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
