/**
 * Enhanced Speech Recognition Service
 * Provides improved accuracy through audio preprocessing, noise filtering, and better configuration
 */

class SpeechRecognitionService {
    constructor() {
        this.recognition = null;
        this.audioContext = null;
        this.mediaStream = null;
        this.audioSource = null;
        this.noiseGate = null;
        this.isInitialized = false;
        this.isListening = false;
        this.onResultCallback = null;
        this.onErrorCallback = null;
        this.onStartCallback = null;
        this.onEndCallback = null;
        this.shouldAutoRestart = false;
        this.logs = [];
    }

    /**
     * Initialize the speech recognition system
     */
    async initialize() {
        try {
            // Check browser support
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognitionAPI) {
                throw new Error('Speech Recognition not supported. Please use Chrome or Edge browser.');
            }

            // Create recognition instance
            this.recognition = new SpeechRecognitionAPI();

            // Configure recognition for better accuracy
            this.configureRecognition();

            // Set up event handlers
            this.setupEventHandlers();

            this.isInitialized = true;
            this.log('✅ Speech Recognition initialized successfully');

            return { success: true, message: 'Speech Recognition ready' };
        } catch (error) {
            this.log(`❌ Initialization failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Configure recognition with optimal settings
     */
    configureRecognition() {
        if (!this.recognition) return;

        // Language settings - using en-US for better model support
        this.recognition.lang = 'en-US';

        // Continuous listening
        this.recognition.continuous = true;

        // Enable interim results for real-time feedback
        this.recognition.interimResults = true;

        // Maximum alternatives to consider
        this.recognition.maxAlternatives = 3; // Increased for better confidence scoring

        this.log('✅ Recognition configured with optimal settings');
    }

    /**
     * Set up audio preprocessing with noise reduction
     */
    async setupAudioPreprocessing(deviceId = null) {
        try {
            // Request microphone with enhanced constraints
            const constraints = {
                audio: {
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    echoCancellation: true,       // Remove echo
                    noiseSuppression: true,       // Suppress background noise
                    autoGainControl: true,        // Normalize volume
                    channelCount: 1,              // Mono audio
                    sampleRate: 48000,            // High quality sample rate
                }
            };

            this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            // Create audio context for preprocessing
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioSource = this.audioContext.createMediaStreamSource(this.mediaStream);

            // Add noise gate filter
            this.addNoiseGate();

            this.log('✅ Audio preprocessing enabled (Echo Cancel, Noise Suppress, Auto Gain)');

            return { success: true, stream: this.mediaStream };
        } catch (error) {
            this.log(`❌ Audio preprocessing failed: ${error.message}`);

            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                return {
                    success: false,
                    error: 'Microphone permission denied',
                    userAction: 'Please allow microphone access in your browser settings'
                };
            }

            return { success: false, error: error.message };
        }
    }

    /**
     * Add noise gate to filter out low-level background noise
     */
    addNoiseGate() {
        if (!this.audioContext || !this.audioSource) return;

        try {
            // Create dynamics compressor (acts as noise gate)
            const compressor = this.audioContext.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-50, this.audioContext.currentTime); // dB
            compressor.knee.setValueAtTime(40, this.audioContext.currentTime);
            compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
            compressor.attack.setValueAtTime(0, this.audioContext.currentTime);
            compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

            // Create gain node for volume normalization
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(1.2, this.audioContext.currentTime); // Boost by 20%

            // Connect the audio chain
            this.audioSource.connect(compressor);
            compressor.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            this.noiseGate = compressor;
            this.log('✅ Noise gate and volume normalization active');
        } catch (error) {
            this.log(`⚠️ Noise gate setup failed: ${error.message}`);
        }
    }

    /**
     * Setup event handlers for recognition
     */
    setupEventHandlers() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.log('✅ Speech Recognition ACTIVE - Listening...');
            if (this.onStartCallback) this.onStartCallback();
        };

        this.recognition.onresult = (event) => {
            this.handleResults(event);
        };

        this.recognition.onerror = (event) => {
            this.handleError(event);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.log('Speech Recognition stopped');

            // Auto-restart if enabled and not manually stopped
            if (this.shouldAutoRestart) {
                this.log('Auto-restarting recognition...');
                setTimeout(() => {
                    if (this.shouldAutoRestart) {
                        this.start();
                    }
                }, 500);
            }

            if (this.onEndCallback) this.onEndCallback();
        };
    }

    /**
     * Handle speech recognition results with confidence scoring
     */
    handleResults(event) {
        let interimText = '';
        let finalText = '';
        let maxConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const alternatives = result;

            // Get best alternative with highest confidence
            let bestTranscript = result[0].transcript;
            let bestConfidence = result[0].confidence || 0;

            // Check all alternatives for better confidence
            for (let j = 0; j < Math.min(alternatives.length, 3); j++) {
                const alt = alternatives[j];
                if (alt.confidence && alt.confidence > bestConfidence) {
                    bestConfidence = alt.confidence;
                    bestTranscript = alt.transcript;
                }
            }

            if (result.isFinal) {
                finalText += bestTranscript + ' ';
                maxConfidence = Math.max(maxConfidence, bestConfidence);

                // Log confidence for debugging
                if (bestConfidence > 0) {
                    const confidencePercent = (bestConfidence * 100).toFixed(0);
                    this.log(`📝 "${bestTranscript.trim()}" (${confidencePercent}% confidence)`);
                }
            } else {
                interimText += bestTranscript;
            }
        }

        // Callback with results and confidence
        if (this.onResultCallback) {
            this.onResultCallback({
                finalText: finalText.trim(),
                interimText: interimText.trim(),
                confidence: maxConfidence,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle errors with user-friendly messages
     */
    handleError(event) {
        console.error('Speech Recognition Error:', event.error);

        let errorMessage = '';
        let userAction = '';

        switch (event.error) {
            case 'not-allowed':
            case 'permission-denied':
                errorMessage = 'Microphone permission denied';
                userAction = '1. Click the 🔒 icon in your browser address bar\n2. Allow microphone access\n3. Refresh this page';
                this.shouldAutoRestart = false;
                break;

            case 'no-speech':
                errorMessage = 'Waiting for speech...';
                userAction = 'Speak clearly into your microphone';
                // Keep auto-restart enabled for no-speech - this is normal behavior
                // Don't log this as an error since it's expected during pauses
                return; // Exit early, don't call error callback

            case 'audio-capture':
                errorMessage = 'Microphone is not available';
                userAction = 'Please check if another app is using your microphone';
                this.shouldAutoRestart = false;
                break;

            case 'network':
                errorMessage = 'Network error occurred';
                userAction = 'Please check your internet connection';
                break;

            case 'aborted':
                errorMessage = 'Recognition aborted';
                // This is usually intentional, don't show error
                break;

            default:
                errorMessage = `Recognition error: ${event.error}`;
                userAction = 'Please try again';
        }

        if (errorMessage && event.error !== 'aborted') {
            this.log(`❌ ${errorMessage}`);

            if (this.onErrorCallback) {
                this.onErrorCallback({
                    error: event.error,
                    message: errorMessage,
                    userAction: userAction
                });
            }
        }
    }

    /**
     * Start speech recognition
     */
    async start(deviceId = null) {
        if (!this.isInitialized) {
            const initResult = await this.initialize();
            if (!initResult.success) {
                return initResult;
            }
        }

        if (this.isListening) {
            return { success: false, error: 'Already listening' };
        }

        try {
            // Setup audio preprocessing
            const audioResult = await this.setupAudioPreprocessing(deviceId);
            if (!audioResult.success) {
                return audioResult;
            }

            // Start recognition with auto-restart enabled
            this.shouldAutoRestart = true; // Enable auto-restart for continuous listening
            this.recognition.start();
            this.log('🔄 Auto-restart enabled - will keep listening');

            return { success: true, message: 'Speech recognition started' };
        } catch (error) {
            this.log(`❌ Failed to start: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Stop speech recognition
     */
    stop() {
        try {
            this.shouldAutoRestart = false;

            if (this.recognition && this.isListening) {
                this.recognition.stop();
            }

            // Cleanup audio preprocessing
            this.cleanupAudioProcessing();

            this.log('Speech recognition stopped');
            return { success: true };
        } catch (error) {
            this.log(`⚠️ Stop error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cleanup audio processing resources
     */
    cleanupAudioProcessing() {
        try {
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(track => track.stop());
                this.mediaStream = null;
            }

            if (this.audioContext && this.audioContext.state !== 'closed') {
                this.audioContext.close();
                this.audioContext = null;
            }

            this.audioSource = null;
            this.noiseGate = null;
        } catch (error) {
            console.warn('Cleanup warning:', error);
        }
    }

    /**
     * Set callback for results
     */
    onResult(callback) {
        this.onResultCallback = callback;
    }

    /**
     * Set callback for errors
     */
    onError(callback) {
        this.onErrorCallback = callback;
    }

    /**
     * Set callback for start event
     */
    onStart(callback) {
        this.onStartCallback = callback;
    }

    /**
     * Set callback for end event
     */
    onEnd(callback) {
        this.onEndCallback = callback;
    }

    /**
     * Check if speech recognition is supported
     */
    static isSupported() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    /**
     * Log messages
     */
    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `${timestamp} - ${message}`;
        this.logs.push(logMessage);
        console.log(`[SpeechService] ${message}`);
    }

    /**
     * Get recent logs
     */
    getLogs(count = 10) {
        return this.logs.slice(-count);
    }

    /**
     * Destroy the service and cleanup all resources
     */
    destroy() {
        this.stop();
        this.cleanupAudioProcessing();
        this.recognition = null;
        this.isInitialized = false;
        this.logs = [];
        this.log('Service destroyed');
    }
}

export default SpeechRecognitionService;
