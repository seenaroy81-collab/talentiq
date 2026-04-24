import { CheckCircleIcon, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {/* Active Screenings */}
      <motion.div variants={item} whileHover={{ y: -5 }} className="card bg-base-100/40 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-primary/20 transition-all overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="card-body p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 shadow-inner">
              <UsersIcon className="w-8 h-8 text-primary" />
            </div>
            <div className="badge badge-primary gap-2 shadow-lg font-bold px-4 py-3 rounded-xl border-none bg-primary/20 text-primary">
              <span className="relative flex h-2.5 w-2.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              In Progress
            </div>
          </div>
          <div className="text-5xl font-black mb-2 tracking-tight">{activeSessionsCount}</div>
          <div className="text-sm opacity-70 font-bold tracking-widest uppercase flex items-center gap-2">
            Active AI Screenings
          </div>
        </div>
      </motion.div>

      {/* Completed Interviews */}
      <motion.div variants={item} whileHover={{ y: -5 }} className="card bg-base-100/40 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-secondary/20 transition-all overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="card-body p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl border border-secondary/20 shadow-inner">
              <CheckCircleIcon className="w-8 h-8 text-secondary" />
            </div>
          </div>
          <div className="text-5xl font-black mb-2 tracking-tight">{recentSessionsCount}</div>
          <div className="text-sm opacity-70 font-bold tracking-widest uppercase flex items-center gap-2">
            All-Time Candidates
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StatsCards;
