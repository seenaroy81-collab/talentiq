import { useState, useEffect } from "react";
import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
  LockIcon,
  SearchIcon,
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function ActiveSessions({ sessions, isLoading, isUserInSession, onJoinSession }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [filteredSessions, setFilteredSessions] = useState([]);

  useEffect(() => {
    applyFilters();
  }, [sessions, searchQuery, difficultyFilter]);

  const applyFilters = () => {
    let filtered = [...sessions];

    // Filter by difficulty
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((s) => s.difficulty === difficultyFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.sessionName?.toLowerCase().includes(query) ||
          s.problem?.toLowerCase().includes(query) ||
          s.host?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredSessions(filtered);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="lg:col-span-2 card bg-base-100/50 backdrop-blur-md border border-base-content/5 shadow-xl h-full flex flex-col"
    >
      <div className="card-body p-6 flex-1 flex flex-col min-h-0">
        {/* HEADERS SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg shadow-primary/20">
              <ZapIcon className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Live Sessions
                <div className="badge badge-sm badge-success gap-1 shadow-sm font-normal text-white">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  {filteredSessions.length} active
                </div>
              </h2>
              <p className="text-xs text-base-content/60 font-medium">Join a room to start coding</p>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search rooms..."
              className="input input-sm input-bordered w-full pl-9 bg-base-200/50 hover:bg-base-200 focus:bg-base-100 transition-colors rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex bg-base-200/50 p-1 rounded-lg">
            {['all', 'easy', 'medium', 'hard'].map((filter) => (
              <button
                key={filter}
                className={`btn btn-sm border-0 px-3 capitalize font-medium transition-all rounded-md ${difficultyFilter === filter
                  ? 'bg-base-100 shadow-sm text-base-content'
                  : 'bg-transparent text-base-content/60 hover:text-base-content'
                  }`}
                onClick={() => setDifficultyFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="flex-1 overflow-y-auto pr-2 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoaderIcon className="size-8 animate-spin text-primary opacity-50" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      whileHover={{ scale: 1.01 }}
                      key={session._id}
                      className="group relative bg-base-100 border border-base-content/5 hover:border-primary/30 rounded-xl p-4 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        {/* Status Line */}
                        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${session.participant && !isUserInSession(session) ? 'bg-base-300' : 'bg-success'
                          }`} />

                        <div className="pl-2">
                          <div className="relative size-12 rounded-xl bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors">
                            <Code2Icon className="size-6 text-base-content/70 group-hover:text-primary transition-colors" />
                            {session.password && (
                              <div className="absolute -top-1 -right-1 p-0.5 bg-base-100 rounded-full border border-base-200 shadow-sm">
                                <div className="size-3 bg-warning rounded-full flex items-center justify-center">
                                  <LockIcon className="size-2 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-base text-base-content truncate group-hover:text-primary transition-colors">
                              {session.sessionName}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-base-content/60">
                            <div className="flex items-center gap-1">
                              <CrownIcon className="size-3" />
                              <span>{session.host?.name}</span>
                            </div>
                            <div className="w-1 h-1 bg-base-content/20 rounded-full" />
                            <span>{session.problem}</span>
                            <div className="w-1 h-1 bg-base-content/20 rounded-full" />
                            <span className={`font-medium ${session.difficulty === 'easy' ? 'text-success' :
                              session.difficulty === 'medium' ? 'text-warning' : 'text-error'
                              }`}>
                              {session.difficulty}
                            </span>
                          </div>
                        </div>

                        {session.participant && !isUserInSession(session) ? (
                          <div className="px-3 py-1.5 bg-base-200 text-base-content/50 rounded-lg text-xs font-bold uppercase tracking-wider">
                            Full
                          </div>
                        ) : (
                          <button
                            onClick={() => onJoinSession(session)}
                            className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
                          >
                            {isUserInSession(session) ? "Rejoin" : "Join"}
                            <ArrowRightIcon className="size-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-base-200/50 rounded-2xl flex items-center justify-center">
                      <SparklesIcon className="w-8 h-8 text-base-content/20" />
                    </div>
                    <p className="font-medium text-base-content/60">
                      {searchQuery || difficultyFilter !== "all"
                        ? "No matching sessions found"
                        : "No active sessions right now"}
                    </p>
                    <button className="btn btn-link btn-xs text-primary no-underline mt-2">
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
export default ActiveSessions;

