import { Card } from "@/components/ui/card";
import { Zap, Target, Shield, Gauge } from "lucide-react";

const AdvantagesSection = () => {
  const advantages = [
    {
      icon: Zap,
      title: "Swap Instantané",
      description:
        "Échangez vos liquidités en temps réel avec d'autres auto-entrepreneurs",
      color: "bg-swapeo-primary",
    },
    {
      icon: Target,
      title: "Matching Précis",
      description:
        "Notre algorithme trouve la correspondance parfaite selon vos critères",
      color: "bg-blue-500",
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description:
        "Plateforme sécurisée avec vérification complète de chaque utilisateur",
      color: "bg-purple-500",
    },
    {
      icon: Gauge,
      title: "Ultra Rapide",
      description:
        "Obtenez vos fonds en moins de 24h avec notre processus optimisé",
      color: "bg-orange-500",
    },
  ];

  return (
    <section id="avantages" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Avantages{" "}
            <span className="text-swapeo-primary">Concurrentiels</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Une technologie de pointe au service des auto-entrepreneurs
          </p>
        </div>

        {/* Advantages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {advantages.map((advantage, index) => (
            <Card
              key={index}
              className="swapeo-card p-8 group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-swapeo-primary/10"
            >
              <div className="flex items-start space-x-6">
                <div
                  className={`w-16 h-16 ${advantage.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <advantage.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dashboard preview section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Interface <span className="text-swapeo-primary">Moderne</span>
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Un dashboard intuitif pour gérer tous vos swaps
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-swapeo-navy-light/50 border border-swapeo-slate/20 rounded-2xl p-6 backdrop-blur-sm">
            {/* Browser chrome */}
            <div className="flex items-center space-x-2 mb-6 p-4 bg-swapeo-navy/50 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-swapeo-navy px-4 py-2 rounded-lg text-gray-300 text-sm">
                  app.swapeo.fr/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats cards */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-swapeo-navy/50 p-4 rounded-lg border border-swapeo-slate/20">
                    <div className="text-2xl font-bold text-white">2.4M€</div>
                    <div className="text-swapeo-primary text-sm">
                      Volume Total
                    </div>
                  </div>
                  <div className="bg-swapeo-navy/50 p-4 rounded-lg border border-swapeo-slate/20">
                    <div className="text-2xl font-bold text-white">
                      245 890 €
                    </div>
                    <div className="text-swapeo-primary text-sm">
                      Solde Principal
                    </div>
                  </div>
                </div>
                <div className="bg-swapeo-navy/50 p-4 rounded-lg border border-swapeo-slate/20">
                  <div className="text-white font-medium mb-2">
                    Swaps Récents
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">SWP-001</span>
                      <span className="text-swapeo-primary">+5,000€</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">SWP-002</span>
                      <span className="text-orange-400">-2,500€</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet section */}
              <div className="bg-swapeo-navy/50 p-4 rounded-lg border border-swapeo-slate/20">
                <div className="text-white font-medium mb-4">
                  Wallet Principal
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    245 890 €
                  </div>
                  <div className="text-gray-400 text-sm mb-4">
                    +2.43% ce mois
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-swapeo-primary text-white text-xs py-2 rounded">
                      Déposer
                    </button>
                    <button className="border border-swapeo-slate/30 text-gray-300 text-xs py-2 rounded">
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
