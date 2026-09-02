import { beforeEach, describe, expect, it } from "vitest"

import { Organization } from "../../domain/entities/organization.entity.js"
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { InMemoryOrganizationsRepository } from "../repositories/in-memory/in-memory-organizations.repository.js"
import { GetOrganizationUseCase } from "./get-organization.use-case.js"

let organizationsRepository: InMemoryOrganizationsRepository
let sut: GetOrganizationUseCase

describe("Get Organization Use Case", () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new GetOrganizationUseCase(organizationsRepository)
  })

  it("should get an organization", async () => {
    const organization = Organization.create({
      name: "Lumina",
    })

    await organizationsRepository.create(organization)

    const result = await sut.execute({
      organizationId: organization.id,
    })

    expect(result.organization.id.equals(organization.id)).toBe(true)
    expect(result.organization.name).toBe("Lumina")
  })

  it("should not get an organization that does not exist", async () => {
    await expect(
      sut.execute({
        organizationId: new UniqueEntityId(),
      }),
    ).rejects.toThrow()
  })
})