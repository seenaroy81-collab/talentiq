import { createClient } from 'redis';
import { ENV } from './env.js';

const redisClient = createClient({
    url: ENV.REDIS_URL || 'redis://localhost:6379',
    socket: {
        // Upstash requires TLS for connections. This handles both local and prod.
        tls: ENV.REDIS_URL?.startsWith('rediss://'),
        rejectUnauthorized: false, // Required for some free-tier providers
    }
});

redisClient.on('error', (err) => {
    // Log error but don't crash the server
    console.error('❌ Redis Client Error:', err.message);
});

let isConnected = false;

export const connectRedis = async () => {
    if (isConnected) return;
    try {
        await redisClient.connect();
        isConnected = true;
        console.log('✅ Connected to Redis');
    } catch (error) {
        console.error('❌ Failed to connect to Redis:', error.message);
        // We don't throw here so the server can still start without Redis
    }
};

export const cacheSet = async (key, value, ttl = 3600) => {
    if (!isConnected) return;
    try {
        const stringValue = JSON.stringify(value);
        await redisClient.set(key, stringValue, {
            EX: ttl
        });
    } catch (error) {
        console.error(`Redis Cache Set Error (${key}):`, error);
    }
};

export const cacheGet = async (key) => {
    if (!isConnected) return null;
    try {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`Redis Cache Get Error (${key}):`, error);
        return null;
    }
};

export const cacheDel = async (key) => {
    if (!isConnected) return;
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error(`Redis Cache Del Error (${key}):`, error);
    }
};

export default redisClient;
