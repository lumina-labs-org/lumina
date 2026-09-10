import { ChangeMemberRoleUseCase } from "../../modules/organizations/application/use-cases/change-member-role.use-case.js"
import { ChangeMemberRoleController } from "../../modules/organizations/http/controllers/memberships/change-member-role.controller.js"
import { membershipsRepository } from "../repositories/drizzle.js"


export function makeChangeMemberRoleController() {
    const changeMemberRoleUseCase =
        new ChangeMemberRoleUseCase(membershipsRepository)

    return new ChangeMemberRoleController(
        changeMemberRoleUseCase,
    )
}