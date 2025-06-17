import { useState, useEffect } from "react";
import { Zap, Cpu, Globe, Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const InteractiveLogo = ({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const handleClick = () => {
    setIsClicked(true);
    setClickCount((prev) => prev + 1);

    // Generate explosion particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);

    // Reset animation
    setTimeout(() => {
      setIsClicked(false);
      setParticles([]);
    }, 800);
  };

  // Special effects for multiple clicks
  useEffect(() => {
    if (clickCount >= 5) {
      document.body.style.animation = "pulse-glow 0.5s ease-out";
      setTimeout(() => {
        document.body.style.animation = "";
        setClickCount(0);
      }, 500);
    }
  }, [clickCount]);

  const getLogoIcon = () => {
    switch (clickCount % 4) {
      case 1:
        return <Zap className="w-full h-full" />;
      case 2:
        return <Cpu className="w-full h-full" />;
      case 3:
        return <Globe className="w-full h-full" />;
      default:
        return <span className="text-white font-bold">S</span>;
    }
  };

  const getSpecialEffect = () => {
    if (clickCount >= 3 && clickCount < 5) {
      return "animate-neon-pulse";
    }
    if (clickCount >= 5) {
      return "animate-text-glow";
    }
    return "";
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Interactive Logo */}
      <div className="relative">
        <div
          className={`
            ${sizeClasses[size]} 
            bg-gradient-to-br from-swapeo-primary via-swapeo-primary-light to-swapeo-primary-dark
            rounded-xl 
            flex items-center justify-center 
            cursor-pointer
            transition-all duration-500 ease-out
            relative overflow-hidden
            swapeo-logo
            ${isClicked ? "animate-logo-explode" : ""}
            ${isHovered ? "scale-110 shadow-2xl shadow-swapeo-primary/50" : ""}
            ${getSpecialEffect()}
            hover:rotate-12
            hover-lift
          `}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />

          {/* Rotating border */}
          <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-swapeo-primary via-purple-500 to-blue-500 animate-spin-slow opacity-0 hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-swapeo-primary via-swapeo-primary-light to-swapeo-primary-dark" />

          {/* Logo content */}
          <div className="relative z-10 transition-all duration-300">
            {getLogoIcon()}
          </div>

          {/* Click particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-swapeo-primary rounded-full animate-float-particle"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(${particle.x}px, ${particle.y}px)`,
              }}
            />
          ))}

          {/* Sparkle effects */}
          {isHovered && (
            <>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              <Sparkles
                className="absolute -bottom-1 -left-1 w-3 h-3 text-blue-400 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}
        </div>

        {/* Ripple effect */}
        {isClicked && (
          <div className="absolute inset-0 rounded-xl border-2 border-swapeo-primary animate-ping" />
        )}
      </div>

      {/* Text */}
      {showText && (
        <span
          className={`
            text-white font-bold 
            ${textSizeClasses[size]}
            transition-all duration-300
            ${isHovered ? "animate-wave glow-text" : ""}
            ${getSpecialEffect()}
          `}
        >
          SWAPEO
        </span>
      )}

      {/* Easter egg message */}
      {clickCount >= 10 && (
        <div className="fixed top-4 right-4 bg-swapeo-primary text-white px-4 py-2 rounded-lg animate-slide-in-from-right z-50">
          🎉 Logo Master! You've unlocked the secret!
        </div>
      )}
    </div>
  );
};

export default InteractiveLogo;
