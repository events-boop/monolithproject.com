/**
 * Monolith Haptic Feedback
 *
 * Replaces the old audio-chirp UI feedback with the Vibration API. On devices
 * without vibration hardware (most desktops, iOS Safari) every call is a
 * silent no-op — that's desired. The old `signalChirp` export name is kept
 * so callers don't need to change.
 *
 * Hover is intentionally a no-op: vibrating on every hover would be miserable
 * on mobile, and desktops don't have motors to run anyway.
 */

function canVibrate(): boolean {
    if (typeof navigator === "undefined") return false;
    if (typeof navigator.vibrate !== "function") return false;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        return false;
    }
    return true;
}

function vibrate(pattern: number | number[]) {
    if (!canVibrate()) return;
    try {
        navigator.vibrate(pattern);
    } catch {
        // Some browsers throw if user-activation is missing; fail silently.
    }
}

class HapticFeedback {
    /** Tactile tap on navigation / primary action. */
    public click() {
        vibrate(10);
    }

    /** No-op — hover haptics are hostile on touch and impossible on desktop. */
    public hover() {
        // intentional no-op
    }

    /** Error / blocked action — short double pulse. */
    public error() {
        vibrate([20, 40, 20]);
    }

    /** Boot / confirmation sequence — three-step staccato. */
    public boot() {
        vibrate([10, 30, 10, 30, 20]);
    }
}

export const signalChirp = new HapticFeedback();
