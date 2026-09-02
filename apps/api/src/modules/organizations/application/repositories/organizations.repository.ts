import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Organization } from "../../domain/entities/organization.entity.js";
import { Slug } from "../../domain/value-objects/slug.js";

export interface OrganizationsRepository {
  create(organization: Organization): Promise<void>
  findBySlug(slug: Slug): Promise<Organization | null>
  findById(id: UniqueEntityId): Promise<Organization | null>
}
