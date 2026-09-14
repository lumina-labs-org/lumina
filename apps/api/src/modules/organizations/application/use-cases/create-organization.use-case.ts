import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import type { TransactionManager } from "../../../../shared/application/transactions/transaction-manager.js";
import { Membership } from "../../domain/entities/membership.entity.js";
import { Organization } from "../../domain/entities/organization.entity.js";
import { MembershipsRepository } from "../repositories/memberships.repository.js";
import { OrganizationsRepository } from "../repositories/organizations.repository.js";
import { UsersRepository } from "../repositories/users.repository.js";

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
        private readonly membershipsRepository: MembershipsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly transactionManager: TransactionManager,
    ) { }


    async execute({ name, userId }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) throw new Error("User not found")

        const org = Organization.create({ name })
        const member = Membership.createOwner({ userId, organizationId: org.id })

        const slugAlreadyExists = await this.organizationsRepository.findBySlug(org.slug)

        if (slugAlreadyExists) throw new Error("Org slug already exists!")

        await this.transactionManager.execute(async ({ organizationsRepository, membershipsRepository }) => {
            await organizationsRepository.create(org)
            await membershipsRepository.create(member)
        })

        return {
            org
        }
    }

}
