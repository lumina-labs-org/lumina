import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js";
import { User } from "../../domain/entities/user.entity.js";
import { Organization } from "../../domain/entities/organization.entity.js";
import { Role, Status } from "../../domain/enums/memberships.enums.js";
import { Membership } from "../../domain/entities/membership.entity.js";
import { AcceptInviteUseCase } from "./accept-invite.use-case.js";
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";

let membershipsRepository: InMemoryMembershipsRepository
let sut: AcceptInviteUseCase

describe("Accept Invite Use Case", () => {

    beforeEach(() => {
        membershipsRepository = new InMemoryMembershipsRepository()
        sut = new AcceptInviteUseCase(membershipsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should accept an membership invite from organization", async () => {

        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)
        const inviter = User.create({ name: "Pedro Marques", email: "phmarkes@teste.com" })
        const invitedUser = User.create({ name: "Joao Lucas", email: "joaolucas@teste.com" })
        const org = Organization.create({ name: "Lumina" })

        const orgId = org.id;
        const inviterId = inviter.id;
        const invitedUserId = invitedUser.id;

        const membershipInviter = Membership.createOwner({
            organizationId: orgId,
            userId: inviterId
        })
        const membershipInvited = Membership.createInvite({
            organizationId: orgId,
             invitedByUserId: inviterId,
            userId: invitedUserId,
            role: Role.MEMBER
        })

        await membershipsRepository.create(membershipInviter)
        await membershipsRepository.create(membershipInvited)

        vi.setSystemTime(updatedAt)

        const { membership } = await sut.execute({ membershipId: membershipInvited.id, userId: invitedUserId })

        expect(membership.status).toBe(Status.ACTIVE)
        expect(membershipsRepository.items).toHaveLength(2)
        expect(membership.updatedAt).toEqual(updatedAt)

    })

    it("should not accept a membership that does not exist", async () => {
        const inviter = User.create({ name: "Pedro Marques", email: "phmarkes@teste.com" })
        const org = Organization.create({ name: "Lumina" })

        const orgId = org.id;
        const inviterId = inviter.id;

        const membershipInviter = Membership.createOwner({
            organizationId: orgId,
            userId: inviterId
        })

        await membershipsRepository.create(membershipInviter)

        await expect(sut.execute({
            membershipId: new UniqueEntityId(),
            userId: inviterId
        })).rejects.toThrow()


    })

    it("should not accept another user's membership", async () => {
        const inviter = User.create({ name: "Pedro Marques", email: "phmarkes@teste.com" })
        const invitedUser = User.create({ name: "Joao Lucas", email: "joaolucas@teste.com" })

        const org = Organization.create({ name: "Lumina" })

        const orgId = org.id;
        const inviterId = inviter.id;
        const invitedUserId = invitedUser.id

        const membershipInviter = Membership.createOwner({
            organizationId: orgId,
            userId: inviterId
        })

        const membershipInvited = Membership.createInvite({
            organizationId: orgId,
            userId: invitedUserId,
             invitedByUserId: inviterId,
            role: Role.MANAGER,
        })

        await membershipsRepository.create(membershipInviter)
        await membershipsRepository.create(membershipInvited)

        await expect(sut.execute({
            membershipId: membershipInviter.id,
            userId: new UniqueEntityId()
        })).rejects.toThrow()
    })

    it("should not accept a membership that is not pending", async () => {
          const inviter = User.create({ name: "Pedro Marques", email: "phmarkes@teste.com" })
        const invitedUser = User.create({ name: "Joao Lucas", email: "joaolucas@teste.com" })

        const org = Organization.create({ name: "Lumina" })

        const orgId = org.id;
        const inviterId = inviter.id;
        const invitedUserId = invitedUser.id

        const membershipInviter = Membership.createOwner({
            organizationId: orgId,
            userId: inviterId
        })

        const membershipInvited = Membership.createInvite({
            organizationId: orgId,
            userId: invitedUserId,
             invitedByUserId: inviterId,
            role: Role.MANAGER,
        })

        await membershipsRepository.create(membershipInviter)
        await membershipsRepository.create(membershipInvited)

        await sut.execute({
            membershipId: membershipInvited.id,
            userId: invitedUserId
        })

        await expect(sut.execute({
            membershipId: membershipInvited.id,
            userId: invitedUserId
        })).rejects.toThrow()
    })


})