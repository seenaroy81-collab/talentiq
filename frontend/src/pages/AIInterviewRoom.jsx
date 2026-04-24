import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff,
    MessageSquare, Settings, Send, LogOut,
    Volume2, VolumeX, Activity, Play, Square, AlertCircle,
    MousePointer, Keyboard, Users2 as Users2Icon, ClipboardPaste
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useReactMediaRecorder } from "react-media-recorder";
import IndianEnglishSpeechService from "../services/indianEnglishSpeechService";
import TextToSpeechService from "../services/textToSpeechService";
import ProctoringTracker from "../components/Proctoring/ProctoringTracker";
import GazeCalibration from "../components/Proctoring/GazeCalibration";
import { gazeTracker } from "../lib/gaze-tracking";
import { io } from "socket.io-client";

// Note: ensured all imports needed for icons (Play, Square) are present or removed if unused.
// Re-adding 'RefreshCw' and 'ChevronDown' if they were used. 
// Actually, let's stick to the list that was provided in the previous valid block if possible.
// Based on line 8 of the view_file: Volume2, Activity, RefreshCw, ChevronDown were there.
// I will ensure the imports align with usage.

const Visualizer = ({ audioStream }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!audioStream || !audioStream.active) return;

        const audioTracks = audioStream.getAudioTracks();
        if (audioTracks.length === 0) {
            // No audio tracks available yet
            return;
        }

        let audioCtx;
        let animationId;

        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(audioStream);
            source.connect(analyser);

            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            const draw = () => {
                animationId = requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);

                ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 2;

                    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    gradient.addColorStop(0, '#60a5fa'); // Blue-400
                    gradient.addColorStop(1, '#3b82f6'); // Blue-500

                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                    x += barWidth + 1;
                }
            };

            draw();
        } catch (err) {
            console.warn("Visualizer Error:", err);
        }

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
        };
    }, [audioStream]);

    return <canvas ref={canvasRef} width={200} height={50} className="w-full h-full" />;
};

const AIInterviewRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [messages, setMessages] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    // CORE STATE
    const [isThinking, setIsThinking] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false); // AI Speaking
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [cameraError, setCameraError] = useState(null);
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
    const [userDraft, setUserDraft] = useState(""); // The text to be sent

    // GAZE CALIBRATION STATE
    const [isCalibrated, setIsCalibrated] = useState(false);

    // MISSING STATES RESTORED
    const [isTTSMuted, setIsTTSMuted] = useState(false);

    const [isListening, setIsListening] = useState(false);
    const [isEnding, setIsEnding] = useState(false); // For transition to review
    const [socket, setSocket] = useState(null);

    const handleEndInterview = async () => {
        const shouldEnd = window.confirm('Are you sure you want to end this interview?');
        if (shouldEnd) {
            setIsEnding(true);
            try {
                await axios.post(`${API_URL}/ai-interview/${id}/end`);
                addLog("Interview Status: Completed. Redirecting to review...");
            } catch (err) {
                console.error("Failed to end interview status:", err);
            }
            // 5 second delay as requested
            setTimeout(() => {
                navigate(`/ai-interview/${id}/review`);
            }, 5000);
        }
    };

    // Speech Recognition State
    const [speechSupported, setSpeechSupported] = useState(false);
    const [transcriptConfidence, setTranscriptConfidence] = useState(0);

    // Refs
    const speechServiceRef = useRef(null);
    const ttsServiceRef = useRef(null);


    // --- PROCTORING TRACKER ---
    const [trackerStats, setTrackerStats] = useState({
        mouseRegion: "Center",
        wpm: 0,
        isTabActive: true,
        copyPasteDetected: false,
        gazeStatus: "On Screen",
        faceDetected: true
    });

    // DESTRUCTURE FOR USE IN JSX
    const { mouseRegion, wpm, isTabActive, copyPasteDetected, gazeStatus, faceDetected } = trackerStats;

    const handleTrackerUpdate = useCallback((stats) => {
        setTrackerStats(prev => {
            // Prevent redundant re-renders if stats are identical
            if (prev.mouseRegion === stats.mouseRegion &&
                prev.wpm === stats.wpm &&
                prev.isTabActive === stats.isTabActive &&
                prev.copyPasteDetected === stats.copyPasteDetected &&
                prev.gazeStatus === stats.gazeStatus &&
                prev.faceDetected === stats.faceDetected) {
                return prev;
            }
            return stats;
        });
    }, []);



    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log("[AI-ROOM] Unmounting - Cleaning up services");
            if (speechServiceRef.current) speechServiceRef.current.destroy();
            if (ttsServiceRef.current) ttsServiceRef.current.stop();
        };
    }, []);

    // ... (rest of code)



    // MEDIA RECORDER
    const {
        status: recorderStatus,
        startRecording: startMediaRec,
        stopRecording: stopMediaRec,
        previewStream
    } = useReactMediaRecorder({
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
        askPermissionOnMount: true
    });



    // LOGGING
    const [logs, setLogs] = useState([]);
    const addLog = (msg) => {
        setLogs(prev => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 8));
        console.log(`[AI-ROOM] ${msg}`);
    };

    // --- ENHANCED SPEECH RECOGNITION SETUP ---
    useEffect(() => {
        // Check if speech recognition is supported
        const isSupported = IndianEnglishSpeechService.isSupported();
        setSpeechSupported(isSupported);

        if (isSupported) {
            // Create and initialize the speech service
            const service = new IndianEnglishSpeechService();
            speechServiceRef.current = service;

            // Set up transcript callback - THIS IS CRITICAL FOR REAL-TIME TEXT
            service.onTranscript((result) => {
                const { text, isFinal, interim } = result;

                console.log('[TRANSCRIPT UPDATE]', { text, isFinal, interim });

                // Update the draft text in REAL-TIME
                setUserDraft(text);

                // Log only final transcripts to avoid spam
                if (isFinal) {
                    addLog(`📝 "${text}"`);
                }
            });

            // Set up status callback
            service.onStatus((status) => {
                console.log('[STATUS]', status);
                if (status.status === 'listening') {
                    setIsListening(true);
                    addLog("✅ 🎤 LISTENING - Speak now!");
                } else if (status.status === 'stopped') {
                    setIsListening(false);
                }
            });

            // Set up error callback
            service.onError((errorInfo) => {
                const { message } = errorInfo;
                addLog(`❌ ${message}`);

                // Show alert for critical errors
                if (message.includes('permission') || message.includes('microphone')) {
                    alert(`🎤 ${message}\n\nPlease allow microphone access in your browser settings.`);
                }
            });

            // Initialize the service
            service.initialize().then(result => {
                if (result.success) {
                    addLog("✅ Enhanced Speech Engine Ready");
                    addLog("🎯 Real-time transcription enabled");
                } else {
                    addLog(`❌ Initialization failed: ${result.error}`);
                }
            });
        } else {
            addLog("❌ Speech Recognition NOT supported - Use Chrome/Edge");
        }

        // Cleanup on unmount
        return () => {
            if (speechServiceRef.current) {
                speechServiceRef.current.destroy();
            }
        };
    }, []);

    // --- TEXT-TO-SPEECH INITIALIZATION ---
    useEffect(() => {
        if (TextToSpeechService.isSupported()) {
            const tts = new TextToSpeechService();
            ttsServiceRef.current = tts;
            tts.setMuted(isTTSMuted);
            console.log('[AI-ROOM] 🔊 TTS Service initialized');
        } else {
            console.warn('[AI-ROOM] ⚠️ TTS not supported in this browser');
        }

        // Cleanup
        return () => {
            if (ttsServiceRef.current) {
                ttsServiceRef.current.stop();
                ttsServiceRef.current = null;
            }
        };
    }, []);

    // Update TTS mute state
    useEffect(() => {
        if (ttsServiceRef.current) {
            ttsServiceRef.current.setMuted(isTTSMuted);
        }
    }, [isTTSMuted]);



    // --- INITIALIZATION ---
    useEffect(() => {
        const init = async () => {
            // 1. Load Interview
            try {
                const res = await axios.get(`${API_URL}/ai-interview/${id}`);
                setInterview(res.data);
                setMessages(res.data.conversation || []);
                addLog("Interview Loaded");
            } catch (err) {
                addLog(`Error: ${err.message}`);
            }

            // 2. Load Audio Devices
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const inputs = devices.filter(d => d.kind === 'audioinput');
                setAudioDevices(inputs);
                if (inputs.length > 0) setSelectedAudioDevice(inputs[0].deviceId);
                addLog(`Found ${inputs.length} microphone(s)`);
            } catch (err) {
                addLog("Could not enumerate devices");
            }

            // Check Mic Permission
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
                addLog("✅ Microphone Access Granted");
            } catch (err) {
                addLog("❌ Microphone Access DENIED");
            }
        };
        init();

        // Socket Initialization
        const socketUrl = API_URL.replace("/api", ""); // simplistic strip
        const newSocket = io(socketUrl);
        newSocket.emit("join-interview", id);
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [id]);

    useEffect(() => {
        if (isCalibrated) {
            startWebcam();
        }
    }, [isCalibrated]);

    // --- MANAGERS ---

    const startWebcam = async () => {
        try {
            addLog("🎥 Starting webcam...");
            
            // Wait for GazeTracker to load its stream if it hasn't yet!
            let stream = gazeTracker.getVideoStream();
            let attempts = 0;
            while (!stream && attempts < 20) {
                await new Promise(r => setTimeout(r, 200));
                stream = gazeTracker.getVideoStream();
                attempts++;
            }

            if (!stream) {
                // Fallback if gaze tracker didn't initialize one
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // Wait for video to be ready
                return new Promise((resolve, reject) => {
                    const checkReady = () => {
                        if (videoRef.current.readyState >= 2) {
                            addLog(`✅ Camera Ready (${videoRef.current.videoWidth}x${videoRef.current.videoHeight})`);
                            console.log('[CAMERA] Video element ready:', {
                                readyState: videoRef.current.readyState,
                                dimensions: `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`
                            });
                            resolve(true);
                        } else {
                            setTimeout(checkReady, 100);
                        }
                    };
                    checkReady();

                    // Timeout after 5 seconds
                    setTimeout(() => reject(new Error('Camera timeout')), 5000);
                });
            }
        } catch (err) {
            console.error('[CAMERA] Initialization failed:', err);
            addLog(`⚠️ Camera Busy or Error`);
            setCameraError("Camera Connect Failed");
            // Do NOT throw, so the rest of the app can load.
        }
    };

    const toggleVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getVideoTracks();
            tracks.forEach(track => track.enabled = !isVideoOn);
            setIsVideoOn(!isVideoOn);
        } else {
            startWebcam();
            setIsVideoOn(true);
        }
    }

    // ... handleStartRecording, handleStopRecording, handleSendMessage, speak, refs...

    const handleStartRecording = async () => {
        console.log('[DEBUG] handleStart called, isListening:', isListening, 'speechSupported:', speechSupported);

        if (!speechSupported) {
            alert("❌ Speech Recognition not supported\n\nPlease use Google Chrome or Microsoft Edge browser.");
            return;
        }

        if (isListening) {
            addLog("⚠️ Already listening! Click Stop first.");
            return;
        }

        setUserDraft(""); // Clear previous text
        setTranscriptConfidence(0); // Reset confidence
        addLog("Starting Enhanced Speech Recognition...");

        try {
            // Start enhanced speech recognition with selected device
            if (speechServiceRef.current) {
                const result = await speechServiceRef.current.start(selectedAudioDevice);

                if (result.success) {
                    addLog("✅ Speech recognition started successfully");

                    // Start audio visualizer (slight delay for stream setup)
                    setTimeout(() => {
                        try {
                            startMediaRec();
                        } catch (e) {
                            addLog("Visualizer start failed (non-critical)");
                        }
                    }, 300);
                } else {
                    addLog(`❌ Failed to start: ${result.error}`);
                    if (result.userAction) {
                        alert(`${result.error}\n\n${result.userAction}`);
                    }
                }
            } else {
                addLog("❌ Speech service not initialized");
            }
        } catch (e) {
            addLog(`Failed to start: ${e.message}`);
            console.error('[ERROR] Speech start failed:', e);
        }
    };



    const handleStopRecording = () => {
        try {
            // Stop enhanced speech recognition
            if (speechServiceRef.current && isListening) {
                speechServiceRef.current.stop();
            }

            // Stop audio visualizer
            stopMediaRec();

            // Show confidence summary
            const confidencePercent = (transcriptConfidence * 100).toFixed(0);
            if (transcriptConfidence > 0) {
                addLog(`Stopped. Confidence: ${confidencePercent}%. Review & click SEND.`);
            } else {
                addLog("Stopped. Review your text & click SEND.");
            }
        } catch (e) {
            addLog(`Stop failed: ${e.message}`);
        }
    };

    const handleSendMessage = async () => {
        if (!userDraft || userDraft.trim().length === 0) {
            addLog("Cannot send empty message");
            return;
        }

        setIsThinking(true);
        addLog(`Sending: "${userDraft}"`);

        // Optimistic UI Update
        const newMsgs = [...messages, { role: "candidate", content: userDraft }];
        setMessages(newMsgs);
        setUserDraft(""); // Clear input

        try {
            const res = await axios.post(`${API_URL}/ai-interview/${id}/chat`, { message: userDraft });
            const { response } = res.data;

            // Add AI Response
            setMessages([...newMsgs, { role: "ai", content: response }]);

            // Speak
            speak(response);

            // AUTO-DETECT COMPLETION FROM AI RESPONSE
            if (response.toLowerCase().includes("interview is complete") || response.toLowerCase().includes("thank you, the interview is complete")) {
                addLog("AI: Interview Complete detected. Finalizing...");
                setTimeout(() => {
                    setIsEnding(true);
                    axios.post(`${API_URL}/ai-interview/${id}/end`).catch(console.error);
                    setTimeout(() => {
                        navigate(`/ai-interview/${id}/review`);
                    }, 5000);
                }, 2000); // Small pause for the user to hear the AI say goodbye
            }

        } catch (err) {
            addLog(`Error: ${err.message}`);
            speak("I had trouble processing that. Please try again.");
        } finally {
            setIsThinking(false);
        }
    };

    // TTS using curated service
    const speak = (text) => {
        if (ttsServiceRef.current) {
            ttsServiceRef.current.speak(text, {
                onStart: () => setIsAISpeaking(true),
                onEnd: () => setIsAISpeaking(false),
                onError: () => setIsAISpeaking(false)
            });
        }
    };

    // REFS
    const videoRef = useRef(null);
    const canvasRef = useRef(null); // New Canvas Ref for Face Mesh
    const scrollRef = useRef(null);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const currentQuestion = messages.length > 0
        ? [...messages].reverse().find(m => m.role === 'ai')?.content
        : "Initialize Interview...";


    if (!interview) return <div className="h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 flex items-center justify-center text-white"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;



    // --- RENDER: INTERVIEW PHASE ---
    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950 text-white font-sans overflow-hidden relative">
            {/* Animated Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* PROCTORING TRACKER - Only active after calibration */}
            {isCalibrated && (
                <ProctoringTracker
                    onStatUpdate={handleTrackerUpdate}
                    userDraft={userDraft}
                    socket={socket}
                    sessionId={id}
                />
            )}

            {/* CALIBRATION OVERLAY */}
            {!isCalibrated && (
                <GazeCalibration onCalibrationComplete={() => setIsCalibrated(true)} />
            )}

            {/* MAIN CONTENT - Gated by Calibration (Visually hidden or blurred? Or just overlay on top) */}
            {/* If we want to strictly BLOCK access, we should only render content when isCalibrated is true OR render GazeCalibration as a fullscreen modal on top. */}
            {/* The GazeCalibration component is fixed inset-0 z-50, so it covers everything. */}

            <AnimatePresence>
                {isEnding && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
                    >
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 border-t-2 border-b-2 border-blue-500 rounded-full mb-8 shadow-lg shadow-blue-500/20"
                        />
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl font-black tracking-tighter text-white"
                        >
                            FINALIZING <span className="text-blue-500 underline decoration-blue-500/30">INTERVIEW REPORT</span>
                        </motion.h2>
                        <p className="mt-2 text-gray-400 text-sm font-medium tracking-widest uppercase animate-pulse">
                            Generating AI Feedback & Scores...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col h-full p-4 md:p-8 max-w-7xl mx-auto w-full gap-6 relative z-10">

                {/* HEADER - Redesigned */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-white/10 shadow-2xl"
                >
                    {/* Left: Title and Status */}
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                AI Mock Interview
                            </h1>
                            <p className="text-gray-400 text-xs mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Session Active
                            </p>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-3">
                        {/* VOICE TOGGLE */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsTTSMuted(!isTTSMuted)}
                            className="p-2.5 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-blue-400/50 text-white transition-all shadow-lg"
                            title={isTTSMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                        >
                            {isTTSMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-blue-400" />}
                        </motion.button>

                        {/* MIC SELECTOR */}
                        <div className="flex items-center gap-2 backdrop-blur-xl bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 transition-all">
                            <Mic size={14} className="text-blue-400" />
                            <select
                                className="bg-transparent text-xs outline-none cursor-pointer"
                                value={selectedAudioDevice}
                                onChange={(e) => setSelectedAudioDevice(e.target.value)}
                            >
                                {audioDevices.map(device => (
                                    <option key={device.deviceId} value={device.deviceId} className="bg-gray-900">
                                        {device.label || `Mic ${device.deviceId.slice(0, 5)}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* END INTERVIEW BUTTON */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEndInterview}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-sm transition-all shadow-lg shadow-red-500/30 relative z-50 cursor-pointer"
                        >
                            <LogOut size={16} />
                            <span>End Interview</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* MAIN SPLIT */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">

                    {/* LEFT: VISUALS & QUESTION */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-[2] flex flex-col gap-6"
                    >

                        {/* LIVE TRACKING STATS */}


                        {/* QUESTION CARD with Glassmorphism */}
                        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden group hover:border-blue-400/50 transition-all duration-300">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Icon Watermark */}
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MessageSquare size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                                    <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest">
                                        Current Question
                                    </h3>
                                </div>
                                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                                    <span className="text-blue-400">"</span>
                                    {currentQuestion}
                                    <span className="text-blue-400">"</span>
                                </p>
                            </div>
                        </div>



                        {/* VISUALIZER & WEBCAM with Glass Effect */}
                        <div className="flex-1 backdrop-blur-xl bg-black/20 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl group">
                            {/* Webcam Layer */}
                            <video
                                ref={videoRef}
                                autoPlay muted
                                onLoadedMetadata={() => {
                                    if (videoRef.current && canvasRef.current) {
                                        canvasRef.current.width = videoRef.current.videoWidth;
                                        canvasRef.current.height = videoRef.current.videoHeight;
                                    }
                                }}
                                className={`w-full h-full object-cover -scale-x-100 ${!isVideoOn && 'hidden'}`}
                            />











                            {/* Face Detection Warning - Top Right */}
                            <AnimatePresence>
                                {isCalibrated && !faceDetected && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg border-2 border-red-500/50 backdrop-blur-md animate-pulse"
                                    >
                                        <AlertCircle size={18} className="animate-bounce" />
                                        <span className="text-sm font-bold uppercase tracking-wide">⚠️ FACE NOT DETECTED!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Copy/Paste Warning - Top Right below face warning */}
                            <AnimatePresence>
                                {copyPasteDetected && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute top-14 right-4 z-50 flex items-center gap-2 bg-yellow-600/90 text-white px-3 py-1.5 rounded-lg shadow-lg border border-yellow-500/50 backdrop-blur-md"
                                    >
                                        <ClipboardPaste size={14} className="animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Copy/Paste Detected!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isVideoOn && (
                                <div className="flex-1 flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <VideoOff size={48} className="mx-auto mb-4 text-gray-500" />
                                        <p className="text-gray-400">Camera Off</p>
                                    </div>
                                </div>
                            )}

                            {/* Visualizer Overlay with Gradient */}
                            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent p-6 flex items-end">
                                {recorderStatus === 'recording' ? (
                                    <div className="w-full">
                                        <Visualizer audioStream={previewStream} />
                                    </div>
                                ) : (
                                    <div className="w-full text-center mb-4">
                                        <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
                                            <Activity size={16} className="text-blue-400" />
                                            {messages.length === 0 ? "Press Record to Start Interview" : "Waiting for your response..."}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Compact Tracking Stats - Top Left Overlay */}
                            <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 pointer-events-none">
                                <div className="backdrop-blur-md bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                                    <Keyboard size={12} className="text-blue-400" />
                                    <span className="text-xs font-medium text-white/90">{wpm} WPM</span>
                                </div>
                                <div className="backdrop-blur-md bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                                    <MousePointer size={12} className="text-purple-400" />
                                    <span className="text-xs font-medium text-white/90">{mouseRegion}</span>
                                </div>
                            </div>

                            {/* Corner Accents - Adjusted */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-400/50 rounded-tl-lg pointer-events-none"></div>
                            {/* Removed top-right accent to make room for stats */}
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-400/50 rounded-bl-lg pointer-events-none"></div>
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400/50 rounded-br-lg pointer-events-none"></div>
                        </div>

                    </motion.div>

                    {/* RIGHT: TRANSCRIPT & INPUT */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 flex flex-col backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                    >

                        {/* Chat History with Better Styling */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                            <AnimatePresence>
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-lg ${msg.role === 'ai'
                                            ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-gray-100 rounded-tl-none border border-white/5'
                                            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-blue-500/20'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* EDITABLE DRAFT AREA */}
                        <div className="p-6 bg-gradient-to-t from-black/40 to-transparent border-t border-white/5 backdrop-blur-xl">
                            {isListening && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-6 mb-4 backdrop-blur-xl bg-red-500/10 rounded-2xl border border-red-500/30"
                                >
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                                        <p className="text-white font-semibold">Recording...</p>
                                    </div>
                                    <p className="text-xs text-gray-300">Speak clearly. Your words appear below in real-time.</p>
                                </motion.div>
                            )}

                            <div className="relative">
                                <textarea
                                    value={userDraft}
                                    onChange={(e) => {
                                        setUserDraft(e.target.value);
                                        // WPM calculated in ProctoringTracker
                                    }}
                                    // Paste detected globally by ProctoringTracker
                                    placeholder={isListening ? "🎤 Your speech appears here in real-time..." : "Click 'Record Answer', speak your response, then click 'Stop'. You can edit your text before sending."}
                                    className="w-full backdrop-blur-xl bg-white/5 p-5 rounded-2xl text-white resize-none border border-white/10 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 h-36 transition-all placeholder:text-gray-500"
                                />
                                {isListening && (
                                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
                                        <Activity className="text-green-400 animate-pulse" size={14} />
                                        <span className="text-xs text-green-400 font-medium">Live</span>
                                    </div>
                                )}
                            </div>

                            {/* CONTROLS with Refined Layout */}
                            <div className="flex items-center gap-3 mt-6">
                                {/* Video Toggle - Compact Square */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleVideo}
                                    className="flex-shrink-0 h-14 w-14 rounded-2xl backdrop-blur-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all shadow-lg flex items-center justify-center"
                                    title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                                >
                                    {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                                </motion.button>

                                {/* Record/Stop Button - Primary Action */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={isListening ? handleStopRecording : handleStartRecording}
                                    className={`flex-1 h-14 flex items-center justify-center gap-3 px-6 rounded-2xl font-bold transition-all shadow-2xl ${isListening
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/50'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/50'
                                        }`}
                                >
                                    {isListening ? (
                                        <>
                                            <Square size={18} fill="currentColor" className="animate-pulse" />
                                            <span className="hidden sm:inline">Stop Recording</span>
                                        </>
                                    ) : (
                                        <>
                                            <Mic size={18} />
                                            <span className="hidden sm:inline">Record Answer</span>
                                        </>
                                    )}
                                    {/* Mobile/Small Screen Fallback */}
                                    <span className="sm:hidden">{isListening ? "Stop" : "Record"}</span>
                                </motion.button>

                                {/* Send Button - Compact & Refined */}
                                <motion.button
                                    whileHover={{ scale: !userDraft || isListening || isThinking ? 1 : 1.05 }}
                                    whileTap={{ scale: !userDraft || isListening || isThinking ? 1 : 0.95 }}
                                    onClick={handleSendMessage}
                                    disabled={!userDraft || isListening || isThinking}
                                    className={`flex-shrink-0 h-14 px-6 rounded-2xl font-bold transition-all shadow-2xl flex items-center justify-center gap-2 ${!userDraft || isListening || isThinking
                                        ? 'backdrop-blur-xl bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-indigo-500/40 text-white'
                                        }`}
                                >
                                    <Send size={18} />
                                    <span className="hidden md:inline">Send</span>
                                </motion.button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>


        </div>
    );
};

export default AIInterviewRoom;
