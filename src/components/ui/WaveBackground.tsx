import { motion } from "framer-motion";

export const WaveBackground = () => {
  return (
    <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden -z-10 opacity-30 pointer-events-none">
      <svg
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M0 400C200 350 400 450 600 400C800 350 1000 250 1200 300C1400 350 1440 400 1440 400V600H0V400Z"
          fill="url(#gradient1)"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          d="M0 500C300 480 500 550 800 500C1100 450 1300 480 1440 520V600H0V500Z"
          fill="url(#gradient2)"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.2 }}
          d="M0 300C250 350 500 250 750 300C1000 350 1250 200 1440 250V600H0V300Z"
          fill="url(#gradient3)"
        />
        <defs>
          <linearGradient id="gradient1" x1="720" y1="250" x2="720" y2="600" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="720" y1="450" x2="720" y2="600" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient3" x1="720" y1="200" x2="720" y2="600" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1f2937" stopOpacity="0.08" />
            <stop offset="1" stopColor="#1f2937" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Animated wave lines */}
      <div className="absolute inset-0">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent ${i === 2 ? 'via-gray-500/20' : 'via-blue-400/20'} to-transparent`}
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
        
        {/* Subtle moving dark streak */}
        <motion.div 
          className="absolute top-[20%] left-[-50%] w-[100%] h-32 bg-gradient-to-r from-transparent via-gray-900/5 to-transparent -rotate-12 blur-3xl"
          animate={{
            x: ["0%", "200%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2
          }}
        />
      </div>
    </div>
  );
};
