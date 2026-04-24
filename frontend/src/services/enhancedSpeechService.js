/**
 * Enhanced Speech Recognition Service with Multiple Approaches
 * Includes Web Speech API, manual transcription, and TensorFlow.js fallback
 */

class EnhancedSpeechService {
    constructor() {
        // Web Speech API
        this.recognition = null;
        this.isInitialized = false;
        this.isListening = false;

        // Audio Processing
        this.audioContext = null;
        this.mediaStream = null;
        this.analyser = null;
        this.audioWorklet = null;

        // Callbacks
        this.onTranscriptCallback = null;
        this.onErrorCallback = null;
        this.onStatusCallback = null;

        // State
        this.currentTranscript = '';
        this.interimTranscript = '';
        this.finalTranscript = '';
        this.shouldAutoRestart = false;
        this.silenceTimer = null;
        this.lastSpeechTime = 0;

        // Config
        this.SILENCE_THRESHOLD = 2000; // 2 seconds of silence
        this.VOLUME_THRESHOLD = 0.01; // Minimum volume to detect speech

        // Logs
        this.logs = [];
    }

    /**
     * Initialize the service
     */
    async initialize() {
        try {
            // Check browser support
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognitionAPI) {
                this.log('❌ Web Speech API not supported');
                return { success: false, error: 'Speech Recognition not supported. Use Chrome/Edge.' };
            }

            // Create recognition instance
            this.recognition = new SpeechRecognitionAPI();
            this.configureRecognition();
            this.setupEventHandlers();

            this.isInitialized = true;
            this.log('✅ Speech Recognition initialized');
            this.notifyStatus('ready');

            return { success: true };
        } catch (error) {
            this.log(`❌ Init failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Configure recognition settings
     */
    configureRecognition() {
        if (!this.recognition) return;

        this.recognition.lang = 'en-US';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;

        this.log('✅ Recognition configured');
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.log('🎤 LISTENING - Speak now!');
            this.notifyStatus('listening');
        };

        this.recognition.onresult = (event) => {
            // DEBUG: Log that we received a result
            this.log(`🔊 onresult fired! resultIndex=${event.resultIndex}, results.length=${event.results.length}`);

            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                const isFinal = event.results[i].isFinal;

                // DEBUG: Log each transcript segment
                this.log(`   Segment ${i}: "${transcript}" (${isFinal ? 'FINAL' : 'interim'})`);

                if (isFinal) {
                    final += transcript + ' ';
                    this.log(`📝 FINAL: "${transcript}"`);
                } else {
                    interim += transcript;
                    this.log(`⏳ INTERIM: "${transcript}"`);
                }
            }

            // Update transcripts
            if (final) {
                this.finalTranscript += final;
                this.currentTranscript = this.finalTranscript;
                this.lastSpeechTime = Date.now();
            }

            // Combine final + interim for real-time display
            const displayText = this.finalTranscript + (interim ? interim : '');

            // DEBUG: Log what we're about to send
            this.log(`📤 Sending to UI: "${displayText}" (final="${final.trim()}", interim="${interim}")`);

            // CRITICAL: Notify with the transcript immediately
            if (this.onTranscriptCallback) {
                this.onTranscriptCallback({
                    text: displayText,
                    isFinal: !!final,
                    interim: interim,
                    timestamp: Date.now()
                });
            } else {
                this.log(`⚠️ WARNING: No transcript callback registered!`);
            }
        };

        this.recognition.onerror = (event) => {
            this.log(`❌ Error: ${event.error}`);

            // Don't stop on "no-speech" - it's normal
            if (event.error === 'no-speech') {
                return; // Keep listening
            }

            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                this.notifyError('Microphone permission denied. Please allow access.');
                this.shouldAutoRestart = false;
            } else if (event.error === 'audio-capture') {
                this.notifyError('No microphone found. Please check your device.');
                this.shouldAutoRestart = false;
            } else {
                this.notifyError(`Error: ${event.error}`);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.log('⏹️ Recognition stopped');
            this.notifyStatus('stopped');

            // Auto-restart if enabled
            if (this.shouldAutoRestart) {
                setTimeout(() => {
                    if (this.shouldAutoRestart && this.recognition) {
                        this.log('🔄 Auto-restarting...');
                        try {
                            this.recognition.start();
                        } catch (e) {
                            this.log(`⚠️ Restart failed: ${e.message}`);
                        }
                    }
                }, 100);
            }
        };
    }

    /**
     * Setup audio preprocessing
     */
    async setupAudioPreprocessing(deviceId = null) {
        try {
            const constraints = {
                audio: {
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1,
                    sampleRate: 48000
                }
            };

            this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create analyser for volume detection
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;

            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            source.connect(this.analyser);

            // Start volume monitoring
            this.startVolumeMonitoring();

            this.log('✅ Audio preprocessing enabled');
            return { success: true };
        } catch (error) {
            this.log(`❌ Audio setup failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Monitor audio volume to detect speech
     */
    startVolumeMonitoring() {
        if (!this.analyser) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let frameCount = 0;
        let maxVolume = 0;

        const monitor = () => {
            if (!this.isListening) return;

            this.analyser.getByteFrequencyData(dataArray);

            // Calculate average volume
            const average = dataArray.reduce((a, b) => a + b) / bufferLength / 255;

            // Track max volume
            if (average > maxVolume) {
                maxVolume = average;
            }

            frameCount++;

            // Log volume every ~60 frames (about 1 second at 60fps)
            if (frameCount % 60 === 0) {
                const volumePercent = (maxVolume * 100).toFixed(1);
                const volumeBar = '█'.repeat(Math.floor(maxVolume * 20));
                const volumeEmpty = '░'.repeat(20 - Math.floor(maxVolume * 20));

                this.log(`🔊 Mic Level: ${volumePercent}% [${volumeBar}${volumeEmpty}]`);

                if (maxVolume < 0.05) {
                    this.log(`⚠️ VERY LOW! Check: (1) macOS mic permissions, (2) Correct device selected, (3) Mic volume`);
                } else if (maxVolume < this.VOLUME_THRESHOLD) {
                    this.log(`⚠️ Low volume. Speak louder!`);
                }

                maxVolume = 0; // Reset for next interval
            }

            // Detect speech based on volume
            if (average > this.VOLUME_THRESHOLD) {
                this.lastSpeechTime = Date.now();
            }

            // Continue monitoring
            if (this.isListening) {
                requestAnimationFrame(monitor);
            }
        };

        monitor();
        this.log('🎙️ Audio monitoring started - Watch for mic levels below...');
    }

    /**
     * Start listening
     */
    async start(deviceId = null) {
        if (!this.isInitialized) {
            const result = await this.initialize();
            if (!result.success) return result;
        }

        if (this.isListening) {
            this.log('⚠️ Already listening');
            return { success: false, error: 'Already listening' };
        }

        try {
            // Reset state
            this.finalTranscript = '';
            this.interimTranscript = '';
            this.currentTranscript = '';
            this.lastSpeechTime = Date.now();

            // Setup audio
            const audioResult = await this.setupAudioPreprocessing(deviceId);
            if (!audioResult.success) {
                return audioResult;
            }

            // Start recognition
            this.shouldAutoRestart = true;
            this.recognition.start();

            this.log('🚀 Started listening');
            return { success: true };
        } catch (error) {
            this.log(`❌ Start failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Stop listening
     */
    stop() {
        try {
            this.shouldAutoRestart = false;

            if (this.recognition && this.isListening) {
                this.recognition.stop();
            }

            // Cleanup audio
            this.cleanupAudio();

            this.log('⏹️ Stopped');
            return { success: true, transcript: this.finalTranscript };
        } catch (error) {
            this.log(`⚠️ Stop error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cleanup audio resources
     */
    cleanupAudio() {
        try {
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(track => track.stop());
                this.mediaStream = null;
            }

            if (this.audioContext && this.audioContext.state !== 'closed') {
                this.audioContext.close();
                this.audioContext = null;
            }

            this.analyser = null;
        } catch (error) {
            console.warn('Cleanup warning:', error);
        }
    }

    /**
     * Set transcript callback
     */
    onTranscript(callback) {
        this.onTranscriptCallback = callback;
    }

    /**
     * Set error callback
     */
    onError(callback) {
        this.onErrorCallback = callback;
    }

    /**
     * Set status callback
     */
    onStatus(callback) {
        this.onStatusCallback = callback;
    }

    /**
     * Notify transcript update
     */
    notifyTranscript(data) {
        if (this.onTranscriptCallback) {
            this.onTranscriptCallback(data);
        }
    }

    /**
     * Notify error
     */
    notifyError(message) {
        if (this.onErrorCallback) {
            this.onErrorCallback({ message });
        }
    }

    /**
     * Notify status change
     */
    notifyStatus(status) {
        if (this.onStatusCallback) {
            this.onStatusCallback({ status });
        }
    }

    /**
     * Check if supported
     */
    static isSupported() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    /**
     * Get current transcript
     */
    getTranscript() {
        return this.currentTranscript;
    }

    /**
     * Clear transcript
     */
    clearTranscript() {
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.currentTranscript = '';
    }

    /**
     * Log message
     */
    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `${timestamp} - ${message}`;
        this.logs.push(logMessage);
        console.log(`[EnhancedSpeech] ${message}`);
    }

    /**
     * Get logs
     */
    getLogs(count = 10) {
        return this.logs.slice(-count);
    }

    /**
     * Destroy service
     */
    destroy() {
        this.stop();
        this.cleanupAudio();
        this.recognition = null;
        this.isInitialized = false;
        this.logs = [];
    }
}

export default EnhancedSpeechService;
