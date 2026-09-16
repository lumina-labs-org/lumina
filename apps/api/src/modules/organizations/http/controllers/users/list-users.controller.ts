import { FastifyReply, FastifyRequest } from "fastify";
import { ListUsersUseCase } from "../../../application/use-cases/list-users.use-case.js";

export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email } = request.query as { name: string; email: string };

    console.log(name, email, `USERS CONTROLLER QUERY`)

    const { users } = await this.listUsersUseCase.execute({
      name,
      email,
    });

    console.log(users, `USERS CONTROLLER LIST`)

    return reply.status(200).send(
      users.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        email: item.email,
      })),
    );
  }
}
