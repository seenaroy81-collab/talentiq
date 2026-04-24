import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { 
    CheckCircle2, AlertTriangle, MessageSquare, 
    Award, ArrowLeft, Download, Share2, 
    MousePointer, Keyboard, Monitor, Eye, 
    ChevronRight, ChevronDown, User, Bot, Star,
    Flame, Code
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

// ─────────────────────────────────────────────────
// Heatmap Canvas Component (no external library)
// ─────────────────────────────────────────────────
const GazeHeatmap = ({ heatmapData = [], width = 360, height = 220 }) => {
    const canvasRef = useRef(null);

    const drawHeatmap = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || heatmapData.length === 0) return;

        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw background grid (simulates a screen)
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Normalize data points to canvas dimensions
        // Original data was captured at screen resolution, scale down
        const maxX = Math.max(...heatmapData.map(p => p.x), 1920);
        const maxY = Math.max(...heatmapData.map(p => p.y), 1080);

        // Build density grid
        const gridSize = 8;
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);
        const density = new Float32Array(cols * rows);

        heatmapData.forEach(point => {
            const nx = (point.x / maxX) * width;
            const ny = (point.y / maxY) * height;
            const col = Math.floor(nx / gridSize);
            const row = Math.floor(ny / gridSize);
            
            // Apply gaussian-like spread to nearby cells
            const spread = 3;
            for (let dr = -spread; dr <= spread; dr++) {
                for (let dc = -spread; dc <= spread; dc++) {
                    const r = row + dr;
                    const c = col + dc;
                    if (r >= 0 && r < rows && c >= 0 && c < cols) {
                        const dist = Math.sqrt(dr * dr + dc * dc);
                        const weight = Math.exp(-(dist * dist) / (2 * 1.5 * 1.5));
                        density[r * cols + c] += weight;
                    }
                }
            }
        });

        const maxDensity = Math.max(...density, 1);

        // Draw heatmap cells
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const val = density[r * cols + c] / maxDensity;
                if (val < 0.01) continue;

                // Color gradient: blue -> cyan -> green -> yellow -> red
                let red, green, blue, alpha;
                if (val < 0.25) {
                    const t = val / 0.25;
                    red = 0; green = Math.round(t * 255); blue = 255;
                    alpha = 0.15 + t * 0.2;
                } else if (val < 0.5) {
                    const t = (val - 0.25) / 0.25;
                    red = 0; green = 255; blue = Math.round(255 * (1 - t));
                    alpha = 0.35 + t * 0.2;
                } else if (val < 0.75) {
                    const t = (val - 0.5) / 0.25;
                    red = Math.round(255 * t); green = 255; blue = 0;
                    alpha = 0.55 + t * 0.15;
                } else {
                    const t = (val - 0.75) / 0.25;
                    red = 255; green = Math.round(255 * (1 - t)); blue = 0;
                    alpha = 0.7 + t * 0.2;
                }

                ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(
                    c * gridSize + gridSize / 2,
                    r * gridSize + gridSize / 2,
                    gridSize * 0.8,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }

        // Draw center crosshair reference
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }, [heatmapData, width, height]);

    useEffect(() => {
        drawHeatmap();
    }, [drawHeatmap]);

    if (!heatmapData || heatmapData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Eye className="text-gray-600 mb-2" size={28} />
                <p className="text-xs text-gray-500">No gaze tracking data recorded</p>
                <p className="text-[10px] text-gray-600 mt-1">Complete calibration during interview to enable</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                style={{ width: `${width}px`, height: `${height}px` }}
                className="rounded-xl border border-white/10 w-full"
            />
            {/* Legend */}
            <div className="flex items-center justify-between mt-3 px-1">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Low Focus</span>
                <div className="flex-1 mx-3 h-1.5 rounded-full" style={{
                    background: "linear-gradient(to right, #3b82f6, #06b6d4, #22c55e, #eab308, #ef4444)"
                }} />
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">High Focus</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">
                {heatmapData.length.toLocaleString()} gaze points recorded
            </p>
        </div>
    );
};


// ─────────────────────────────────────────────────
// Main Review Page
// ─────────────────────────────────────────────────
const InterviewReviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [interview, setInterview] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axios.get(`${API_URL}/ai-interview/${id}`);
                setInterview(res.data);
            } catch (err) {
                console.error("Failed to fetch interview review:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [id, API_URL]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full mb-4"
                />
                <p className="text-gray-400 animate-pulse font-medium tracking-widest uppercase text-xs">Generating Your Report...</p>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-6 text-center">
                <AlertTriangle size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
                <p className="text-gray-400 mb-6">We couldn't retrieve the data for this interview session.</p>
                <button 
                    onClick={() => navigate("/dashboard")} 
                    className="btn btn-primary"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // ── Calculate Overall Stats ──
    const conversation = interview.conversation || [];
    const codeSubmissions = interview.codeSubmissions || [];
    const codingQuestions = interview.codingQuestions || [];
    const isCodingInterview = interview.interviewType === "coding";
    
    // Filter AI turns that come AFTER the first welcome message (skip index 0)
    // Use (score ?? 0) so undefined/null scores count as 0 instead of being excluded
    const aiTurnsWithScores = conversation
        .slice(1) // skip welcome message
        .filter(m => m.role === "ai");
    
    const avgScore = aiTurnsWithScores.length > 0 
        ? (aiTurnsWithScores.reduce((acc, curr) => acc + (curr.score ?? 0), 0) / aiTurnsWithScores.length).toFixed(1)
        : 0;

    const violations = interview.proctoringData?.violations || [];
    const lastStats = interview.proctoringData?.lastStats || {};
    const heatmapData = interview.proctoringData?.heatmapData || [];

    // Logic for Overall Rating
    const getRatingLabel = (score) => {
        if (score >= 8) return { label: "Excellent", color: "text-green-400", bg: "bg-green-400/10", accent: "from-green-500 to-emerald-600" };
        if (score >= 6) return { label: "Good", color: "text-blue-400", bg: "bg-blue-400/10", accent: "from-blue-500 to-indigo-600" };
        if (score >= 4) return { label: "Average", color: "text-yellow-400", bg: "bg-yellow-400/10", accent: "from-yellow-500 to-orange-600" };
        return { label: "Needs Improvement", color: "text-red-400", bg: "bg-red-400/10", accent: "from-red-500 to-rose-600" };
    };

    const rating = getRatingLabel(parseFloat(avgScore));

    // Get score color for per-question badges
    const getScoreColor = (score) => {
        if (score >= 8) return "text-green-400 bg-green-500/10 border-green-500/20";
        if (score >= 6) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
        if (score >= 4) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
        return "text-red-400 bg-red-500/10 border-red-500/20";
    };

    // Pair up Q&A: each candidate message followed by the AI's evaluation
    const qaPairs = [];
    const convoSlice = conversation.slice(1); // skip welcome
    for (let i = 0; i < convoSlice.length; i++) {
        if (convoSlice[i].role === "candidate") {
            qaPairs.push({
                question: i > 0 ? convoSlice[i - 1]?.content : null, // previous AI msg was the question
                candidateAnswer: convoSlice[i],
                aiEvaluation: convoSlice[i + 1]?.role === "ai" ? convoSlice[i + 1] : null
            });
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <motion.button 
                        whileHover={{ x: -4 }}
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </motion.button>
                    
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm transition-all">
                            <Download size={16} />
                            Download PDF
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                            <Share2 size={16} />
                            Share Results
                        </button>
                    </div>
                </div>

                {/* Hero Summary Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden group mb-8"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity rounded-3xl"></div>
                    <div className="relative border border-white/10 bg-white/5 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl overflow-hidden">
                        {/* Background Orbs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -ml-32 -mb-32"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${rating.bg} ${rating.color} mb-4 border border-white/5`}>
                                    Interview Complete
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                                    Overall Interview <br />Performance <span className="text-blue-500">Analysis</span>
                                </h1>
                                <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                                    Your interview for <span className="text-white font-medium">"{interview.jobDescription}"</span> has been analyzed based on communication, technical accuracy, and engagement.
                                </p>
                            </div>
                            
                            <div className="lg:col-span-4 flex flex-col items-center justify-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle 
                                            cx="80" cy="80" r="70" 
                                            fill="transparent" 
                                            stroke="rgba(255,255,255,0.05)" 
                                            strokeWidth="10" 
                                        />
                                        <motion.circle 
                                            initial={{ strokeDasharray: "0 440" }}
                                            animate={{ strokeDasharray: `${(parseFloat(avgScore) / 10) * 440} 440` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            cx="80" cy="80" r="70" 
                                            fill="transparent" 
                                            stroke={parseFloat(avgScore) >= 6 ? "#22c55e" : parseFloat(avgScore) >= 4 ? "#eab308" : "#ef4444"}
                                            strokeWidth="10" 
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black tracking-tighter">{avgScore}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Score / 10</span>
                                    </div>
                                </div>
                                <div className={`mt-4 font-black uppercase tracking-widest text-sm ${rating.color}`}>
                                    {rating.label}
                                </div>
                            </div>
                        </div>

                        {/* Per-Question Score Bar */}
                        {aiTurnsWithScores.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Per-Question Scores</h4>
                                <div className="flex items-end gap-2">
                                    {aiTurnsWithScores.map((turn, idx) => {
                                        const s = turn.score ?? 0;
                                        const barHeight = Math.max(8, (s / 10) * 60);
                                        const barColor = s >= 8 ? "bg-green-500" : s >= 6 ? "bg-blue-500" : s >= 4 ? "bg-yellow-500" : "bg-red-500";
                                        return (
                                            <motion.div 
                                                key={idx} 
                                                className="flex flex-col items-center gap-1 flex-1"
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <span className="text-[10px] font-bold text-gray-400">{s}</span>
                                                <div className={`w-full max-w-[40px] rounded-t-md ${barColor} transition-all`} style={{ height: `${barHeight}px` }} />
                                                <span className="text-[9px] text-gray-600">Q{idx + 1}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Detailed Conversation Analysis */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <MessageSquare className="text-blue-500" size={20} />
                                Q&A Analysis
                            </h2>
                        </div>

                        {qaPairs.map((pair, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-3"
                            >
                                {/* Candidate's Answer */}
                                <div className="group p-6 rounded-2xl border transition-all duration-300 bg-blue-600/5 border-blue-500/10 hover:border-blue-500/30">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 p-2 rounded-lg bg-blue-500 text-white">
                                            <User size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                Candidate Response
                                            </span>
                                            <p className="text-gray-200 leading-relaxed text-sm mt-2">
                                                {pair.candidateAnswer.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Evaluation */}
                                {pair.aiEvaluation && (
                                    <div className="group p-6 rounded-2xl border transition-all duration-300 bg-white/[0.03] border-white/5 hover:border-white/20">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 p-2 rounded-lg bg-gray-800 text-gray-400">
                                                <Bot size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                        AI Interviewer
                                                    </span>
                                                    {pair.aiEvaluation.score != null && (
                                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getScoreColor(pair.aiEvaluation.score)}`}>
                                                            <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                                            <span className="text-xs font-bold">{pair.aiEvaluation.score}/10</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-gray-200 leading-relaxed text-sm mb-4">
                                                    {pair.aiEvaluation.content}
                                                </p>

                                                {(pair.aiEvaluation.feedback || pair.aiEvaluation.idealAnswer) && (
                                                    <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
                                                        {pair.aiEvaluation.feedback && (
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Evaluation Feedback</h4>
                                                                <p className="text-xs text-blue-100/70 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 italic">
                                                                    "{pair.aiEvaluation.feedback}"
                                                                </p>
                                                            </div>
                                                        )}
                                                        {pair.aiEvaluation.idealAnswer && (
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Reference Answer Points</h4>
                                                                <div className="text-xs text-purple-100/70 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
                                                                    {pair.aiEvaluation.idealAnswer.split('. ').map((point, pIdx) => (
                                                                        <div key={pIdx} className="flex gap-2 mb-1">
                                                                            <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                                                                            <span>{point}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* ═══ CODE SUBMISSIONS SECTION (Coding Interviews) ═══ */}
                    {isCodingInterview && codeSubmissions.length > 0 && (
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Code className="text-emerald-500" size={20} />
                                    Code Submissions
                                </h2>
                                <span className="text-xs text-gray-500">
                                    {codeSubmissions.length} submission{codeSubmissions.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {codeSubmissions.map((submission, idx) => {
                                const question = codingQuestions[submission.questionIndex];
                                const review = submission.aiReview || {};

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-6 rounded-2xl border bg-emerald-600/5 border-emerald-500/10 hover:border-emerald-500/30 transition-all space-y-4"
                                    >
                                        {/* Question Header */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                                    Q{submission.questionIndex + 1} • {question?.topic || 'DSA'} • {question?.difficulty || 'Medium'}
                                                </span>
                                                <h3 className="text-lg font-bold text-white mt-1">
                                                    {question?.title || `Question ${submission.questionIndex + 1}`}
                                                </h3>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getScoreColor(review.score || 0)}`}>
                                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                                <span className="text-xs font-bold">{review.score ?? 0}/10</span>
                                            </div>
                                        </div>

                                        {/* Code Block */}
                                        <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
                                            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                                                    {submission.language}
                                                </span>
                                                <span className="text-[10px] text-gray-500">
                                                    {submission.code?.split('\n').length} lines
                                                </span>
                                            </div>
                                            <pre className="p-4 text-xs text-gray-200 font-mono leading-relaxed overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
                                                <code>{submission.code}</code>
                                            </pre>
                                        </div>

                                        {/* AI Review Metrics */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {review.timeComplexity && (
                                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">Time Complexity</span>
                                                    <p className="text-xs text-blue-200 font-mono mt-1">{review.timeComplexity}</p>
                                                </div>
                                            )}
                                            {review.spaceComplexity && (
                                                <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400">Space Complexity</span>
                                                    <p className="text-xs text-purple-200 font-mono mt-1">{review.spaceComplexity}</p>
                                                </div>
                                            )}
                                        </div>

                                        {review.correctness && (
                                            <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-green-400">Correctness</span>
                                                <p className="text-xs text-green-200 mt-1">{review.correctness}</p>
                                            </div>
                                        )}

                                        {review.codeQuality && (
                                            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-3">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">Code Quality</span>
                                                <p className="text-xs text-cyan-200 mt-1">{review.codeQuality}</p>
                                            </div>
                                        )}

                                        {review.suggestions && (
                                            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-400">Suggestions</span>
                                                <p className="text-xs text-yellow-200 mt-1 italic">{review.suggestions}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Right: Proctoring & Secondary Stats */}
                    <div className="space-y-8">
                        {/* Behavioral Health Stat */}
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <AlertTriangle className="text-yellow-500" size={18} />
                                Integrity Score
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-3xl font-black">{Math.max(0, 100 - (violations.length * 10))}%</span>
                                        <span className="text-xs text-gray-500 font-bold block">Trust Rating</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-red-400">{violations.length}</span>
                                        <span className="text-xs text-gray-500 font-bold block">Violations</span>
                                    </div>
                                </div>
                                
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.max(0, 100 - (violations.length * 10))}%` }}
                                        className={`h-full ${violations.length > 5 ? 'bg-red-500' : 'bg-green-500'}`}
                                    />
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Monitor size={14} />
                                            <span>Tab Stability</span>
                                        </div>
                                        <span className={violations.filter(v => v.type === 'tab_off' || v.type === 'Tab Switched').length > 0 ? 'text-red-400' : 'text-green-400 font-bold'}>
                                            {violations.filter(v => v.type === 'tab_off' || v.type === 'Tab Switched').length > 0 ? 'Low' : 'Excellent'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Eye size={14} />
                                            <span>Gaze Focus</span>
                                        </div>
                                        <span className={lastStats.gazeStatus === 'Off Screen' ? 'text-yellow-400' : 'text-green-400 font-bold'}>
                                            {lastStats.gazeStatus || 'On Screen'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── GAZE HEATMAP ── */}
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Flame className="text-orange-500" size={18} />
                                Gaze Heatmap
                            </h3>
                            <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest">
                                Screen focus distribution during interview
                            </p>
                            <GazeHeatmap heatmapData={heatmapData} />
                        </div>

                        {/* Violation Feed */}
                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Event Log</h3>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {violations.length === 0 ? (
                                    <div className="text-center py-8">
                                        <CheckCircle2 className="mx-auto text-green-500/50 mb-2" size={32} />
                                        <p className="text-xs text-gray-500">Perfect Honor Record</p>
                                    </div>
                                ) : (
                                    violations.map((v, i) => (
                                        <div key={i} className="flex gap-3 text-xs p-2 bg-white/5 rounded-lg border border-white/5">
                                            <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-200 capitalize">{v.type?.replace('_', ' ')} detected</p>
                                                <p className="text-[10px] text-gray-500">{new Date(v.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <Keyboard className="text-blue-400 mb-2" size={16} />
                                <span className="block text-xl font-bold">{lastStats.wpm || 0}</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Avg. WPM</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <MousePointer className="text-purple-400 mb-2" size={16} />
                                <span className="block text-lg font-bold truncate">{lastStats.mouseRegion || 'Center'}</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mouse Region</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}
            </style>
        </div>
    );
};

export default InterviewReviewPage;
