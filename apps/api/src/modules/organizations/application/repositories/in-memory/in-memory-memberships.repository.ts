import { Membership } from "../../../domain/entities/membership.entity.js"
import { MembershipsRepository } from "../memberships.repository.js"

export class InMemoryMembershipsRepository implements MembershipsRepository {

  public items: Membership[] = []

  async create(membership: Membership): Promise<void> {
    this.items.push(membership)
  }
}