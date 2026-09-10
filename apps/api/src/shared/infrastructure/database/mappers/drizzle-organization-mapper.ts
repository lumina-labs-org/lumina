import { Organization } from "../../../../modules/organizations/domain/entities/organization.entity.js"
import { Slug } from "../../../../modules/organizations/domain/value-objects/slug.js"
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"

import { organizationsTable } from "../../../../shared/infrastructure/database/schemas/organizations.js"

type OrganizationRow =
  typeof organizationsTable.$inferSelect

type NewOrganizationRow =
  typeof organizationsTable.$inferInsert

export class DrizzleOrganizationMapper {
  static toPersistence(
    organization: Organization,
  ): NewOrganizationRow {
    return {
      id: organization.id.toString(),
      name: organization.name,
      slug: organization.slug.toString(),
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    }
  }

  static toDomain(row: OrganizationRow): Organization {
    return Organization.restore(
      {
        name: row.name,
        slug: new Slug(row.slug),
        contactEmail: row.contactEmail,
        contactPhone: row.contactPhone,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      new UniqueEntityId(row.id),
    )
  }
}