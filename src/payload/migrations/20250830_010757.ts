import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "navigation_call_to_action_link_call_to_action_link_relationship_idx";
  CREATE INDEX "navigation_call_to_action_link_call_to_action_link_relat_idx" ON "navigation" USING btree ("call_to_action_link_relationship_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "navigation_call_to_action_link_call_to_action_link_relat_idx";
  CREATE INDEX "navigation_call_to_action_link_call_to_action_link_relationship_idx" ON "navigation" USING btree ("call_to_action_link_relationship_id");`)
}
