import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres';

import { decryptWithSecret, encryptWithSecret } from '@/payload/utils/crypto';

type EncryptedTarget = {
  table: string;
  idColumn: string;
  columns: string[];
};

// Every column that stores AES-encrypted data via the encryptField/decryptField hooks
// (src/payload/hooks/encryption.ts). Keep in sync when adding or removing those hooks.
const ENCRYPTED_TARGETS: EncryptedTarget[] = [
  { table: 'clients', idColumn: 'id', columns: ['name', 'phone_number'] },
  { table: 'form_submissions_data', idColumn: 'id', columns: ['value'] },
];

type RekeyArgs = Pick<MigrateUpArgs, 'db' | 'payload'> & {
  oldSecret: string | undefined;
  newSecret: string;
};

// db.execute() resolves to the node-postgres result; the rows live on `.rows`.
const toRows = <T>(result: unknown): T[] => (result as { rows: T[] }).rows;

/**
 * Re-encrypts every encrypted column from `oldSecret` to `newSecret`, in place, via raw SQL so no
 * collection or field hooks (and their side effects, e.g. form emails) fire. Runs inside the
 * caller migration's transaction, so a thrown error rolls everything back.
 *
 * The cipher (AES-256-CTR) is unauthenticated — a WRONG old secret yields silent garbage, not an
 * error, so the transaction cannot catch it. Follow the calling migration's rotation runbook.
 */
export async function rekeyEncryptedFields({ db, payload, oldSecret, newSecret }: RekeyArgs) {
  // PAYLOAD_SECRET_OLD is only set for the single rotation deploy. Absent or matching the current
  // secret means nothing to re-key — keeps this migration a safe no-op everywhere else.
  if (!oldSecret || oldSecret === newSecret) {
    payload.logger.info(
      'Re-key skipped: PAYLOAD_SECRET_OLD is unset or matches the current PAYLOAD_SECRET.',
    );

    return;
  }

  // Queries run sequentially on the migration's single transaction connection; parallelizing
  // would not speed this up and risks connection contention.
  /* oxlint-disable no-await-in-loop */
  for (const { table, idColumn, columns } of ENCRYPTED_TARGETS) {
    // Tolerate schemas where the table isn't present yet (fresh or partially-pushed databases).
    const existence = await db.execute(sql.raw(`SELECT to_regclass('public.${table}') AS reg`));
    const exists = toRows<{ reg: string | null }>(existence);

    if (!exists[0]?.reg) {
      payload.logger.warn(`Re-key skipped: table "${table}" does not exist yet.`);

      continue;
    }

    for (const column of columns) {
      const result = await db.execute(
        sql.raw(`SELECT "${idColumn}" AS id, "${column}" AS value FROM "${table}"`),
      );
      const rows = toRows<{ id: string; value: string | null }>(result);

      let count = 0;

      for (const { id, value } of rows) {
        if (!value) {
          continue;
        }

        const rekeyed = encryptWithSecret(decryptWithSecret(value, oldSecret), newSecret);

        await db.execute(
          sql`UPDATE ${sql.raw(`"${table}"`)} SET ${sql.raw(`"${column}"`)} = ${rekeyed} WHERE ${sql.raw(`"${idColumn}"`)} = ${id}`,
        );
        count += 1;
      }

      payload.logger.info(`Re-keyed ${count} row(s) in ${table}.${column}`);
    }
  }
  /* oxlint-enable no-await-in-loop */
}
