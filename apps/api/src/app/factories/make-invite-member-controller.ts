import { InviteMemberUseCase } from "../../modules/organizations/application/use-cases/invite-member.use-case.js"
import { InviteMemberController } from "../../modules/organizations/http/controllers/organizations/invite-member.controller.js"


import {
    membershipsRepository,
} from "../repositories/drizzle.js"
import { usersRepository } from "../repositories/in-memory.js"

export function makeInviteMemberController() {
    const inviteMemberUseCase =
        new InviteMemberUseCase(
            membershipsRepository,
            usersRepository,
        )

    return new InviteMemberController(
        inviteMemberUseCase,
    )
}