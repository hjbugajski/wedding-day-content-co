import type { FieldHook } from 'payload';

import { decrypt, encrypt } from '@/payload/utils/crypto';

export const encryptField: FieldHook = ({ value }) => {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === 'string') {
    return encrypt(value);
  }

  if (Array.isArray(value)) {
    return value.map(encrypt);
  }

  return encrypt(JSON.stringify(value));
};

export const decryptField: FieldHook = ({ value, req: { payload } }) => {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const decrypted = decrypt(value);

      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (e) {
      payload.logger.error({ err: e, msg: 'Decryption failed' });

      return value;
    }
  }

  if (Array.isArray(value)) {
    return value.map(decrypt);
  }

  return value;
};
