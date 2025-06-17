import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Wallet,
  Clock,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Swaps Actifs",
      value: "8",
      change: "+2 ce mois",
      icon: TrendingUp,
      color: "text-swapeo-primary",
    },
    {
      title: "Volume Total",
      value: "2.4M€",
      change: "+12% ce mois",
      icon: ArrowUpRight,
      color: "text-blue-400",
    },
    {
      title: "Participants",
      value: "24",
      change: "+6 ce mois",
      icon: Users,
      color: "text-purple-400",
    },
    {
      title: "Délai Moyen",
      value: "2.1j",
      change: "-0.3j ce mois",
      icon: Clock,
      color: "text-orange-400",
    },
  ];

  const recentSwaps = [
    {
      id: "SWP-001",
      amount: "50,000 €",
      counterparty: "TechStart SAS",
      status: "En cours",
      progress: 75,
      type: "emprunt",
    },
    {
      id: "SWP-002",
      amount: "25,000 €",
      counterparty: "Digital Studio Ltd",
      status: "En attente",
      progress: 25,
      type: "prêt",
    },
    {
      id: "SWP-003",
      amount: "75,000 €",
      counterparty: "InnoTech SA",
      status: "Terminé",
      progress: 100,
      type: "emprunt",
    },
  ];

  return (
    <div className="min-h-screen swapeo-gradient">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-swapeo-navy border-r border-swapeo-slate/20 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-swapeo-slate/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-swapeo-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-bold text-xl">SWAPEO</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 bg-swapeo-primary/20 text-swapeo-primary rounded-lg"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-swapeo-navy-light rounded-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Créer un Swap</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-swapeo-navy-light rounded-lg"
          >
            <Users className="h-5 w-5" />
            <span>Matching</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-swapeo-navy-light rounded-lg"
          >
            <Wallet className="h-5 w-5" />
            <span>Wallet</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-swapeo-navy-light rounded-lg"
          >
            <Settings className="h-5 w-5" />
            <span>Profil</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-swapeo-navy-light rounded-lg"
          >
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </a>
          <div className="pt-4">
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-swapeo-navy-light rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span>Support</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-swapeo-navy/95 backdrop-blur-sm border-b border-swapeo-slate/20 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Bienvenue, John 👋
              </h1>
              <p className="text-gray-400">
                Voici un aperçu de votre activité sur la plateforme
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="swapeo-button-outline">
                Créer un Swap
              </Button>
              <Button className="swapeo-button">Nouveau Swap</Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="swapeo-card p-6 group hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-swapeo-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mb-2">{stat.title}</div>
                <div className="text-xs text-swapeo-primary">{stat.change}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Swaps */}
            <Card className="lg:col-span-2 swapeo-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Swaps Récents</h3>
                <Button
                  variant="ghost"
                  className="text-swapeo-primary hover:bg-swapeo-primary/10"
                >
                  Voir tout
                </Button>
              </div>

              <div className="space-y-4">
                {recentSwaps.map((swap, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-swapeo-navy/50 rounded-lg border border-swapeo-slate/20"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          swap.type === "prêt"
                            ? "bg-green-500/20"
                            : "bg-blue-500/20"
                        }`}
                      >
                        {swap.type === "prêt" ? (
                          <ArrowUpRight className="h-5 w-5 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {swap.amount}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {swap.counterparty}
                        </div>
                        <div className="text-xs text-gray-500">{swap.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium mb-1 ${
                          swap.status === "Terminé"
                            ? "text-green-400"
                            : swap.status === "En cours"
                              ? "text-orange-400"
                              : "text-gray-400"
                        }`}
                      >
                        {swap.status}
                      </div>
                      <div className="w-20 bg-swapeo-navy rounded-full h-2">
                        <div
                          className="bg-swapeo-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${swap.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6 swapeo-button">
                <Plus className="mr-2 h-4 w-4" />
                Créer un nouveau swap
              </Button>
            </Card>

            {/* Wallet Principal */}
            <Card className="swapeo-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  Wallet Principal
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  245 890 €
                </div>
                <div className="text-green-400 text-sm mb-4">
                  +2.43% ce mois
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="swapeo-button">Déposer</Button>
                  <Button variant="outline" className="swapeo-button-outline">
                    Retirer
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Statut du compte</span>
                  <span className="text-swapeo-primary">Vérifié</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Limite mensuelle</span>
                  <span className="text-white">50 000 €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Utilisé ce mois</span>
                  <span className="text-white">12 400 €</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-swapeo-primary/10 border border-swapeo-primary/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Bell className="h-4 w-4 text-swapeo-primary" />
                  <span className="text-swapeo-primary font-medium text-sm">
                    Notifications
                  </span>
                </div>
                <p className="text-gray-300 text-xs">
                  Nouveau swap accepté : +5,000€ de TechStart SAS en attente de
                  confirmation
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
