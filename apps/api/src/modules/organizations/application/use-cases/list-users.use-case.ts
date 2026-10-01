import { UsersRepository } from "../repositories/users.repository.js";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ListUsersUseCaseResponse {
  users: User[];
}

export class ListUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(query?: string): Promise<ListUsersUseCaseResponse> {
    const users = await this.usersRepository.findAll(query);

    return {
      users: users.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      })),
    };
  }
}
