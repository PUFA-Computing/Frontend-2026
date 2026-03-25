import type { Config } from "tailwindcss";

const config = {
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
            screens: { "2xl": "1400px" },
        },
        extend: {
            fontFamily: {
                display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
                hero:    ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
                serif:   ["var(--font-serif)",   "Lora", "Times New Roman", "Georgia", "serif"],
                sans:    ["var(--font-sans)",     "system-ui", "sans-serif"],
            },
            colors: {
                // Parchment / cream palette
                parchment: {
                    DEFAULT: "#F5EDD0",
                    deep:    "#EDE0BB",
                    light:   "#FAF5E8",
                    card:    "#F0E6C8",
                },
                // Navy ink
                navy: {
                    DEFAULT: "#0D1B3E",
                    mid:     "#152347",
                    light:   "#1E3360",
                    muted:   "#2A4488",
                    200:     "#3D5AA0",
                },
                // Gold accent
                gold: {
                    DEFAULT: "#B8841E",
                    warm:    "#C9922A",
                    light:   "#D9A84A",
                    pale:    "#EDD085",
                    200:     "#F5D98A",
                },
                ink: {
                    DEFAULT: "#1A1A2E",
                    muted:   "#3D3D5C",
                    faint:   "#7A7A9A",
                },

                // Shadcn/Radix compat
                border:      "hsl(var(--border))",
                input:       "hsl(var(--input))",
                ring:        "hsl(var(--ring))",
                background:  "hsl(var(--background))",
                foreground:  "hsl(var(--foreground))",
                primary: {
                    DEFAULT:    "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT:    "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT:    "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT:    "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT:    "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT:    "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT:    "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to:   { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to:   { height: "0" },
                },
                "caret-blink": {
                    "0%,70%,100%": { opacity: "1" },
                    "20%,50%":     { opacity: "0" },
                },
                "spin-once": {
                    "0%":   { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
                "fade-in-left": {
                    "0%":   { opacity: "0", transform: "translateX(-2rem)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                "fade-in-right": {
                    "0%":   { opacity: "0", transform: "translateX(2rem)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                floatY: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%":      { transform: "translateY(-7px)" },
                },
                glowPulse: {
                    "0%, 100%": { boxShadow: "0 0 16px rgba(184,132,30,0.25)" },
                    "50%":      { boxShadow: "0 0 32px rgba(201,146,42,0.5)" },
                },
            },
            animation: {
                "accordion-down":  "accordion-down 0.2s ease-out",
                "accordion-up":    "accordion-up 0.2s ease-out",
                "spin-once":       "spin-once 0.5s ease-in-out",
                "fade-in-left":    "fade-in-left 0.7s ease-out",
                "fade-in-right":   "fade-in-right 0.7s ease-out",
                "float":           "floatY 4s ease-in-out infinite",
                "glow-pulse":      "glowPulse 2.5s ease-in-out infinite",
            },
            backgroundImage: {
                "gold-gradient":  "linear-gradient(135deg, #B8841E, #C9922A, #EDD085)",
                "parch-gradient": "linear-gradient(180deg, #FAF5E8 0%, #F5EDD0 100%)",
                "navy-gradient":  "linear-gradient(180deg, #0D1B3E 0%, #080F22 100%)",
            },
            boxShadow: {
                "gold-sm":    "0 2px 8px rgba(184, 132, 30, 0.18)",
                "gold-md":    "0 4px 20px rgba(184, 132, 30, 0.28)",
                "gold-lg":    "0 8px 40px rgba(184, 132, 30, 0.38)",
                "parch-sm":   "0 2px 8px rgba(26, 26, 46, 0.07)",
                "parch-md":   "0 4px 20px rgba(26, 26, 46, 0.10)",
                "parch-lg":   "0 8px 40px rgba(26, 26, 46, 0.14)",
                "navy-md":    "0 8px 32px rgba(8, 15, 34, 0.4)",
                "navy-lg":    "0 16px 64px rgba(8, 15, 34, 0.6)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
