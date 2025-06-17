import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import InteractiveLogo from "./InteractiveLogo";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Concept", href: "#concept" },
    { label: "Avantages", href: "#avantages" },
    { label: "Réseau", href: "#reseau" },
    { label: "Témoignages", href: "#temoignages" },
    { label: "FAQ", href: "#faq" },
    { label: "Connexion", href: "#connexion" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-swapeo-slate/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Revolutionary Interactive Logo */}
          <InteractiveLogo
            size="md"
            showText={true}
            className="animate-slide-in-from-left"
          />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.slice(0, -1).map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-gray-300 hover:text-swapeo-primary transition-all duration-300 hover-lift group animate-slide-in-from-top"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-swapeo-primary to-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4 animate-slide-in-from-right">
            <a
              href="#connexion"
              className="text-gray-300 hover:text-white transition-all duration-300 hover-lift relative group"
            >
              Connexion
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-swapeo-primary group-hover:w-full transition-all duration-300" />
            </a>
            <Button className="swapeo-button group relative overflow-hidden">
              <span className="relative z-10">Rejoindre</span>
              <div className="absolute inset-0 bg-gradient-to-r from-swapeo-primary-light to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-swapeo-primary/20 transition-all duration-300 hover:scale-110"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 animate-spin" />
              ) : (
                <Menu className="h-6 w-6 animate-pulse" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-in-from-top">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-swapeo-slate/20 glass-effect">
              {menuItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-swapeo-primary hover:bg-swapeo-primary/10 rounded-lg transition-all duration-300 hover-lift animate-slide-in-from-left"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 animate-fade-in">
                <Button className="w-full swapeo-button">Rejoindre</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animated border line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-swapeo-primary to-transparent animate-shimmer" />
    </nav>
  );
};

export default Navigation;
