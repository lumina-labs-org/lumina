// app/factories/make-accept-invite-controller.ts

import { AcceptInviteUseCase } from "../../modules/organizations/application/use-cases/accept-invite.use-case.js"
import { AcceptInviteController } from "../../modules/organizations/http/controllers/memberships/accept-invite.controller.js"

import { membershipsRepository } from "../repositories/drizzle.js"

export function makeAcceptInviteController() {
  const acceptInviteUseCase =
    new AcceptInviteUseCase(membershipsRepository)

  return new AcceptInviteController(
    acceptInviteUseCase,
  )
}