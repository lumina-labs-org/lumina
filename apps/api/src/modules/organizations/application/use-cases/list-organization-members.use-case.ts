import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { MembershipsRepository } from "../repositories/memberships.repository.js"

interface ListOrganizationMembersUseCaseRequest {
  organizationId: UniqueEntityId
}

interface ListOrganizationMembersUseCaseResponse {
  memberships: Membership[]
}

export class ListOrganizationMembersUseCase {
  constructor(
    private readonly membershipsRepository: MembershipsRepository,
  ) {}

  async execute({
    organizationId,
  }: ListOrganizationMembersUseCaseRequest): Promise<ListOrganizationMembersUseCaseResponse> {
    const memberships =
      await this.membershipsRepository.findByOrganizationId(
        organizationId,
      )

    return {
      memberships,
    }
  }
}