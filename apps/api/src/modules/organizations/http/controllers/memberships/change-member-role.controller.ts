import { FastifyReply, FastifyRequest } from "fastify"

import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import { MembershipRole } from "../../../domain/enums/memberships.enums.js"
import { ChangeMemberRoleUseCase } from "../../../application/use-cases/change-member-role.use-case.js"

export class ChangeMemberRoleController {
  constructor(
    private readonly changeMemberRoleUseCase: ChangeMemberRoleUseCase,
  ) {}

  async handle(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const {
      organizationId,
      id,
    } = request.params as {
      organizationId: string
      id: string
    }

    const {
      actorUserId,
      role,
    } = request.body as {
      actorUserId: string
      role: MembershipRole
    }

    const { membership } =
      await this.changeMemberRoleUseCase.execute({
        organizationId: new UniqueEntityId(organizationId),
        actorUserId: new UniqueEntityId(actorUserId),
        membershipId: new UniqueEntityId(id),
        role,
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