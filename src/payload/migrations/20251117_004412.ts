import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_blocks_checkbox_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_checkbox_width" AS ENUM('half', 'full');
  ALTER TYPE "public"."enum_navigation_call_to_action_icon" ADD VALUE 'checkmark' BEFORE 'chevronDown';
  CREATE TABLE "forms_blocks_checkbox_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"description" jsonb,
  	"value" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"width" "enum_forms_blocks_checkbox_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_checkbox_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"description" jsonb,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"width" "enum__forms_v_blocks_checkbox_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "forms_blocks_checkbox_options" ADD CONSTRAINT "forms_blocks_checkbox_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_checkbox_options" ADD CONSTRAINT "_forms_v_blocks_checkbox_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_checkbox" ADD CONSTRAINT "_forms_v_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_blocks_checkbox_options_order_idx" ON "forms_blocks_checkbox_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_options_parent_id_idx" ON "forms_blocks_checkbox_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_options_label_idx" ON "forms_blocks_checkbox_options" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_options_value_idx" ON "forms_blocks_checkbox_options" USING btree ("value");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_label_idx" ON "forms_blocks_checkbox" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_name_idx" ON "forms_blocks_checkbox" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_checkbox_options_order_idx" ON "_forms_v_blocks_checkbox_options" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_checkbox_options_parent_id_idx" ON "_forms_v_blocks_checkbox_options" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_checkbox_options_label_idx" ON "_forms_v_blocks_checkbox_options" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_checkbox_options_value_idx" ON "_forms_v_blocks_checkbox_options" USING btree ("value");
  CREATE INDEX "_forms_v_blocks_checkbox_order_idx" ON "_forms_v_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_checkbox_parent_id_idx" ON "_forms_v_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_checkbox_path_idx" ON "_forms_v_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_checkbox_label_idx" ON "_forms_v_blocks_checkbox" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_checkbox_name_idx" ON "_forms_v_blocks_checkbox" USING btree ("name");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "forms_blocks_checkbox_options" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "_forms_v_blocks_checkbox_options" CASCADE;
  DROP TABLE "_forms_v_blocks_checkbox" CASCADE;
  ALTER TABLE "navigation" ALTER COLUMN "call_to_action_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_navigation_call_to_action_icon";
  CREATE TYPE "public"."enum_navigation_call_to_action_icon" AS ENUM('arrowLeft', 'arrowRight', 'arrowUpRight', 'calendar', 'calendarCheck', 'chevronDown', 'circle', 'instagram', 'menu', 'navArrowDown', 'navArrowDownSmall', 'navArrowLeft', 'navArrowRight', 'navArrowUp', 'quoteSolid', 'tikTok', 'x');
  ALTER TABLE "navigation" ALTER COLUMN "call_to_action_icon" SET DATA TYPE "public"."enum_navigation_call_to_action_icon" USING "call_to_action_icon"::"public"."enum_navigation_call_to_action_icon";
  DROP TYPE "public"."enum_forms_blocks_checkbox_width";
  DROP TYPE "public"."enum__forms_v_blocks_checkbox_width";`)
}
