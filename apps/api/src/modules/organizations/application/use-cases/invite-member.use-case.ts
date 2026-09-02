import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { InviteMembershipRole, Membership } from "../../domain/entities/membership.entity.js";
import { Role } from "../../domain/enums/memberships.enums.js";
import { MembershipsRepository } from "../repositories/memberships.repository.js";
import { UsersRepository } from "../repositories/users.repository.js";


interface InviteMemberUseCaseRequest {
    orgId: UniqueEntityId
    inviterId: UniqueEntityId
    invitedUserId: UniqueEntityId
    role: InviteMembershipRole
}

interface InviteMemberUseCaseResponse {
    membership: Membership
}

export class InviteMemberUseCase {

    constructor(
        private readonly membershipsRepository: MembershipsRepository,
        private readonly usersRepository: UsersRepository,
    ) { }

    async execute({ role, orgId, invitedUserId, inviterId }: InviteMemberUseCaseRequest): Promise<InviteMemberUseCaseResponse> {
        const inviter = await this.membershipsRepository.findByUserIdAndOrganizationId(inviterId, orgId)

        if (!inviter) throw new Error('Inviter not found')

        const hasPermissionByInvite = inviter.canInviteMembers()

        if (!hasPermissionByInvite) throw new Error('This Membership hasn`t permission by invite')
        if (
            inviter.role === Role.MANAGER &&
            role !== Role.MEMBER
        ) {
            throw new Error(
                "Managers can only invite members."
            )
        }


        const invited = await this.usersRepository.findById(invitedUserId)

        if (!invited) throw new Error("User not found")

        const invitedAlreadyBeInTheOrg = await this.membershipsRepository.findByUserIdAndOrganizationId(invitedUserId, orgId)

        if (invitedAlreadyBeInTheOrg) throw new Error("The invited user already be in the Organization")

        const membership = Membership.createInvite({ role, userId: invitedUserId, organizationId: orgId,  invitedByUserId: inviterId })

        await this.membershipsRepository.create(membership)

        return { membership }

    }

}