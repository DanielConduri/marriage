import { sql } from "drizzle-orm"
import { check, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const rsvpResponses = pgTable(
  "rsvp_responses",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 120 }).notNull(),
    cedula: varchar("cedula", { length: 10 }).notNull().unique(),
    guests: integer("guests").notNull(),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check("guests_between_1_and_7", sql`${table.guests} >= 1 AND ${table.guests} <= 7`),
  ]
)
