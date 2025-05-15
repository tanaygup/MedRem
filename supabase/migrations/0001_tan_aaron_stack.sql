CREATE TYPE "public"."gender" AS ENUM('Male', 'Female', 'Other');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Pending', 'Confirmed', 'Cancelled');--> statement-breakpoint
CREATE TABLE "appointments" (
	"appointment_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"doctor_id" serial NOT NULL,
	"appointment_date" date NOT NULL,
	"appointment_time" time with time zone NOT NULL,
	"location" text,
	"status" "status",
	"details" text
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"doctor_id" serial PRIMARY KEY NOT NULL,
	"doctorName" text NOT NULL,
	"phone" varchar,
	"email" varchar,
	"address" text
);
--> statement-breakpoint
CREATE TABLE "medicine_schedules" (
	"schedule_id" serial PRIMARY KEY NOT NULL,
	"medicine_id" serial NOT NULL,
	"date" date NOT NULL,
	"morning" boolean DEFAULT false,
	"afternoon" boolean DEFAULT false,
	"evening" boolean DEFAULT false,
	"night" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "medicines" (
	"medicine_id" serial PRIMARY KEY NOT NULL,
	"prescription_id" serial NOT NULL,
	"medicine_name" text NOT NULL,
	"dosage" text NOT NULL,
	"meds_left" integer,
	"total_doses_taken" integer,
	"total_doses" integer
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"prescription_id" serial PRIMARY KEY NOT NULL,
	"appointment_id" serial NOT NULL,
	"doctor_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" date NOT NULL,
	"start_date" date,
	"end_date" date,
	"processed_text" text
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "id" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "full_name" TO "name";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "diseases" text[];--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicine_schedules" ADD CONSTRAINT "medicine_schedules_medicine_id_medicines_medicine_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("medicine_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_prescription_id_prescriptions_prescription_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("prescription_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointment_id_appointments_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("appointment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctor_id_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;