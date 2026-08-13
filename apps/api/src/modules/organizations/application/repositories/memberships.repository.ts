import { Membership } from "../../domain/entities/membership.entity.js";

export interface MembershipsRepository {
  create(membership: Membership): Promise<void>
}