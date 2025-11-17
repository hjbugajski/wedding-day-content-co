import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_navigation_call_to_action_icon" ADD VALUE 'sparkle' BEFORE 'tikTok';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation" ALTER COLUMN "call_to_action_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_navigation_call_to_action_icon";
  CREATE TYPE "public"."enum_navigation_call_to_action_icon" AS ENUM('arrowLeft', 'arrowRight', 'arrowUpRight', 'calendar', 'calendarCheck', 'checkmark', 'chevronDown', 'circle', 'instagram', 'menu', 'navArrowDown', 'navArrowDownSmall', 'navArrowLeft', 'navArrowRight', 'navArrowUp', 'quoteSolid', 'tikTok', 'x');
  ALTER TABLE "navigation" ALTER COLUMN "call_to_action_icon" SET DATA TYPE "public"."enum_navigation_call_to_action_icon" USING "call_to_action_icon"::"public"."enum_navigation_call_to_action_icon";`)
}
