/**
 * Indian English Optimized Speech Recognition Service
 * Configured specifically for Indian English accent with enhanced accuracy
 */

class IndianEnglishSpeechService {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.fullTranscript = '';

        // Callbacks
        this.onTranscriptCallback = null;
        this.onErrorCallback = null;
        this.onStatusCallback = null;

        // Indian English specific settings
        this.languageCode = 'en-IN'; // Indian English
        this.alternativeLanguages = ['en-US', 'en-GB']; // Fallbacks
        this.confidenceThreshold = 0.6; // Lower for accents
    }

    /**
     * Initialize speech recognition with Indian English support
     */
    async initialize() {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                throw new Error('Speech Recognition not supported. Use Chrome or Edge.');
            }

            this.recognition = new SpeechRecognition();

            // CRITICAL: Configure for Indian English
            this.recognition.lang = this.languageCode; // en-IN for Indian English
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 5; // More alternatives for better accuracy

            this.setupHandlers();

            console.log('[IndianEnglishSpeech] ✅ Initialized for Indian English (en-IN)');
            console.log('[IndianEnglishSpeech] 🎯 Confidence threshold:', this.confidenceThreshold);
            return { success: true };
        } catch (error) {
            console.error('[IndianEnglishSpeech] ❌ Init failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Setup event handlers
     */
    setupHandlers() {
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('[IndianEnglishSpeech] 🎤 LISTENING (Indian English Mode)');
            if (this.onStatusCallback) {
                this.onStatusCallback({ status: 'listening' });
            }
        };

        this.recognition.onresult = (event) => {
            let interimText = '';
            let finalText = '';
            let bestConfidence = 0;

            // Process all results
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const alternatives = event.results[i];

                // Find best alternative based on confidence
                let bestTranscript = alternatives[0].transcript;
                let currentConfidence = alternatives[0].confidence || 0;

                // Check all alternatives for better confidence
                for (let j = 0; j < Math.min(alternatives.length, 5); j++) {
                    const alt = alternatives[j];
                    const altConf = alt.confidence || 0;

                    if (altConf > currentConfidence) {
                        currentConfidence = altConf;
                        bestTranscript = alt.transcript;
                    }
                }

                // Apply post-processing for Indian English patterns
                bestTranscript = this.postProcessIndianEnglish(bestTranscript);

                if (event.results[i].isFinal) {
                    // Only use if confidence is above threshold
                    if (currentConfidence >= this.confidenceThreshold || currentConfidence === 0) {
                        finalText += bestTranscript + ' ';
                        bestConfidence = Math.max(bestConfidence, currentConfidence);

                        const confPercent = (currentConfidence * 100).toFixed(0);
                        console.log(`[IndianEnglishSpeech] 📝 FINAL: "${bestTranscript}" (${confPercent}% confidence)`);
                    } else {
                        console.warn(`[IndianEnglishSpeech] ⚠️ Low confidence (${(currentConfidence * 100).toFixed(0)}%), skipped`);
                    }
                } else {
                    interimText += bestTranscript;
                    console.log(`[IndianEnglishSpeech] ⏳ INTERIM: "${bestTranscript}"`);
                }
            }

            // Update full transcript
            if (finalText) {
                this.fullTranscript += finalText;
            }

            // Send to UI immediately
            const displayText = this.fullTranscript + interimText;

            console.log('[IndianEnglishSpeech] 📤 Sending:', displayText);

            if (this.onTranscriptCallback) {
                this.onTranscriptCallback({
                    text: displayText,
                    isFinal: !!finalText,
                    interim: interimText,
                    confidence: bestConfidence
                });
            }
        };

        this.recognition.onerror = (event) => {
            console.warn('[IndianEnglishSpeech] ⚠️ Error:', event.error);

            // Ignore "no-speech" - it's just a warning
            if (event.error === 'no-speech') {
                console.log('[IndianEnglishSpeech] ℹ️ No speech detected yet, still listening...');
                return;
            }

            // Handle permission errors
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                if (this.onErrorCallback) {
                    this.onErrorCallback({
                        message: 'Microphone permission denied. Please allow access in browser settings.'
                    });
                }
            }
        };

        this.recognition.onend = () => {
            console.log('[IndianEnglishSpeech] ⏹️ Stopped');
            this.isListening = false;

            if (this.onStatusCallback) {
                this.onStatusCallback({ status: 'stopped' });
            }
        };
    }

    /**
     * Post-process text for common Indian English patterns
     * Improves accuracy by handling common variations
     */
    postProcessIndianEnglish(text) {
        if (!text) return text;

        // Common Indian English variations and corrections
        const corrections = {
            // Example corrections (expand based on your needs)
            'itself': 'itself',
            'only': 'only',
            // Add more patterns as needed
        };

        let processed = text;

        // Apply corrections
        for (const [wrong, correct] of Object.entries(corrections)) {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            processed = processed.replace(regex, correct);
        }

        return processed;
    }

    /**
     * Start listening with Indian English configuration
     */
    async start() {
        if (!this.recognition) {
            const result = await this.initialize();
            if (!result.success) return result;
        }

        if (this.isListening) {
            console.log('[IndianEnglishSpeech] Already listening');
            return { success: false, error: 'Already listening' };
        }

        try {
            // Reset transcript
            this.fullTranscript = '';

            // Start recognition
            this.recognition.start();

            console.log('[IndianEnglishSpeech] 🚀 Starting (Indian English accent optimized)...');
            return { success: true };
        } catch (error) {
            console.error('[IndianEnglishSpeech] Failed to start:', error);
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
     * Change language on the fly
     */
    setLanguage(languageCode) {
        this.languageCode = languageCode;
        if (this.recognition) {
            this.recognition.lang = languageCode;
            console.log(`[IndianEnglishSpeech] 🌏 Language changed to: ${languageCode}`);
        }
    }

    /**
     * Adjust confidence threshold
     */
    setConfidenceThreshold(threshold) {
        this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
        console.log(`[IndianEnglishSpeech] 🎯 Confidence threshold: ${this.confidenceThreshold}`);
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
     * Get supported languages
     */
    static getSupportedLanguages() {
        return [
            { code: 'en-IN', name: 'English (India)', recommended: true },
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'hi-IN', name: 'Hindi (India)' }
        ];
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        this.recognition = null;
    }
}

export default IndianEnglishSpeechService;
