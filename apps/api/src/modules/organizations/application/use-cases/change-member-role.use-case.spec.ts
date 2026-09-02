import { beforeEach, describe, expect, it } from "vitest"

import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { Role } from "../../domain/enums/memberships.enums.js"
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js"
import { ChangeMemberRoleUseCase } from "./change-member-role.use-case.js"

let membershipsRepository: InMemoryMembershipsRepository
let sut: ChangeMemberRoleUseCase

function createActiveMembership({
  userId,
  organizationId,
  role,
  invitedByUserId,
}: {
  userId: UniqueEntityId
  organizationId: UniqueEntityId
  role: typeof Role.MEMBER | typeof Role.MANAGER
  invitedByUserId: UniqueEntityId
}) {
  const membership = Membership.createInvite({
    userId,
    organizationId,
    invitedByUserId,
    role,
  })

  membership.accept()

  return membership
}

describe("Change Member Role Use Case", () => {
  beforeEach(() => {
    membershipsRepository = new InMemoryMembershipsRepository()
    sut = new ChangeMemberRoleUseCase(membershipsRepository)
  })

  it("should allow an owner to change a member role", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()
    const memberId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    const member = createActiveMembership({
      userId: memberId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(member),
    ])

    const { membership } = await sut.execute({
      organizationId,
      actorUserId: ownerId,
      membershipId: member.id,
      role: Role.MANAGER,
    })

    expect(membership.role).toBe(Role.MANAGER)
  })

  it("should allow a manager to change a member role", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()
    const managerId = new UniqueEntityId()
    const memberId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    const manager = createActiveMembership({
      userId: managerId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MANAGER,
    })

    const member = createActiveMembership({
      userId: memberId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(manager),
      membershipsRepository.create(member),
    ])

    const { membership } = await sut.execute({
      organizationId,
      actorUserId: managerId,
      membershipId: member.id,
      role: Role.MANAGER,
    })

    expect(membership.role).toBe(Role.MANAGER)
  })

  it("should not allow a member to change roles", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()
    const memberId = new UniqueEntityId()
    const anotherMemberId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    const member = createActiveMembership({
      userId: memberId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MEMBER,
    })

    const anotherMember = createActiveMembership({
      userId: anotherMemberId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(member),
      membershipsRepository.create(anotherMember),
    ])

    await expect(
      sut.execute({
        organizationId,
        actorUserId: memberId,
        membershipId: anotherMember.id,
        role: Role.MANAGER,
      }),
    ).rejects.toThrow()
  })

  it("should not allow a manager to change another manager role", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()
    const managerId = new UniqueEntityId()
    const anotherManagerId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    const manager = createActiveMembership({
      userId: managerId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MANAGER,
    })

    const anotherManager = createActiveMembership({
      userId: anotherManagerId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MANAGER,
    })

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(manager),
      membershipsRepository.create(anotherManager),
    ])

    await expect(
      sut.execute({
        organizationId,
        actorUserId: managerId,
        membershipId: anotherManager.id,
        role: Role.MEMBER,
      }),
    ).rejects.toThrow()
  })

  it("should not allow a manager to promote a member to owner", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()
    const managerId = new UniqueEntityId()
    const memberId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    const manager = createActiveMembership({
      userId: managerId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MANAGER,
    })

    const member = createActiveMembership({
      userId: memberId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(manager),
      membershipsRepository.create(member),
    ])

    await expect(
      sut.execute({
        organizationId,
        actorUserId: managerId,
        membershipId: member.id,
        role: Role.OWNER,
      }),
    ).rejects.toThrow()
  })

  it("should allow an owner to promote another member to owner", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()
    const memberId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    const member = createActiveMembership({
      userId: memberId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(member),
    ])

    const { membership } = await sut.execute({
      organizationId,
      actorUserId: ownerId,
      membershipId: member.id,
      role: Role.OWNER,
    })

    expect(membership.role).toBe(Role.OWNER)
  })

  it("should not allow the last owner to leave the owner role", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    await membershipsRepository.create(owner)

    await expect(
      sut.execute({
        organizationId,
        actorUserId: ownerId,
        membershipId: owner.id,
        role: Role.MANAGER,
      }),
    ).rejects.toThrow()

    expect(owner.role).toBe(Role.OWNER)
  })

  it("should allow an owner to leave the owner role when another owner exists", async () => {
    const organizationId = new UniqueEntityId()
    const firstOwnerId = new UniqueEntityId()
    const secondOwnerId = new UniqueEntityId()

    const firstOwner = Membership.createOwner({
      userId: firstOwnerId,
      organizationId,
    })

    const secondOwner = Membership.createOwner({
      userId: secondOwnerId,
      organizationId,
    })

    await Promise.all([
      membershipsRepository.create(firstOwner),
      membershipsRepository.create(secondOwner),
    ])

    const { membership } = await sut.execute({
      organizationId,
      actorUserId: firstOwnerId,
      membershipId: firstOwner.id,
      role: Role.MANAGER,
    })

    expect(membership.role).toBe(Role.MANAGER)
  })
})