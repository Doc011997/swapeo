import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Search,
  Handshake,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Inscription",
      description:
        "Créez votre compte et définissez votre profil d'auto-entrepreneur",
    },
    {
      icon: Search,
      number: "02",
      title: "Matching",
      description:
        "Notre IA trouve automatiquement les meilleures correspondances selon vos critères",
    },
    {
      icon: Handshake,
      number: "03",
      title: "Échange",
      description: "Validez les détails du swap et échangez en toute sécurité",
    },
    {
      icon: CreditCard,
      number: "04",
      title: "Transfert",
      description:
        "Recevez vos fonds dans les 24h avec zéro formalité supplémentaire",
    },
  ];

  return (
    <section id="concept" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comment <span className="text-swapeo-primary">ça marche</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            4 étapes simples pour accéder à la liquidité
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {step.title === "Matching" ? (
                <Link to="/swap" className="block">
                  <Card className="swapeo-card p-6 text-center h-full group hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-swapeo-primary/5 border-swapeo-primary/30 hover:border-swapeo-primary/60">
                    {/* Step number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-swapeo-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-swapeo-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 mt-4 group-hover:bg-swapeo-primary/40 transition-colors">
                      <step.icon className="h-8 w-8 text-swapeo-primary group-hover:animate-pulse" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-swapeo-primary">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white">
                      {step.description}
                    </p>

                    {/* Call to action pour Matching */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="inline-flex items-center text-swapeo-primary text-sm font-medium">
                        Accéder au Marketplace
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card className="swapeo-card p-6 text-center h-full group hover:scale-105 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-swapeo-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-swapeo-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 mt-4 group-hover:bg-swapeo-primary/30 transition-colors">
                    <step.icon className="h-8 w-8 text-swapeo-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              )}

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-swapeo-primary to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        {/* Bouton principal pour accéder au marketplace */}
        <div className="text-center mb-20">
          <Link to="/swap">
            <Button className="swapeo-button text-lg px-8 py-4 h-auto group relative overflow-hidden hover:scale-105 transition-all duration-300">
              <span className="relative z-10 flex items-center">
                <Search className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                Rechercher des opportunités
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-swapeo-primary-light via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
          <p className="text-gray-400 text-sm mt-3">
            ✨ Accédez à notre marketplace et découvrez des opportunités de
            financement adaptées à vos besoins
          </p>
        </div>

        {/* Network visualization */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Réseau de Connexion à{" "}
            <span className="text-swapeo-primary">d'Échange</span>
          </h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Visualisez en temps réel le flux de financement et de remboursement
            entre entrepreneurs sur la plateforme Swapeo
          </p>
        </div>

        {/* Network diagram */}
        <div className="relative max-w-6xl mx-auto">
          <div className="bg-swapeo-navy-light/30 rounded-2xl p-8 border border-swapeo-slate/20">
            {/* Status indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                { label: "Prêteur", color: "bg-swapeo-primary" },
                { label: "Emprunteur", color: "bg-blue-500" },
                { label: "Plateforme Swapeo", color: "bg-purple-500" },
                { label: "Financement", color: "bg-orange-500" },
                { label: "Remboursement", color: "bg-pink-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span className="text-gray-300 text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Network graph */}
            <div className="relative h-96 overflow-hidden">
              <svg className="w-full h-full">
                {/* Connections */}
                <g className="opacity-60">
                  <line
                    x1="20%"
                    y1="30%"
                    x2="50%"
                    y2="50%"
                    stroke="#1bc870"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <line
                    x1="80%"
                    y1="30%"
                    x2="50%"
                    y2="50%"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <line
                    x1="30%"
                    y1="70%"
                    x2="50%"
                    y2="50%"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <line
                    x1="70%"
                    y1="70%"
                    x2="50%"
                    y2="50%"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <line
                    x1="50%"
                    y1="20%"
                    x2="50%"
                    y2="50%"
                    stroke="#ec4899"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </g>
              </svg>

              {/* Network nodes */}
              <div className="absolute inset-0">
                {/* Central node - Swapeo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-swapeo-primary rounded-full flex items-center justify-center animate-pulse-glow">
                  <span className="text-white font-bold">S</span>
                </div>

                {/* Surrounding nodes */}
                <div className="absolute top-[30%] left-[20%] w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-float">
                  <span className="text-white text-xs">Startup A</span>
                </div>
                <div
                  className="absolute top-[30%] right-[20%] w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <span className="text-white text-xs">Digital Agency</span>
                </div>
                <div
                  className="absolute bottom-[30%] left-[30%] w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <span className="text-white text-xs">Consultant</span>
                </div>
                <div
                  className="absolute bottom-[30%] right-[30%] w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center animate-float"
                  style={{ animationDelay: "3s" }}
                >
                  <span className="text-white text-xs">Designer</span>
                </div>
                <div
                  className="absolute top-[20%] left-1/2 transform -translate-x-1/2 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-float"
                  style={{ animationDelay: "4s" }}
                >
                  <span className="text-white text-xs">Dev Studio</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { value: "125", label: "Utilisateurs connectés" },
                { value: "2.4M€", label: "Volume échangé" },
                { value: "98.7%", label: "Taux de réussite" },
                { value: "18h", label: "Délai moyen" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
