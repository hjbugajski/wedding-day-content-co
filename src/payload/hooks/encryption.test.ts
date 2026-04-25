import { describe, expect, it, vi } from 'vitest';

vi.mock('@/env/server', () => ({
  env: { PAYLOAD_SECRET: 'encryption-hook-test-secret' },
}));

import { decryptField, encryptField } from '@/payload/hooks/encryption';
import { decrypt, encrypt } from '@/payload/utils/crypto';

const baseArgs = (value: unknown) =>
  ({
    value,
    req: { payload: { logger: { error: vi.fn() } } },
  }) as never;

describe('encryptField', () => {
  it('passes through undefined and null', () => {
    expect(encryptField(baseArgs(undefined))).toBeUndefined();
    expect(encryptField(baseArgs(null))).toBeNull();
  });

  it('encrypts a string to something decrypt() reverses', () => {
    const out = encryptField(baseArgs('secret')) as string;
    expect(typeof out).toBe('string');
    expect(out).not.toBe('secret');
    expect(decrypt(out)).toBe('secret');
  });

  it('encrypts each string element of an array', () => {
    const out = encryptField(baseArgs(['a', 'b'])) as string[];
    expect(out).toHaveLength(2);
    expect(out.map(decrypt)).toEqual(['a', 'b']);
  });

  it('JSON-stringifies non-primitive values before encrypting', () => {
    const out = encryptField(baseArgs({ a: 1 })) as string;
    expect(decrypt(out)).toBe('{"a":1}');
  });
});

describe('decryptField', () => {
  it('passes through undefined and null', () => {
    expect(decryptField(baseArgs(undefined))).toBeUndefined();
    expect(decryptField(baseArgs(null))).toBeNull();
  });

  it('decrypts a string and JSON-parses when possible', () => {
    const cipher = encrypt(JSON.stringify({ a: 1 }));
    expect(decryptField(baseArgs(cipher))).toEqual({ a: 1 });
  });

  it('returns the decrypted string when it is not valid JSON', () => {
    const cipher = encrypt('plain text');
    expect(decryptField(baseArgs(cipher))).toBe('plain text');
  });

  it('logs and returns the original value when decryption throws', () => {
    const logger = { error: vi.fn() };
    const args = {
      value: 'not-a-valid-cipher',
      req: { payload: { logger } },
    };
    const result = decryptField(args as never);
    expect(result).toBe('not-a-valid-cipher');
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ msg: 'Decryption failed' }),
    );
  });

  it('decrypts each string element of an array', () => {
    const out = decryptField(baseArgs([encrypt('a'), encrypt('b')])) as string[];
    expect(out).toEqual(['a', 'b']);
  });
});
