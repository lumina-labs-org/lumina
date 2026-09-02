import { FastifyReply, FastifyRequest } from "fastify"

import { CreateOrganizationUseCase } from "../../application/use-cases/create-organization.use-case.js"
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { CreateOrganizationBody } from "../schemas/create-organization.schema.js"


export class CreateOrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: CreateOrganizationBody }>,
    reply: FastifyReply,
  ) {
    const { name } = request.body

    const userId = new UniqueEntityId()

    const { org } =
      await this.createOrganizationUseCase.execute({
        name,
        userId,
      })

    return reply.status(201).send({
      organization: {
        id: org.id.toString(),
        name: org.name,
        slug: org.slug.toString(),
      },
    })
  }
}