import { Organization } from "../../../domain/entities/organization.entity.js"
import { OrganizationsRepository } from "../organizations.repository.js"

export class InMemoryOrganizationsRepository implements OrganizationsRepository {

  public items: Organization[] = []

  async create(organization: Organization): Promise<void> {
    this.items.push(organization)
  }
}