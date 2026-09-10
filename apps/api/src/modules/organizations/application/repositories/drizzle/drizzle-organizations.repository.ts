import { eq } from "drizzle-orm"

import { db } from "../../../../../shared/infrastructure/database/connection.js"
import { organizationsTable } from "../../../../../shared/infrastructure/database/schemas/organizations.js"


import { DrizzleOrganizationMapper } from "../../../../../shared/infrastructure/database/mappers/drizzle-organization-mapper.js"
import { OrganizationsRepository } from "../organizations.repository.js"
import { Organization } from "../../../domain/entities/organization.entity.js"
import { Slug } from "../../../domain/value-objects/slug.js"
import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"

export class DrizzleOrganizationsRepository
  implements OrganizationsRepository
{
  async create(organization: Organization): Promise<void> {
    const data =
      DrizzleOrganizationMapper.toPersistence(organization)

    await db
      .insert(organizationsTable)
      .values(data)
  }

  async findBySlug(slug: Slug): Promise<Organization | null> {
    const [row] = await db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.slug, slug.toString()))
      .limit(1)

    if (!row) {
      return null
    }

    return DrizzleOrganizationMapper.toDomain(row)
  }

  async findById(id: UniqueEntityId): Promise<Organization | null> {
    const [row] = await db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, id.toString()))
      .limit(1)

    if (!row) {
      return null
    }

    return DrizzleOrganizationMapper.toDomain(row)
  }
}