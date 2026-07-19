import { randomUUID } from 'node:crypto';
import { createClient, type RedisClientType } from 'redis';

export type RateLimitResult = {
    allowed: boolean;
    retryAfterSeconds: number;
};

type MemoryEntry = {
    count: number;
    resetAt: number;
};

const memoryEntries = new Map<string, MemoryEntry>();
const RATE_LIMIT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
local ttl = redis.call('PTTL', KEYS[1])
return {count, ttl}
`;

const CONCURRENCY_ACQUIRE_SCRIPT = `
local now = tonumber(ARGV[1])
local expires_at = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now)
if redis.call('ZCARD', KEYS[1]) >= limit then
  return 0
end
redis.call('ZADD', KEYS[1], expires_at, ARGV[4])
redis.call('PEXPIRE', KEYS[1], expires_at - now)
return 1
`;

const memoryConcurrency = new Map<string, Map<string, number>>();

let redisClientPromise: Promise<RedisClientType> | null = null;

function getRedisClient() {
    const redisUrl = process.env.REDIS_URL?.trim();

    if (!redisUrl) return null;

    if (!redisClientPromise) {
        const client = createClient({ url: redisUrl });
        client.on('error', (error) => console.error('[rate-limit] Redis error', error instanceof Error ? error.message : 'Unknown Redis error'));
        redisClientPromise = client.connect()
            .then(() => client as RedisClientType)
            .catch((error) => {
                redisClientPromise = null;
                throw error;
            });
    }

    return redisClientPromise;
}

function consumeMemoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const existing = memoryEntries.get(key);

    if (!existing || existing.resetAt <= now) {
        memoryEntries.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
    }

    existing.count += 1;

    return {
        allowed: existing.count <= limit,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
}

export async function consumeRateLimit(namespace: string, identifier: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const key = `tanvinhdat:rate-limit:${namespace}:${identifier}`;
    const clientPromise = getRedisClient();

    if (!clientPromise) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('REDIS_URL is required for production rate limiting.');
        }

        return consumeMemoryLimit(key, limit, windowMs);
    }

    const client = await clientPromise;
    const result = await client.eval(RATE_LIMIT_SCRIPT, {
        keys: [key],
        arguments: [String(windowMs)],
    });
    const [count, ttl] = result as [number, number];

    return {
        allowed: count <= limit,
        retryAfterSeconds: Math.max(1, Math.ceil(ttl / 1000)),
    };
}

export async function resetRateLimit(namespace: string, identifier: string) {
    const key = `tanvinhdat:rate-limit:${namespace}:${identifier}`;
    const clientPromise = getRedisClient();

    if (!clientPromise) {
        memoryEntries.delete(key);
        return;
    }

    const client = await clientPromise;
    await client.del(key);
}

export async function acquireConcurrencySlot(namespace: string, limit: number, ttlMs: number): Promise<() => Promise<void>> {
    const key = `tanvinhdat:concurrency:${namespace}`;
    const token = randomUUID();
    const now = Date.now();
    const expiresAt = now + ttlMs;
    const clientPromise = getRedisClient();

    if (!clientPromise) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('REDIS_URL is required for production concurrency control.');
        }

        const leases = memoryConcurrency.get(key) || new Map<string, number>();

        for (const [leaseToken, leaseExpiry] of leases) {
            if (leaseExpiry <= now) leases.delete(leaseToken);
        }

        if (leases.size >= limit) {
            throw new Error('CONCURRENCY_LIMIT_REACHED');
        }

        leases.set(token, expiresAt);
        memoryConcurrency.set(key, leases);

        return async () => {
            const currentLeases = memoryConcurrency.get(key);
            currentLeases?.delete(token);
            if (currentLeases?.size === 0) memoryConcurrency.delete(key);
        };
    }

    const client = await clientPromise;
    const acquired = await client.eval(CONCURRENCY_ACQUIRE_SCRIPT, {
        keys: [key],
        arguments: [String(now), String(expiresAt), String(limit), token],
    });

    if (Number(acquired) !== 1) {
        throw new Error('CONCURRENCY_LIMIT_REACHED');
    }

    return async () => {
        await client.zRem(key, token);
    };
}
