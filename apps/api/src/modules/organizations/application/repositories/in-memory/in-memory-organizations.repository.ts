import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import { Organization } from "../../../domain/entities/organization.entity.js"
import { Slug } from "../../../domain/value-objects/slug.js"
import { OrganizationsRepository } from "../organizations.repository.js"

export class InMemoryOrganizationsRepository implements OrganizationsRepository {

  public items: Organization[] = []

  async create(organization: Organization): Promise<void> {
    this.items.push(organization)
  }

  async findBySlug(slug: Slug): Promise<Organization | null> {
      const slugExists = this.items.find(item => item.slug.equals(slug))

      if (!slugExists) return null

      return slugExists
  }

   async findById(id: UniqueEntityId): Promise<Organization | null> {
      const idExists = this.items.find(item => item.id.equals(id))

      if (!idExists) return null

      return idExists
  }
}