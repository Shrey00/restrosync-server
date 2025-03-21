ALTER TABLE "orders" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount" real;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_coupon_code_unique" UNIQUE("coupon_code");