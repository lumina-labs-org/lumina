import { FastifyReply, FastifyRequest } from "fastify"

import { ListOrganizationMembersUseCase } from "../../../application/use-cases/list-organization-members.use-case.js"
import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"

export class ListOrganizationMembersController {
  constructor(
    private readonly listOrganizationMembersUseCase: ListOrganizationMembersUseCase,
  ) { }

  async handle(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {

    const { id: orgId } = request.params as { id: string }

    const { memberships } =
      await this.listOrganizationMembersUseCase.execute({
        organizationId: new UniqueEntityId(orgId),
      })


    return reply.status(200).send(
     {
      memberships:  memberships.map((item) => ({
        id: item.membership.id.toString(),
        status: item.membership.status,
        role: item.membership.role,
        invitedUser: {
          id: item.invitedUser.id.toString(),
          name: item.invitedUser.name,
          email: item.invitedUser.email,
        },
        invitedByUser: item.invitedByUser
          ? {
              id: item.invitedByUser.id.toString(),
              name: item.invitedByUser.name,
              email: item.invitedByUser.email,
            }
          : null,
      })),
     }
    )
  }
}
