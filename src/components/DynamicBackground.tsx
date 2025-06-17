import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const DynamicBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Mouse tracking for interactive effects
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.5 ? "#1bc870" : "#3b82f6",
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          x:
            particle.x < 0
              ? window.innerWidth
              : particle.x > window.innerWidth
                ? 0
                : particle.x,
          y:
            particle.y < 0
              ? window.innerHeight
              : particle.y > window.innerHeight
                ? 0
                : particle.y,
        })),
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Dynamic mouse-following gradient */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(27, 200, 112, 0.1), 
            transparent 40%)`,
        }}
      />

      {/* Rotating dashed circles */}
      <div className="absolute inset-0">
        {/* Large outer circle */}
        <div
          className="dynamic-circle"
          style={{
            width: "800px",
            height: "800px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderColor: "rgba(27, 200, 112, 0.2)",
            borderWidth: "3px",
            animationDuration: "30s",
          }}
        />

        {/* Medium circle */}
        <div
          className="dynamic-circle dynamic-circle-reverse"
          style={{
            width: "600px",
            height: "600px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderColor: "rgba(59, 130, 246, 0.3)",
            borderWidth: "2px",
            animationDuration: "20s",
          }}
        />

        {/* Inner circle */}
        <div
          className="dynamic-circle"
          style={{
            width: "400px",
            height: "400px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderColor: "rgba(147, 51, 234, 0.2)",
            borderWidth: "2px",
            animationDuration: "15s",
          }}
        />

        {/* Small central circle */}
        <div
          className="dynamic-circle dynamic-circle-reverse"
          style={{
            width: "200px",
            height: "200px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderColor: "rgba(27, 200, 112, 0.4)",
            borderWidth: "1px",
            animationDuration: "10s",
          }}
        />
      </div>

      {/* Additional decorative circles at different positions */}
      <div className="absolute top-20 left-10">
        <div
          className="dynamic-circle"
          style={{
            width: "300px",
            height: "300px",
            borderColor: "rgba(27, 200, 112, 0.1)",
            borderWidth: "2px",
            animationDuration: "25s",
          }}
        />
      </div>

      <div className="absolute bottom-20 right-10">
        <div
          className="dynamic-circle dynamic-circle-reverse"
          style={{
            width: "250px",
            height: "250px",
            borderColor: "rgba(59, 130, 246, 0.15)",
            borderWidth: "2px",
            animationDuration: "18s",
          }}
        />
      </div>

      <div className="absolute top-1/3 right-1/4">
        <div
          className="dynamic-circle"
          style={{
            width: "150px",
            height: "150px",
            borderColor: "rgba(147, 51, 234, 0.2)",
            borderWidth: "1px",
            animationDuration: "12s",
          }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full transition-all duration-1000 ease-out"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animation: `float-particle ${6 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-swapeo-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-swapeo-purple/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl animate-pulse-glow" />
      <div className="absolute bottom-1/3 left-3/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />

      {/* Matrix-like effect lines */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-swapeo-primary to-transparent"
            style={{
              left: `${20 + i * 15}%`,
              height: "100%",
              animation: `matrix-rain ${3 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Pulsing grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(27, 200, 112, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(27, 200, 112, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
};

export default DynamicBackground;
