import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Organization } from "../../domain/entities/organization.entity.js"
import { OrganizationNotFoundError } from "../errors/organization-not-found.error.js"
import { OrganizationsRepository } from "../repositories/organizations.repository.js"

interface GetOrganizationUseCaseRequest {
  organizationId: UniqueEntityId
}

interface GetOrganizationUseCaseResponse {
  organization: Organization
}

export class GetOrganizationUseCase {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async execute({
    organizationId,
  }: GetOrganizationUseCaseRequest): Promise<GetOrganizationUseCaseResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      throw new OrganizationNotFoundError()
    }

    return {
      organization,
    }
  }
}