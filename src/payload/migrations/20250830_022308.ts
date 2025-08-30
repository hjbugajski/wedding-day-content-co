import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  ALTER TABLE "form_submissions_data" ADD COLUMN "name" varchar NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
