/**
 * Natural Text-to-Speech Service
 * Uses Web Speech API with optimized settings for human-like voice
 */

class TextToSpeechService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
        this.isMuted = false;
        this.currentUtterance = null;

        // Natural voice settings
        this.settings = {
            rate: 0.95,      // Slightly slower for clarity (0.9-1.0 is natural)
            pitch: 1.0,      // Natural pitch
            volume: 0.9      // Comfortable volume
        };

        // Load voices
        this.loadVoices();

        // Voice list can load asynchronously
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }

    /**
     * Load and select the most natural voice available
     */
    loadVoices() {
        this.voices = this.synth.getVoices();

        if (this.voices.length === 0) {
            console.warn('[TTS] No voices loaded yet, will retry...');
            return;
        }

        // Priority order for natural-sounding voices
        const voicePreferences = [
            // Google voices (very natural)
            { name: 'Google US English', lang: 'en-US' },
            { name: 'Google UK English Female', lang: 'en-GB' },
            { name: 'Google UK English Male', lang: 'en-GB' },

            // Microsoft voices (natural)
            { name: 'Microsoft Zira', lang: 'en-US' },
            { name: 'Microsoft David', lang: 'en-US' },

            // Apple/macOS voices (natural)
            { name: 'Samantha', lang: 'en-US' },
            { name: 'Alex', lang: 'en-US' },
            { name: 'Karen', lang: 'en-AU' },
            { name: 'Daniel', lang: 'en-GB' },

            // Any English voice with "natural" or "premium" in name
            { pattern: /natural|premium|enhanced/i, lang: 'en' },

            // Fallback to any English voice
            { lang: 'en-US' },
            { lang: 'en-GB' },
            { lang: 'en' }
        ];

        // Try to find the best voice
        for (const pref of voicePreferences) {
            let voice = null;

            if (pref.name) {
                // Exact name match
                voice = this.voices.find(v => v.name === pref.name);
            } else if (pref.pattern) {
                // Pattern match
                voice = this.voices.find(v =>
                    pref.pattern.test(v.name) && v.lang.startsWith('en')
                );
            } else if (pref.lang) {
                // Language match
                voice = this.voices.find(v => v.lang === pref.lang);
                if (!voice) {
                    voice = this.voices.find(v => v.lang.startsWith(pref.lang));
                }
            }

            if (voice) {
                this.selectedVoice = voice;
                console.log(`[TTS] ✅ Selected voice: ${voice.name} (${voice.lang})`);
                break;
            }
        }

        if (!this.selectedVoice && this.voices.length > 0) {
            // Last resort: use first available voice
            this.selectedVoice = this.voices[0];
            console.log(`[TTS] ⚠️ Using fallback voice: ${this.selectedVoice.name}`);
        }

        // Log all available voices for debugging
        console.log('[TTS] Available voices:', this.voices.map(v => ({
            name: v.name,
            lang: v.lang,
            default: v.default
        })));
    }

    /**
     * Speak the given text with natural voice
     */
    speak(text, callbacks = {}) {
        if (!text || this.isMuted) return;

        // Cancel any ongoing speech
        this.stop();

        if (!this.selectedVoice) {
            console.error('[TTS] No voice available');
            return;
        }

        // Create utterance
        this.currentUtterance = new SpeechSynthesisUtterance(text);

        // Apply natural voice settings
        this.currentUtterance.voice = this.selectedVoice;
        this.currentUtterance.rate = this.settings.rate;
        this.currentUtterance.pitch = this.settings.pitch;
        this.currentUtterance.volume = this.settings.volume;

        // Set up callbacks
        this.currentUtterance.onstart = () => {
            console.log('[TTS] 🔊 Started speaking:', text.substring(0, 50) + '...');
            if (callbacks.onStart) callbacks.onStart();
        };

        this.currentUtterance.onend = () => {
            console.log('[TTS] ✅ Finished speaking');
            if (callbacks.onEnd) callbacks.onEnd();
        };

        this.currentUtterance.onerror = (event) => {
            console.error('[TTS] ❌ Error:', event.error);
            if (callbacks.onError) callbacks.onError(event.error);
        };

        // Speak!
        this.synth.speak(this.currentUtterance);
    }

    /**
     * Stop current speech
     */
    stop() {
        // Force cancel regardless of state to ensure silence
        this.synth.cancel();
    }

    /**
     * Pause current speech
     */
    pause() {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
        }
    }

    /**
     * Resume paused speech
     */
    resume() {
        if (this.synth.paused) {
            this.synth.resume();
        }
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stop();
        }
        return this.isMuted;
    }

    /**
     * Set mute state
     */
    setMuted(muted) {
        this.isMuted = muted;
        if (muted) {
            this.stop();
        }
    }

    /**
     * Adjust speech rate (0.1 to 10)
     */
    setRate(rate) {
        this.settings.rate = Math.max(0.1, Math.min(10, rate));
    }

    /**
     * Adjust pitch (0 to 2)
     */
    setPitch(pitch) {
        this.settings.pitch = Math.max(0, Math.min(2, pitch));
    }

    /**
     * Adjust volume (0 to 1)
     */
    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Get available voices
     */
    getVoices() {
        return this.voices;
    }

    /**
     * Set specific voice by name
     */
    setVoice(voiceName) {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) {
            this.selectedVoice = voice;
            console.log(`[TTS] Voice changed to: ${voice.name}`);
            return true;
        }
        return false;
    }

    /**
     * Check if TTS is supported
     */
    static isSupported() {
        return 'speechSynthesis' in window;
    }

    /**
     * Check if currently speaking
     */
    isSpeaking() {
        return this.synth.speaking;
    }
}

export default TextToSpeechService;
