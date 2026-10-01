import { FastifyReply, FastifyRequest } from "fastify"

import { InviteMemberUseCase } from "../../../application/use-cases/invite-member.use-case.js"
import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import { InviteMemberBody  } from "../../schemas/invite-member.schema.js"


export class InviteMemberController {
  constructor(
    private readonly inviteMemberUseCase: InviteMemberUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: InviteMemberBody }>,
    reply: FastifyReply,
  ) {
    const { invitedUserId, role, inviterId } = request.body
    const { id } = request.params as { id: string }

    const { membership, invitedUser, invitedByUser } =
      await this.inviteMemberUseCase.execute({
       inviterId: new UniqueEntityId(inviterId),
       invitedUserId: new UniqueEntityId(invitedUserId),
       role,
       orgId: new UniqueEntityId(id),
      })

    return reply.status(201).send({
      membership: {
        id: membership.id.toString(),
        status: membership.status,
        role: membership.role,
        invitedUser: {
          id: invitedUser.id.toString(),
          name: invitedUser.name,
          email: invitedUser.email,
        },
        invitedByUser: {
          id: invitedByUser?.id.toString(),
          name: invitedByUser?.name,
          email: invitedByUser?.email,
        },
      },
    })
  }
}
