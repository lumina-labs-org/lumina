import { index, pgEnum, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core"
import { Role, Status } from "../../../../modules/organizations/domain/enums/memberships.enums.js"
import { organizationsTable } from "./organizations.js"
import { usersTable } from "./users.js"

export const membershipRoleEnum = pgEnum("membership_role", [
  Role.OWNER, Role.MANAGER, Role.MEMBER,
])

export const membershipStatusEnum = pgEnum("membership_status", [
  Status.ACTIVE, Status.PENDING, Status.DECLINED, Status.REVOKED,
])

export const membershipsTable = pgTable("memberships", {
  id: uuid().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => usersTable.id),
  organizationId: uuid("organization_id").notNull().references(() => organizationsTable.id),
  invitedByUserId: uuid("invited_by_user_id").references(() => usersTable.id),
  role: membershipRoleEnum().notNull(),
  status: membershipStatusEnum().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
}, (table) => [
  unique("memberships_user_id_organization_id_unique").on(table.userId, table.organizationId),
  index("memberships_organization_id_idx").on(table.organizationId),
])
