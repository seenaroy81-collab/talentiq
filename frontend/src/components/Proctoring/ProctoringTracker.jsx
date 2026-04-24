import React, { useEffect, useRef, useState } from 'react';
import { gazeTracker } from '../../lib/gaze-tracking';
import GazeDebugOverlay from './GazeDebugOverlay';
import { updateProctoringData } from '../../api/sessionAPI';

/**
 * ProctoringTracker
 * 
 * Handles all "spy" logic:
 * - WebGazer (Eye Tracking) - NOW INTEGRATED
 * - Mouse Tracking (Region)
 * - Keyboard Tracking (WPM)
 * - Visibility Tracking (Tab focus)
 * 
 * Props:
 * - onStatUpdate: (stats) => void  // Callback to parent with latest stats
 * - userDraft: string              // Current text for WPM calc
 * - sessionId: string              // ID of the current session
 */
const ProctoringTracker = ({ onStatUpdate, userDraft, socket, sessionId }) => {
    // STATE
    const [mouseRegion, setMouseRegion] = useState("Center");
    const [wpm, setWpm] = useState(0);
    const [isTabActive, setIsTabActive] = useState(true);
    const [copyPasteDetected, setCopyPasteDetected] = useState(false);
    const [gazeStatus, setGazeStatus] = useState("On Screen"); // NEW
    const [faceDetected, setFaceDetected] = useState(true); // Face detection status

    // REFS
    const typingHistoryRef = useRef([]);
    const lastDraftLengthRef = useRef(0);
    const heatmapBufferRef = useRef([]);

    // --- 0. GAZE TRACKING ---
    useEffect(() => {
        // Assume calibration already happened in parent component
        gazeTracker.startTracking();

        gazeTracker.setGazeListener((data) => {
            if (!data) return;

            // Update face detection status
            const hasFace = data.faceDetected !== false && !data.isOffScreen;
            setFaceDetected(hasFace);

            // Update Visual Pointer
            if (pointerRef.current && data.x !== null && data.y !== null) {
                if (!data.isOffScreen && hasFace) {
                    pointerRef.current.style.display = 'block';

                    // Visual feedback for confidence
                    const confidence = data.confidence || 1.0;
                    const scale = confidence < 0.5 ? 1.5 : 1;
                    
                    // Use hardware-accelerated transform for ultra-smooth realistic movement
                    pointerRef.current.style.transform = `translate(${data.x}px, ${data.y}px) scale(${scale})`;
                    pointerRef.current.style.opacity = Math.max(0.3, confidence); // Dim if unsure

                    // Optional: Change color if low confidence
                    pointerRef.current.style.backgroundColor = confidence < 0.6 ? 'orange' : 'red';

                    // BUFFER HEATMAP DATA
                    if (confidence > 0.5) {
                        heatmapBufferRef.current.push({
                            x: Math.round(data.x),
                            y: Math.round(data.y),
                            timestamp: Date.now()
                        });
                    }

                } else {
                    pointerRef.current.style.display = 'none';
                }
            } else if (pointerRef.current) {
                pointerRef.current.style.display = 'none';
            }

            // Determine gaze status
            if (data.isOffScreen || !hasFace) {
                setGazeStatus("Off Screen");
                return;
            }

            // Check bounds if we have coordinates
            if (data.x !== null && data.y !== null) {
                const margin = 50;
                const inWidth = data.x >= -margin && data.x <= window.innerWidth + margin;
                const inHeight = data.y >= -margin && data.y <= window.innerHeight + margin;

                if (inWidth && inHeight) {
                    setGazeStatus("On Screen");
                } else {
                    setGazeStatus("Off Screen");
                }
            } else {
                setGazeStatus("On Screen");
            }
        });

        return () => {
            // gazeTracker.stopTracking(); // Optional
        };
    }, []);

    // ... (rest of observers)
    
    // --- 1. MOUSE REGION TRACKING ---
    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const width = window.innerWidth;
            const height = window.innerHeight;

            let hRegion = "Center";
            let vRegion = "Center";

            if (clientX < width / 3) hRegion = "Left";
            else if (clientX > (width * 2) / 3) hRegion = "Right";

            if (clientY < height / 3) vRegion = "Top";
            else if (clientY > (height * 2) / 3) vRegion = "Bottom";

            let region = "";
            if (hRegion === "Center" && vRegion === "Center") region = "Center";
            else region = `${vRegion} ${hRegion}`.replace("Center", "").trim();

            setMouseRegion(region);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // --- 2. WPM CALCULATION (Sliding Window: Last 30 Seconds) ---
    useEffect(() => {
        if (userDraft === undefined) return;
        
        const diff = Math.abs((userDraft?.length || 0) - lastDraftLengthRef.current);
        let charsToAdd = 0;
        
        if (diff > 0 && diff <= 15) {
            charsToAdd = diff;
        } else if (diff > 15) {
            charsToAdd = 1; // gentle penalty/limit for paste
        }
        
        lastDraftLengthRef.current = userDraft?.length || 0;
        
        if (charsToAdd > 0) {
            typingHistoryRef.current.push({ timestamp: Date.now(), chars: charsToAdd });
        }
    }, [userDraft]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const windowMs = 30000; // 30 sec sliding window
            
            typingHistoryRef.current = typingHistoryRef.current.filter(entry => now - entry.timestamp <= windowMs);
            const charsInWindow = typingHistoryRef.current.reduce((sum, entry) => sum + entry.chars, 0);
            
            let timeElapsedMin = windowMs / 60000; 
            if (typingHistoryRef.current.length > 0) {
                const oldest = typingHistoryRef.current[0].timestamp;
                const actualElapsed = (now - oldest) / 60000;
                timeElapsedMin = Math.max(10 / 60, Math.min(actualElapsed, timeElapsedMin));
            }
            
            const calculatedWpm = Math.round((charsInWindow / 5) / timeElapsedMin);
            setWpm(Math.min(calculatedWpm, 250));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // --- 3. TAB VISIBILITY ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            const active = !document.hidden;
            setIsTabActive(active);

            // IMMEDIATELY REPORT TAB SWITCH AS VIOLATION
            if (!active && sessionId) {
                updateProctoringData(sessionId, {
                    violation: {
                        type: "Tab Switched",
                        timestamp: Date.now(),
                        metadata: { url: window.location.href }
                    }
                });
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [sessionId]);

    // --- 4. COPY/PASTE DETECTION ---
    useEffect(() => {
        const handlePaste = (e) => {
            const pastedData = e.clipboardData.getData('text');
            setCopyPasteDetected(true);

            // IMMEDIATELY REPORT PASTE AS VIOLATION
            if (sessionId) {
                updateProctoringData(sessionId, {
                    violation: {
                        type: "Copy/Paste Detected",
                        timestamp: Date.now(),
                        metadata: { length: pastedData.length }
                    }
                });
            }

            const timer = setTimeout(() => {
                setCopyPasteDetected(false);
            }, 3000);

            return () => clearTimeout(timer);
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [sessionId]); 

    // --- 5. PERIODIC SYNC (Heatmap & Stats) ---
    useEffect(() => {
        if (!sessionId) return;

        const syncInterval = setInterval(() => {
            // Sample heatmap points (max 50 per sync)
            const pointsToSync = heatmapBufferRef.current.slice(0, 50);
            heatmapBufferRef.current = heatmapBufferRef.current.slice(50);

            const payload = {
                heatmapPoints: pointsToSync,
                lastStats: {
                    wpm,
                    mouseRegion,
                    isTabActive,
                    faceDetected,
                    gazeStatus
                }
            };

            // Always sync latest stats every 5s for reliability
            updateProctoringData(sessionId, payload).catch(err => {
                console.warn("Proctoring sync failed:", err.message);
            });
        }, 5000); // Sync every 5 seconds

        return () => clearInterval(syncInterval);
    }, [sessionId, wpm, mouseRegion, isTabActive, faceDetected, gazeStatus]);


    // Last reported stats
    const lastReportedStats = useRef({});

    // Pointer Ref for direct DOM manipulation (performance)
    const pointerRef = useRef(null);

    useEffect(() => {
        if (onStatUpdate) {
            // Only report if at least one value has changed to prevent infinite loops
            const hasChanged =
                mouseRegion !== lastReportedStats.current.mouseRegion ||
                wpm !== lastReportedStats.current.wpm ||
                isTabActive !== lastReportedStats.current.isTabActive ||
                copyPasteDetected !== lastReportedStats.current.copyPasteDetected ||
                gazeStatus !== lastReportedStats.current.gazeStatus ||
                faceDetected !== lastReportedStats.current.faceDetected;

            if (hasChanged) {
                const stats = {
                    mouseRegion,
                    wpm,
                    isTabActive,
                    copyPasteDetected,
                    gazeStatus,
                    faceDetected
                };
                lastReportedStats.current = stats;
                onStatUpdate(stats);
            }
        }
    }, [mouseRegion, wpm, isTabActive, copyPasteDetected, gazeStatus, faceDetected, onStatUpdate]);

    return (
        <>
            {/* Gaze Pointer */}
            <div
                ref={pointerRef}
                style={{
                    position: 'fixed',
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transition: 'transform 0.15s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.2s',
                    display: 'none', // Hidden by default, shown by JS
                    opacity: 0.7,
                    border: '2px solid white',
                    boxShadow: '0 0 10px rgba(255,0,0,0.5)',
                    top: '-10px',
                    left: '-10px'
                }}
            />

            {/* Real-time Data Overlay (GazeCloud Style) */}
            <GazeDebugOverlay />
        </>
    );
};

export default ProctoringTracker;
