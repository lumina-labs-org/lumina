import type { MembershipsRepository } from "../../../modules/organizations/application/repositories/memberships.repository.js"
import type { OrganizationsRepository } from "../../../modules/organizations/application/repositories/organizations.repository.js"

export interface TransactionContext {
  organizationsRepository: OrganizationsRepository
  membershipsRepository: MembershipsRepository
}

export interface TransactionManager {
  execute<T>(callback: (context: TransactionContext) => Promise<T>): Promise<T>
}
