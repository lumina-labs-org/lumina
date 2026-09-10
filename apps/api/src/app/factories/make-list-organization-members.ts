import { ListOrganizationMembersUseCase } from "../../modules/organizations/application/use-cases/list-organization-members.use-case.js"
import { ListOrganizationMembersController } from "../../modules/organizations/http/controllers/organizations/list-organizations-members.controller.js"

import {
    membershipsRepository
} from "../repositories/drizzle.js"

export function makeListOrganizationMembersController() {
    const listOrganizationMembersUseCase =
        new ListOrganizationMembersUseCase(
            membershipsRepository,
        )

    return new ListOrganizationMembersController(
        listOrganizationMembersUseCase,
    )
}