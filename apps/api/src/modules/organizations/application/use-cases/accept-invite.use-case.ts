import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Membership } from "../../domain/entities/membership.entity.js";
import { Status } from "../../domain/enums/memberships.enums.js";
import { MembershipsRepository } from "../repositories/memberships.repository.js";



interface AcceptInviteUseCaseRequest {
    membershipId: UniqueEntityId
    userId: UniqueEntityId
}

interface AcceptInviteUseCaseResponse {
    membership: Membership
}

export class AcceptInviteUseCase {

    constructor(
        private readonly membershipsRepository: MembershipsRepository,
    ) { }

    async execute({ userId, membershipId }: AcceptInviteUseCaseRequest): Promise<AcceptInviteUseCaseResponse> {
        const membership = await this.membershipsRepository.findById(membershipId)

        if (!membership) throw new Error('Membership not found')

        if (!membership.userId.equals(userId)) {
            throw new Error('This user not allowed accept this invite.')
        }

        membership.accept()

        await this.membershipsRepository.save(membership)

        return {
            membership
        }

    }

}