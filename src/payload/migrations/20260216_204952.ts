import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_date_default_date_values" CASCADE;
  DROP TABLE "forms_blocks_date" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_radio_options" CASCADE;
  DROP TABLE "forms_blocks_radio" CASCADE;
  DROP TABLE "forms_blocks_checkbox_options" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_phone_number" CASCADE;
  DROP TABLE "_forms_v_blocks_text" CASCADE;
  DROP TABLE "_forms_v_blocks_textarea" CASCADE;
  DROP TABLE "_forms_v_blocks_date_default_date_values" CASCADE;
  DROP TABLE "_forms_v_blocks_date" CASCADE;
  DROP TABLE "_forms_v_blocks_select_options" CASCADE;
  DROP TABLE "_forms_v_blocks_select" CASCADE;
  DROP TABLE "_forms_v_blocks_radio_options" CASCADE;
  DROP TABLE "_forms_v_blocks_radio" CASCADE;
  DROP TABLE "_forms_v_blocks_checkbox_options" CASCADE;
  DROP TABLE "_forms_v_blocks_checkbox" CASCADE;
  DROP TABLE "_forms_v_blocks_email" CASCADE;
  DROP TABLE "_forms_v_blocks_phone_number" CASCADE;
  ALTER TABLE "forms" ADD COLUMN "fields" jsonb;
  ALTER TABLE "_forms_v" ADD COLUMN "version_fields" jsonb;
  DROP TYPE "public"."enum_forms_blocks_text_width";
  DROP TYPE "public"."enum_forms_blocks_textarea_width";
  DROP TYPE "public"."enum_forms_blocks_date_width";
  DROP TYPE "public"."enum_forms_blocks_date_mode";
  DROP TYPE "public"."enum_forms_blocks_date_allowed_dates";
  DROP TYPE "public"."enum_forms_blocks_select_width";
  DROP TYPE "public"."enum_forms_blocks_radio_width";
  DROP TYPE "public"."enum_forms_blocks_checkbox_width";
  DROP TYPE "public"."enum_forms_blocks_email_width";
  DROP TYPE "public"."enum_forms_blocks_phone_number_width";
  DROP TYPE "public"."enum__forms_v_blocks_text_width";
  DROP TYPE "public"."enum__forms_v_blocks_textarea_width";
  DROP TYPE "public"."enum__forms_v_blocks_date_width";
  DROP TYPE "public"."enum__forms_v_blocks_date_mode";
  DROP TYPE "public"."enum__forms_v_blocks_date_allowed_dates";
  DROP TYPE "public"."enum__forms_v_blocks_select_width";
  DROP TYPE "public"."enum__forms_v_blocks_radio_width";
  DROP TYPE "public"."enum__forms_v_blocks_checkbox_width";
  DROP TYPE "public"."enum__forms_v_blocks_email_width";
  DROP TYPE "public"."enum__forms_v_blocks_phone_number_width";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_blocks_text_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum_forms_blocks_textarea_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum_forms_blocks_date_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum_forms_blocks_date_mode" AS ENUM('single', 'multiple', 'range');
  CREATE TYPE "public"."enum_forms_blocks_date_allowed_dates" AS ENUM('any', 'previous', 'future');
  CREATE TYPE "public"."enum_forms_blocks_select_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum_forms_blocks_radio_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum_forms_blocks_checkbox_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum_forms_blocks_email_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum_forms_blocks_phone_number_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_text_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_textarea_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_date_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_date_mode" AS ENUM('single', 'multiple', 'range');
  CREATE TYPE "public"."enum__forms_v_blocks_date_allowed_dates" AS ENUM('any', 'previous', 'future');
  CREATE TYPE "public"."enum__forms_v_blocks_select_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_radio_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_checkbox_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_email_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__forms_v_blocks_phone_number_width" AS ENUM('half', 'full');
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"width" "enum_forms_blocks_text_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"width" "enum_forms_blocks_textarea_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_date_default_date_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" timestamp(3) with time zone
  );
  
  CREATE TABLE "forms_blocks_date" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"width" "enum_forms_blocks_date_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_date_value" timestamp(3) with time zone,
  	"default_date_from_value" timestamp(3) with time zone,
  	"default_date_to_value" timestamp(3) with time zone,
  	"mode" "enum_forms_blocks_date_mode" DEFAULT 'single',
  	"allowed_dates" "enum_forms_blocks_date_allowed_dates" DEFAULT 'any',
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"width" "enum_forms_blocks_select_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_radio_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "forms_blocks_radio" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"width" "enum_forms_blocks_radio_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"width" "enum_forms_blocks_email_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_phone_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"width" "enum_forms_blocks_phone_number_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"width" "enum__forms_v_blocks_text_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"width" "enum__forms_v_blocks_textarea_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_date_default_date_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"value" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_date" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"width" "enum__forms_v_blocks_date_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_date_value" timestamp(3) with time zone,
  	"default_date_from_value" timestamp(3) with time zone,
  	"default_date_to_value" timestamp(3) with time zone,
  	"mode" "enum__forms_v_blocks_date_mode" DEFAULT 'single',
  	"allowed_dates" "enum__forms_v_blocks_date_allowed_dates" DEFAULT 'any',
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"width" "enum__forms_v_blocks_select_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_radio_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_radio" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"width" "enum__forms_v_blocks_radio_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"_uuid" varchar,
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
  
  CREATE TABLE "_forms_v_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"width" "enum__forms_v_blocks_email_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_phone_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"width" "enum__forms_v_blocks_phone_number_width" DEFAULT 'full',
  	"placeholder" varchar,
  	"default_value" varchar,
  	"required" boolean DEFAULT false,
  	"description" jsonb,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_date_default_date_values" ADD CONSTRAINT "forms_blocks_date_default_date_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_date"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_date" ADD CONSTRAINT "forms_blocks_date_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio" ADD CONSTRAINT "forms_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_options" ADD CONSTRAINT "forms_blocks_checkbox_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_phone_number" ADD CONSTRAINT "forms_blocks_phone_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_text" ADD CONSTRAINT "_forms_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_textarea" ADD CONSTRAINT "_forms_v_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_date_default_date_values" ADD CONSTRAINT "_forms_v_blocks_date_default_date_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_blocks_date"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_date" ADD CONSTRAINT "_forms_v_blocks_date_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_select_options" ADD CONSTRAINT "_forms_v_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_select" ADD CONSTRAINT "_forms_v_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_radio_options" ADD CONSTRAINT "_forms_v_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_radio" ADD CONSTRAINT "_forms_v_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_checkbox_options" ADD CONSTRAINT "_forms_v_blocks_checkbox_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_checkbox" ADD CONSTRAINT "_forms_v_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_email" ADD CONSTRAINT "_forms_v_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_phone_number" ADD CONSTRAINT "_forms_v_blocks_phone_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_label_idx" ON "forms_blocks_text" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_text_name_idx" ON "forms_blocks_text" USING btree ("name");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_label_idx" ON "forms_blocks_textarea" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_textarea_name_idx" ON "forms_blocks_textarea" USING btree ("name");
  CREATE INDEX "forms_blocks_date_default_date_values_order_idx" ON "forms_blocks_date_default_date_values" USING btree ("_order");
  CREATE INDEX "forms_blocks_date_default_date_values_parent_id_idx" ON "forms_blocks_date_default_date_values" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_date_order_idx" ON "forms_blocks_date" USING btree ("_order");
  CREATE INDEX "forms_blocks_date_parent_id_idx" ON "forms_blocks_date" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_date_path_idx" ON "forms_blocks_date" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_date_label_idx" ON "forms_blocks_date" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_date_name_idx" ON "forms_blocks_date" USING btree ("name");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_label_idx" ON "forms_blocks_select_options" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_select_options_value_idx" ON "forms_blocks_select_options" USING btree ("value");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_label_idx" ON "forms_blocks_select" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_select_name_idx" ON "forms_blocks_select" USING btree ("name");
  CREATE INDEX "forms_blocks_radio_options_order_idx" ON "forms_blocks_radio_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_options_parent_id_idx" ON "forms_blocks_radio_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_radio_options_label_idx" ON "forms_blocks_radio_options" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_radio_options_value_idx" ON "forms_blocks_radio_options" USING btree ("value");
  CREATE INDEX "forms_blocks_radio_order_idx" ON "forms_blocks_radio" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_parent_id_idx" ON "forms_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_path_idx" ON "forms_blocks_radio" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_radio_label_idx" ON "forms_blocks_radio" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_radio_name_idx" ON "forms_blocks_radio" USING btree ("name");
  CREATE INDEX "forms_blocks_checkbox_options_order_idx" ON "forms_blocks_checkbox_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_options_parent_id_idx" ON "forms_blocks_checkbox_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_options_label_idx" ON "forms_blocks_checkbox_options" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_options_value_idx" ON "forms_blocks_checkbox_options" USING btree ("value");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_label_idx" ON "forms_blocks_checkbox" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_name_idx" ON "forms_blocks_checkbox" USING btree ("name");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_label_idx" ON "forms_blocks_email" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_email_name_idx" ON "forms_blocks_email" USING btree ("name");
  CREATE INDEX "forms_blocks_phone_number_order_idx" ON "forms_blocks_phone_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_phone_number_parent_id_idx" ON "forms_blocks_phone_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_phone_number_path_idx" ON "forms_blocks_phone_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_phone_number_label_idx" ON "forms_blocks_phone_number" USING btree ("label");
  CREATE UNIQUE INDEX "forms_blocks_phone_number_name_idx" ON "forms_blocks_phone_number" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_text_order_idx" ON "_forms_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_text_parent_id_idx" ON "_forms_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_text_path_idx" ON "_forms_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_text_label_idx" ON "_forms_v_blocks_text" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_text_name_idx" ON "_forms_v_blocks_text" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_textarea_order_idx" ON "_forms_v_blocks_textarea" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_textarea_parent_id_idx" ON "_forms_v_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_textarea_path_idx" ON "_forms_v_blocks_textarea" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_textarea_label_idx" ON "_forms_v_blocks_textarea" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_textarea_name_idx" ON "_forms_v_blocks_textarea" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_date_default_date_values_order_idx" ON "_forms_v_blocks_date_default_date_values" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_date_default_date_values_parent_id_idx" ON "_forms_v_blocks_date_default_date_values" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_date_order_idx" ON "_forms_v_blocks_date" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_date_parent_id_idx" ON "_forms_v_blocks_date" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_date_path_idx" ON "_forms_v_blocks_date" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_date_label_idx" ON "_forms_v_blocks_date" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_date_name_idx" ON "_forms_v_blocks_date" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_select_options_order_idx" ON "_forms_v_blocks_select_options" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_select_options_parent_id_idx" ON "_forms_v_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_select_options_label_idx" ON "_forms_v_blocks_select_options" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_select_options_value_idx" ON "_forms_v_blocks_select_options" USING btree ("value");
  CREATE INDEX "_forms_v_blocks_select_order_idx" ON "_forms_v_blocks_select" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_select_parent_id_idx" ON "_forms_v_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_select_path_idx" ON "_forms_v_blocks_select" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_select_label_idx" ON "_forms_v_blocks_select" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_select_name_idx" ON "_forms_v_blocks_select" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_radio_options_order_idx" ON "_forms_v_blocks_radio_options" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_radio_options_parent_id_idx" ON "_forms_v_blocks_radio_options" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_radio_options_label_idx" ON "_forms_v_blocks_radio_options" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_radio_options_value_idx" ON "_forms_v_blocks_radio_options" USING btree ("value");
  CREATE INDEX "_forms_v_blocks_radio_order_idx" ON "_forms_v_blocks_radio" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_radio_parent_id_idx" ON "_forms_v_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_radio_path_idx" ON "_forms_v_blocks_radio" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_radio_label_idx" ON "_forms_v_blocks_radio" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_radio_name_idx" ON "_forms_v_blocks_radio" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_checkbox_options_order_idx" ON "_forms_v_blocks_checkbox_options" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_checkbox_options_parent_id_idx" ON "_forms_v_blocks_checkbox_options" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_checkbox_options_label_idx" ON "_forms_v_blocks_checkbox_options" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_checkbox_options_value_idx" ON "_forms_v_blocks_checkbox_options" USING btree ("value");
  CREATE INDEX "_forms_v_blocks_checkbox_order_idx" ON "_forms_v_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_checkbox_parent_id_idx" ON "_forms_v_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_checkbox_path_idx" ON "_forms_v_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_checkbox_label_idx" ON "_forms_v_blocks_checkbox" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_checkbox_name_idx" ON "_forms_v_blocks_checkbox" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_email_order_idx" ON "_forms_v_blocks_email" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_email_parent_id_idx" ON "_forms_v_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_email_path_idx" ON "_forms_v_blocks_email" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_email_label_idx" ON "_forms_v_blocks_email" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_email_name_idx" ON "_forms_v_blocks_email" USING btree ("name");
  CREATE INDEX "_forms_v_blocks_phone_number_order_idx" ON "_forms_v_blocks_phone_number" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_phone_number_parent_id_idx" ON "_forms_v_blocks_phone_number" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_phone_number_path_idx" ON "_forms_v_blocks_phone_number" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_phone_number_label_idx" ON "_forms_v_blocks_phone_number" USING btree ("label");
  CREATE INDEX "_forms_v_blocks_phone_number_name_idx" ON "_forms_v_blocks_phone_number" USING btree ("name");
  ALTER TABLE "forms" DROP COLUMN "fields";
  ALTER TABLE "_forms_v" DROP COLUMN "version_fields";`)
}
