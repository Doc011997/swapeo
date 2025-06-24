import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Smartphone,
  Wifi,
  WifiOff,
  Bell,
  Share,
  Star,
  X,
  Home,
  Zap,
} from "lucide-react";

interface PWAFeaturesProps {
  user?: any;
  userLevel?: any;
  totalPoints?: number;
  streakDays?: number;
}

const PWAFeatures = ({
  user,
  userLevel,
  totalPoints,
  streakDays,
}: PWAFeaturesProps) => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotificationPermission, setShowNotificationPermission] =
    useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    "Notification" in window ? Notification.permission : "denied",
  );
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Détecter si l'app est installée
    const isInStandaloneMode = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    setIsInstalled(isInStandaloneMode);

    // Écouteur pour l'installation PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Écouteur pour le statut en ligne/hors ligne
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Vérifier les permissions de notification
    if ("Notification" in window && Notification.permission === "default") {
      setTimeout(() => setShowNotificationPermission(true), 3000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallPrompt(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setShowNotificationPermission(false);

      if (permission === "granted") {
        // Notification de bienvenue
        new Notification("🎉 Notifications activées !", {
          body: "Vous recevrez maintenant des alertes pour vos swaps et activités.",
          icon: "/icon-192x192.png",
          badge: "/icon-72x72.png",
        });
      }
    }
  };

  const sendTestNotification = () => {
    if (notificationPermission === "granted") {
      new Notification("🚀 Test de notification", {
        body: `Bonjour ${user?.firstName} ! Votre niveau ${userLevel?.level} vous attend.`,
        icon: "/icon-192x192.png",
        badge: "/icon-72x72.png",
        data: { url: "/dashboard" },
      });
    }
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Swapeo - Plateforme de Swaps Financiers",
          text: "Découvrez Swapeo, la révolution des échanges financiers !",
          url: window.location.origin,
        });
      } catch (error) {
        console.log("Partage annulé");
      }
    } else {
      // Fallback pour copier le lien
      navigator.clipboard.writeText(window.location.origin);
      alert("Lien copié dans le presse-papiers !");
    }
  };

  return (
    <div className="space-y-4">
      {/* Widget Home Screen (si installé) */}
      {isInstalled && (
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Home className="h-4 w-4 mr-2 text-blue-600" />
              Widget Écran d'Accueil
            </h3>
            <Badge className="bg-blue-100 text-blue-700">PWA Active</Badge>
          </div>

          <div className="bg-white rounded-lg p-3 border-2 border-dashed border-blue-200">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-900">
                  {user?.firstName} • Lv.{userLevel?.level}
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                  <span className="text-green-600 font-semibold">
                    {totalPoints} pts
                  </span>
                  <span className="text-orange-600 font-semibold">
                    {streakDays} jours
                  </span>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-1 mx-auto">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full"
                    style={{
                      width: `${userLevel ? (userLevel.currentXP / userLevel.requiredXP) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-2 text-center">
            Ajoutez à votre écran d'accueil pour un accès rapide !
          </p>
        </Card>
      )}

      {/* Status en ligne/hors ligne */}
      <Card
        className={`p-3 ${isOnline ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
      >
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${isOnline ? "text-green-700" : "text-red-700"}`}
          >
            {isOnline ? "En ligne" : "Mode hors ligne"}
          </span>
          {!isOnline && (
            <Badge className="bg-yellow-100 text-yellow-700 text-xs">
              Données en cache disponibles
            </Badge>
          )}
        </div>
        {!isOnline && (
          <p className="text-xs text-red-600 mt-1">
            Certaines fonctionnalités peuvent être limitées
          </p>
        )}
      </Card>

      {/* Actions PWA */}
      <div className="grid grid-cols-2 gap-2">
        {notificationPermission === "granted" && (
          <Button
            variant="outline"
            size="sm"
            onClick={sendTestNotification}
            className="text-xs"
          >
            <Bell className="h-3 w-3 mr-1" />
            Test Notif
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={shareApp}
          className="text-xs"
        >
          <Share className="h-3 w-3 mr-1" />
          Partager
        </Button>
      </div>

      {/* Prompt d'installation */}
      <AnimatePresence>
        {showInstallPrompt && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <Card className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Installer Swapeo</h4>
                    <p className="text-sm opacity-90">
                      Accès rapide depuis votre écran d'accueil
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 flex-shrink-0"
                  onClick={() => setShowInstallPrompt(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button
                  onClick={handleInstallApp}
                  className="bg-white text-purple-600 hover:bg-gray-100 flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-white hover:bg-white/20"
                >
                  Plus tard
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt de notification */}
      <AnimatePresence>
        {showNotificationPermission && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 left-4 right-4 z-50"
          >
            <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <h4 className="font-semibold">Activer les notifications</h4>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowNotificationPermission(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Recevez des alertes pour vos swaps, paiements et opportunités
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={handleNotificationPermission}
                  className="bg-white text-orange-600 hover:bg-gray-100 flex-1"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Activer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowNotificationPermission(false)}
                  className="text-white hover:bg-white/20"
                >
                  Ignorer
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PWAFeatures;
