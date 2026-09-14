import { and, eq } from "drizzle-orm"
import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import type { DatabaseExecutor } from "../../../../../shared/infrastructure/database/database-executor.js"
import { db } from "../../../../../shared/infrastructure/database/connection.js"
import { DrizzleMembershipMapper } from "../../../../../shared/infrastructure/database/mappers/drizzle-membership-mapper.js"
import { membershipsTable } from "../../../../../shared/infrastructure/database/schemas/memberships.js"
import { Membership } from "../../../domain/entities/membership.entity.js"
import { MembershipsRepository } from "../memberships.repository.js"

export class DrizzleMembershipsRepository implements MembershipsRepository {
  constructor(private readonly database: DatabaseExecutor = db) {}

  async create(membership: Membership): Promise<void> {
    await this.database.insert(membershipsTable)
      .values(DrizzleMembershipMapper.toPersistence(membership))
  }

  async findByUserIdAndOrganizationId(
    userId: UniqueEntityId,
    organizationId: UniqueEntityId,
  ): Promise<Membership | null> {
    const [row] = await this.database.select().from(membershipsTable).where(and(
      eq(membershipsTable.userId, userId.toString()),
      eq(membershipsTable.organizationId, organizationId.toString()),
    )).limit(1)

    return row ? DrizzleMembershipMapper.toDomain(row) : null
  }

  async findById(id: UniqueEntityId): Promise<Membership | null> {
    const [row] = await this.database.select().from(membershipsTable)
      .where(eq(membershipsTable.id, id.toString())).limit(1)

    return row ? DrizzleMembershipMapper.toDomain(row) : null
  }

  async findByOrganizationId(organizationId: UniqueEntityId): Promise<Membership[]> {
    const rows = await this.database.select().from(membershipsTable)
      .where(eq(membershipsTable.organizationId, organizationId.toString()))

    return rows.map(DrizzleMembershipMapper.toDomain)
  }

  async findByUserId(userId: UniqueEntityId): Promise<Membership[]> {
    const rows = await this.database.select().from(membershipsTable)
      .where(eq(membershipsTable.userId, userId.toString()))

    return rows.map(DrizzleMembershipMapper.toDomain)
  }

  async save(membership: Membership): Promise<void | null> {
    const [row] = await this.database.update(membershipsTable)
      .set(DrizzleMembershipMapper.toPersistence(membership))
      .where(eq(membershipsTable.id, membership.id.toString()))
      .returning({ id: membershipsTable.id })

    if (!row) return null
  }
}
