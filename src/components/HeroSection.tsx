import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with geometric patterns */}
      <div className="absolute inset-0 swapeo-gradient">
        {/* Animated circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-swapeo-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-swapeo-purple/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-swapeo-slate/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-swapeo-slate/10 rounded-full"></div>
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Hero badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-swapeo-primary/20 border border-swapeo-primary/30 text-swapeo-primary text-sm font-medium mb-8">
          🚀 RÉVOLUTION FINANCIÈRE
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Swap de trésorerie
          <br />
          <span className="text-swapeo-primary">nouvelle génération</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Accédez à la liquidité instantanément grâce à notre technologie
          d'échange sécurisé entre auto-entrepreneurs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button className="swapeo-button text-lg px-8 py-4 h-auto group">
            Commencer gratuitement
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            className="swapeo-button-outline text-lg px-8 py-4 h-auto"
          >
            Découvrir
            <ChevronDown className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center">
          <p className="text-gray-400 text-sm mb-4">
            Découvrir comment ça marche
          </p>
          <ChevronDown className="h-6 w-6 text-swapeo-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
