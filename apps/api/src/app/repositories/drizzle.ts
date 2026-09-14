import { DrizzleMembershipsRepository } from "../../modules/organizations/application/repositories/drizzle/drizzle-memberships.repository.js"
import { DrizzleOrganizationsRepository } from "../../modules/organizations/application/repositories/drizzle/drizzle-organizations.repository.js"
import { DrizzleUsersRepository } from "../../modules/organizations/application/repositories/drizzle/drizzle-users.repository.js"
import { DrizzleTransactionManager } from "../../shared/infrastructure/database/transactions/drizzle-transaction-manager.js"

export const organizationsRepository =
  new DrizzleOrganizationsRepository()

export const membershipsRepository =
  new DrizzleMembershipsRepository()

export const usersRepository =
  new DrizzleUsersRepository()

export const transactionManager = new DrizzleTransactionManager()
