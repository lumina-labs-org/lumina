import { beforeEach, describe, expect, it } from "vitest"

import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { Organization } from "../../domain/entities/organization.entity.js"
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js"
import { InMemoryOrganizationsRepository } from "../repositories/in-memory/in-memory-organizations.repository.js"
import { ListUserOrganizationsUseCase } from "./list-users-organization.use-case.js"

let membershipsRepository: InMemoryMembershipsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: ListUserOrganizationsUseCase

describe("List User Organizations Use Case", () => {
  beforeEach(() => {
    membershipsRepository = new InMemoryMembershipsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()

    sut = new ListUserOrganizationsUseCase(
      membershipsRepository,
      organizationsRepository,
    )
  })

  it("should list organizations from a user", async () => {
    const userId = new UniqueEntityId()

    const firstOrganization = Organization.create({
      name: "Lumina",
    })

    const secondOrganization = Organization.create({
      name: "Faculdade",
    })

    const firstMembership = Membership.createOwner({
      userId,
      organizationId: firstOrganization.id,
    })

    const secondMembership = Membership.createOwner({
      userId,
      organizationId: secondOrganization.id,
    })

    await Promise.all([
      organizationsRepository.create(firstOrganization),
      organizationsRepository.create(secondOrganization),
      membershipsRepository.create(firstMembership),
      membershipsRepository.create(secondMembership),
    ])

    const result = await sut.execute({
      userId,
    })

    expect(result.organizations).toHaveLength(2)
  })

  it("should return an empty list when user has no organizations", async () => {
    const result = await sut.execute({
      userId: new UniqueEntityId(),
    })

    expect(result.organizations).toHaveLength(0)
  })
})