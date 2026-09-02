import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Membership } from "../../domain/entities/membership.entity.js";
import { Status } from "../../domain/enums/memberships.enums.js";
import { MembershipsRepository } from "../repositories/memberships.repository.js";



interface DeclineInviteUseCaseRequest {
    membershipId: UniqueEntityId
    userId: UniqueEntityId
}

interface DeclineInviteUseCaseResponse {
    membership: Membership
}

export class DeclineInviteUseCase {

    constructor(
        private readonly membershipsRepository: MembershipsRepository,
    ) { }

    async execute({ userId, membershipId }: DeclineInviteUseCaseRequest): Promise<DeclineInviteUseCaseResponse> {
        const membership = await this.membershipsRepository.findById(membershipId)

        if (!membership) throw new Error('Membership not found')

        if (!membership.userId.equals(userId)) {
            throw new Error('This user not allowed decline this invite.')
        }

        membership.decline()

        await this.membershipsRepository.save(membership)

        return {
            membership
        }

    }

}