import { CreateOrganizationUseCase } from "../../modules/organizations/application/use-cases/create-organization.use-case.js"
import { CreateOrganizationController } from "../../modules/organizations/http/controllers/organizations/create-organization.controller.js"

import {
  membershipsRepository,
  organizationsRepository,
  transactionManager,
  usersRepository,
} from "../repositories/drizzle.js"

export function makeCreateOrganizationController() {
  const createOrganizationUseCase =
    new CreateOrganizationUseCase(
      organizationsRepository,
      membershipsRepository,
      usersRepository,
      transactionManager,
    )

  return new CreateOrganizationController(
    createOrganizationUseCase,
  )
}
