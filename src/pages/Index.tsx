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
  Award,
  TrendingUp,
  Shield,
  Users,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Consultante Marketing",
      rating: 5,
      comment:
        "Swapeo m'a permis d'obtenir les liquidités nécessaires pour développer mon activité en quelques heures seulement.",
      year: "2024",
      color: "from-swapeo-primary to-blue-500",
    },
    {
      name: "Thomas A.",
      role: "Développeur Freelance",
      rating: 5,
      comment:
        "Une solution révolutionnaire ! Finalement les auto-entrepreneurs peuvent s'entraider facilement.",
      year: "2024",
      color: "from-blue-500 to-purple-500",
    },
    {
      name: "Marie L.",
      role: "Designer Graphique",
      rating: 5,
      comment:
        "Interface moderne et processus ultra simplifié. J'ai pu financer mon nouveau matériel rapidement.",
      year: "2024",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const faqItems = [
    {
      question: "Comment fonctionne le système de matching ?",
      answer:
        "Notre algorithme analyse automatiquement les demandes et offres de financement selon vos critères (montant, durée, taux) et vous propose des correspondances compatibles en temps réel.",
    },
    {
      question: "Quels sont les délais de traitement ?",
      answer:
        "Une fois le matching effectué et l'accord validé entre les parties, les fonds sont transférés sous 24h ouvrées via notre système de paiement sécurisé.",
    },
    {
      question: "Comment modifier mes informations KYC ?",
      answer:
        "Vous pouvez mettre à jour vos documents de vérification directement depuis votre espace client. Notre équipe valide les modifications sous 48h.",
    },
    {
      question: "Puis-je annuler un swap en cours ?",
      answer:
        "Un swap peut être annulé jusqu'à validation mutuelle des deux parties. Une fois accepté et les fonds transférés, il devient irrévocable selon nos conditions générales.",
    },
  ];

  const pricingFeatures = [
    "✅ Flux de financement instantané",
    "✅ Flux de remboursement automatisé",
    "✅ Matching AI ultra-précis",
    "✅ Support 24/7 inclus",
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "50px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll("[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen swapeo-gradient relative overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <AdvantagesSection />
      <HowItWorksSection />

      {/* Revolutionary Testimonials Section */}
      <section id="temoignages" className="py-24 relative overflow-hidden">
        {/* Enhanced Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-rose-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse-glow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-full px-6 py-3 mb-6">
              <Award className="h-5 w-5 text-violet-400" />
              <span className="text-violet-300 font-medium">
                Témoignages clients
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ils nous font{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-rose-400 animate-text-glow">
                confiance
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Découvrez pourquoi plus de{" "}
              <span className="text-violet-400 font-bold">10,000+</span>{" "}
              entrepreneurs font confiance à Swapeo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 group relative overflow-hidden hover:border-violet-500/50 transition-all duration-500">
                  {/* Enhanced Gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-lg`}
                  />

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg" />

                  {/* Stars with enhanced animation */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                          style={{
                            animation: `pulse 2s infinite ${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Vérifié
                    </div>
                  </div>

                  <blockquote className="text-gray-300 mb-8 leading-relaxed text-lg group-hover:text-white transition-colors duration-500 relative">
                    <span className="text-4xl text-violet-400/30 absolute -top-2 -left-2">
                      "
                    </span>
                    <span className="relative z-10">{testimonial.comment}</span>
                  </blockquote>

                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="relative">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                        <Award className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {testimonial.role}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-violet-400 font-medium text-xs">
                          {testimonial.year}
                        </div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full" />
                        <div className="text-gray-500 text-xs">
                          Client certifié
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced hover glow effect */}
                  <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-violet-500/30 transition-all duration-500" />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/5 via-cyan-500/5 to-rose-500/5 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-20 left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full px-6 py-3 mb-6">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-green-300 font-medium">
                Tarification simple
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Un seul tarif,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 animate-text-glow">
                transparent
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Pas de frais cachés, pas d'abonnement.{" "}
              <span className="text-green-400 font-bold">
                Payez uniquement au succès
              </span>
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-2 border-gray-700/50 p-12 text-center relative overflow-hidden group hover:border-green-500/50 transition-all duration-700 hover:scale-105">
                {/* Enhanced Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  {/* Header with icon */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl md:text-3xl font-bold text-white">
                        Commission unique
                      </div>
                      <div className="text-green-400 font-medium">
                        Payez au succès seulement
                      </div>
                    </div>
                  </div>

                  {/* Price display */}
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 animate-text-glow">
                        1
                      </span>
                      <div className="text-left ml-2">
                        <div className="text-3xl font-bold text-white">%</div>
                        <div className="text-green-400 text-sm font-medium">
                          seulement
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg">
                      Prélevé uniquement lors du{" "}
                      <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-1 rounded">
                        succès de votre swap
                      </span>
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {pricingFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-gray-300 text-left flex items-center bg-gray-800/30 rounded-lg p-3 group-hover:bg-gray-700/30 transition-colors duration-300"
                      >
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                          <Zap className="h-3 w-3 text-green-400" />
                        </div>
                        <span className="text-sm">
                          {feature.replace("✅ ", "")}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg py-4 rounded-xl font-semibold shadow-2xl group relative overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center">
                        Démarrer gratuitement
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                    <p className="text-gray-400 text-sm">
                      <Shield className="inline h-4 w-4 mr-1" />
                      Aucun engagement • Annulation libre
                    </p>
                  </div>
                </div>

                {/* Glow border effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/0 via-green-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Revolutionary FAQ Section */}
      <section id="faq" className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className={`
            text-center mb-16 transition-all duration-1000
            ${isVisible.faq ? "animate-slide-in-from-top" : "opacity-0 translate-y-10"}
          `}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Questions{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-swapeo-primary to-blue-500 animate-text-glow">
                Fréquentes
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card
                key={index}
                className={`
                  swapeo-card p-8 hover-lift group
                  transition-all duration-700
                  ${isVisible.faq ? "animate-slide-in-from-left" : "opacity-0 translate-x-10"}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4 group-hover:text-swapeo-primary transition-colors duration-300 flex items-center">
                  <Zap className="h-5 w-5 text-swapeo-primary mr-3 animate-pulse" />
                  {item.question}
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-white transition-colors duration-300">
                  {item.answer}
                </p>
              </Card>
            ))}
          </div>

          <div
            className={`
            text-center mt-12 transition-all duration-1000 delay-500
            ${isVisible.faq ? "animate-fade-in" : "opacity-0"}
          `}
          >
            <p className="text-gray-300 mb-6 text-lg">
              Vous avez d'autres questions ?
            </p>
            <Button
              variant="outline"
              className="glass-effect neon-border text-lg px-8 py-4 group"
            >
              <span className="flex items-center text-white">
                Voir toute la FAQ
                <Sparkles className="ml-2 h-5 w-5 group-hover:animate-spin transition-all duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Revolutionary Contact Section */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-swapeo-primary/10 rounded-full blur-2xl animate-pulse-glow" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Options */}
            <Card
              className={`
              swapeo-card p-8 hover-tilt
              transition-all duration-1000
              ${isVisible.contact ? "animate-slide-in-from-left" : "opacity-0 translate-x-10"}
            `}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center">
                <Zap className="h-8 w-8 text-swapeo-primary mr-3 animate-pulse" />
                Nous Contacter
              </h3>

              <div className="space-y-6 mb-8">
                {[
                  {
                    icon: Mail,
                    title: "Chat en direct",
                    desc: "Disponible 24/7",
                    action: "Ouvrir le chat",
                    color: "swapeo-primary",
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    desc: "contact@swapeo.com",
                    action: "Envoyer un email",
                    color: "blue-400",
                  },
                  {
                    icon: Phone,
                    title: "Téléphone",
                    desc: "+33 1 76 40 05 32",
                    action: "Appeler maintenant",
                    color: "purple-400",
                  },
                ].map((contact, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center space-x-4 p-4 rounded-lg glass-effect hover:scale-105 transition-all duration-300 cursor-pointer group
                      animate-slide-in-from-bottom
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-12 h-12 bg-${contact.color}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <contact.icon
                        className={`h-6 w-6 text-${contact.color} animate-pulse`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-lg">
                        {contact.title}
                      </div>
                      <div className="text-gray-400">{contact.desc}</div>
                      <button
                        className={`text-${contact.color} text-sm hover:underline font-medium`}
                      >
                        {contact.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Status */}
              <div className="glass-effect border border-swapeo-primary/20 rounded-lg p-6 neon-border">
                <h4 className="text-swapeo-primary font-semibold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 animate-spin-slow" />
                  Statut du Service
                </h4>
                <div className="space-y-3 text-sm">
                  {[
                    {
                      service: "Plateforme Swapeo",
                      status: "Opérationnel",
                      color: "green-400",
                    },
                    {
                      service: "API de matching",
                      status: "Opérationnel",
                      color: "green-400",
                    },
                    {
                      service: "Système de paiement",
                      status: "Opérationnel",
                      color: "green-400",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-300">{item.service}</span>
                      <span className={`text-${item.color} flex items-center`}>
                        <div
                          className={`w-2 h-2 bg-${item.color} rounded-full mr-2 animate-pulse`}
                        />
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-gray-400 text-xs mt-4">
                  ⚡ Dernière mise à jour il y a 30 secondes
                </div>
              </div>
            </Card>

            {/* Support Form */}
            <Card
              className={`
              swapeo-card p-8 hover-tilt
              transition-all duration-1000 delay-200
              ${isVisible.contact ? "animate-slide-in-from-right" : "opacity-0 translate-x-10"}
            `}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center">
                <Sparkles className="h-8 w-8 text-blue-400 mr-3 animate-spin-slow" />
                Nouvelle Demande
              </h3>

              <form className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Sujet
                  </label>
                  <select className="w-full bg-swapeo-navy border border-swapeo-slate/30 rounded-lg px-4 py-3 text-white focus:border-swapeo-primary focus:outline-none transition-all duration-300 hover:border-swapeo-primary/50">
                    <option>Sélectionner un sujet</option>
                    <option>Support technique</option>
                    <option>Question sur les swaps</option>
                    <option>Problème de paiement</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full bg-swapeo-navy border border-swapeo-slate/30 rounded-lg px-4 py-3 text-white focus:border-swapeo-primary focus:outline-none resize-none transition-all duration-300 hover:border-swapeo-primary/50"
                    placeholder="Décrivez votre problème ou question..."
                  ></textarea>
                </div>

                <Button className="w-full swapeo-button text-lg py-4 group">
                  <span className="relative z-10 flex items-center justify-center">
                    Envoyer la demande
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Revolutionary Footer */}
      <footer className="border-t border-swapeo-slate/20 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-swapeo-navy-dark to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-swapeo-primary to-blue-500 rounded-lg flex items-center justify-center neon-border">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-white font-bold text-2xl animate-text-glow">
                  SWAPEO
                </span>
              </div>
              <p className="text-gray-400 max-w-md text-lg leading-relaxed">
                La plateforme de swap de trésorerie{" "}
                <span className="text-swapeo-primary font-semibold">
                  nouvelle génération
                </span>{" "}
                pour auto-entrepreneurs.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Légal</h4>
              <div className="space-y-3">
                {[
                  "Mentions légales",
                  "CGU",
                  "Politique de confidentialité",
                ].map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block text-gray-400 hover:text-swapeo-primary transition-all duration-300 hover-lift"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Contact</h4>
              <div className="space-y-3">
                {[
                  { icon: Mail, text: "contact@swapeo.com" },
                  { icon: Phone, text: "+33 1 76 40 05 32" },
                  { icon: MapPin, text: "Paris, France" },
                ].map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-gray-400 text-sm group hover:text-swapeo-primary transition-colors duration-300"
                  >
                    <contact.icon className="h-4 w-4 group-hover:animate-pulse" />
                    <span>{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-swapeo-slate/20 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm flex items-center justify-center">
              © 2024 Swapeo. Tous droits réservés.
              <Sparkles className="ml-2 h-4 w-4 text-swapeo-primary animate-pulse" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
