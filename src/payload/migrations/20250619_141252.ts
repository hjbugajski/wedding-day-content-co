import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_navigation_items_link_rel" AS ENUM('noopener', 'noreferrer', 'nofollow');
  CREATE TYPE "public"."enum_navigation_navigation_items_links_rel" AS ENUM('noopener', 'noreferrer', 'nofollow');
  CREATE TYPE "public"."enum_navigation_navigation_items_links_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_navigation_navigation_items_navigation_type" AS ENUM('standalone', 'group');
  CREATE TYPE "public"."enum_navigation_navigation_items_link_type" AS ENUM('internal', 'external');
  CREATE TABLE IF NOT EXISTS "navigation_navigation_items_link_rel" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_navigation_navigation_items_link_rel",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "navigation_navigation_items_links_rel" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_navigation_navigation_items_links_rel",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "navigation_navigation_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"description" varchar,
  	"type" "enum_navigation_navigation_items_links_type" DEFAULT 'internal',
  	"relationship_id" uuid,
  	"anchor" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"umami_event" varchar,
  	"umami_event_id" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "navigation_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"navigation_type" "enum_navigation_navigation_items_navigation_type" DEFAULT 'standalone' NOT NULL,
  	"link_text" varchar,
  	"link_description" varchar,
  	"link_type" "enum_navigation_navigation_items_link_type" DEFAULT 'internal',
  	"link_relationship_id" uuid,
  	"link_anchor" varchar,
  	"link_url" varchar,
  	"link_new_tab" boolean DEFAULT false,
  	"link_umami_event" varchar,
  	"link_umami_event_id" varchar,
  	"group_text" varchar
  );
  
  DROP TABLE "navigation_links_rel" CASCADE;
  DROP TABLE "navigation_links" CASCADE;
  ALTER TABLE "images" ADD COLUMN "link_description" varchar;
  ALTER TABLE "navigation" ADD COLUMN "call_to_action_link_description" varchar;
  ALTER TABLE "footer_link_groups_links" ADD COLUMN "description" varchar;
  DO $$ BEGIN
   ALTER TABLE "navigation_navigation_items_link_rel" ADD CONSTRAINT "navigation_navigation_items_link_rel_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navigation_navigation_items_links_rel" ADD CONSTRAINT "navigation_navigation_items_links_rel_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation_navigation_items_links"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navigation_navigation_items_links" ADD CONSTRAINT "navigation_navigation_items_links_relationship_id_pages_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navigation_navigation_items_links" ADD CONSTRAINT "navigation_navigation_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navigation_navigation_items" ADD CONSTRAINT "navigation_navigation_items_link_relationship_id_pages_id_fk" FOREIGN KEY ("link_relationship_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navigation_navigation_items" ADD CONSTRAINT "navigation_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_link_rel_order_idx" ON "navigation_navigation_items_link_rel" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_link_rel_parent_idx" ON "navigation_navigation_items_link_rel" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_links_rel_order_idx" ON "navigation_navigation_items_links_rel" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_links_rel_parent_idx" ON "navigation_navigation_items_links_rel" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_links_order_idx" ON "navigation_navigation_items_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_links_parent_id_idx" ON "navigation_navigation_items_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_links_relationship_idx" ON "navigation_navigation_items_links" USING btree ("relationship_id");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_order_idx" ON "navigation_navigation_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_parent_id_idx" ON "navigation_navigation_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "navigation_navigation_items_link_link_relationship_idx" ON "navigation_navigation_items" USING btree ("link_relationship_id");
  DROP TYPE "public"."enum_navigation_links_rel";
  DROP TYPE "public"."enum_navigation_links_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_links_rel" AS ENUM('noopener', 'noreferrer', 'nofollow');
  CREATE TYPE "public"."enum_navigation_links_type" AS ENUM('internal', 'external');
  CREATE TABLE IF NOT EXISTS "navigation_links_rel" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_navigation_links_rel",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"type" "enum_navigation_links_type" DEFAULT 'internal' NOT NULL,
  	"relationship_id" uuid,
  	"anchor" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"umami_event" varchar,
  	"umami_event_id" varchar
  );
  
  DROP TABLE "navigation_navigation_items_link_rel" CASCADE;
  DROP TABLE "navigation_navigation_items_links_rel" CASCADE;
  DROP TABLE "navigation_navigation_items_links" CASCADE;
  DROP TABLE "navigation_navigation_items" CASCADE;
  DO $$ BEGIN
   ALTER TABLE "navigation_links_rel" ADD CONSTRAINT "navigation_links_rel_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation_links"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navigation_links" ADD CONSTRAINT "navigation_links_relationship_id_pages_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navigation_links" ADD CONSTRAINT "navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "navigation_links_rel_order_idx" ON "navigation_links_rel" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "navigation_links_rel_parent_idx" ON "navigation_links_rel" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "navigation_links_order_idx" ON "navigation_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "navigation_links_parent_id_idx" ON "navigation_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "navigation_links_relationship_idx" ON "navigation_links" USING btree ("relationship_id");
  ALTER TABLE "images" DROP COLUMN IF EXISTS "link_description";
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "call_to_action_link_description";
  ALTER TABLE "footer_link_groups_links" DROP COLUMN IF EXISTS "description";
  DROP TYPE "public"."enum_navigation_navigation_items_link_rel";
  DROP TYPE "public"."enum_navigation_navigation_items_links_rel";
  DROP TYPE "public"."enum_navigation_navigation_items_links_type";
  DROP TYPE "public"."enum_navigation_navigation_items_navigation_type";
  DROP TYPE "public"."enum_navigation_navigation_items_link_type";`)
}
