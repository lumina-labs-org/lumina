import { Organization } from "../../domain/entities/organization.entity.js";

export interface OrganizationsRepository {
  create(organization: Organization): Promise<void>
}
