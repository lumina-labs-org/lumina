import { Membership } from "../../../../modules/organizations/domain/entities/membership.entity.js"
import { UniqueEntityId } from "../../../domain/entities/unique-entity-id.js"
import { membershipsTable } from "../schemas/memberships.js"

export class DrizzleMembershipMapper {
  static toPersistence(membership: Membership): typeof membershipsTable.$inferInsert {
    return {
      id: membership.id.toString(),
      userId: membership.userId.toString(),
      organizationId: membership.organizationId.toString(),
      invitedByUserId: membership.invitedByUserId?.toString() ?? null,
      role: membership.role,
      status: membership.status,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    }
  }

  static toDomain(row: typeof membershipsTable.$inferSelect): Membership {
    return Membership.restore({
      userId: new UniqueEntityId(row.userId),
      organizationId: new UniqueEntityId(row.organizationId),
      invitedByUserId: row.invitedByUserId === null ? null : new UniqueEntityId(row.invitedByUserId),
      role: row.role,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }, new UniqueEntityId(row.id))
  }
}
