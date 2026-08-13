import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Membership } from "../../domain/entities/membership.entity.js";
import { Organization } from "../../domain/entities/organization.entity.js";
import { MembershipsRepository } from "../repositories/memberships.repository.js";
import { OrganizationsRepository } from "../repositories/organizations.repository.js";

interface CreateOrganizationUseCaseRequest {
    name: string;
    userId: UniqueEntityId;
}

interface CreateOrganizationUseCaseResponse {
    org: Organization
}

export class CreateOrganizationUseCase {

    constructor(
        private readonly organizationsRepository: OrganizationsRepository,
        private readonly membershipsRepository: MembershipsRepository
    ) { }


    async execute({ name, userId }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
        const org = Organization.create({ name })
        const member = Membership.createOwner({ userId, organizationId: org.id })

        const result = await this.organizationsRepository.create(org)
        await this.membershipsRepository.create(member)

        return {
            org
        }
    }

}