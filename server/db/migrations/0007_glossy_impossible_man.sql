CREATE TABLE "cms_documents" (
	"key" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"draft_revision_id" bigint,
	"published_revision_id" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_revisions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"document_key" text NOT NULL,
	"revision" integer NOT NULL,
	"state" text NOT NULL,
	"payload" jsonb NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cms_revisions" ADD CONSTRAINT "cms_revisions_document_key_cms_documents_key_fk" FOREIGN KEY ("document_key") REFERENCES "public"."cms_documents"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cms_revisions_document_revision_idx" ON "cms_revisions" USING btree ("document_key","revision");