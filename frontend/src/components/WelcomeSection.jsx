import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, MessageSquareIcon, CodeIcon } from "lucide-react";
import { motion } from "framer-motion";

function WelcomeSection({ onStartQA, onStartCoding }) {
  const { user } = useUser();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden mb-10">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-7xl mx-auto px-6 pt-12 pb-8"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <motion.div variants={item} className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 flex items-center justify-center"
              >
                <SparklesIcon className="w-7 h-7 text-white" />
              </motion.div>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
                Welcome back, <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
                  {user?.firstName || "Developer"}!
                </span>
              </h1>
            </div>
            <p className="text-xl text-base-content/60 max-w-lg leading-relaxed">
              Create and manage autonomous AI interviews with high-fidelity proctoring and automated reporting.
            </p>
          </motion.div>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartQA}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              <div className="flex items-center gap-3 text-white font-bold text-lg relative z-10">
                <MessageSquareIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <div className="text-left">
                  <span className="block leading-none">Technical</span>
                  <span className="block text-sm opacity-80 font-medium">Q&A Interview</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-2" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartCoding}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              <div className="flex items-center gap-3 text-white font-bold text-lg relative z-10">
                <CodeIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <div className="text-left">
                  <span className="block leading-none">AI Coding</span>
                  <span className="block text-sm opacity-80 font-medium">Technical Screening</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-2" />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default WelcomeSection;
