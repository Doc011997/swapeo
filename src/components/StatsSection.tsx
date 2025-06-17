import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, Shield, Users } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "2,400+",
      label: "Entrepreneurs inscrits",
      description: "Une communauté active et grandissante",
    },
    {
      icon: Clock,
      value: "24h",
      label: "Délai moyen",
      description: "Pour obtenir votre financement",
    },
    {
      icon: TrendingUp,
      value: "98.7%",
      label: "Taux de succès",
      description: "Des swaps aboutis avec satisfaction",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Sécurité garantie",
      description: "Plateforme sécurisée et réglementée",
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Contrôle <span className="text-swapeo-primary">Intégral</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Visualisez vos swaps en temps réel
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="swapeo-card p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-swapeo-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-swapeo-primary/30 transition-colors">
                <stat.icon className="h-6 w-6 text-swapeo-primary" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-swapeo-primary font-medium mb-2">
                {stat.label}
              </div>
              <p className="text-gray-400 text-sm">{stat.description}</p>
            </Card>
          ))}
        </div>

        {/* Circular visualization */}
        <div className="relative">
          <div className="w-full max-w-4xl mx-auto bg-swapeo-navy-light/30 rounded-2xl p-8 border border-swapeo-slate/20">
            <div className="relative h-96 flex items-center justify-center">
              {/* Central node */}
              <div className="absolute w-24 h-24 bg-swapeo-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">€</span>
              </div>

              {/* Surrounding nodes */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-swapeo-purple rounded-full flex items-center justify-center">
                <span className="text-white text-sm">3000€+3m</span>
              </div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-swapeo-purple rounded-full flex items-center justify-center">
                <span className="text-white text-sm">1500€+1m</span>
              </div>
              <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-16 h-16 bg-swapeo-purple rounded-full flex items-center justify-center">
                <span className="text-white text-sm">5000€+6m</span>
              </div>
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-16 h-16 bg-swapeo-purple rounded-full flex items-center justify-center">
                <span className="text-white text-sm">2000€+2m</span>
              </div>

              {/* Connection lines */}
              <div className="absolute inset-0 overflow-hidden">
                <svg className="w-full h-full">
                  <line
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="15%"
                    stroke="#1bc870"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="85%"
                    stroke="#1bc870"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="15%"
                    y2="50%"
                    stroke="#1bc870"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="85%"
                    y2="50%"
                    stroke="#1bc870"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
