import { FastifyReply, FastifyRequest } from "fastify"

import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import { RevokeInviteUseCase } from "../../../application/use-cases/revoke-invite.use-case.js"

export class RevokeInviteController {
  constructor(
    private readonly revokeInviteUseCase: RevokeInviteUseCase,
  ) {}

  async handle(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } = request.params as {
      id: string
    }

    const { userId } = request.body as {
      userId: string
    }

    const { membership } =
      await this.revokeInviteUseCase.execute({
        membershipId: new UniqueEntityId(id),
        userId: new UniqueEntityId(userId),
      })

    return reply.status(200).send({
      membership: {
        id: membership.id.toString(),
        organizationId: membership.organizationId.toString(),
        userId: membership.userId.toString(),
        role: membership.role,
        status: membership.status,
      },
    })
  }
}