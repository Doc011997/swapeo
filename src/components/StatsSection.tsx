import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, Shield, Users, Zap, Target } from "lucide-react";
import { useState, useEffect } from "react";

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);

  const stats = [
    {
      icon: Users,
      finalValue: 2400,
      suffix: "+",
      label: "Entrepreneurs inscrits",
      description: "Une communauté active et grandissante",
      color: "text-swapeo-primary",
      bgColor: "bg-swapeo-primary/20",
    },
    {
      icon: Clock,
      finalValue: 24,
      suffix: "h",
      label: "Délai moyen",
      description: "Pour obtenir votre financement",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      icon: TrendingUp,
      finalValue: 98.7,
      suffix: "%",
      label: "Taux de succès",
      description: "Des swaps aboutis avec satisfaction",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      icon: Shield,
      finalValue: 100,
      suffix: "%",
      label: "Sécurité garantie",
      description: "Plateforme sécurisée et réglementée",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate counters
          stats.forEach((stat, index) => {
            let current = 0;
            const increment = stat.finalValue / 100;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.finalValue) {
                current = stat.finalValue;
                clearInterval(timer);
              }
              setAnimatedStats((prev) => {
                const newStats = [...prev];
                newStats[index] = current;
                return newStats;
              });
            }, 30);
          });
        }
      },
      { threshold: 0.3 },
    );

    const element = document.getElementById("stats-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 relative overflow-hidden">
      {/* Revolutionary Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-swapeo-primary/10 rounded-full blur-2xl animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div
          className={`
          text-center mb-16 transition-all duration-1000
          ${isVisible ? "animate-slide-in-from-top" : "opacity-0 translate-y-10"}
        `}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contrôle{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-swapeo-primary via-blue-500 to-purple-500 animate-text-glow">
              Intégral
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Visualisez vos swaps en temps réel avec une précision{" "}
            <span className="text-swapeo-primary font-semibold animate-pulse">
              millimétrique
            </span>
          </p>
        </div>

        {/* Revolutionary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`
                swapeo-card p-8 text-center group relative overflow-hidden
                transition-all duration-700 hover-tilt
                ${isVisible ? "animate-slide-in-from-bottom" : "opacity-0 translate-y-10"}
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Background glow effect */}
              <div
                className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg`}
              />

              {/* Floating icon */}
              <div
                className={`
                w-16 h-16 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6
                group-hover:scale-125 group-hover:rotate-12 transition-all duration-500
                relative z-10
              `}
              >
                <stat.icon className={`h-8 w-8 ${stat.color} animate-pulse`} />

                {/* Icon glow */}
                <div
                  className={`absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${stat.bgColor}`}
                />
              </div>

              {/* Animated value */}
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 relative">
                <span className="animate-text-glow">
                  {animatedStats[index]?.toFixed(
                    stat.finalValue % 1 !== 0 ? 1 : 0,
                  )}
                  {stat.suffix}
                </span>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200px_100%] animate-shimmer opacity-0 group-hover:opacity-100" />
              </div>

              <div
                className={`text-lg font-medium mb-3 ${stat.color} transition-colors duration-300`}
              >
                {stat.label}
              </div>

              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {stat.description}
              </p>

              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-swapeo-primary group-hover:to-blue-500 transition-all duration-500" />
            </Card>
          ))}
        </div>

        {/* Revolutionary Circular Visualization */}
        <div
          className={`
          relative transition-all duration-1000 delay-800
          ${isVisible ? "animate-fade-in" : "opacity-0"}
        `}
        >
          <div className="w-full max-w-5xl mx-auto glass-effect rounded-3xl p-8 border border-swapeo-slate/20 neon-border relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(27, 200, 112, 0.3) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                 radial-gradient(circle at 40% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`,
                }}
              />
            </div>

            <div className="relative h-96 flex items-center justify-center">
              {/* Enhanced Central Node */}
              <div className="absolute w-32 h-32 bg-gradient-to-br from-swapeo-primary via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-glow neon-border group cursor-pointer">
                <div className="w-24 h-24 bg-swapeo-navy rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl animate-text-glow">
                    €
                  </span>
                </div>
                <Zap className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
              </div>

              {/* Enhanced Surrounding Nodes */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 glass-effect rounded-full flex items-center justify-center neon-border hover:scale-110 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-white text-xs font-bold">3000€</div>
                  <div className="text-swapeo-primary text-xs">+3m</div>
                </div>
                <Target className="absolute -top-1 -right-1 h-4 w-4 text-swapeo-primary animate-spin-slow opacity-0 group-hover:opacity-100" />
              </div>

              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 glass-effect rounded-full flex items-center justify-center neon-border hover:scale-110 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-white text-xs font-bold">1500€</div>
                  <div className="text-blue-400 text-xs">+1m</div>
                </div>
                <Target className="absolute -top-1 -right-1 h-4 w-4 text-blue-400 animate-spin-slow opacity-0 group-hover:opacity-100" />
              </div>

              <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-20 h-20 glass-effect rounded-full flex items-center justify-center neon-border hover:scale-110 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-white text-xs font-bold">5000€</div>
                  <div className="text-purple-400 text-xs">+6m</div>
                </div>
                <Target className="absolute -top-1 -right-1 h-4 w-4 text-purple-400 animate-spin-slow opacity-0 group-hover:opacity-100" />
              </div>

              <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-20 h-20 glass-effect rounded-full flex items-center justify-center neon-border hover:scale-110 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-white text-xs font-bold">2000€</div>
                  <div className="text-orange-400 text-xs">+2m</div>
                </div>
                <Target className="absolute -top-1 -right-1 h-4 w-4 text-orange-400 animate-spin-slow opacity-0 group-hover:opacity-100" />
              </div>

              {/* Enhanced Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient
                    id="connectionGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#1bc870" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <line
                  x1="50%"
                  y1="50%"
                  x2="50%"
                  y2="15%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="3"
                  opacity="0.8"
                  className="animate-pulse"
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="50%"
                  y2="85%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="3"
                  opacity="0.8"
                  className="animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="15%"
                  y2="50%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="3"
                  opacity="0.8"
                  className="animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="85%"
                  y2="50%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="3"
                  opacity="0.8"
                  className="animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                />
              </svg>

              {/* Floating particles around connections */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-swapeo-primary rounded-full animate-float-particle"
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    top: `${30 + Math.random() * 40}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${4 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
