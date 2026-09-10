import { FastifyReply, FastifyRequest } from "fastify"

import { ListUserOrganizationsUseCase } from "../../../application/use-cases/list-users-organization.use-case.js"
import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"

export class ListOrganizationsController {
  constructor(
    private readonly listUserOrganizationsUseCase: ListUserOrganizationsUseCase,
  ) { }

  async handle(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {

    const { userId } = request.query as { userId: string }

    const { organizations } =
      await this.listUserOrganizationsUseCase.execute({
        userId: new UniqueEntityId(userId),
      })

    return reply.status(200).send(
      organizations.map((item) => ({
        id: item.organization.id.toString(),
        name: item.organization.name,
        slug: item.organization.slug.toString(),
        role: item.membership.role,
      })),
    )
  }
}