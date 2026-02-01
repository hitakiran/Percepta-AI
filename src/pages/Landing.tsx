import { Button } from "@/components/ui/button";
import { Eye, Target, Lightbulb, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { motion } from "framer-motion";
import { LiquidChrome } from "@/components/ui/LiquidChrome";

export default function Landing() {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  } as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  } as const;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-gray-200 relative">
      <LiquidChrome />

      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 px-6">
        <motion.div 
          className="max-w-[800px] mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">
              AI Perception Measurement
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.05]">
            Measure your product's
            <br />
            AI perception.
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Ensure AI models position your product correctly to investors and early adopters.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="h-12 px-8 rounded-full text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
            >
              Start Evaluation
            </Button>
            <Button 
              size="lg" 
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="h-12 px-8 rounded-full text-base font-medium text-primary border-2 border-transparent hover:border-primary hover:bg-black hover:text-white transition-all duration-300"
            >
              View Dashboard
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6 text-muted-foreground/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Value Proposition - Clean Grid */}
      <section className="py-16 bg-secondary/30 relative overflow-hidden">
        {/* Animated Light Gray Background for this section */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50/50 to-gray-100/50">
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            style={{
              backgroundImage: "radial-gradient(circle at center, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeInUp} 
              className="text-center flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-500"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-4 bg-white rounded-full mb-2 shadow-sm"
              >
                <Eye className="w-8 h-8 text-foreground" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xl font-bold tracking-tight">See AI Perception</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ask AI models buyer-style questions and see exactly what they say—as an uninformed potential customer would.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp} 
              className="text-center flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-500"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-4 bg-white rounded-full mb-2 shadow-sm"
              >
                <Target className="w-8 h-8 text-foreground" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xl font-bold tracking-tight">Identify Gaps</h3>
              <p className="text-muted-foreground leading-relaxed">
                Spot missing information, incorrect descriptions, and hallucinated content that hurts your positioning.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp} 
              className="text-center flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-500"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-4 bg-white rounded-full mb-2 shadow-sm"
              >
                <Lightbulb className="w-8 h-8 text-foreground" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xl font-bold tracking-tight">Get Fixes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive specific, actionable recommendations to improve your product context and roadmap communication.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section - Minimal List */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight"
          >
            How it works
          </motion.h2>
          
          <div className="space-y-12">
            {[
              { step: "01", title: "Enter Product Info", desc: "Provide your website URL, competitors, and target persona." },
              { step: "02", title: "Review Source Trace", desc: "See what public data was fetched and any uncertainties." },
              { step: "03", title: "Approve Golden Prompts", desc: "Review and customize the questions AI will ask." },
              { step: "04", title: "Define Scoring Rubric", desc: "Set the criteria for how responses should be evaluated." },
              { step: "05", title: "Select Models", desc: "Choose which AI models to query (GPT-4, Gemini, etc.)." },
              { step: "06", title: "Watch Generation", desc: "See live trace logs as models respond as uninformed buyers." },
              { step: "07", title: "Review Results", desc: "Analyze responses with overall scores and detailed rubric views." },
              { step: "08", title: "Identify Gaps", desc: "Spot missing or incorrect information affecting perception." },
              { step: "09", title: "Apply Fixes", desc: "Get actionable recommendations to improve your product context." },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center text-center group relative"
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4 relative">
                  <span className="text-4xl font-bold text-muted-foreground/10 absolute -top-8 left-1/2 -translate-x-1/2 scale-150 blur-[1px] select-none">
                    {item.step}
                  </span>
                  <span className="text-sm font-mono font-medium text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10 relative z-10">
                    Step {item.step}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">{item.desc}</p>
                
                {i !== 8 && (
                  <motion.div 
                    className="h-12 w-px bg-gradient-to-b from-border to-transparent mt-8"
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: 48, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                )}
                
                {/* Side animations */}
                <motion.div
                  className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-32 h-32 bg-gray-100/50 rounded-full blur-3xl -z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 1 }}
                />
                <motion.div
                  className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-32 h-32 bg-gray-200/30 rounded-full blur-3xl -z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement - Text Only */}
      <section className="py-16 bg-primary text-primary-foreground">
        <motion.div 
          className="container mx-auto px-6 max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-8 tracking-tight leading-tight">
            AI search is the new SEO.
            <br />
            <span className="opacity-70">Don't let hallucinations kill your momentum.</span>
          </motion.h2>
          <motion.div 
            variants={fadeInUp}
            className="grid sm:grid-cols-2 gap-x-12 gap-y-6 text-left max-w-2xl mx-auto mt-8 opacity-90"
          >
            <p className="leading-relaxed">Investors use AI to research your market fit before the first call.</p>
            <p className="leading-relaxed">Incorrect positioning confuses your initial target market.</p>
            <p className="leading-relaxed">Early adopters rely on AI summaries to compare you against incumbents.</p>
            <p className="leading-relaxed">Competitors with longer history drown out your new narrative.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Minimal CTA */}
      <section className="py-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            Ready to measure?
          </h2>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="h-14 px-12 rounded-full text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-300 hover:scale-105"
          >
            Start Your Free Evaluation
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground/60 font-medium">Percepta AI</p>
        </div>
      </footer>
    </div>
  );
}
