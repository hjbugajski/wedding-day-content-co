import crypto from 'crypto';

import { env } from '@/env/server';

const createKeyFromSecret = (secretKey: string): string =>
  crypto.createHash('sha256').update(secretKey).digest('hex').slice(0, 32);

const algorithm = 'aes-256-ctr';

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, createKeyFromSecret(env.PAYLOAD_SECRET), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const ivString = iv.toString('hex');
  const encryptedString = encrypted.toString('hex');

  return `${ivString}${encryptedString}`;
};

export const decrypt = (hash: string): string => {
  const iv = hash.slice(0, 32);
  const content = hash.slice(32);
  const decipher = crypto.createDecipheriv(
    algorithm,
    createKeyFromSecret(env.PAYLOAD_SECRET),
    Buffer.from(iv, 'hex'),
  );
  const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

  return decrypted.toString();
};
