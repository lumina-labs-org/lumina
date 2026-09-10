import { RevokeInviteUseCase } from "../../modules/organizations/application/use-cases/revoke-invite.use-case.js"
import { RevokeInviteController } from "../../modules/organizations/http/controllers/memberships/revoke-invite.controller.js"
import { membershipsRepository } from "../repositories/drizzle.js"


export function makeRevokeInviteController() {
    const revokeInviteUseCase =
        new RevokeInviteUseCase(membershipsRepository)

    return new RevokeInviteController(revokeInviteUseCase)
}