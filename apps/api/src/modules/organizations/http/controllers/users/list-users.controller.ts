import { FastifyReply, FastifyRequest } from "fastify";
import { ListUsersUseCase } from "../../../application/use-cases/list-users.use-case.js";

export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { query } = request.query as { query?: string };

    const { users } = await this.listUsersUseCase.execute(query);

    return reply.status(200).send(
      users.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        email: item.email,
      })),
    );
  }
}
