// Simple in-memory rate limiting for password attempts
// For production, use Redis or similar distributed cache

const attemptStore = new Map();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function rateLimitPasswordAttempts(req, res, next) {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Get or create attempt record
    if (!attemptStore.has(key)) {
        attemptStore.set(key, { count: 0, firstAttempt: now });
    }

    const record = attemptStore.get(key);

    // Reset if window has passed
    if (now - record.firstAttempt > WINDOW_MS) {
        record.count = 0;
        record.firstAttempt = now;
    }

    // Check if limit exceeded
    if (record.count >= MAX_ATTEMPTS) {
        const timeLeft = Math.ceil((record.firstAttempt + WINDOW_MS - now) / 1000 / 60);
        return res.status(429).json({
            message: `Too many password attempts. Please try again in ${timeLeft} minutes.`,
        });
    }

    // Increment count
    record.count++;

    next();
}

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of attemptStore.entries()) {
        if (now - record.firstAttempt > WINDOW_MS) {
            attemptStore.delete(key);
        }
    }
}, WINDOW_MS);
