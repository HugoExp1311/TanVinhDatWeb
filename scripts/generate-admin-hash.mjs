import { pbkdf2Sync, randomBytes } from 'node:crypto';

const password = process.argv.slice(2).join(' ');

if (!password) {
    console.error('Usage: npm run admin:hash -- "your-strong-admin-password"');
    process.exit(1);
}

const iterations = 310_000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256');

console.log(`ADMIN_PASSWORD_HASH=pbkdf2:sha256:${iterations}:${salt.toString('base64')}:${hash.toString('base64')}`);