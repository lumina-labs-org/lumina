import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { User } from "../../domain/entities/user.entity.js"
import { MembershipsRepository } from "../repositories/memberships.repository.js"
import { UsersRepository } from "../repositories/users.repository.js"

interface ListOrganizationMembersUseCaseRequest {
  organizationId: UniqueEntityId
}

interface ListOrganizationMembersUseCaseResponse {
  memberships: {
    membership: Membership
    invitedUser: User
    invitedByUser: User | null
  }[]
}

export class ListOrganizationMembersUseCase {
  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    organizationId,
  }: ListOrganizationMembersUseCaseRequest): Promise<ListOrganizationMembersUseCaseResponse> {

    const memberships =
      await this.membershipsRepository.findByOrganizationId(
        organizationId,
      )

      const membershipsWithUsers = await Promise.all(memberships.map(async (membership) => {
        const invitedUser = await this.usersRepository.findById(
          membership.userId,
        )

        const invitedByUser = membership.invitedByUserId
          ? await this.usersRepository.findById(membership.invitedByUserId)
          : null

        if (!invitedUser) {
          throw new Error("Invited user not found.")
        }

        if (membership.invitedByUserId && !invitedByUser) {
          throw new Error("Inviter user not found.")
        }

        return {
          membership,
          invitedUser,
          invitedByUser,
        }
      }))

    return {
      memberships: membershipsWithUsers,
    }
  }
}
