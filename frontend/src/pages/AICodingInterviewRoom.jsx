import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  CodeIcon,
  PlayIcon,
  SendIcon,
  ClockIcon,
  ChevronRightIcon,
  CheckCircle2Icon,
  XCircleIcon,
  LoaderIcon,
  BrainCircuitIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  EyeIcon,
  ChevronLeftIcon,
  LightbulbIcon,
  TerminalIcon,
  LayoutIcon,
  CameraIcon,
  LogOutIcon,
  BarChart3Icon,
  ZapIcon,
  SparklesIcon,
} from "lucide-react";
import ProctoringTracker from "../components/Proctoring/ProctoringTracker";
import GazeCalibration from "../components/Proctoring/GazeCalibration";
import TextToSpeechService from "../services/textToSpeechService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const LANGUAGE_MAP = {
  javascript: { label: "JavaScript", monacoId: "javascript", icon: "JS" },
  python: { label: "Python", monacoId: "python", icon: "PY" },
  java: { label: "Java", monacoId: "java", icon: "JV" },
  cpp: { label: "C++", monacoId: "cpp", icon: "C+" },
  typescript: { label: "TypeScript", monacoId: "typescript", icon: "TS" },
};

const DEFAULT_STARTERS = {
  javascript: `// Write your solution here\nfunction solution() {\n  \n}\n`,
  python: `# Write your solution here\ndef solution():\n    pass\n`,
  java: `// Write your solution here\nclass Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n`,
  cpp: `// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n`,
  typescript: `// Write your solution here\nfunction solution(): void {\n  \n}\n`,
};

const AICodingInterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Interview state
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [allDone, setAllDone] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({ enableAIHelp: true, aiHelpButton: true });

  // Editor state
  const [code, setCode] = useState(DEFAULT_STARTERS.javascript);
  const [language, setLanguage] = useState("javascript");
  const [availableLanguages, setAvailableLanguages] = useState(["javascript"]);

  // AI Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  // Proctoring
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [showProctoring, setShowProctoring] = useState(true);
  const [proctoringStats, setProctoringStats] = useState({});
  const [violations, setViolations] = useState([]);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [maxDuration, setMaxDuration] = useState(60);
  const timerRef = useRef(null);

  // Refs
  const chatEndRef = useRef(null);
  const ttsRef = useRef(new TextToSpeechService());

  // Hints
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  // Code review result
  const [lastReview, setLastReview] = useState(null);

  // ═══ LOAD INTERVIEW ═══
  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const res = await axios.get(`${API_URL}/ai-interview/${id}`);
      const data = res.data.interview;
      setInterview(data);
      setTotalQuestions(data.questionCount || 5);

      // Get the session to find allowed languages
      if (data.sessionId) {
        try {
          const sessionRes = await axios.get(`${API_URL}/sessions/${data.sessionId._id || data.sessionId}`);
          const session = sessionRes.data.session || sessionRes.data;
          if (session.codingLanguages?.length > 0) {
            setAvailableLanguages(session.codingLanguages);
            setLanguage(session.codingLanguages[0]);
            setCode(DEFAULT_STARTERS[session.codingLanguages[0]] || DEFAULT_STARTERS.javascript);
          }
          if (session.maxDuration) {
            setMaxDuration(session.maxDuration);
          }
          setSessionConfig({
            enableAIHelp: session.enableAIHelp !== undefined ? session.enableAIHelp : true,
            aiHelpButton: session.aiHelpButton !== undefined ? session.aiHelpButton : true,
          });
        } catch (e) {
          console.warn("Could not fetch session details:", e.message);
        }
      }

      // If there are already coding questions, resume
      if (data.codingQuestions?.length > 0) {
        const lastQ = data.codingQuestions[data.codingQuestions.length - 1];
        setCurrentQuestion(lastQ);
        setQuestionIndex(data.codingQuestions.length - 1);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch interview:", err);
      setLoading(false);
    }
  };

  // ═══ TIMER ═══
  useEffect(() => {
    if (isCalibrated && !allDone) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isCalibrated, allDone]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // ═══ SCROLLING ═══
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ═══ GET NEXT QUESTION ═══
  const fetchNextQuestion = useCallback(async () => {
    setLoadingQuestion(true);
    setShowHints(false);
    setRevealedHints(0);
    setLastReview(null);
    try {
      const res = await axios.post(`${API_URL}/ai-interview/${id}/next-coding-question`);
      const data = res.data;

      if (data.done) {
        setAllDone(true);
        setChatMessages((prev) => [...prev, {
          role: "ai",
          content: "🎉 All questions have been completed! Great job. Click 'End Interview' to see your results.",
        }]);
        ttsRef.current.speak("All questions have been completed! Great job. Click End Interview to see your results.");
        return;
      }

      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTotalQuestions(data.totalQuestions);

      // Reset editor
      setCode(DEFAULT_STARTERS[language] || DEFAULT_STARTERS.javascript);

      setChatMessages((prev) => [...prev, {
        role: "ai",
        content: `📝 **Question ${data.questionIndex + 1}/${data.totalQuestions}: ${data.question.title}**\n\nRead the problem on the left and write your solution. Click "Submit Code" when ready.`,
      }]);

      ttsRef.current.speak(`Question ${data.questionIndex + 1}. ${data.question.title}. ${data.question.description.substring(0, 200)}`);
    } catch (err) {
      console.error("Failed to fetch question:", err);
      setChatMessages((prev) => [...prev, { role: "ai", content: "❌ Failed to load question. Please try again." }]);
    } finally {
      setLoadingQuestion(false);
    }
  }, [id, language]);

  // Auto-fetch first question after calibration
  useEffect(() => {
    if (isCalibrated && !currentQuestion && !loading) {
      setChatMessages([{
        role: "ai",
        content: "👋 Welcome to your AI Coding Interview! I'll present you with coding challenges one at a time. Write your solution in the Monaco editor and submit when ready. Good luck!",
      }]);
      ttsRef.current.speak("Welcome to your AI Coding Interview! I'll present you with coding challenges one at a time. Good luck!");
      fetchNextQuestion();
    }
  }, [isCalibrated, loading]);

  // ═══ SUBMIT CODE ═══
  const handleSubmitCode = async () => {
    if (!code.trim() || submitting) return;

    setSubmitting(true);
    setChatMessages((prev) => [...prev, {
      role: "candidate",
      content: `Submitted code for Q${questionIndex + 1} (${LANGUAGE_MAP[language]?.label || language})`,
    }]);

    try {
      const res = await axios.post(`${API_URL}/ai-interview/${id}/submit-code`, {
        code,
        language,
        questionIndex,
      });

      const { review, response } = res.data;
      setLastReview(review);

      setChatMessages((prev) => [...prev, {
        role: "ai",
        content: response,
        score: review.score,
      }]);

      ttsRef.current.speak(response);
    } catch (err) {
      console.error("Failed to submit code:", err);
      setChatMessages((prev) => [...prev, { role: "ai", content: "❌ Failed to evaluate code. Please try again." }]);
    } finally {
      setSubmitting(false);
    }
  };

  // ═══ GET AI SUGGESTION ═══
  const handleGetSuggestion = async () => {
    if (submitting || loadingQuestion || !currentQuestion || allDone) return;
    
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/ai-interview/${id}/suggestion`, {
        code,
        language,
        questionIndex,
      });
      
      const { suggestion, conversation } = res.data;
      setChatMessages(conversation); // This ensures the conversation history is synced
      ttsRef.current.speak(`Here is a hint for you: ${suggestion}`);
    } catch (err) {
      console.error("Failed to get suggestion:", err);
      setChatMessages(prev => [...prev, { role: "ai", content: "❌ Failed to get AI suggestion. Please try again." }]);
    } finally {
      setSubmitting(false);
    }
  };

  // ═══ END INTERVIEW ═══
  const handleEndInterview = async () => {
    clearInterval(timerRef.current);
    try {
      // Save proctoring data before ending
      await axios.post(`${API_URL}/ai-interview/${id}/chat`, {
        message: "__SAVE_PROCTORING__",
        proctoringData: { violations, lastStats: proctoringStats },
      }).catch(() => {});

      await axios.post(`${API_URL}/ai-interview/${id}/end`);
      navigate(`/ai-interview/${id}/review`);
    } catch (err) {
      console.error("Failed to end interview:", err);
      navigate(`/ai-interview/${id}/review`);
    }
  };

  // ═══ PROCTORING CALLBACKS ═══
  const handleProctoringUpdate = useCallback((stats) => {
    setProctoringStats(stats);
  }, []);

  const handleProctoringViolation = useCallback((violation) => {
    setViolations((prev) => [...prev, { ...violation, timestamp: new Date() }]);
  }, []);

  // ═══ CALIBRATION COMPLETE ═══
  if (!isCalibrated && !loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6">
        <GazeCalibration onCalibrationComplete={() => setIsCalibrated(true)} />
      </div>
    );
  }

  // ═══ LOADING ═══
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoaderIcon className="size-10 text-emerald-400 animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Loading coding interview...</p>
        </div>
      </div>
    );
  }

  const timeProgress = Math.min(100, (elapsedSeconds / (maxDuration * 60)) * 100);
  const isOverTime = elapsedSeconds > maxDuration * 60;

  return (
    <div className="h-screen bg-[#0a0a1a] text-white flex flex-col overflow-hidden">
      {/* ═══ TOP BAR ═══ */}
      <div className="h-14 bg-[#0d0d20]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg">
              <CodeIcon className="size-4 text-white" />
            </div>
            <span className="font-bold text-sm">AI Coding Interview</span>
          </div>
          
          {/* Question Progress */}
          <div className="flex items-center gap-2 ml-4">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i < questionIndex ? "bg-emerald-500" :
                  i === questionIndex ? "bg-cyan-400 ring-2 ring-cyan-400/30 scale-125" :
                  "bg-gray-700"
                }`}
              />
            ))}
            <span className="text-[11px] text-gray-500 ml-1">Q{questionIndex + 1}/{totalQuestions}</span>
          </div>
        </div>

        {/* Center - Timer */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg ${isOverTime ? "bg-red-500/10 border border-red-500/20" : "bg-white/5"}`}>
          <ClockIcon className={`size-3.5 ${isOverTime ? "text-red-400" : "text-gray-400"}`} />
          <span className={`font-mono text-sm font-bold ${isOverTime ? "text-red-400" : "text-gray-300"}`}>
            {formatTime(elapsedSeconds)}
          </span>
          <span className="text-[10px] text-gray-600">/ {maxDuration}m</span>
          <div className="w-20 h-1 bg-gray-800 rounded-full overflow-hidden ml-2">
            <div className={`h-full rounded-full transition-all ${isOverTime ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${timeProgress}%` }} />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Proctoring Status */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium ${
            proctoringStats.faceDetected !== false ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          }`}>
            <EyeIcon className="size-3" />
            {proctoringStats.faceDetected !== false ? "Monitored" : "Face Lost"}
          </div>

          <button
            onClick={handleEndInterview}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-all"
          >
            <LogOutIcon className="size-3.5" />
            End Interview
          </button>
        </div>
      </div>

      {/* ═══ MAIN CONTENT — 3 Panels ═══ */}
      <div className="flex-1 flex overflow-hidden">
        {/* ═══ LEFT PANEL — Problem Description ═══ */}
        <div className="w-[380px] flex-shrink-0 border-r border-white/5 flex flex-col bg-[#0d0d1a]">
          {/* Problem Header */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                {currentQuestion?.topic || "Loading"} • {currentQuestion?.difficulty || "—"}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                currentQuestion?.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400" :
                currentQuestion?.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400" :
                "bg-red-500/10 text-red-400"
              }`}>
                {currentQuestion?.difficulty || "—"}
              </span>
            </div>
            <h2 className="font-bold text-lg text-white leading-tight">
              {currentQuestion?.title || "Loading question..."}
            </h2>
          </div>

          {/* Problem Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {loadingQuestion ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <LoaderIcon className="size-8 text-cyan-400 animate-spin" />
                <p className="text-gray-400 text-sm">AI is generating your question...</p>
              </div>
            ) : currentQuestion ? (
              <>
                {/* Description */}
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-gray-300 text-[13px] leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.description}
                  </p>
                </div>

                {/* Examples */}
                {currentQuestion.examples?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                       <LayoutIcon className="size-3" />
                       Examples
                    </h4>
                    {currentQuestion.examples.map((ex, i) => (
                      <div key={i} className="space-y-2">
                        <div className="text-[10px] text-gray-500 font-bold ml-1">Example {i + 1}</div>
                        <div className="bg-[#0a0a14] border border-white/5 rounded-xl p-4 space-y-3 font-mono">
                          <div className="space-y-1">
                            <div className="text-[10px] text-emerald-500/50 uppercase font-sans font-black tracking-tighter">Input</div>
                            <div className="text-emerald-400 text-sm">{ex.input}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] text-cyan-500/50 uppercase font-sans font-black tracking-tighter">Output</div>
                            <div className="text-cyan-400 text-sm">{ex.output}</div>
                          </div>
                          {ex.explanation && (
                            <div className="pt-2 border-t border-white/5">
                              <div className="text-[10px] text-gray-600 uppercase font-sans font-black tracking-tighter mb-1">Explanation</div>
                              <p className="text-gray-400 text-[11px] font-sans leading-relaxed italic">{ex.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {currentQuestion.constraints?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <ShieldCheckIcon className="size-3" />
                      Constraints
                    </h4>
                    <div className="bg-[#0a0a14]/50 border border-white/5 rounded-xl p-4">
                      <ul className="space-y-2">
                        {currentQuestion.constraints.map((c, i) => (
                          <li key={i} className="text-gray-400 text-[11px] flex items-start gap-2 leading-relaxed">
                            <div className="size-1 rounded-full bg-cyan-500/50 mt-1.5 flex-shrink-0" />
                            <code className="text-gray-300 font-mono bg-white/5 px-1 rounded">{c}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Hints */}
                {currentQuestion.hints?.length > 0 && (
                  <div>
                    <button
                      onClick={() => {
                        setShowHints(true);
                        setRevealedHints((prev) => Math.min(prev + 1, currentQuestion.hints.length));
                      }}
                      className="flex items-center gap-2 text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors"
                    >
                      <LightbulbIcon className="size-3.5" />
                      {showHints ? `Hint ${revealedHints}/${currentQuestion.hints.length}` : "Show Hint"}
                    </button>
                    <AnimatePresence>
                      {showHints && currentQuestion.hints.slice(0, revealedHints).map((hint, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mt-2"
                        >
                          <p className="text-amber-200/80 text-xs">{hint}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
                <BrainCircuitIcon className="size-10 opacity-30" />
                <p className="text-sm">Waiting for first question...</p>
              </div>
            )}
          </div>

          {/* Last Review Summary */}
          <AnimatePresence>
            {lastReview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="border-t border-white/5 p-3 bg-[#0d0d20] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Review</span>
                  <span className={`text-sm font-black ${
                    lastReview.score >= 7 ? "text-emerald-400" :
                    lastReview.score >= 4 ? "text-amber-400" : "text-red-400"
                  }`}>{lastReview.score}/10</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-mono">⏱ {lastReview.timeComplexity}</span>
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-[10px] font-mono">💾 {lastReview.spaceComplexity}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ CENTER PANEL — Monaco Editor ═══ */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="h-10 bg-[#12121f] border-b border-white/5 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <TerminalIcon className="size-3.5 text-gray-500" />
              <span className="text-xs text-gray-400 font-semibold">Code Editor</span>
            </div>
            
            <div className="flex items-center gap-1">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    if (!code || code === DEFAULT_STARTERS[language]) {
                      setCode(DEFAULT_STARTERS[lang] || DEFAULT_STARTERS.javascript);
                    }
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    language === lang
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {LANGUAGE_MAP[lang]?.icon || lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* AI Suggestion Button */}
            {sessionConfig.enableAIHelp && sessionConfig.aiHelpButton && !allDone && (
              <button
                onClick={handleGetSuggestion}
                disabled={submitting || loadingQuestion}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50"
              >
                <SparklesIcon className="size-3" />
                Ask AI Assistant
              </button>
            )}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={LANGUAGE_MAP[language]?.monacoId || "javascript"}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
                minimap: { enabled: false },
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "all",
                cursorBlinking: "smooth",
                smoothScrolling: true,
                wordWrap: "on",
                tabSize: 2,
                automaticLayout: true,
                bracketPairColorization: { enabled: true },
                guides: { indentation: true, bracketPairs: true },
              }}
            />
          </div>

          {/* Submit Bar */}
          <div className="h-14 bg-[#12121f] border-t border-white/5 flex items-center justify-between px-4">
            <div className="text-[11px] text-gray-500">
              {code.split("\n").length} lines • {language.toUpperCase()}
            </div>

            <div className="flex items-center gap-2">
              {!allDone && lastReview && (
                <button
                  onClick={fetchNextQuestion}
                  disabled={loadingQuestion}
                  className="flex items-center gap-2 px-5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                >
                  {loadingQuestion ? <LoaderIcon className="size-3.5 animate-spin" /> : <ChevronRightIcon className="size-3.5" />}
                  Next Question
                </button>
              )}
              <button
                onClick={handleSubmitCode}
                disabled={submitting || !currentQuestion || allDone}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <LoaderIcon className="size-3.5 animate-spin" />
                ) : (
                  <SendIcon className="size-3.5" />
                )}
                {submitting ? "Evaluating..." : "Submit Code"}
              </button>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL — Chat + Webcam ═══ */}
        <div className="w-[320px] flex-shrink-0 border-l border-white/5 flex flex-col bg-[#0d0d1a]">
          {/* Webcam */}
          <div className="h-44 relative bg-[#0a0a14] border-b border-white/5 overflow-hidden">
            <ProctoringTracker
              interviewId={id}
              onStatsUpdate={handleProctoringUpdate}
              onViolation={handleProctoringViolation}
              isActive={isCalibrated}
            />
            {/* Overlay badges */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${proctoringStats.faceDetected !== false ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-[9px] text-gray-400 font-medium">
                {proctoringStats.gazeStatus || "Tracking"}
              </span>
            </div>
            <div className="absolute top-2 right-2">
              <CameraIcon className="size-3.5 text-gray-500" />
            </div>
            {violations.length > 0 && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                <AlertTriangleIcon className="size-2.5 text-red-400" />
                <span className="text-[9px] text-red-400 font-bold">{violations.length} flags</span>
              </div>
            )}
          </div>

          {/* Chat Header */}
          <div className="p-3 border-b border-white/5 flex items-center gap-2">
            <BrainCircuitIcon className="size-4 text-cyan-400" />
            <span className="text-xs font-bold text-gray-300">AI Interviewer</span>
            <div className="flex-1" />
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <BarChart3Icon className="size-3" />
              {interview?.codeSubmissions?.length || 0} submitted
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.role === "candidate"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                    : "bg-white/5 border border-white/5 text-gray-300"
                }`}>
                  {msg.content}
                  {msg.score !== undefined && (
                    <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold ${
                      msg.score >= 7 ? "text-emerald-400" :
                      msg.score >= 4 ? "text-amber-400" : "text-red-400"
                    }`}>
                      <ZapIcon className="size-2.5" />
                      Score: {msg.score}/10
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {(submitting || loadingQuestion) && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <LoaderIcon className="size-3 animate-spin" />
                {submitting ? "AI is reviewing your code..." : "Generating question..."}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Bottom: Quick Actions */}
          {allDone && (
            <div className="p-3 border-t border-white/5">
              <button
                onClick={handleEndInterview}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
              >
                <CheckCircle2Icon className="size-4" />
                End Interview & View Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICodingInterviewRoom;
