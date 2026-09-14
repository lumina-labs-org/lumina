import { FastifyReply, FastifyRequest } from "fastify"

import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import { GetOrganizationUseCase } from "../../../application/use-cases/get-organization.use-case.js"
import { OrganizationNotFoundError } from "../../../application/errors/organization-not-found.error.js"

export class GetOrganizationByIdController {
    constructor(
        private readonly getOrganizationUseCase: GetOrganizationUseCase,
    ) { }

    async handle(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        try {
            const { id } = request.params as { id: string }

            const { organization } =
                await this.getOrganizationUseCase.execute({
                    organizationId: new UniqueEntityId(id),
                })

            return reply.status(200).send({
                organization: {
                    id: organization.id.toString(),
                    name: organization.name,
                    slug: organization.slug.toString(),
                },
            })
        } catch (error) {
            console.log(JSON.stringify(error, null, 2), "ERROR")
            console.log(reply.statusCode)
            if (error instanceof OrganizationNotFoundError) {
                return reply.status(404).send({
                    message: error.message,
                })
            }

            throw error
        }

    }
}