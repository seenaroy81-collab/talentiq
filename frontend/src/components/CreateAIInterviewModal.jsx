import { useState, useEffect } from "react";
import {
  LoaderIcon,
  X,
  PlusIcon,
  Trash2Icon,
  CopyIcon,
  CheckIcon,
  LockIcon,
  ClockIcon,
  BrainCircuitIcon,
  LinkIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
  FileTextIcon,
  CodeIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../lib/axios";

import { SearchIcon, FilterIcon } from "lucide-react";

const AVAILABLE_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "typescript", label: "TypeScript" },
];

const AVAILABLE_TOPICS = [
  "Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Trees",
  "Graphs", "Dynamic Programming", "Sorting & Searching", "Recursion",
  "Hash Maps", "Two Pointers", "Sliding Window", "Binary Search",
];

const CreateAIInterviewModal = ({ isOpen, onClose, initialType = "qa" }) => {
  const { user } = useUser();

  const [step, setStep] = useState(1); // 1: Config, 2: Questions, 3: Success
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdSession, setCreatedSession] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryQuestions, setLibraryQuestions] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [formData, setFormData] = useState({
    sessionName: "",
    description: "",
    difficulty: "medium",
    password: "",
    maxDuration: 60,
    questionCount: 5,
    questionMode: "mixed", // "ai", "manual", "mixed"
    resumeRequired: true,
    interviewerEmail: user?.emailAddresses?.[0]?.emailAddress || "",
    expiresAt: "",
    customQuestions: [],
    // Coding interview fields
    interviewType: initialType, // Use initialType here
    codingLanguages: ["javascript"],
    codingTopics: ["Arrays", "Strings"],
    enableAIHelp: true,
    aiHelpButton: true,
  });

  // Ensure type is updated if prop changes while closed
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, interviewType: initialType }));
    }
  }, [isOpen, initialType]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newCategory, setNewCategory] = useState("technical");

  useEffect(() => {
    if (showLibrary) {
      fetchLibrary();
    }
  }, [showLibrary, searchTerm, searchCategory]);

  const fetchLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const res = await axiosInstance.get("questions", {
        params: {
          search: searchTerm || undefined,
          category: searchCategory || undefined,
          limit: 100
        }
      });
      setLibraryQuestions(res.data.questions || []);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      // Fallback to a small set of default questions if API fails
      setLibraryQuestions([
        { _id: "fallback-1", title: "Two Sum", category: "Arrays", difficulty: "easy", question: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target." },
        { _id: "fallback-2", title: "Valid Parentheses", category: "Strings", difficulty: "easy", question: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid." }
      ]);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const addFromLibrary = (libQ) => {
    setFormData(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, { 
        question: `${libQ.title}: ${libQ.question}`, 
        category: libQ.category,
        difficulty: libQ.difficulty || "Easy",
        examples: libQ.examples || [],
        constraints: libQ.constraints || [],
        hints: libQ.hints || []
      }]
    }));
  };

  const addMandatoryQuestions = () => {
    // Specifically adding 2 high-quality DSA questions with rich data
    const q1 = {
      question: "Two Sum: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      category: "Arrays",
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
      ],
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"]
    };
    const q2 = {
      question: "Reverse Linked List: Given the head of a singly linked list, reverse the list, and return the reversed list.",
      category: "Linked Lists",
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
      ],
      constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"]
    };
    setFormData(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, q1, q2]
    }));
  };

  const toggleLanguage = (lang) => {
    setFormData(prev => {
      const langs = prev.codingLanguages.includes(lang)
        ? prev.codingLanguages.filter(l => l !== lang)
        : [...prev.codingLanguages, lang];
      return { ...prev, codingLanguages: langs.length > 0 ? langs : [lang] };
    });
  };

  const toggleTopic = (topic) => {
    setFormData(prev => {
      const topics = prev.codingTopics.includes(topic)
        ? prev.codingTopics.filter(t => t !== topic)
        : [...prev.codingTopics, topic];
      return { ...prev, codingTopics: topics.length > 0 ? topics : [topic] };
    });
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setFormData({
      ...formData,
      customQuestions: [
        ...formData.customQuestions,
        { question: newQuestion.trim(), category: newCategory },
      ],
    });
    setNewQuestion("");
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      customQuestions: formData.customQuestions.filter((_, i) => i !== index),
    });
  };

  const handleCreate = async () => {
    if (!formData.sessionName || !formData.password) {
      alert("Session name and password are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        sessionName: formData.sessionName,
        description: formData.description,
        difficulty: formData.difficulty,
        password: formData.password,
        maxDuration: formData.maxDuration,
        resumeRequired: formData.resumeRequired,
        isAI: true,
        interviewerEmail: formData.interviewerEmail,
        customQuestions: formData.customQuestions,
        questionCount: formData.questionCount,
        questionMode: formData.questionMode,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        interviewType: formData.interviewType,
        codingLanguages: formData.codingLanguages,
        codingTopics: formData.codingTopics,
        enableAIHelp: formData.enableAIHelp,
        aiHelpButton: formData.aiHelpButton,
      };

      const res = await axiosInstance.post("/sessions", payload);

      setCreatedSession(res.data.session);
      setStep(3);
    } catch (error) {
      console.error("Failed to create session:", error);
      alert(error.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const getShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/interview/join?code=${createdSession?._id}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getShareLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      sessionName: "",
      description: "",
      difficulty: "medium",
      password: "",
      maxDuration: 60,
      questionCount: 5,
      questionMode: "mixed",
      resumeRequired: true,
      interviewerEmail: user?.emailAddresses?.[0]?.emailAddress || "",
      expiresAt: "",
      customQuestions: [],
      interviewType: "qa",
      codingLanguages: ["javascript"],
      codingTopics: ["Arrays", "Strings"],
      enableAIHelp: true,
      aiHelpButton: true,
    });
    setCreatedSession(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-base-300/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="p-6 border-b border-base-200 bg-base-100/50 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shadow-lg ${formData.interviewType === "coding" ? "bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-emerald-500/20" : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/20"}`}>
              {formData.interviewType === "coding" ? <CodeIcon className="size-6 text-white" /> : <BrainCircuitIcon className="size-6 text-white" />}
            </div>
            <div>
              <h3 className="font-bold text-2xl">
                {step === 1 ? "Create AI Interview" : step === 2 ? "Custom Questions" : "Session Created!"}
              </h3>
              <p className="text-sm opacity-60">
                {step === 1 ? "Configure your autonomous interview" : step === 2 ? "Add questions the AI will ask" : "Share the link with your candidate"}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="btn btn-ghost btn-circle btn-sm">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Session Config */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                
                {/* ═══ INTERVIEW TYPE SELECTOR ═══ */}
                <div className="flex flex-col gap-4">
                  {formData.interviewType === "qa" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative overflow-hidden flex flex-col items-start p-6 rounded-3xl border-2 bg-blue-500/10 border-blue-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                      
                      <div className="flex w-full items-start justify-between">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-400 shadow-inner border border-blue-500/20">
                          <MessageSquareIcon className="size-7" />
                        </div>
                        
                        <div className="size-6 rounded-full flex items-center justify-center border-2 border-blue-500 bg-blue-500 text-white">
                          <CheckIcon className="size-3.5" strokeWidth={3} />
                        </div>
                      </div>
                      
                      <div className="text-left mt-5 relative z-10 w-full">
                        <h4 className="text-lg font-black tracking-tight text-blue-100">Technical Q&A</h4>
                        <p className="text-xs mt-1.5 leading-relaxed font-medium text-blue-200/60">High fidelity voice & chat interaction.</p>
                        
                        <div className="mt-4 w-full h-1 rounded-full overflow-hidden bg-blue-500/20">
                          <div className="h-full bg-blue-500 w-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formData.interviewType === "coding" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative overflow-hidden flex flex-col items-start p-6 rounded-3xl border-2 bg-emerald-500/10 border-emerald-500 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
                    >
                      {formData.interviewType === "coding" && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                      )}

                      <div className="flex w-full items-start justify-between">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400 shadow-inner border border-emerald-500/20">
                          <CodeIcon className="size-7" />
                        </div>
                        
                        <div className="size-6 rounded-full flex items-center justify-center border-2 border-emerald-500 bg-emerald-500 text-white">
                          <CheckIcon className="size-3.5" strokeWidth={3} />
                        </div>
                      </div>
                      
                      <div className="text-left mt-5 relative z-10 w-full">
                        <h4 className="text-lg font-black tracking-tight text-emerald-100">AI Coding Interview</h4>
                        <p className="text-xs mt-1.5 leading-relaxed font-medium text-emerald-200/60">Full Monaco Editor & DSA evaluation.</p>

                        <div className="mt-4 w-full h-1 rounded-full overflow-hidden bg-emerald-500/20">
                          <div className="h-full bg-emerald-500 w-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left */}
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label text-sm font-medium">Session Name *</label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-base-200/50 rounded-xl"
                        placeholder="e.g. Frontend Developer Interview"
                        value={formData.sessionName}
                        onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium">Job Description / Topics</label>
                      <textarea
                        className="textarea textarea-bordered w-full bg-base-200/50 rounded-xl h-24"
                        placeholder="React, Node.js, System Design..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium">Your Email (for report)</label>
                      <input
                        type="email"
                        className="input input-bordered w-full bg-base-200/50 rounded-xl"
                        value={formData.interviewerEmail}
                        onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Right */}
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label text-sm font-medium">Difficulty</label>
                      <select
                        className="select select-bordered w-full bg-base-200/50 rounded-xl"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium">
                        Duration
                        <span className="font-bold text-primary">{formData.maxDuration} min</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[30, 60, 90, 120].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => setFormData({ ...formData, maxDuration: mins })}
                            className={`btn btn-sm h-10 ${formData.maxDuration === mins ? "btn-primary shadow-lg shadow-primary/20" : "btn-ghost bg-base-200/50"}`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium">Session Expiry (Optional)</label>
                      <div className="relative">
                        <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-50" />
                        <input
                          type="datetime-local"
                          className="input input-bordered w-full bg-base-200/50 rounded-xl pl-10"
                          value={formData.expiresAt}
                          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-base-200/50 p-4 rounded-xl">
                      <span className="text-sm font-medium">Require Resume Upload</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={formData.resumeRequired}
                        onChange={(e) => setFormData({ ...formData, resumeRequired: e.target.checked })}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium">
                        Number of Questions
                        <span className="font-bold text-primary">{formData.questionCount}</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={formData.questionCount}
                        onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                        className="range range-primary range-sm"
                        step="1"
                      />
                    </div>

                    {/* Question Source */}
                    <div className="form-control">
                      <label className="label text-sm font-medium">Question Source</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "ai", label: "Autonomous AI Only", icon: SparklesIcon },
                          { id: "manual", label: "Manual Typed Only", icon: FileTextIcon },
                          { id: "mixed", label: "Mix (Custom + AI)", icon: BrainCircuitIcon },
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, questionMode: mode.id }))}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                              formData.questionMode === mode.id
                                ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                                : "bg-base-200/50 border-base-content/5 hover:border-base-content/20"
                            }`}
                          >
                            <mode.icon className="size-4" />
                            <span className="text-xs font-semibold">{mode.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══ CODING INTERVIEW CONFIG ═══ */}
                {formData.interviewType === "coding" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CodeIcon className="size-4 text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-400">Coding Interview Config</span>
                    </div>

                    {/* Language Selector */}
                    <div>
                      <label className="label text-xs font-bold uppercase tracking-widest opacity-60">Allowed Languages</label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_LANGUAGES.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => toggleLanguage(lang.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                              formData.codingLanguages.includes(lang.id)
                                ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                                : "bg-base-200/50 border border-base-content/5 opacity-60 hover:opacity-100"
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DSA Topic Selector */}
                    <div>
                      <label className="label text-xs font-bold uppercase tracking-widest opacity-60">DSA Topics</label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TOPICS.map((topic) => (
                          <button
                            key={topic}
                            onClick={() => toggleTopic(topic)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                              formData.codingTopics.includes(topic)
                                ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                                : "bg-base-200/50 border border-base-content/5 opacity-50 hover:opacity-100"
                            }`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Assistance Toggle */}
                    <div className="space-y-3 mt-4 pt-4 border-t border-emerald-500/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-emerald-400">AI Coding Assistant</span>
                          <p className="text-[10px] opacity-50">Candidates can ask AI for help/hints</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-success toggle-sm"
                          checked={formData.enableAIHelp}
                          onChange={(e) => setFormData({ ...formData, enableAIHelp: e.target.checked })}
                        />
                      </div>

                      {formData.enableAIHelp && (
                        <div className="flex items-center justify-between bg-base-100/30 p-2 rounded-lg ml-4 border border-white/5">
                          <span className="text-[11px] font-medium opacity-70 italic">Show Suggestion Button</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-xs"
                            checked={formData.aiHelpButton}
                            onChange={(e) => setFormData({ ...formData, aiHelpButton: e.target.checked })}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Password */}
                <div className="bg-base-200/30 p-5 rounded-2xl border border-base-content/5">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <LockIcon className="size-4 text-accent" />
                    <span>Session Password *</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input input-bordered w-full bg-base-200/50 rounded-xl pr-12"
                      placeholder="Minimum 4 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                  </div>
                  <p className="text-xs opacity-50 mt-2">Share this password with your candidate so they can access the interview.</p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Custom Questions */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-base-200/30 p-4 rounded-xl border border-base-content/5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <SparklesIcon className="size-5 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">
                        {formData.questionMode === "manual" ? "Manual Questions" : "Custom Questions + AI"}
                      </h4>
                      <p className="text-xs opacity-70 mt-1">
                        {formData.questionMode === "manual" 
                          ? `Add the ${formData.questionCount} questions you want. Only these will be used.`
                          : "Your questions will be asked first, then AI will generate more."
                        }
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowLibrary(!showLibrary)}
                    className="btn btn-xs btn-outline btn-warning rounded-lg"
                  >
                    <LinkIcon className="size-3 mr-1" />
                    {showLibrary ? "Hide Library" : "From Library"}
                  </button>
                </div>

                {showLibrary && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-base-300/50 rounded-xl overflow-hidden border border-warning/10"
                  >
                    <div className="p-3 bg-warning/5 border-b border-warning/10 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-warning opacity-70">
                        Standard DSA Question Library
                      </span>
                      <button 
                        onClick={addMandatoryQuestions}
                        className="btn btn-xs btn-warning rounded-full text-[9px] h-6 min-h-0"
                      >
                        Add Manual Questions (2)
                      </button>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="p-3 bg-base-300/30 border-b border-white/5 flex gap-2">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 opacity-40" />
                        <input 
                          type="text" 
                          placeholder="Search problems..."
                          className="input input-bordered input-xs w-full pl-9 bg-base-200/50 rounded-lg text-[10px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select 
                        className="select select-bordered select-xs bg-base-200/50 rounded-lg text-[10px]"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        <option value="Arrays">Arrays</option>
                        <option value="Strings">Strings</option>
                        <option value="Linked Lists">Linked Lists</option>
                        <option value="Trees">Trees</option>
                        <option value="Dynamic Programming">DP</option>
                      </select>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-2 grid grid-cols-1 gap-1">
                      {loadingLibrary ? (
                        <div className="flex items-center justify-center py-8">
                          <LoaderIcon className="size-5 animate-spin opacity-20" />
                        </div>
                      ) : libraryQuestions.length > 0 ? (
                        libraryQuestions.map((libQ) => (
                          <button
                            key={libQ._id}
                            type="button"
                            onClick={() => addFromLibrary(libQ)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left group border border-transparent hover:border-warning/10"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold group-hover:text-warning transition-colors">{libQ.title}</span>
                                <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded ${
                                  libQ.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' : 
                                  libQ.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 
                                  'bg-red-500/10 text-red-500'
                                }`}>
                                  {libQ.difficulty}
                                </span>
                              </div>
                              <p className="text-[10px] opacity-40 mt-0.5 italic">{libQ.category}</p>
                              <p className="text-[10px] opacity-70 mt-1 line-clamp-2 leading-relaxed bg-white/5 p-2 rounded border border-white/5">
                                {libQ.question}
                              </p>
                            </div>
                            <PlusIcon className="size-3 opacity-0 group-hover:opacity-100 text-warning" />
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8 opacity-40 text-xs">No questions found matching your search</div>
                      )}
                    </div>
                  </motion.div>
                )}

                {formData.customQuestions.length < formData.questionCount && !showLibrary && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-400">
                    <span className="font-bold">Note:</span> You have added {formData.customQuestions.length} of {formData.questionCount} questions.
                  </div>
                )}

                {/* Question List */}
                <div className="space-y-3">
                  {formData.customQuestions.map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 bg-base-200/30 p-4 rounded-xl border border-base-content/5"
                    >
                      <span className="text-xs font-bold text-primary mt-1 min-w-[28px]">Q{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm">{q.question}</p>
                        <span className="badge badge-sm badge-ghost mt-1 capitalize">{q.category}</span>
                      </div>
                      <button onClick={() => removeQuestion(i)} className="btn btn-ghost btn-xs text-error">
                        <Trash2Icon className="size-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Add Question */}
                <div className="flex flex-col gap-3 bg-base-100/50 p-4 rounded-xl border border-white/5">
                  <div className="flex gap-2">
                    <select
                      className="select select-bordered select-sm bg-base-200/50 rounded-lg flex-1"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="technical">Technical</option>
                      <option value="dsa">Data Structures & Algos</option>
                      <option value="logic">Logical Reasoning</option>
                      <option value="behavioral">Behavioral</option>
                    </select>
                    <button 
                      onClick={addQuestion} 
                      className="btn btn-sm btn-primary rounded-lg px-4 gap-2" 
                      disabled={!newQuestion.trim()}
                    >
                      <PlusIcon className="size-4" />
                      Add Question
                    </button>
                  </div>
                  <textarea
                    className="textarea textarea-bordered bg-base-200/50 rounded-lg w-full text-sm min-h-[100px]"
                    placeholder="Enter your question here... (Tip: Include examples/constraints for coding problems)"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && createdSession && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckIcon className="size-10 text-green-400" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold">Session Created!</h3>
                  <p className="text-base-content/60 mt-2">Share the link below with your candidate.</p>
                  {formData.interviewType === "coding" && (
                    <span className="badge badge-sm bg-emerald-500/10 text-emerald-400 border-emerald-500/30 mt-2">💻 Coding Interview</span>
                  )}
                </div>

                {/* Shareable Link */}
                <div className="bg-base-200/50 rounded-2xl p-5 border border-base-content/5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LinkIcon className="size-4 text-primary" />
                    <span>Interview Link</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getShareLink()}
                      className="input input-bordered w-full bg-base-100 text-xs font-mono rounded-xl"
                    />
                    <button onClick={copyLink} className="btn btn-primary btn-sm rounded-lg gap-1">
                      {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Session ID */}
                <div className="bg-base-200/30 rounded-xl p-4 text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="opacity-60">Session ID</span>
                    <span className="font-mono">{createdSession._id}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-60">Password</span>
                    <span className="font-mono">{formData.password}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-60">Type</span>
                    <span className="font-mono capitalize">{formData.interviewType === "coding" ? "💻 Coding" : "💬 Q&A"}</span>
                  </div>
                  {formData.customQuestions.length > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="opacity-60">Custom Questions</span>
                      <span>{formData.customQuestions.length}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-base-200 bg-base-100/50 backdrop-blur-xl flex justify-between">
          {step === 1 && (
            <>
              <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
              <button
                type="button"
                className="btn btn-primary px-6 rounded-xl"
                onClick={() => {
                  console.log("Current Mode:", formData.questionMode); 
                  if (formData.questionMode === "ai") {
                    handleCreate();
                  } else {
                    setStep(2);
                  }
                }}
                disabled={!formData.sessionName || !formData.password || loading}
              >
                {formData.questionMode === "ai"
                  ? (loading ? <LoaderIcon className="size-5 animate-spin" /> : "Create Session")
                  : "Next: Questions →"
                }
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/25" onClick={handleCreate} disabled={loading}>
                {loading ? <LoaderIcon className="size-5 animate-spin" /> : "Create Session"}
              </button>
            </>
          )}
          {step === 3 && (
            <button className="btn btn-primary w-full rounded-xl" onClick={handleClose}>
              Done
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateAIInterviewModal;
