import { useState, useEffect, useRef } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Zap,
  Heart,
  Archive,
  Trash2,
} from "lucide-react";

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}

export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = "",
}: SwipeableCardProps) => {
  const [isActioning, setIsActioning] = useState(false);
  const [actionType, setActionType] = useState<
    "left" | "right" | "up" | "down" | null
  >(null);
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 100;
    const { offset, velocity } = info;

    // Déterminer la direction de swipe
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Swipe horizontal
      if (offset.x > threshold || velocity.x > 500) {
        // Swipe droite
        setActionType("right");
        setIsActioning(true);
        controls.start({
          x: window.innerWidth,
          opacity: 0,
          transition: { duration: 0.3 },
        });
        setTimeout(() => {
          onSwipeRight?.();
          resetCard();
        }, 300);
      } else if (offset.x < -threshold || velocity.x < -500) {
        // Swipe gauche
        setActionType("left");
        setIsActioning(true);
        controls.start({
          x: -window.innerWidth,
          opacity: 0,
          transition: { duration: 0.3 },
        });
        setTimeout(() => {
          onSwipeLeft?.();
          resetCard();
        }, 300);
      } else {
        // Retour à la position initiale
        controls.start({ x: 0, y: 0 });
      }
    } else {
      // Swipe vertical
      if (offset.y > threshold || velocity.y > 500) {
        // Swipe bas
        setActionType("down");
        setIsActioning(true);
        controls.start({
          y: window.innerHeight,
          opacity: 0,
          transition: { duration: 0.3 },
        });
        setTimeout(() => {
          onSwipeDown?.();
          resetCard();
        }, 300);
      } else if (offset.y < -threshold || velocity.y < -500) {
        // Swipe haut
        setActionType("up");
        setIsActioning(true);
        controls.start({
          y: -window.innerHeight,
          opacity: 0,
          transition: { duration: 0.3 },
        });
        setTimeout(() => {
          onSwipeUp?.();
          resetCard();
        }, 300);
      } else {
        // Retour à la position initiale
        controls.start({ x: 0, y: 0 });
      }
    }
  };

  const resetCard = () => {
    setTimeout(() => {
      controls.set({ x: 0, y: 0, opacity: 1 });
      setIsActioning(false);
      setActionType(null);
    }, 100);
  };

  const getActionIcon = () => {
    switch (actionType) {
      case "left":
        return <Archive className="h-8 w-8 text-orange-600" />;
      case "right":
        return <Heart className="h-8 w-8 text-red-600" />;
      case "up":
        return <Zap className="h-8 w-8 text-blue-600" />;
      case "down":
        return <Trash2 className="h-8 w-8 text-gray-600" />;
      default:
        return null;
    }
  };

  const getActionText = () => {
    switch (actionType) {
      case "left":
        return "Archiver";
      case "right":
        return "Favoris";
      case "up":
        return "Action rapide";
      case "down":
        return "Supprimer";
      default:
        return "";
    }
  };

  return (
    <div className="relative">
      <motion.div
        ref={cardRef}
        className={`${className} cursor-grab active:cursor-grabbing`}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileDrag={{ scale: 1.05, rotateZ: 5 }}
        style={{ touchAction: "none" }}
      >
        {children}
      </motion.div>

      {/* Indicateur d'action */}
      {isActioning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg backdrop-blur-sm"
        >
          <div className="text-center text-white">
            {getActionIcon()}
            <p className="text-sm font-semibold mt-2">{getActionText()}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const maxPull = 100;

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(info.offset.y, maxPull));
    }
  };

  const handleDragEnd = async (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > 80 && window.scrollY === 0) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <motion.div
      className="relative"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ y: isRefreshing ? 60 : 0 }}
    >
      {/* Indicateur de refresh */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-blue-50"
        style={{
          height: Math.max(pullDistance, isRefreshing ? 60 : 0),
          opacity: pullDistance > 20 || isRefreshing ? 1 : 0,
        }}
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={{
            duration: 1,
            repeat: isRefreshing ? Infinity : 0,
            ease: "linear",
          }}
        >
          <RotateCcw
            className={`h-6 w-6 ${isRefreshing ? "text-blue-600" : "text-gray-400"}`}
          />
        </motion.div>
        <span className="ml-2 text-sm font-medium text-gray-600">
          {isRefreshing
            ? "Actualisation..."
            : pullDistance > 80
              ? "Relâchez pour actualiser"
              : "Tirez pour actualiser"}
        </span>
      </motion.div>

      <div style={{ marginTop: isRefreshing ? 60 : 0 }}>{children}</div>
    </motion.div>
  );
};

interface HapticFeedbackProps {
  type: "light" | "medium" | "heavy" | "success" | "warning" | "error";
  children: React.ReactNode;
  onPress?: () => void;
}

export const HapticFeedback = ({
  type,
  children,
  onPress,
}: HapticFeedbackProps) => {
  const triggerHaptic = () => {
    // Vérifier si les vibrations sont supportées
    if ("vibrate" in navigator) {
      switch (type) {
        case "light":
          navigator.vibrate(10);
          break;
        case "medium":
          navigator.vibrate(25);
          break;
        case "heavy":
          navigator.vibrate(50);
          break;
        case "success":
          navigator.vibrate([25, 25, 50]);
          break;
        case "warning":
          navigator.vibrate([50, 25, 25]);
          break;
        case "error":
          navigator.vibrate([100, 25, 100]);
          break;
      }
    }

    onPress?.();
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onTapStart={triggerHaptic}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

// Hook pour les gestes de navigation
export const useSwipeNavigation = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
) => {
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      // Vérifier si c'est un swipe horizontal
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe gauche
          onSwipeLeft?.();
        } else {
          // Swipe droite
          onSwipeRight?.();
        }
      }

      startX = 0;
      startY = 0;
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
};

export default {
  SwipeableCard,
  PullToRefresh,
  HapticFeedback,
  useSwipeNavigation,
};
