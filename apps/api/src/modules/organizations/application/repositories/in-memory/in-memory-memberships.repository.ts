import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../../domain/entities/membership.entity.js"
import { MembershipsRepository } from "../memberships.repository.js"

export class InMemoryMembershipsRepository implements MembershipsRepository {

  public items: Membership[] = []

  async create(membership: Membership): Promise<void> {
    this.items.push(membership)
  }

  async findByUserIdAndOrganizationId(userId: UniqueEntityId, organizationId: UniqueEntityId): Promise<Membership | null> {
    const membership = this.items.find(item => item.userId.equals(userId) && item.organizationId.equals(organizationId))

    return membership ?? null
  }

  async findById(id: UniqueEntityId): Promise<Membership | null> {
    const membership = this.items.find(item => item.id.equals(id))

    return membership ?? null
  }

  async save(membership: Membership): Promise<void | null> {
    const membershipIndex = this.items.findIndex(item => item.id.equals(membership.id))

    if (!membershipIndex) return null

    this.items[membershipIndex] = membership
  }

  async findByOrganizationId(
    organizationId: UniqueEntityId,
  ): Promise<Membership[]> {
    return this.items.filter((membership) =>
      membership.organizationId.equals(organizationId)
    )
  }

  async findByUserId(
    userId: UniqueEntityId,
  ): Promise<Membership[]> {
    return this.items.filter((membership) =>
      membership.userId.equals(userId)
    )
  }

}