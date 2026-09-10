import { CreateOrganizationUseCase } from "../../modules/organizations/application/use-cases/create-organization.use-case.js"
import { CreateOrganizationController } from "../../modules/organizations/http/controllers/organizations/create-organization.controller.js"

import {
  membershipsRepository,
  organizationsRepository,
} from "../repositories/drizzle.js"

export function makeCreateOrganizationController() {
  const createOrganizationUseCase =
    new CreateOrganizationUseCase(
      organizationsRepository,
      membershipsRepository,
    )

  return new CreateOrganizationController(
    createOrganizationUseCase,
  )
}