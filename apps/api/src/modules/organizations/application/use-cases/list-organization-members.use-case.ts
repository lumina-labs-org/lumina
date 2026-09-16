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

    const userIds = memberships.flatMap((membership) => [
      membership.userId,
      ...(membership.invitedByUserId ? [membership.invitedByUserId] : []),
    ])

    const users = await this.usersRepository.findByManyId(userIds)
    const usersById = new Map(users.map((user) => [user.id.toString(), user]))

    const membershipsWithUsers = memberships.map((membership) => {
      const invitedUser = usersById.get(membership.userId.toString())
      const invitedByUser = membership.invitedByUserId
        ? usersById.get(membership.invitedByUserId.toString()) ?? null
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
    })

    return {
      memberships: membershipsWithUsers,
    }
  }
}
