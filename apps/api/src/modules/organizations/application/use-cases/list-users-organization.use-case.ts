import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { Organization } from "../../domain/entities/organization.entity.js"
import { MembershipsRepository } from "../repositories/memberships.repository.js"
import { OrganizationsRepository } from "../repositories/organizations.repository.js"

interface ListUserOrganizationsUseCaseRequest {
  userId: UniqueEntityId
}

interface UserOrganization {
  organization: Organization
  membership: Membership
}

interface ListUserOrganizationsUseCaseResponse {
  organizations: UserOrganization[]
}

export class ListUserOrganizationsUseCase {
  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async execute({
    userId,
  }: ListUserOrganizationsUseCaseRequest): Promise<ListUserOrganizationsUseCaseResponse> {
    const memberships =
      await this.membershipsRepository.findByUserId(userId)

    const organizations: UserOrganization[] = []

    for (const membership of memberships) {
      const organization =
        await this.organizationsRepository.findById(
          membership.organizationId,
        )

      if (!organization) continue

      organizations.push({
        organization,
        membership,
      })
    }

    return {
      organizations,
    }
  }
}