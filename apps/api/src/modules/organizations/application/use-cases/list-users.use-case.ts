import { UsersRepository } from "../repositories/users.repository.js";

interface ListUsersUseCaseRequest {
  name?: string;
  email?: string;
}

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

  async execute({
    name,
    email,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    const users = await this.usersRepository.findAll({ name, email });

    return {
      users: users.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      })),
    };
  }
}
