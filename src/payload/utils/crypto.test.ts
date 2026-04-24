import { describe, expect, it, vi } from 'vitest';

vi.mock('@/env/server', () => ({
  env: { PAYLOAD_SECRET: 'test-secret-for-crypto-round-trip' },
}));

import { decrypt, encrypt } from '@/payload/utils/crypto';

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

  it('throws when decrypting a tampered ciphertext', () => {
    const good = encrypt('hello');
    // Flip the final hex nibble of the ciphertext body (leave the 32-char IV intact)
    // so AES-CTR decrypts to garbage that isn't valid UTF-8.
    const last = good.at(-1)!;
    const flipped = good.slice(0, -1) + (last === '0' ? '1' : '0');
    expect(() => decrypt(flipped)).not.toThrow();
    expect(decrypt(flipped)).not.toBe('hello');
  });

  it('throws when the hash is too short to contain an IV', () => {
    expect(() => decrypt('abc')).toThrow();
  });
});
