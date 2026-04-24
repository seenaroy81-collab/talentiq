/**
 * Simple, Reliable Speech Recognition Service
 * Minimal complexity, maximum reliability
 */

class SimpleSpeechService {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.fullTranscript = '';

        // Callbacks
        this.onTranscriptCallback = null;
        this.onErrorCallback = null;
        this.onStatusCallback = null;
    }

    /**
     * Initialize speech recognition
     */
    async initialize() {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                throw new Error('Speech Recognition not supported. Use Chrome or Edge.');
            }

            this.recognition = new SpeechRecognition();

            // CRITICAL: These settings make it work reliably
            this.recognition.continuous = true;          // Keep listening
            this.recognition.interimResults = true;      // Show results as you speak
            this.recognition.lang = 'en-US';             // English
            this.recognition.maxAlternatives = 1;        // Just give me the best result

            this.setupHandlers();

            console.log('[SimpleSpeech] ✅ Initialized successfully');
            return { success: true };
        } catch (error) {
            console.error('[SimpleSpeech] ❌ Init failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Setup event handlers
     */
    setupHandlers() {
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('[SimpleSpeech] 🎤 STARTED - Speak now!');
            if (this.onStatusCallback) {
                this.onStatusCallback({ status: 'listening' });
            }
        };

        this.recognition.onresult = (event) => {
            let interimText = '';
            let finalText = '';

            // Process all results
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalText += transcript + ' ';
                    console.log('[SimpleSpeech] 📝 FINAL:', transcript);
                } else {
                    interimText += transcript;
                    console.log('[SimpleSpeech] ⏳ INTERIM:', transcript);
                }
            }

            // Update full transcript
            if (finalText) {
                this.fullTranscript += finalText;
            }

            // Send to UI immediately
            const displayText = this.fullTranscript + interimText;

            console.log('[SimpleSpeech] 📤 Sending:', displayText);

            if (this.onTranscriptCallback) {
                this.onTranscriptCallback({
                    text: displayText,
                    isFinal: !!finalText,
                    interim: interimText
                });
            }
        };

        this.recognition.onerror = (event) => {
            console.warn('[SimpleSpeech] ⚠️ Error:', event.error);

            // CRITICAL: Ignore "no-speech" - it's just a warning, not a real error
            if (event.error === 'no-speech') {
                console.log('[SimpleSpeech] ℹ️ No speech detected yet, still listening...');
                return; // Don't treat this as an error!
            }

            // For real errors, notify user
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                if (this.onErrorCallback) {
                    this.onErrorCallback({
                        message: 'Microphone permission denied. Please allow access in browser settings.'
                    });
                }
            }
        };

        this.recognition.onend = () => {
            console.log('[SimpleSpeech] ⏹️ Stopped');
            this.isListening = false;

            if (this.onStatusCallback) {
                this.onStatusCallback({ status: 'stopped' });
            }
        };
    }

    /**
     * Start listening
     */
    async start() {
        if (!this.recognition) {
            const result = await this.initialize();
            if (!result.success) return result;
        }

        if (this.isListening) {
            console.log('[SimpleSpeech] Already listening');
            return { success: false, error: 'Already listening' };
        }

        try {
            // Reset transcript
            this.fullTranscript = '';

            // Start recognition
            this.recognition.start();

            console.log('[SimpleSpeech] 🚀 Starting...');
            return { success: true };
        } catch (error) {
            console.error('[SimpleSpeech] Failed to start:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Stop listening
     */
    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        return { success: true, transcript: this.fullTranscript };
    }

    /**
     * Set callbacks
     */
    onTranscript(callback) {
        this.onTranscriptCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }

    onStatus(callback) {
        this.onStatusCallback = callback;
    }

    /**
     * Check if supported
     */
    static isSupported() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        this.recognition = null;
    }
}

export default SimpleSpeechService;
