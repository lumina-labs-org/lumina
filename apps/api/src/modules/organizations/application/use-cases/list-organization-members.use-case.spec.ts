import { beforeEach, describe, expect, it } from "vitest"

import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { User } from "../../domain/entities/user.entity.js"
import { Role } from "../../domain/enums/memberships.enums.js"
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js"
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users.repository.js"
import { ListOrganizationMembersUseCase } from "./list-organization-members.use-case.js"

let membershipsRepository: InMemoryMembershipsRepository
let usersRepository: InMemoryUsersRepository
let sut: ListOrganizationMembersUseCase

describe("List Organization Members Use Case", () => {
  beforeEach(() => {
    membershipsRepository = new InMemoryMembershipsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new ListOrganizationMembersUseCase(
      membershipsRepository,
      usersRepository,
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

    const ownerUser = User.create({
      name: "Owner",
      email: "owner@example.com",
    }, ownerId)

    const memberUser = User.create({
      name: "Member",
      email: "member@example.com",
    }, memberId)

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(member),
      usersRepository.create(ownerUser),
      usersRepository.create(memberUser),
    ])

    const result = await sut.execute({
      organizationId,
    })

    expect(result.memberships).toHaveLength(2)
    expect(result.memberships[0].invitedUser.id.equals(ownerId)).toBe(true)
    expect(result.memberships[0].invitedByUser).toBeNull()
    expect(result.memberships[1].invitedUser.id.equals(memberId)).toBe(true)
    expect(result.memberships[1].invitedByUser?.id.equals(ownerId)).toBe(true)
  })

  it("should return an empty list when organization has no memberships", async () => {
    const result = await sut.execute({
      organizationId: new UniqueEntityId(),
    })

    expect(result.memberships).toHaveLength(0)
  })
})
