import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LockIcon,
  ArrowRightIcon,
  LoaderIcon,
  ShieldCheckIcon,
  BrainCircuitIcon,
  ClockIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  CodeIcon,
  BrainIcon,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const CandidateEntryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledCode = searchParams.get("code") || "";

  const [sessionCode, setSessionCode] = useState(prefilledCode);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Fetch session info when code is entered
  useEffect(() => {
    if (sessionCode.length >= 20) {
      fetchSessionInfo(sessionCode);
    } else {
      setSessionInfo(null);
    }
  }, [sessionCode]);

  const fetchSessionInfo = async (code) => {
    setLoadingInfo(true);
    try {
      const res = await axios.get(`${API_URL}/candidate/session/${code}`);
      setSessionInfo(res.data.session);
      setError("");
    } catch (err) {
      setSessionInfo(null);
      if (err.response?.status === 404) {
        setError("Session not found. Please check your code.");
      }
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!sessionCode || !password) {
      setError("Please enter both session code and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/candidate/join`, {
        sessionId: sessionCode,
        password,
      });

      // Store the candidate token
      localStorage.setItem("candidateToken", res.data.token);
      localStorage.setItem("candidateSession", JSON.stringify(res.data.session));

      // Navigate to resume upload page
      navigate(`/interview/${sessionCode}/upload`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join session");
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = () => {
    if (!sessionInfo?.expiresAt) return null;
    const diff = new Date(sessionInfo.expiresAt) - new Date();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <BrainCircuitIcon className="size-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Talent IQ</h1>
            <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">AI Interview Platform</p>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Enter Interview Session</h2>
              <p className="text-gray-400 text-sm mb-8">
                Enter the session code and password provided by your interviewer.
              </p>

              <form onSubmit={handleJoin} className="space-y-5">
                {/* Session Code */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Session Code
                  </label>
                  <input
                    type="text"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.trim())}
                    placeholder="Paste your session ID here"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-mono text-sm"
                    required
                  />
                </div>

                {/* Session Info Badge */}
                <AnimatePresence>
                  {loadingInfo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-gray-400 text-xs">
                      <LoaderIcon className="size-3 animate-spin" /> Fetching session info...
                    </motion.div>
                  )}
                  {sessionInfo && !sessionInfo.isExpired && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="size-4 text-green-400" />
                        <span className="text-green-400 text-sm font-semibold">{sessionInfo.sessionName}</span>
                      </div>
                      {sessionInfo.description && (
                        <p className="text-gray-400 text-xs">{sessionInfo.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {sessionInfo.difficulty && (
                          <span className="capitalize">📊 {sessionInfo.difficulty}</span>
                        )}
                        <span className="flex items-center gap-1">
                          {sessionInfo.interviewType === "coding" ? (
                            <><CodeIcon className="size-3 text-emerald-400" /> Coding</>
                          ) : (
                            <><BrainIcon className="size-3 text-blue-400" /> Q&A</>
                          )}
                        </span>
                        {sessionInfo.maxDuration && (
                          <span>⏱️ {sessionInfo.maxDuration} min</span>
                        )}
                        {sessionInfo.questionCount > 0 && (
                          <span>❓ {sessionInfo.questionCount} questions</span>
                        )}
                      </div>
                      {getTimeRemaining() && (
                        <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                          <ClockIcon className="size-3" />
                          {getTimeRemaining()}
                        </div>
                      )}
                    </motion.div>
                  )}
                  {sessionInfo?.isExpired && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-2"
                    >
                      <AlertCircleIcon className="size-4 text-red-400" />
                      <span className="text-red-400 text-sm">This session has expired</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter session password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
                    >
                      <AlertCircleIcon className="size-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || sessionInfo?.isExpired}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoaderIcon className="size-5 animate-spin" />
                  ) : (
                    <>
                      Enter Session
                      <ArrowRightIcon className="size-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Bottom info */}
          <p className="text-center text-gray-600 text-xs mt-6">
            Your interview will be monitored for integrity. Ensure your webcam and microphone are ready.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CandidateEntryPage;
