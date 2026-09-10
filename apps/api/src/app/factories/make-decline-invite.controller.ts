// app/factories/make-decline-invite-controller.ts

import { DeclineInviteUseCase } from "../../modules/organizations/application/use-cases/decline-invite.use-case.js"
import { DeclineInviteController } from "../../modules/organizations/http/controllers/memberships/decline-invite.controller.js"

import { membershipsRepository } from "../repositories/drizzle.js"

export function makeDeclineInviteController() {
  const declineInviteUseCase =
    new DeclineInviteUseCase(membershipsRepository)

  return new DeclineInviteController(
    declineInviteUseCase,
  )
}