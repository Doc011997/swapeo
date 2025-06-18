import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Wallet,
  Clock,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  BarChart3,
  Euro,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

const DashboardSimple = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'utilisateur depuis localStorage
    const savedUser = localStorage.getItem("swapeo_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Rediriger vers login si pas connecté
      window.location.href = "/login";
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("swapeo_token");
    localStorage.removeItem("swapeo_user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Dashboard Swapeo
                </h1>
                <p className="text-gray-400 text-sm">
                  Bienvenue {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                className={
                  user.role === "emprunteur"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-green-500/20 text-green-400"
                }
              >
                {user.role}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-600 hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Statut KYC :</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">Vérifié</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Trust Score :</span>
                <span className="text-blue-400 font-semibold">
                  {user.trustScore || 85}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Rôle :</span>
                <Badge
                  className={
                    user.role === "emprunteur"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-green-500/20 text-green-400"
                  }
                >
                  {user.role}
                </Badge>
              </div>

              {user.company && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Entreprise :</span>
                  <span className="text-white">{user.company}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Wallet Card */}
          <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Mon Wallet</h3>
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Solde disponible</p>
                <p className="text-2xl font-bold text-white">
                  {user.wallet?.balance?.toLocaleString() || "25 000"} €
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Total déposé</p>
                  <p className="text-green-400 font-semibold">
                    {user.wallet?.totalDeposited?.toLocaleString() || "50 000"}{" "}
                    €
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Total retiré</p>
                  <p className="text-red-400 font-semibold">
                    {user.wallet?.totalWithdrawn?.toLocaleString() || "25 000"}{" "}
                    €
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  Déposer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-slate-600 hover:bg-slate-700"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Retirer
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Statistiques</h3>
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400">Swaps actifs</span>
                </div>
                <span className="text-white font-semibold">3</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-400">En attente</span>
                </div>
                <span className="text-white font-semibold">1</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">Partenaires</span>
                </div>
                <span className="text-white font-semibold">7</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Euro className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-400">Volume total</span>
                </div>
                <span className="text-white font-semibold">127K€</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 h-16">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Nouveau Swap</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-slate-600 hover:bg-slate-700 h-16"
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Rechercher</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-slate-600 hover:bg-slate-700 h-16"
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-slate-600 hover:bg-slate-700 h-16"
            >
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Historique</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Success Message */}
        <Card className="mt-8 bg-green-500/10 border-green-500/30 p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div>
              <h4 className="text-green-400 font-semibold">
                🎉 Connexion réussie !
              </h4>
              <p className="text-green-300 text-sm">
                Bienvenue sur votre dashboard Swapeo ! Votre plateforme est
                maintenant fonctionnelle.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSimple;
