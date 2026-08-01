type RateLimitEntry = {
    count: number;
    resetAt: number;
};

type ConcurrencySlot = {
    key: string;
    expiresAt: number;
};

type RateLimitResult = {
    allowed: boolean;
    retryAfterSeconds: number;
};

type GlobalRateLimitState = typeof globalThis & {
    __tanVinhDatRateLimitState?: {
        counters: Map<string, RateLimitEntry>;
        concurrency: Map<string, ConcurrencySlot[]>;
    };
};

const globalState = globalThis as GlobalRateLimitState;
const state = globalState.__tanVinhDatRateLimitState ?? {
    counters: new Map<string, RateLimitEntry>(),
    concurrency: new Map<string, ConcurrencySlot[]>(),
};

globalState.__tanVinhDatRateLimitState = state;

function buildScopedKey(namespace: string, key: string) {
    return `${namespace}:${key}`;
}

function pruneExpiredEntries(now: number) {
    for (const [key, entry] of state.counters) {
        if (entry.resetAt <= now) {
            state.counters.delete(key);
        }
    }

    for (const [namespace, slots] of state.concurrency) {
        const activeSlots = slots.filter((slot) => slot.expiresAt > now);

        if (activeSlots.length === 0) {
            state.concurrency.delete(namespace);
        } else if (activeSlots.length !== slots.length) {
            state.concurrency.set(namespace, activeSlots);
        }
    }
}

export async function consumeRateLimit(
    namespace: string,
    key: string,
    maxRequests: number,
    windowMs: number,
): Promise<RateLimitResult> {
    if (maxRequests < 1) {
        throw new Error('RATE_LIMIT_MAX_REQUESTS_INVALID');
    }

    if (windowMs < 1) {
        throw new Error('RATE_LIMIT_WINDOW_INVALID');
    }

    const now = Date.now();
    pruneExpiredEntries(now);

    const scopedKey = buildScopedKey(namespace, key);
    const existing = state.counters.get(scopedKey);

    if (!existing || existing.resetAt <= now) {
        state.counters.set(scopedKey, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
    }

    if (existing.count >= maxRequests) {
        return {
            allowed: false,
            retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
        };
    }

    existing.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
}

export async function acquireConcurrencySlot(
    namespace: string,
    maxSlots: number,
    timeoutMs: number,
): Promise<() => Promise<void>> {
    if (maxSlots < 1) {
        throw new Error('CONCURRENCY_MAX_SLOTS_INVALID');
    }

    if (timeoutMs < 1) {
        throw new Error('CONCURRENCY_TIMEOUT_INVALID');
    }

    const now = Date.now();
    pruneExpiredEntries(now);

    const slots = state.concurrency.get(namespace) ?? [];

    if (slots.length >= maxSlots) {
        throw new Error('CONCURRENCY_LIMIT_REACHED');
    }

    const slotKey = `${namespace}:${crypto.randomUUID()}`;
    const slot: ConcurrencySlot = { key: slotKey, expiresAt: now + timeoutMs };
    let released = false;

    state.concurrency.set(namespace, [...slots, slot]);

    return async () => {
        if (released) return;
        released = true;

        const currentSlots = state.concurrency.get(namespace) ?? [];
        const nextSlots = currentSlots.filter((activeSlot) => activeSlot.key !== slotKey);

        if (nextSlots.length === 0) {
            state.concurrency.delete(namespace);
        } else {
            state.concurrency.set(namespace, nextSlots);
        }
    };
}
