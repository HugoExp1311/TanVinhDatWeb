const textEncoder = new TextEncoder();

type ParsedPasswordHash = {
    algorithm: 'pbkdf2';
    digest: 'SHA-256' | 'SHA-512';
    iterations: number;
    salt: ArrayBuffer;
    hash: Uint8Array;
};

function base64ToBytes(value: string) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

function bytesToArrayBuffer(bytes: Uint8Array) {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function safeEqual(left: Uint8Array, right: Uint8Array) {
    if (left.byteLength !== right.byteLength) return false;

    let result = 0;

    for (let index = 0; index < left.byteLength; index += 1) {
        result |= left[index] ^ right[index];
    }

    return result === 0;
}

function parseAdminPasswordHash(): ParsedPasswordHash {
    const configuredHash = process.env.ADMIN_PASSWORD_HASH?.trim();

    if (!configuredHash) {
        throw new Error('ADMIN_PASSWORD_HASH is not configured. Generate a PBKDF2 hash and set it in the server environment.');
    }

    const [algorithm, digest, iterations, salt, hash] = configuredHash.split(':');

    if (algorithm !== 'pbkdf2') {
        throw new Error('ADMIN_PASSWORD_HASH must use the pbkdf2 format.');
    }

    const normalizedDigest = digest === 'sha512' ? 'SHA-512' : digest === 'sha256' ? 'SHA-256' : null;
    const parsedIterations = Number.parseInt(iterations || '', 10);

    if (!normalizedDigest || !Number.isFinite(parsedIterations) || parsedIterations < 100_000 || !salt || !hash) {
        throw new Error('ADMIN_PASSWORD_HASH is invalid. Expected: pbkdf2:sha256:310000:<saltBase64>:<hashBase64>');
    }

    return {
        algorithm,
        digest: normalizedDigest,
        iterations: parsedIterations,
        salt: bytesToArrayBuffer(base64ToBytes(salt)),
        hash: base64ToBytes(hash),
    };
}

export async function verifyAdminPassword(password: string) {
    const parsedHash = parseAdminPasswordHash();
    const passwordKey = await crypto.subtle.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            hash: parsedHash.digest,
            salt: parsedHash.salt,
            iterations: parsedHash.iterations,
        },
        passwordKey,
        parsedHash.hash.byteLength * 8,
    );

    return safeEqual(new Uint8Array(derivedBits), parsedHash.hash);
}