import { describe, expect, it, vi } from 'vitest';

vi.mock('@/env/server', () => ({
  env: { PAYLOAD_SECRET: 'current-secret' },
}));

import { decryptWithSecret, encryptWithSecret } from '@/payload/utils/crypto';
import { rekeyEncryptedFields } from '@/payload/utils/rekey-encrypted-fields';

type ExecuteArgs = Parameters<typeof rekeyEncryptedFields>[0];

// Walk a drizzle SQL object: a chunk is either a StringChunk (literal text, `.value` is a string
// array), a nested SQL (`.queryChunks`), or a raw interpolated value that becomes a bound
// parameter. sqlText reconstructs the query (parameters render as "?"); sqlParams collects the
// interpolated values in order. Lets the mock db branch on the query and capture each UPDATE.
type SqlNode = { queryChunks?: unknown[]; value?: unknown };

const sqlText = (node: unknown): string => {
  if (node === null || node === undefined) {
    return '';
  }

  if (typeof node !== 'object') {
    return '?';
  }

  const n = node as SqlNode;

  if (Array.isArray(n.queryChunks)) {
    return n.queryChunks.map(sqlText).join('');
  }

  return Array.isArray(n.value) ? n.value.join('') : '';
};

const sqlParams = (node: unknown, acc: unknown[] = []): unknown[] => {
  if (node === null || node === undefined) {
    return acc;
  }

  if (typeof node !== 'object') {
    acc.push(node);

    return acc;
  }

  const n = node as SqlNode;

  if (Array.isArray(n.queryChunks)) {
    n.queryChunks.forEach((chunk) => sqlParams(chunk, acc));
  }

  return acc;
};

const makeArgs = (overrides: Partial<ExecuteArgs>) => {
  const executed: unknown[] = [];
  const db = {
    execute: (query: unknown) => {
      executed.push(query);

      return Promise.resolve({ rows: [] });
    },
  };
  const logger = { info: vi.fn(), warn: vi.fn() };

  const args = {
    db: db as unknown as ExecuteArgs['db'],
    payload: { logger } as unknown as ExecuteArgs['payload'],
    oldSecret: undefined,
    newSecret: 'current-secret',
    ...overrides,
  } satisfies ExecuteArgs;

  return { args, executed, logger };
};

describe('rekeyEncryptedFields: no-op safety', () => {
  it('runs no queries when PAYLOAD_SECRET_OLD is unset (dev/preview/normal deploys)', async () => {
    const { args, executed } = makeArgs({ oldSecret: undefined });

    await rekeyEncryptedFields(args);

    expect(executed).toHaveLength(0);
  });

  it('runs no queries when the old secret matches the current secret', async () => {
    const { args, executed } = makeArgs({
      oldSecret: 'current-secret',
      newSecret: 'current-secret',
    });

    await rekeyEncryptedFields(args);

    expect(executed).toHaveLength(0);
  });
});

describe('rekeyEncryptedFields: re-key loop', () => {
  const OLD = 'old-secret';
  const NEW = 'new-secret';

  it('decrypts each non-null row with the old secret and re-encrypts with the new', async () => {
    // Rows keyed by the SELECT alias (`"<column>" AS value`) so the mock can answer each column.
    const seeds: Record<string, { id: string; value: string | null }[]> = {
      name: [
        { id: 'c1', value: encryptWithSecret('Alice', OLD) },
        { id: 'c2', value: null },
      ],
      phone_number: [{ id: 'c1', value: encryptWithSecret('555-1234', OLD) }],
      value: [{ id: 'f1', value: encryptWithSecret('answer', OLD) }],
    };
    const updates: { rekeyed: string; id: string }[] = [];

    const db = {
      execute: (query: unknown) => {
        const text = sqlText(query);

        if (text.includes('to_regclass')) {
          return Promise.resolve({ rows: [{ reg: 'present' }] });
        }

        if (text.startsWith('SELECT')) {
          const column = Object.keys(seeds).find((col) => text.includes(`"${col}" AS value`));

          return Promise.resolve({ rows: column ? seeds[column] : [] });
        }

        const [rekeyed, id] = sqlParams(query) as [string, string];
        updates.push({ rekeyed, id });

        return Promise.resolve({ rows: [] });
      },
    };
    const logger = { info: vi.fn(), warn: vi.fn() };

    await rekeyEncryptedFields({
      db: db as unknown as ExecuteArgs['db'],
      payload: { logger } as unknown as ExecuteArgs['payload'],
      oldSecret: OLD,
      newSecret: NEW,
    });

    // One UPDATE per non-null row (the null clients.name row is skipped), each re-encrypted
    // so it now decrypts under the new secret back to the original plaintext.
    expect(updates).toHaveLength(3);
    expect(updates.map((u) => decryptWithSecret(u.rekeyed, NEW))).toEqual([
      'Alice',
      '555-1234',
      'answer',
    ]);
  });
});
