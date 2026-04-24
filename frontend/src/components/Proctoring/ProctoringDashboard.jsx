import React, { useEffect, useState } from 'react';
import {
    Users,
    Eye,
    MousePointer,
    Keyboard,
    Globe,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Copy,
    Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router";

/**
 * ProctoringDashboard
 * 
 * Visualization component for the Interviewer side.
 * Connects to simple prop-based stats or (in future) Socket.io stream.
 * 
 * Props:
 * - stats: { isFaceVisible, mouseRegion, wpm, isTabActive, copyPasteDetected }
 */
const ProctoringDashboard = ({ stats }) => {
    const { id } = useParams();

    // If no stats provided, use defaults (or loading state)
    const {
        mouseRegion = "Center",
        wpm = 0,
        isTabActive = true,
        copyPasteDetected = false
    } = stats || {};

    // Local violations history
    const [violations, setViolations] = useState([]);

    useEffect(() => {
        if (!isTabActive) addViolation("Tab Switched", "warning");
        if (copyPasteDetected) addViolation("Copy/Paste Detected", "warning");
    }, [isTabActive, copyPasteDetected]);

    const addViolation = (msg, type) => {
        setViolations(prev => {
            // Prevent spamming same violation
            if (prev.length > 0 && prev[0].msg === msg && (Date.now() - prev[0].timestamp < 3000)) return prev;

            return [{ msg, type, timestamp: Date.now() }, ...prev].slice(0, 10);
        });
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl border border-gray-800 h-full flex flex-col gap-6">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    <Activity className="text-blue-400 animate-pulse" />
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Live Proctoring
                    </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    LIVE MONITORING
                </div>
            </div>

            {/* MAIN STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">



                {/* 2. TAB FOCUS */}
                <StatCard
                    label="Tab Focus"
                    value={isTabActive ? "Active" : "Background"}
                    icon={Globe}
                    color={isTabActive ? "text-green-400" : "text-orange-500"}
                    subtext={isTabActive ? "User is on page" : "User switched tab"}
                />

                {/* 3. TYPING SPEED */}
                <StatCard
                    label="Typing Speed"
                    value={`${wpm} WPM`}
                    icon={Keyboard}
                    color="text-blue-400"
                    subtext={wpm > 60 ? "Fast Typist" : "Normal Pace"}
                />

                {/* 4. MOUSE REGION */}
                <StatCard
                    label="Mouse Region"
                    value={mouseRegion || "Center"}
                    icon={MousePointer}
                    color="text-purple-400"
                    subtext="Screen Area"
                />
            </div>

            {/* VIOLATION LOG & HEATMAP PLACEHOLDER */}
            <div className="flex flex-1 gap-4 min-h-0">

                {/* VIOLATION LOG */}
                <div className="flex-1 bg-black/20 rounded-xl p-4 overflow-hidden flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Event Log</h3>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                        <AnimatePresence>
                            {violations.length === 0 && (
                                <p className="text-gray-600 text-sm text-center italic mt-10">No violations detected yet.</p>
                            )}
                            {violations.map((v) => (
                                <motion.div
                                    key={v.timestamp}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${v.type === 'critical'
                                        ? 'bg-red-500/10 border-red-500/20 text-red-200'
                                        : 'bg-orange-500/10 border-orange-500/20 text-orange-200'
                                        }`}
                                >
                                    {v.type === 'critical' ? <AlertTriangle size={16} /> : <AlertTriangle size={16} />}
                                    <span className="flex-1 font-medium">{v.msg}</span>
                                    <span className="text-xs opacity-60">
                                        {new Date(v.timestamp).toLocaleTimeString()}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* LIVE FEED - GAZE TRACKING (REMOVED) */}
                <div className="flex-1 bg-black/20 rounded-xl overflow-hidden border border-gray-800 relative flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Live Feed Disabled</p>
                </div>

            </div>
        </div>
    );
};

// Sub-component for individual cards
const StatCard = ({ label, value, icon: Icon, color, subtext }) => (
    <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
        <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            <div className={`p-2 rounded-lg bg-black/20 ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={16} />
            </div>
        </div>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </div>
);

export default ProctoringDashboard;
