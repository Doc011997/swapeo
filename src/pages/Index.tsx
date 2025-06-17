import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Mail, MapPin, Phone } from "lucide-react";

const Index = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Consultante Marketing",
      rating: 5,
      comment:
        "Swapeo m'a permis d'obtenir les liquidités nécessaires pour développer mon activité en quelques heures seulement.",
      year: "2024",
    },
    {
      name: "Thomas A.",
      role: "Développeur Freelance",
      rating: 5,
      comment:
        "Une solution révolutionnaire ! Finalement les auto-entrepreneurs peuvent s'entraider facilement.",
      year: "2024",
    },
    {
      name: "Marie L.",
      role: "Designer Graphique",
      rating: 5,
      comment:
        "Interface moderne et processus ultra simplifié. J'ai pu financer mon nouveau matériel rapidement.",
      year: "2024",
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
    "✅ Flux de financement",
    "✅ Flux de Remboursement",
  ];

  return (
    <div className="min-h-screen swapeo-gradient">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <AdvantagesSection />
      <HowItWorksSection />

      {/* Testimonials Section */}
      <section id="temoignages" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Témoignages <span className="text-swapeo-primary">Clients</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez ce que pensent nos utilisateurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="swapeo-card p-6 group hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-swapeo-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                    <div className="text-swapeo-primary text-sm">
                      {testimonial.year}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tarification{" "}
              <span className="text-swapeo-primary">Transparente</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Des frais simples et équitables pour tous
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="swapeo-card p-8 text-center">
              <div className="text-2xl font-bold text-white mb-2">
                Frais de plateforme
              </div>
              <div className="text-4xl font-bold text-swapeo-primary mb-6">
                1%
              </div>
              <p className="text-gray-300 mb-8">
                Prélevé uniquement lors du succès du swap
              </p>

              <div className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <div key={index} className="text-gray-300 text-left">
                    {feature}
                  </div>
                ))}
              </div>

              <Button className="w-full swapeo-button">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions <span className="text-swapeo-primary">Fréquentes</span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="swapeo-card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">{item.answer}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4">Vous avez d'autres questions ?</p>
            <Button variant="outline" className="swapeo-button-outline">
              Voir toutes la FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* Contact/Support Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="swapeo-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Nous Contacter
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-swapeo-primary/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-swapeo-primary" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Chat en direct</div>
                    <div className="text-gray-400 text-sm">Disponible 24/7</div>
                    <button className="text-swapeo-primary text-sm hover:underline">
                      Ouvrir le chat
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-swapeo-primary/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-swapeo-primary" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Email</div>
                    <div className="text-gray-400 text-sm">
                      contact@swapeo.com
                    </div>
                    <button className="text-swapeo-primary text-sm hover:underline">
                      Envoyer un email
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-swapeo-primary/20 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-swapeo-primary" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Téléphone</div>
                    <div className="text-gray-400 text-sm">
                      +33 1 76 40 05 32
                    </div>
                    <button className="text-swapeo-primary text-sm hover:underline">
                      Appeler maintenant
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-swapeo-primary/10 border border-swapeo-primary/20 rounded-lg p-4">
                <h4 className="text-swapeo-primary font-semibold mb-2">
                  Statut du Service
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Plateforme Swapeo</span>
                    <span className="text-green-400">Opérationnel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">API de matching</span>
                    <span className="text-green-400">Opérationnel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Système de paiement</span>
                    <span className="text-green-400">Opérationnel</span>
                  </div>
                </div>
                <div className="text-gray-400 text-xs mt-3">
                  Dernière mise à jour il y a 3 minutes
                </div>
              </div>
            </Card>

            {/* Support Form */}
            <Card className="swapeo-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Nouvelle Demande
              </h3>

              <form className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Sujet
                  </label>
                  <select className="w-full bg-swapeo-navy border border-swapeo-slate/30 rounded-lg px-4 py-3 text-white focus:border-swapeo-primary focus:outline-none">
                    <option>Sélectionner un sujet</option>
                    <option>Support technique</option>
                    <option>Question sur les swaps</option>
                    <option>Problème de paiement</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-swapeo-navy border border-swapeo-slate/30 rounded-lg px-4 py-3 text-white focus:border-swapeo-primary focus:outline-none resize-none"
                    placeholder="Décrivez votre problème ou question..."
                  ></textarea>
                </div>

                <Button className="w-full swapeo-button">
                  Envoyer la demande
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-swapeo-slate/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-swapeo-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-white font-bold text-xl">SWAPEO</span>
              </div>
              <p className="text-gray-400 max-w-md">
                La plateforme de swap de trésorerie nouvelle génération pour
                auto-entrepreneurs.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-400 hover:text-swapeo-primary transition-colors"
                >
                  Mentions légales
                </a>
                <a
                  href="#"
                  className="block text-gray-400 hover:text-swapeo-primary transition-colors"
                >
                  CGU
                </a>
                <a
                  href="#"
                  className="block text-gray-400 hover:text-swapeo-primary transition-colors"
                >
                  Politique de confidentialité
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>contact@swapeo.com</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>+33 1 76 40 05 32</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Paris, France</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-swapeo-slate/20 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Swapeo. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
