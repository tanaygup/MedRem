ALTER TABLE "appointments" ALTER COLUMN "appointment_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "doctor_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "doctor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "doctor_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "prescriptions" ALTER COLUMN "appointment_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "prescriptions" ALTER COLUMN "appointment_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "prescriptions" ALTER COLUMN "doctor_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "prescriptions" ALTER COLUMN "doctor_id" DROP NOT NULL;