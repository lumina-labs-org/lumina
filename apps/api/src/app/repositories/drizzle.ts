import { DrizzleMembershipsRepository } from "../../modules/organizations/application/repositories/drizzle/drizzle-memberships.repository.js"
import { DrizzleOrganizationsRepository } from "../../modules/organizations/application/repositories/drizzle/drizzle-organizations.repository.js"

export const organizationsRepository =
  new DrizzleOrganizationsRepository()

export const membershipsRepository =
  new DrizzleMembershipsRepository()
