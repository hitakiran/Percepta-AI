import { motion } from "framer-motion";

export const LiquidChrome = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 bg-gray-50/50">
      <svg className="hidden">
        <defs>
          <filter id="liquid-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="30s"
                values="0.01 0.01;0.005 0.005;0.01 0.01"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="200"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <motion.div
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ filter: "url(#liquid-filter)" }}
      >
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-blue-200/40 to-indigo-200/40 blur-3xl animate-blob mix-blend-multiply" />
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-purple-200/40 to-pink-200/40 blur-3xl animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-cyan-200/40 to-teal-200/40 blur-3xl animate-blob animation-delay-4000 mix-blend-multiply" />
        <div className="absolute top-[30%] left-[30%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-gray-200/40 to-slate-200/40 blur-3xl animate-blob animation-delay-6000 mix-blend-overlay" />
      </motion.div>
      
      {/* Glass Overlay for sheen */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] mix-blend-overlay pointer-events-none" />

      {/* Animated Lines and Waves Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-40"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M0 400C200 350 400 450 600 400C800 350 1000 250 1200 300C1400 350 1440 400 1440 400V600H0V400Z"
            fill="url(#wave-gradient1)"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            d="M0 500C300 480 500 550 800 500C1100 450 1300 480 1440 520V600H0V500Z"
            fill="url(#wave-gradient2)"
          />
          <defs>
            <linearGradient id="wave-gradient1" x1="720" y1="250" x2="720" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-gradient2" x1="720" y1="450" x2="720" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Lines */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
            style={{ top: `${30 + i * 15}%` }}
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};
