import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import {
  MembershipRole,
  Role,
  Status,
} from "../../domain/enums/memberships.enums.js"
import { MembershipsRepository } from "../repositories/memberships.repository.js"

interface ChangeMemberRoleUseCaseRequest {
  organizationId: UniqueEntityId
  actorUserId: UniqueEntityId
  membershipId: UniqueEntityId
  role: MembershipRole
}

interface ChangeMemberRoleUseCaseResponse {
  membership: Membership
}

export class ChangeMemberRoleUseCase {
  constructor(
    private readonly membershipsRepository: MembershipsRepository,
  ) {}

  async execute({
    organizationId,
    actorUserId,
    membershipId,
    role,
  }: ChangeMemberRoleUseCaseRequest): Promise<ChangeMemberRoleUseCaseResponse> {
    const actor =
      await this.membershipsRepository.findByUserIdAndOrganizationId(
        actorUserId,
        organizationId,
      )

    if (!actor) {
      throw new Error("Actor does not belong to this organization")
    }

    if (actor.status !== Status.ACTIVE) {
      throw new Error("Only active members can change roles")
    }

    if (actor.role === Role.MEMBER) {
      throw new Error("Members cannot change roles")
    }

    const target =
      await this.membershipsRepository.findById(membershipId)

    if (!target) {
      throw new Error("Membership not found")
    }

    if (!target.organizationId.equals(organizationId)) {
      throw new Error("Membership does not belong to this organization")
    }

    if (target.status !== Status.ACTIVE) {
      throw new Error("Only active memberships can have their role changed")
    }

    if (actor.role === Role.MANAGER) {
      if (target.role !== Role.MEMBER) {
        throw new Error("Managers can only change members")
      }

      if (role === Role.OWNER) {
        throw new Error("Managers cannot promote members to owner")
      }
    }

    if (
      target.role === Role.OWNER &&
      role !== Role.OWNER
    ) {
      const organizationMemberships =
        await this.membershipsRepository.findByOrganizationId(
          organizationId,
        )

      const activeOwners = organizationMemberships.filter(
        (membership) =>
          membership.role === Role.OWNER &&
          membership.status === Status.ACTIVE,
      )

      if (activeOwners.length <= 1) {
        throw new Error(
          "Organization must have at least one active owner",
        )
      }
    }

    target.changeRole(role)

    await this.membershipsRepository.save(target)

    return {
      membership: target,
    }
  }
}