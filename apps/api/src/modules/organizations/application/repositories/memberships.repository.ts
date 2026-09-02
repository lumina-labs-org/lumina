import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Membership } from "../../domain/entities/membership.entity.js";

export interface MembershipsRepository {
  create(membership: Membership): Promise<void>
  findByUserIdAndOrganizationId(userId: UniqueEntityId, organizationId: UniqueEntityId): Promise<Membership | null>
  findById(id: UniqueEntityId): Promise<Membership | null>
  findByOrganizationId(
    organizationId: UniqueEntityId
  ): Promise<Membership[]>
  findByUserId(
    userId: UniqueEntityId
  ): Promise<Membership[]>
  save(membership: Membership): Promise<void | null>
}