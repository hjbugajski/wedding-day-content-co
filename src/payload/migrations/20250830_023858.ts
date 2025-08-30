import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "navigation_call_to_action_link_call_to_action_link_relationship_idx";
  ALTER TABLE "forms" ADD COLUMN "email_settings_subject_template" varchar;
  ALTER TABLE "forms" ADD COLUMN "email_settings_subject_field" varchar;
  ALTER TABLE "forms" ADD COLUMN "email_settings_name_field" varchar;
  ALTER TABLE "forms" ADD COLUMN "email_settings_email_field" varchar;
  ALTER TABLE "forms" ADD COLUMN "email_settings_phone_field" varchar;
  ALTER TABLE "_forms_v" ADD COLUMN "version_email_settings_subject_template" varchar;
  ALTER TABLE "_forms_v" ADD COLUMN "version_email_settings_subject_field" varchar;
  ALTER TABLE "_forms_v" ADD COLUMN "version_email_settings_name_field" varchar;
  ALTER TABLE "_forms_v" ADD COLUMN "version_email_settings_email_field" varchar;
  ALTER TABLE "_forms_v" ADD COLUMN "version_email_settings_phone_field" varchar;
  ALTER TABLE "form_submissions_data" ADD COLUMN "name" varchar;
  CREATE INDEX IF NOT EXISTS "navigation_call_to_action_link_call_to_action_link_relat_idx" ON "navigation" USING btree ("call_to_action_link_relationship_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "navigation_call_to_action_link_call_to_action_link_relat_idx";
  CREATE INDEX "navigation_call_to_action_link_call_to_action_link_relationship_idx" ON "navigation" USING btree ("call_to_action_link_relationship_id");
  ALTER TABLE "forms" DROP COLUMN "email_settings_subject_template";
  ALTER TABLE "forms" DROP COLUMN "email_settings_subject_field";
  ALTER TABLE "forms" DROP COLUMN "email_settings_name_field";
  ALTER TABLE "forms" DROP COLUMN "email_settings_email_field";
  ALTER TABLE "forms" DROP COLUMN "email_settings_phone_field";
  ALTER TABLE "_forms_v" DROP COLUMN "version_email_settings_subject_template";
  ALTER TABLE "_forms_v" DROP COLUMN "version_email_settings_subject_field";
  ALTER TABLE "_forms_v" DROP COLUMN "version_email_settings_name_field";
  ALTER TABLE "_forms_v" DROP COLUMN "version_email_settings_email_field";
  ALTER TABLE "_forms_v" DROP COLUMN "version_email_settings_phone_field";
  ALTER TABLE "form_submissions_data" DROP COLUMN "name";`)
}
