ALTER TABLE "offers" ALTER COLUMN "customer_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "free_item" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "usage" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "usage" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "item" DROP DEFAULT;