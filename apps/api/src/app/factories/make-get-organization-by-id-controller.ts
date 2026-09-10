import { GetOrganizationUseCase } from "../../modules/organizations/application/use-cases/get-organization.use-case.js"
import { GetOrganizationByIdController } from "../../modules/organizations/http/controllers/organizations/get-organization-by-id.controller.js"

import {
    organizationsRepository
} from "../repositories/drizzle.js"

export function makeGetOrganizationByIdController() {
    const getOrganizationUseCase =
        new GetOrganizationUseCase(
            organizationsRepository,
        )

    return new GetOrganizationByIdController(
        getOrganizationUseCase,
    )
}