import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import DynamicBackground from "./DynamicBackground";

const HeroSection = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const dynamicTexts = [
    "nouvelle génération",
    "révolutionnaire",
    "ultra-rapide",
    "sécurisé",
    "intelligent",
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Revolutionary Dynamic Background */}
      <DynamicBackground />

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Animated Hero Badge */}
        <div
          className={`
          inline-flex items-center px-6 py-3 rounded-full 
          glass-effect neon-border text-swapeo-primary text-sm font-medium mb-8
          transition-all duration-1000 hover:scale-105 hover-lift
          ${isVisible ? "animate-slide-in-from-top" : "opacity-0"}
        `}
        >
          <Sparkles className="mr-2 h-4 w-4 animate-spin-slow" />
          🚀 RÉVOLUTION FINANCIÈRE
          <Zap className="ml-2 h-4 w-4 animate-pulse" />
        </div>

        {/* Revolutionary Main Heading */}
        <h1
          className={`
          text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight
          transition-all duration-1000 delay-200
          ${isVisible ? "animate-slide-in-from-bottom" : "opacity-0 translate-y-10"}
        `}
        >
          <span className="relative">
            Swap de trésorerie
            <div className="absolute -inset-1 bg-gradient-to-r from-swapeo-primary to-blue-500 rounded-lg blur opacity-20 animate-pulse-glow" />
          </span>
          <br />
          <span
            className={`
            text-transparent bg-clip-text bg-gradient-to-r from-swapeo-primary via-blue-500 to-purple-500
            animate-text-glow transition-all duration-700
          `}
          >
            {dynamicTexts[textIndex]}
          </span>
        </h1>

        {/* Enhanced Subtitle */}
        <p
          className={`
          text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed
          transition-all duration-1000 delay-400
          ${isVisible ? "animate-slide-in-from-bottom" : "opacity-0 translate-y-10"}
        `}
        >
          Accédez à la liquidité{" "}
          <span className="text-swapeo-primary font-semibold animate-pulse">
            instantanément
          </span>{" "}
          grâce à notre technologie d'échange sécurisé entre auto-entrepreneurs.
        </p>

        {/* Revolutionary CTA Buttons */}
        <div
          className={`
          flex flex-col sm:flex-row gap-6 justify-center items-center mb-16
          transition-all duration-1000 delay-600
          ${isVisible ? "animate-slide-in-from-bottom" : "opacity-0 translate-y-10"}
        `}
        >
          <Button className="swapeo-button text-lg px-10 py-5 h-auto group relative overflow-hidden hover:scale-110 transition-all duration-300">
            <span className="relative z-10 flex items-center">
              Commencer gratuitement
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-swapeo-primary-light via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Sparkles className="absolute top-1 right-1 h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 animate-pulse" />
          </Button>

          <Button
            variant="outline"
            className="glass-effect neon-border text-lg px-10 py-5 h-auto group hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center text-white">
              Découvrir
              <ChevronDown className="ml-3 h-6 w-6 group-hover:translate-y-1 transition-transform duration-300 animate-bounce" />
            </span>
          </Button>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div
          className={`
          flex flex-col items-center
          transition-all duration-1000 delay-800
          ${isVisible ? "animate-fade-in" : "opacity-0"}
        `}
        >
          <p className="text-gray-400 text-sm mb-4 animate-pulse">
            ✨ Découvrir comment ça marche
          </p>
          <div className="relative">
            <ChevronDown className="h-8 w-8 text-swapeo-primary animate-bounce cursor-pointer hover:scale-125 transition-transform duration-300" />
            <div className="absolute inset-0 bg-swapeo-primary rounded-full blur-lg opacity-30 animate-pulse-glow" />
          </div>
        </div>

        {/* Floating Action Elements */}
        <div className="absolute top-1/4 left-10 hidden lg:block animate-float">
          <div className="w-16 h-16 glass-effect rounded-full flex items-center justify-center neon-border cursor-pointer hover:scale-110 transition-all duration-300">
            <Zap className="h-8 w-8 text-swapeo-primary animate-pulse" />
          </div>
        </div>

        <div
          className="absolute top-1/3 right-10 hidden lg:block animate-float"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-20 h-20 glass-effect rounded-full flex items-center justify-center neon-border cursor-pointer hover:scale-110 transition-all duration-300">
            <Sparkles className="h-10 w-10 text-blue-400 animate-spin-slow" />
          </div>
        </div>

        <div
          className="absolute bottom-1/4 left-1/4 hidden lg:block animate-float"
          style={{ animationDelay: "2s" }}
        >
          <div className="w-12 h-12 glass-effect rounded-full flex items-center justify-center neon-border cursor-pointer hover:scale-110 transition-all duration-300">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse-glow" />
          </div>
        </div>
      </div>

      {/* Enhanced Gradient Overlays */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-swapeo-navy to-transparent" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-swapeo-navy/50 to-transparent" />
    </section>
  );
};

export default HeroSection;
