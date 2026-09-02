import { beforeEach, describe, expect, it } from "vitest"

import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { Membership } from "../../domain/entities/membership.entity.js"
import { Role, Status } from "../../domain/enums/memberships.enums.js"
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js"
import { RevokeInviteUseCase } from "./revoke-invite.use-case.js"

let membershipsRepository: InMemoryMembershipsRepository
let sut: RevokeInviteUseCase

describe("Revoke Invite Use Case", () => {
  beforeEach(() => {
    membershipsRepository = new InMemoryMembershipsRepository()
    sut = new RevokeInviteUseCase(membershipsRepository)
  })

  it("should allow the inviter to revoke an invite", async () => {
    const organizationId = new UniqueEntityId()
    const inviterId = new UniqueEntityId()
    const invitedUserId = new UniqueEntityId()

    const inviterMembership = Membership.createOwner({
      userId: inviterId,
      organizationId,
    })

    const invite = Membership.createInvite({
      userId: invitedUserId,
      organizationId,
      invitedByUserId: inviterId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(inviterMembership),
      membershipsRepository.create(invite),
    ])

    const { membership } = await sut.execute({
      membershipId: invite.id,
      userId: inviterId,
    })

    expect(membership.status).toBe(Status.REVOKED)
    expect(membershipsRepository.items).toHaveLength(2)
  })

  it("should allow another owner to revoke an invite", async () => {
    const organizationId = new UniqueEntityId()
    const inviterId = new UniqueEntityId()
    const anotherOwnerId = new UniqueEntityId()
    const invitedUserId = new UniqueEntityId()

    const inviterMembership = Membership.createOwner({
      userId: inviterId,
      organizationId,
    })

    const anotherOwnerMembership = Membership.createOwner({
      userId: anotherOwnerId,
      organizationId,
    })

    const invite = Membership.createInvite({
      userId: invitedUserId,
      organizationId,
      invitedByUserId: inviterId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(inviterMembership),
      membershipsRepository.create(anotherOwnerMembership),
      membershipsRepository.create(invite),
    ])

    const { membership } = await sut.execute({
      membershipId: invite.id,
      userId: anotherOwnerId,
    })

    expect(membership.status).toBe(Status.REVOKED)
  })

  it("should not allow another manager to revoke an invite", async () => {
    const organizationId = new UniqueEntityId()
    const ownerId = new UniqueEntityId()
    const managerId = new UniqueEntityId()
    const invitedUserId = new UniqueEntityId()

    const ownerMembership = Membership.createOwner({
      userId: ownerId,
      organizationId,
    })

    const managerMembership = Membership.createInvite({
      userId: managerId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MANAGER,
    })

    managerMembership.accept()

    const invite = Membership.createInvite({
      userId: invitedUserId,
      organizationId,
      invitedByUserId: ownerId,
      role: Role.MEMBER,
    })

    await Promise.all([
      membershipsRepository.create(ownerMembership),
      membershipsRepository.create(managerMembership),
      membershipsRepository.create(invite),
    ])

    await expect(
      sut.execute({
        membershipId: invite.id,
        userId: managerId,
      }),
    ).rejects.toThrow()

    expect(invite.status).toBe(Status.PENDING)
  })

  it("should not revoke an invite that does not exist", async () => {
    await expect(
      sut.execute({
        membershipId: new UniqueEntityId(),
        userId: new UniqueEntityId(),
      }),
    ).rejects.toThrow()
  })

  it("should not revoke a membership that is not pending", async () => {
    const organizationId = new UniqueEntityId()
    const inviterId = new UniqueEntityId()
    const invitedUserId = new UniqueEntityId()

    const owner = Membership.createOwner({
      userId: inviterId,
      organizationId,
    })

    const invite = Membership.createInvite({
      userId: invitedUserId,
      organizationId,
      invitedByUserId: inviterId,
      role: Role.MEMBER,
    })

    invite.accept()

    await Promise.all([
      membershipsRepository.create(owner),
      membershipsRepository.create(invite),
    ])

    await expect(
      sut.execute({
        membershipId: invite.id,
        userId: inviterId,
      }),
    ).rejects.toThrow()

    expect(invite.status).toBe(Status.ACTIVE)
  })
})