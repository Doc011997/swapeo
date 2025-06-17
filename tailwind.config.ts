import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Swapeo brand colors
        swapeo: {
          primary: "#1bc870",
          "primary-dark": "#0f9954",
          "primary-light": "#4dd88a",
          navy: "#1a1d3a",
          "navy-light": "#2d3157",
          "navy-dark": "#0f1125",
          purple: "#3b2b5d",
          "purple-light": "#4a3970",
          "purple-dark": "#2d1f4a",
          slate: "#64748b",
          "slate-light": "#94a3b8",
          "slate-dark": "#475569",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            "animation-timing-function": "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "none",
            "animation-timing-function": "cubic-bezier(0,0,0.2,1)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scale: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        "logo-explode": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": {
            transform: "scale(1.3) rotate(90deg)",
            filter: "hue-rotate(0deg)",
          },
          "50%": {
            transform: "scale(0.8) rotate(180deg)",
            filter: "hue-rotate(180deg)",
          },
          "75%": {
            transform: "scale(1.2) rotate(270deg)",
            filter: "hue-rotate(360deg)",
          },
          "100%": {
            transform: "scale(1) rotate(360deg)",
            filter: "hue-rotate(0deg)",
          },
        },
        "float-particle": {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px)",
            opacity: "0",
          },
          "10%": { opacity: "1" },
          "50%": {
            transform: "translateY(-100px) translateX(50px)",
            opacity: "1",
          },
          "90%": { opacity: "1" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "75%": { transform: "rotate(-5deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        "magnetic-pull": {
          "0%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-5px) scale(1.02)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "neon-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px #1bc870, 0 0 10px #1bc870, 0 0 15px #1bc870",
          },
          "50%": {
            boxShadow: "0 0 20px #1bc870, 0 0 30px #1bc870, 0 0 40px #1bc870",
          },
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 20px rgba(27, 200, 112, 0.5)" },
          "50%": {
            textShadow:
              "0 0 30px rgba(27, 200, 112, 0.8), 0 0 40px rgba(27, 200, 112, 0.3)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "spin-reverse": "spin-reverse 2s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.5s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.5s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.5s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.5s ease-out",
        scale: "scale 0.5s ease-out",
        "logo-explode":
          "logo-explode 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "float-particle": "float-particle 6s ease-in-out infinite",
        wave: "wave 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "magnetic-pull": "magnetic-pull 0.3s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "matrix-rain": "matrix-rain 3s linear infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "text-glow": "text-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "shimmer-gradient":
          "linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.5) 50%, transparent 60%)",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      transformOrigin: {
        "center-center": "center center",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
