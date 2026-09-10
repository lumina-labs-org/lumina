import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const organizationsTable = pgTable("organizations", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).unique().notNull(),
  contactEmail: varchar("contact_email", {
    length: 255,
  }),
  contactPhone: varchar("contact_phone", {
    length: 20,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).notNull(),
});