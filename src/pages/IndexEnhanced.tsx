import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Users,
  Globe,
  ChevronRight,
  Play,
  Coffee,
  Heart,
  Target,
  Layers,
  Coins,
  Wallet,
  Building,
  CreditCard,
  BarChart3,
  Lock,
  CheckCircle,
  Timer,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

const IndexEnhanced = () => {
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({ users: 0, volume: 0, transactions: 0 });

  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "25%"]);
  const particlesY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  // Mouse tracking pour les effets organiques
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation des statistiques
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const targetStats = { users: 15420, volume: 2847395, transactions: 8943 };
      const increment = 50;

      const timer = setInterval(() => {
        setStats((current) => ({
          users: Math.min(
            current.users +
              Math.ceil(targetStats.users / (duration / increment)),
            targetStats.users,
          ),
          volume: Math.min(
            current.volume +
              Math.ceil(targetStats.volume / (duration / increment)),
            targetStats.volume,
          ),
          transactions: Math.min(
            current.transactions +
              Math.ceil(targetStats.transactions / (duration / increment)),
            targetStats.transactions,
          ),
        }));
      }, increment);

      setTimeout(() => clearInterval(timer), duration);
    };

    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Rotation automatique des témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Consultante Marketing",
      avatar: "SM",
      rating: 5,
      comment:
        "Swapeo m'a permis d'obtenir les liquidités nécessaires pour développer mon activité en quelques heures seulement.",
      amount: "45 000€",
      color: "from-blue-500 to-cyan-400",
    },
    {
      name: "Thomas A.",
      role: "Développeur Freelance",
      avatar: "TA",
      rating: 5,
      comment:
        "Une solution révolutionnaire ! Finalement les auto-entrepreneurs peuvent s'entraider facilement.",
      amount: "28 000€",
      color: "from-purple-500 to-pink-400",
    },
    {
      name: "Marie L.",
      role: "Designer Graphique",
      avatar: "ML",
      rating: 5,
      comment:
        "Interface moderne et processus ultra simplifié. J'ai pu financer mon nouveau matériel rapidement.",
      amount: "15 000€",
      color: "from-green-500 to-teal-400",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Instantané",
      description: "Financement en moins de 24h",
      gradient: "from-yellow-400 to-orange-500",
      delay: 0.1,
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Cryptage bancaire et KYC vérifié",
      gradient: "from-blue-500 to-indigo-600",
      delay: 0.2,
    },
    {
      icon: Users,
      title: "Communautaire",
      description: "Entraide entre entrepreneurs",
      gradient: "from-green-500 to-emerald-600",
      delay: 0.3,
    },
    {
      icon: TrendingUp,
      title: "Rentable",
      description: "Taux compétitifs pour tous",
      gradient: "from-purple-500 to-violet-600",
      delay: 0.4,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Inscription",
      description: "Créez votre profil en 2 minutes",
      icon: Users,
      color: "text-blue-400",
    },
    {
      number: "02",
      title: "Vérification",
      description: "KYC automatique et sécurisé",
      icon: Shield,
      color: "text-green-400",
    },
    {
      number: "03",
      title: "Matching",
      description: "Algorithme intelligent de pairing",
      icon: Target,
      color: "text-purple-400",
    },
    {
      number: "04",
      title: "Transaction",
      description: "Échange instantané et transparent",
      icon: Zap,
      color: "text-yellow-400",
    },
  ];

  const FloatingOrb = ({ size, color, animation, delay = 0 }) => (
    <motion.div
      className={`absolute rounded-full ${color} filter blur-xl opacity-60`}
      style={{ width: size, height: size }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0.8, 1.2, 0.8],
        opacity: [0.3, 0.6, 0.3],
        x: animation.x,
        y: animation.y,
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );

  const MorphingBackground = () => (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ y: backgroundY }}
    >
      {/* Orbes flottantes organiques */}
      <FloatingOrb
        size="200px"
        color="bg-gradient-to-r from-blue-500/20 to-cyan-400/20"
        animation={{ x: [0, 100, -50, 0], y: [0, -100, 50, 0] }}
        delay={0}
      />
      <FloatingOrb
        size="150px"
        color="bg-gradient-to-r from-purple-500/20 to-pink-400/20"
        animation={{ x: [0, -80, 120, 0], y: [0, 80, -60, 0] }}
        delay={2}
      />
      <FloatingOrb
        size="300px"
        color="bg-gradient-to-r from-green-500/15 to-teal-400/15"
        animation={{ x: [0, 150, -100, 0], y: [0, -50, 100, 0] }}
        delay={4}
      />

      {/* Mesh gradient dynamique */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                      rgba(99, 102, 241, 0.1) 0%, 
                      rgba(168, 85, 247, 0.05) 30%, 
                      transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 2, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particules flottantes */}
      <motion.div className="absolute inset-0" style={{ y: particlesY }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-900 text-white overflow-x-hidden"
    >
      {/* Background morphing */}
      <MorphingBackground />

      {/* Navigation avec effet glassmorphism */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Navigation />
      </motion.div>

      {/* Hero Section Enhanced */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge animé */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>
              <span className="text-sm font-medium">
                Révolution FinTech • +15k entrepreneurs
              </span>
            </motion.div>

            {/* Titre avec effet de révélation */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            >
              <motion.span
                className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                L'avenir du
              </motion.span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                financement
              </motion.span>
            </motion.h1>

            {/* Sous-titre avec animation de frappe */}
            <motion.div
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.p
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 2, ease: "easeInOut" }}
                className="overflow-hidden whitespace-nowrap border-r-2 border-blue-400"
                style={{ display: "inline-block" }}
              >
                Échangez vos liquidités directement entre entrepreneurs
              </motion.p>
            </motion.div>

            {/* CTA Buttons avec effets avancés */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Button className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Commencer maintenant
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-30 -z-10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button
                  variant="outline"
                  className="border-2 border-white/30 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-semibold"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Voir la démo
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats animées */}
            <motion.div
              className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {stats.users.toLocaleString()}+
                </motion.div>
                <div className="text-gray-400">Entrepreneurs</div>
              </motion.div>
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  {Math.floor(stats.volume / 1000)}M€
                </motion.div>
                <div className="text-gray-400">Échangés</div>
              </motion.div>
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  {stats.transactions.toLocaleString()}
                </motion.div>
                <div className="text-gray-400">Transactions</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-400/20 rounded-full"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -180, -360],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.section>

      {/* Features Section avec effets Coinbase Wallet */}
      <motion.section
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <motion.span
                className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Pourquoi Swapeo ?
              </motion.span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Une plateforme révolutionnaire qui transforme la façon dont les
              entrepreneurs gèrent leurs liquidités
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: feature.delay, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative group"
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl h-full relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl`}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Floating icon */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 relative z-10`}
                    animate={
                      hoveredCard === index
                        ? {
                            rotate: [0, -10, 10, 0],
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-4 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 relative z-10">
                    {feature.description}
                  </p>

                  {/* Glow effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl rounded-3xl -z-10`}
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it works avec Timeline animée */}
      <motion.section
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Comment ça fonctionne
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Un processus simple et sécurisé en 4 étapes
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center mb-12 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} w-full`}
                >
                  {/* Content */}
                  <motion.div
                    className={`flex-1 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-2xl">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 mb-4">{step.description}</p>
                      <motion.div
                        className={`inline-flex items-center space-x-2 ${step.color}`}
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <step.icon className="h-5 w-5" />
                        <span className="font-medium">Étape {step.number}</span>
                      </motion.div>
                    </Card>
                  </motion.div>

                  {/* Icon Circle */}
                  <motion.div
                    className="relative z-10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl`}
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(59, 130, 246, 0.5)",
                          "0 0 40px rgba(147, 51, 234, 0.5)",
                          "0 0 20px rgba(59, 130, 246, 0.5)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    {/* Number badge */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5,
                      }}
                    >
                      {step.number}
                    </motion.div>
                  </motion.div>

                  {/* Spacer */}
                  <div className="flex-1" />
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-px h-20 bg-gradient-to-b from-blue-500 to-purple-600 mt-20"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{ top: "100px" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Témoignages avec carrousel fluide */}
      <motion.section
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Découvrez les success stories de notre communauté
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden">
                  {/* Background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentTestimonial].color} opacity-10`}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <div className="relative z-10">
                    {/* Stars */}
                    <motion.div
                      className="flex justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.5 }}
                        >
                          <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 mx-1" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Comment */}
                    <motion.blockquote
                      className="text-2xl md:text-3xl font-medium text-white text-center mb-8 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      "{testimonials[currentTestimonial].comment}"
                    </motion.blockquote>

                    {/* Profile */}
                    <motion.div
                      className="flex items-center justify-center space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-br ${testimonials[currentTestimonial].color} rounded-full flex items-center justify-center font-bold text-white text-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {testimonials[currentTestimonial].avatar}
                      </motion.div>
                      <div className="text-center">
                        <div className="font-semibold text-white text-lg">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-gray-400">
                          {testimonials[currentTestimonial].role}
                        </div>
                        <motion.div
                          className="text-green-400 font-medium mt-1"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {testimonials[currentTestimonial].amount} financés
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <motion.div
              className="flex justify-center space-x-3 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "w-8 bg-blue-500"
                      : "w-3 bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Final avec animation de révélation */}
      <motion.section
        className="py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundSize: "200% 200%" }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl md:text-7xl font-bold mb-6"
              animate={{
                backgroundImage: [
                  "linear-gradient(45deg, #ffffff, #3b82f6)",
                  "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                  "linear-gradient(45deg, #8b5cf6, #ffffff)",
                  "linear-gradient(45deg, #ffffff, #3b82f6)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Rejoignez la révolution
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Plus de 15 000 entrepreneurs nous font déjà confiance pour gérer
              leurs liquidités
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-6 rounded-full text-xl font-semibold shadow-2xl">
                  <span className="flex items-center">
                    Créer mon compte
                    <motion.div
                      className="ml-3"
                      animate={{ x: [0, 10, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
                  </span>
                </Button>
                {/* Multiple glow layers */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 -z-10"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-2 border-white/30 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white px-12 py-6 rounded-full text-xl font-semibold"
                >
                  <Coffee className="h-6 w-6 mr-3" />
                  Prendre un café
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer avec effets subtils */}
      <motion.footer
        className="bg-gray-900/80 backdrop-blur-xl border-t border-white/10 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo et description */}
            <motion.div
              className="md:col-span-2"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-white font-bold text-xl">S</span>
                </motion.div>
                <span className="text-2xl font-bold text-white">Swapeo</span>
              </motion.div>
              <p className="text-gray-400 mb-6 max-w-md">
                La plateforme révolutionnaire qui permet aux entrepreneurs
                d'échanger leurs liquidités directement, sans intermédiaires.
              </p>
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {[Heart, Users, Globe].map((Icon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer group"
                  >
                    <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">Produit</h3>
              <div className="space-y-3">
                {["Fonctionnalités", "Tarifs", "Sécurité", "API"].map(
                  (item, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="block text-gray-400 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-3">
                <motion.div
                  className="flex items-center space-x-3 text-gray-400"
                  whileHover={{ x: 5, color: "#ffffff" }}
                >
                  <Mail className="h-4 w-4" />
                  <span>hello@swapeo.fr</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-3 text-gray-400"
                  whileHover={{ x: 5, color: "#ffffff" }}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Paris, France</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-3 text-gray-400"
                  whileHover={{ x: 5, color: "#ffffff" }}
                >
                  <Phone className="h-4 w-4" />
                  <span>+33 1 23 45 67 89</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              © 2024 Swapeo. Tous droits réservés. Révolutionnons ensemble
              l'avenir de la finance.
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default IndexEnhanced;
