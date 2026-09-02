import { beforeEach, describe, expect, it } from "vitest"

import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { Role } from "../../domain/enums/memberships.enums.js"
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js"
import { ListOrganizationMembersUseCase } from "./list-organization-members.use-case.js"

let membershipsRepository: InMemoryMembershipsRepository
let sut: ListOrganizationMembersUseCase

describe("List Organization Members Use Case", () => {
  beforeEach(() => {
    membershipsRepository = new InMemoryMembershipsRepository()
    sut = new ListOrganizationMembersUseCase(
      membershipsRepository,
    )
  })

  it("should list organization memberships", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()
    const memberId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    const member = Membership.createInvite({
      userId: memberId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(member),
    ])

    const result = await sut.execute({
      organizationId,
    })

    expect(result.memberships).toHaveLength(2)
  })

  it("should return an empty list when organization has no memberships", async () => {
    const result = await sut.execute({
      organizationId: new UniqueEntityId(),
    })

    expect(result.memberships).toHaveLength(0)
  })
})