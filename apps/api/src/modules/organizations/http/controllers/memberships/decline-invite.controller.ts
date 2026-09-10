import { FastifyReply, FastifyRequest } from "fastify"

import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import { DeclineInviteUseCase } from "../../../application/use-cases/decline-invite.use-case.js"

export class DeclineInviteController {
    constructor(
        private readonly declineInviteUseCase: DeclineInviteUseCase,
    ) { }

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
            await this.declineInviteUseCase.execute({
                membershipId: new UniqueEntityId(id),
                userId: new UniqueEntityId(userId),
            })

        return reply.status(200).send({
            membership: {
                id: membership.id.toString(),
                status: membership.status,
                role: membership.role,
            },
        })
    }
}