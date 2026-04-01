/**
 * Monolith Signal Chirp Engine
 * High-precision, zero-latency synthesizer for tactical UI feedback.
 * Monolith OS v3001
 */

class SignalChirpEngine {
    private audioCtx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private initialized: boolean = false;

    private init() {
        if (this.initialized) return;
        try {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.gain.value = 0.05; // Discreet, táctile volume
            this.masterGain.connect(this.audioCtx.destination);
            this.initialized = true;
        } catch (e) {
            console.warn("SignalChirpEngine: Audio contextualization failed.", e);
        }
    }

    private playFrequency(freq: number, type: OscillatorType, length: number, gainValue: number = 1) {
        if (!this.initialized || !this.audioCtx || !this.masterGain) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        
        // Envelope
        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(gainValue, this.audioCtx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + length);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioCtx.currentTime + length + 0.1);
    }

    /**
     * Tactile click for navigation and buttons
     */
    public click() {
        this.init();
        this.playFrequency(1200, "square", 0.03, 0.5);
    }

    /**
     * Subtle hover blip for menu items
     */
    public hover() {
        this.init();
        this.playFrequency(2400, "sine", 0.015, 0.3);
    }

    /**
     * Diagnostic error chirp
     */
    public error() {
        this.init();
        this.playFrequency(400, "sawtooth", 0.1, 0.4);
        setTimeout(() => this.playFrequency(300, "sawtooth", 0.1, 0.4), 80);
    }

    /**
     * Kernel boot sequence chirp
     */
    public boot() {
        this.init();
        this.playFrequency(800, "sine", 0.05);
        setTimeout(() => this.playFrequency(1000, "sine", 0.05), 50);
        setTimeout(() => this.playFrequency(1200, "sine", 0.1), 100);
    }
}

export const signalChirp = new SignalChirpEngine();
