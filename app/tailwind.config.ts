import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#08080A",
        surface: "#121215",
        surface2: "#1A1A1F",
        ink: "#F5F4F0",
        muted: "#9A9A9E",
        line: "rgba(245,244,240,0.09)",
        onair: "#FF4F3A",
        gold: "#D9A857",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      backgroundImage: {
        "studio-glow":
          "radial-gradient(60% 60% at 70% 30%, rgba(255,79,58,0.18) 0%, rgba(255,79,58,0) 60%), radial-gradient(50% 50% at 20% 80%, rgba(217,168,87,0.14) 0%, rgba(217,168,87,0) 60%)",
      },
      keyframes: {
        eq1: { "0%,100%": { height: "20%" }, "50%": { height: "90%" } },
        eq2: { "0%,100%": { height: "60%" }, "50%": { height: "25%" } },
        eq3: { "0%,100%": { height: "35%" }, "50%": { height: "100%" } },
        eq4: { "0%,100%": { height: "80%" }, "50%": { height: "40%" } },
        eq5: { "0%,100%": { height: "45%" }, "50%": { height: "70%" } },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "blur-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(18px) scale(0.98)",
            filter: "blur(14px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
            filter: "blur(0px)",
          },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "blur-breathe": {
          "0%,100%": { filter: "blur(0px)", opacity: "1" },
          "50%": { filter: "blur(2.5px)", opacity: "0.8" },
        },
      },
      animation: {
        eq1: "eq1 1.1s ease-in-out infinite",
        eq2: "eq2 0.9s ease-in-out infinite",
        eq3: "eq3 1.3s ease-in-out infinite",
        eq4: "eq4 1.0s ease-in-out infinite",
        eq5: "eq5 1.2s ease-in-out infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "blur-up": "blur-up 1.1s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        "blur-breathe": "blur-breathe 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
