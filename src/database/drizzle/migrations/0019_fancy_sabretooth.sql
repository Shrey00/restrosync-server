ALTER TABLE "restaurants" ADD COLUMN "software_id" uuid DEFAULT gen_random_uuid() NOT NULL;