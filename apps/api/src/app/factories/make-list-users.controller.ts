import { ListUsersUseCase } from "../../modules/organizations/application/use-cases/list-users.use-case.js";
import { ListUsersController } from "../../modules/organizations/http/controllers/users/list-users.controller.js";

import { usersRepository } from "../repositories/drizzle.js";

export function makeListUsersController() {
  const listUsersUseCase = new ListUsersUseCase(usersRepository);

  return new ListUsersController(listUsersUseCase);
}
