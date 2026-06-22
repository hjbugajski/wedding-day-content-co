import { describe, expect, it, vi } from 'vitest';

vi.mock('@/env/server', () => ({
  env: { PAYLOAD_SECRET: 'test-secret-for-crypto-round-trip' },
}));

import { decrypt, decryptWithSecret, encrypt, encryptWithSecret } from '@/payload/utils/crypto';

describe('crypto: encrypt + decrypt', () => {
  it('round-trips a plain string', () => {
    const secret = 'hello world';
    expect(decrypt(encrypt(secret))).toBe(secret);
  });

  it('round-trips unicode and punctuation', () => {
    const secret = 'naïve café — "quoted"';
    expect(decrypt(encrypt(secret))).toBe(secret);
  });

  it('round-trips an empty string', () => {
    expect(decrypt(encrypt(''))).toBe('');
  });

  it('produces different ciphertexts for the same input (fresh IV each time)', () => {
    const a = encrypt('repeat');
    const b = encrypt('repeat');
    expect(a).not.toBe(b);
    expect(decrypt(a)).toBe('repeat');
    expect(decrypt(b)).toBe('repeat');
  });

  it('produces a hex string prefixed with a 32-char IV', () => {
    const out = encrypt('x');
    expect(out).toMatch(/^[0-9a-f]+$/i);
    expect(out.length).toBeGreaterThanOrEqual(32);
  });

  it('returns garbage (not a throw) when decrypting a tampered ciphertext', () => {
    const good = encrypt('hello');
    // Flip the final hex nibble of the ciphertext body (leave the 32-char IV intact);
    // AES-CTR is unauthenticated, so it decrypts to garbage rather than throwing.
    const last = good.at(-1)!;
    const flipped = good.slice(0, -1) + (last === '0' ? '1' : '0');
    expect(() => decrypt(flipped)).not.toThrow();
    expect(decrypt(flipped)).not.toBe('hello');
  });

  it('throws when the hash is too short to contain an IV', () => {
    expect(() => decrypt('abc')).toThrow();
  });
});

describe('crypto: secret rotation (re-key)', () => {
  const OLD = 'old-payload-secret';
  const NEW = 'new-payload-secret';

  it('re-keys a value from the old secret to the new secret', () => {
    const plaintext = 'naïve café — "quoted"';
    const oldCipher = encryptWithSecret(plaintext, OLD);

    const rekeyed = encryptWithSecret(decryptWithSecret(oldCipher, OLD), NEW);

    expect(decryptWithSecret(rekeyed, NEW)).toBe(plaintext);
  });

  it('old ciphertext no longer decrypts to the original under the new secret', () => {
    const plaintext = 'sensitive value';
    const oldCipher = encryptWithSecret(plaintext, OLD);

    // AES-CTR is unauthenticated — the wrong key returns garbage, not an error.
    expect(decryptWithSecret(oldCipher, NEW)).not.toBe(plaintext);
  });
});
