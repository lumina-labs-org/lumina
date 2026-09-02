import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { Role, Status } from "../../domain/enums/memberships.enums.js"
import { MembershipsRepository } from "../repositories/memberships.repository.js"

interface RevokeInviteUseCaseRequest {
    membershipId: UniqueEntityId
    userId: UniqueEntityId
}

interface RevokeInviteUseCaseResponse {
    membership: Membership
}

export class RevokeInviteUseCase {
    constructor(
        private readonly membershipsRepository: MembershipsRepository,
    ) { }

    async execute({
        membershipId,
        userId,
    }: RevokeInviteUseCaseRequest): Promise<RevokeInviteUseCaseResponse> {
        const membership =
            await this.membershipsRepository.findById(membershipId)

        if (!membership) {
            throw new Error("Membership not found")
        }

        const actorMembership =
            await this.membershipsRepository.findByUserIdAndOrganizationId(
                userId,
                membership.organizationId,
            )

        if (!actorMembership) {
            throw new Error("User does not belong to this organization")
        }

        const isInviter =
            membership.invitedByUserId?.equals(userId) ?? false

        const isActiveOwner =
            actorMembership.role === Role.OWNER &&
            actorMembership.status === Status.ACTIVE

        if (!isInviter && !isActiveOwner) {
            throw new Error("User is not allowed to revoke this invite")
        }

        membership.revoke()

        await this.membershipsRepository.save(membership)

        return { membership }
    }
}