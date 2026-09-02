import { InMemoryMembershipsRepository } from "../../modules/organizations/application/repositories/in-memory/in-memory-memberships.repository.js"
import { InMemoryOrganizationsRepository } from "../../modules/organizations/application/repositories/in-memory/in-memory-organizations.repository.js"
import { InMemoryUsersRepository } from "../../modules/organizations/application/repositories/in-memory/in-memory-users.repository.js"

export const organizationsRepository =
  new InMemoryOrganizationsRepository()

export const membershipsRepository =
  new InMemoryMembershipsRepository()

export const usersRepository =
  new InMemoryUsersRepository()