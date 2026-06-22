import crypto from 'crypto';

import { env } from '@/env/server';

const createKeyFromSecret = (secretKey: string): string =>
  crypto.createHash('sha256').update(secretKey).digest('hex').slice(0, 32);

const algorithm = 'aes-256-ctr';

// Key-parameterized variants. The re-key migration needs to decrypt with the old
// secret and encrypt with the new one in the same process, so the secret cannot be
// baked in. `encrypt`/`decrypt` below are the app-wide helpers bound to the live secret.
export const encryptWithSecret = (text: string, secret: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, createKeyFromSecret(secret), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}${encrypted.toString('hex')}`;
};

export const decryptWithSecret = (hash: string, secret: string): string => {
  const iv = hash.slice(0, 32);
  const content = hash.slice(32);
  const decipher = crypto.createDecipheriv(
    algorithm,
    createKeyFromSecret(secret),
    Buffer.from(iv, 'hex'),
  );
  const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

  return decrypted.toString();
};

export const encrypt = (text: string): string => encryptWithSecret(text, env.PAYLOAD_SECRET);

export const decrypt = (hash: string): string => decryptWithSecret(hash, env.PAYLOAD_SECRET);
