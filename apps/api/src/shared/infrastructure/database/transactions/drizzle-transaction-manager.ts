import { DrizzleMembershipsRepository } from "../../../../modules/organizations/application/repositories/drizzle/drizzle-memberships.repository.js"
import { DrizzleOrganizationsRepository } from "../../../../modules/organizations/application/repositories/drizzle/drizzle-organizations.repository.js"
import type { TransactionContext, TransactionManager } from "../../../application/transactions/transaction-manager.js"
import { db } from "../connection.js"

export class DrizzleTransactionManager implements TransactionManager {
  async execute<T>(callback: (context: TransactionContext) => Promise<T>): Promise<T> {
    return db.transaction(async (tx) => {
      return callback({
        organizationsRepository: new DrizzleOrganizationsRepository(tx),
        membershipsRepository: new DrizzleMembershipsRepository(tx),
      })
    })
  }
}
