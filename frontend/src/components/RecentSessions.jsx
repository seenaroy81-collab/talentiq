import { Code2, Clock, Users, Trophy, Loader, ArrowUpRight } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

function RecentSessions({ sessions, isLoading }) {
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
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-accent to-secondary rounded-xl shadow-lg shadow-accent/20">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold">Your Past Sessions</h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader className="w-10 h-10 animate-spin text-primary opacity-50" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <motion.div
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              key={session._id}
              className={`group card relative cursor-pointer transition-all border ${session.status === "active"
                ? "bg-base-100 border-success/40 shadow-lg shadow-success/10"
                : "bg-base-100/50 hover:bg-base-100 border-base-content/5 hover:border-primary/20 hover:shadow-lg"
                }`}
            >
              {session.status === "active" && (
                <div className="absolute top-3 right-3">
                  <div className="badge badge-success badge-sm gap-1 text-white shadow-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                    ACTIVE
                  </div>
                </div>
              )}

              <div className="card-body p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${session.status === "active"
                      ? "bg-gradient-to-br from-success to-success/70 shadow-success/20 shadow-md"
                      : "bg-gradient-to-br from-base-200 to-base-300 group-hover:from-primary group-hover:to-secondary"
                      }`}
                  >
                    <Code2 className={`w-6 h-6 transition-colors ${session.status === 'active' ? 'text-white' : 'text-base-content/70 group-hover:text-white'
                      }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-primary transition-colors">{session.problem}</h3>
                    <span
                      className={`badge badge-sm border-0 ${getDifficultyBadgeClass(session.difficulty)}`}
                    >
                      {session.difficulty}
                    </span>
                  </div>

                  {session.status !== 'active' && (
                    <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-primary transition-all duration-300 absolute top-5 right-5" />
                  )}
                </div>

                <div className="space-y-2.5 text-xs font-medium opacity-70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {formatDistanceToNow(new Date(session.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {session.participant ? "2" : "1"} participant
                      {session.participant ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-base-100/30 rounded-3xl border border-dashed border-base-content/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-base-content/30" />
            </div>
            <p className="font-medium opacity-60 mb-1">No sessions yet</p>
            <p className="text-sm opacity-40">Start your coding journey today!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default RecentSessions;
