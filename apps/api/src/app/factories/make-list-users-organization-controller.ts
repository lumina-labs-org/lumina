import { ListUserOrganizationsUseCase } from "../../modules/organizations/application/use-cases/list-users-organization.use-case.js"
import { ListOrganizationsController } from "../../modules/organizations/http/controllers/organizations/list-users-organizations.controller.js"

import {
  membershipsRepository,
  organizationsRepository,
} from "../repositories/drizzle.js"

export function makeListUsersOrganizationsController() {
  const listUsersOrganizationsUseCase =
    new ListUserOrganizationsUseCase(
      membershipsRepository,
      organizationsRepository,
    )

  return new ListOrganizationsController(
    listUsersOrganizationsUseCase,
  )
}