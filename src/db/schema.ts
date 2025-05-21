import { boolean, date, integer, pgEnum, pgTable, serial, text, time, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const genderEnum= pgEnum('gender',['Male','Female','Other']);
export const statusEnum= pgEnum('status',['Pending','Confirmed','Cancelled']);

export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  clerkId:text('clerk_id').notNull().unique(),
  name: text().notNull(),
  phone: varchar().notNull(),
  email: varchar().notNull(),
  age:integer().notNull(),
  address: text(),
  gender: genderEnum(),
  diseases: text().array(),
  detailsUpdated: boolean('details_updated').default(false),
  createdAt: date('created_at').notNull(),
});

export const doctors = pgTable('doctors', {
  doctorId: integer('doctor_id').primaryKey(),
  doctorName: text().notNull(),
  phone: varchar(),
  email: varchar(),
  address: text(),
});

export const appointments = pgTable('appointments', {
  appointmentId: integer('appointment_id').primaryKey(),
  clerkId:text('clerk_id').notNull().references(() => users.clerkId),
  doctorId: integer('doctor_id').references(() => doctors.doctorId),
  appointmentDate: date('appointment_date').notNull(),
  appointmentTime: time('appointment_time',{withTimezone:true}).notNull(),
  location: text(),
  status: statusEnum(),
  details: text(),
});

export const prescriptions = pgTable('prescriptions', {
  prescriptionId: serial('prescription_id').primaryKey(),
  appointmentId: integer('appointment_id'),
  doctorId: integer('doctor_id'),
  userId: serial('user_id').notNull().references(() => users.userId,{onDelete: 'cascade'}),
  clerkId:text('clerk_id').notNull().references(() => users.clerkId,{onDelete: 'cascade'}),
  createdAt: date('created_at').notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  processedText: text('processed_text')
});
export const medicines = pgTable('medicines', {
  medicineId: serial('medicine_id').primaryKey(),
  prescriptionId: serial('prescription_id').references(() => prescriptions.prescriptionId),
  medicineName: text('medicine_name').notNull(),
  dosage: text('dosage').notNull(),//kinti quantity leni h
  medsLeft: integer('meds_left'),
  totalDosesTaken: integer('total_doses_taken'),
  totalDoses: integer('total_doses'),
});
export const medicineSchedules = pgTable('medicine_schedules', {
  scheduleId: serial('schedule_id').primaryKey(),
  medicineId: serial('medicine_id').references(() => medicines.medicineId),
  date: date('date').notNull(),
  morning: boolean(),
  afternoon: boolean(),
  evening: boolean(),
  night: boolean(),

});

//RELATIONS

export const userRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
  prescriptions: many(prescriptions),
}));
export const doctorRelations = relations(doctors, ({ many }) => ({
  appointments: many(appointments),
  prescriptions: many(prescriptions),
}));

export const prescriptionRelations = relations(prescriptions, ({ many }) => ({
  medicines: many(medicines),
}));
export const medicineRelations = relations(medicines, ({ many }) => ({
  schedules: many(medicineSchedules),
}));