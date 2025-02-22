ALTER TABLE "order_items" ALTER COLUMN "status" SET DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "delivery_status" SET DEFAULT 'Confirmed';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp (3) with time zone;