import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js";
import { InMemoryOrganizationsRepository } from "../repositories/in-memory/in-memory-organizations.repository.js";
import { InviteMemberUseCase } from "./invite-member.use-case.js";
import { UsersRepository } from "../repositories/users.repository.js";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users.repository.js";
import { User } from "../../domain/entities/user.entity.js";
import { Organization } from "../../domain/entities/organization.entity.js";
import { Role, Status } from "../../domain/enums/memberships.enums.js";
import { Membership } from "../../domain/entities/membership.entity.js";
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";

let organizationsRepository: InMemoryOrganizationsRepository
let membershipsRepository: InMemoryMembershipsRepository
let usersRepository: InMemoryUsersRepository
let sut: InviteMemberUseCase

describe("Invite Member Use Case", () => {

    beforeEach(() => {
        organizationsRepository = new InMemoryOrganizationsRepository()
        membershipsRepository = new InMemoryMembershipsRepository()
        usersRepository = new InMemoryUsersRepository()
        sut = new InviteMemberUseCase(membershipsRepository, usersRepository)
    })

    it("should invite an membership from organization", async () => {
        const inviter = User.create({ name: "Pedro Marques", email: "phmarkes@teste.com" })
        const invitedUser = User.create({ name: "Joao Lucas", email: "joaolucas@teste.com" })
        const org = Organization.create({ name: "Lumina" })

        const orgId = org.id;
        const inviterId = inviter.id;
        const invitedUserId = invitedUser.id;

        const membership = Membership.createOwner({ userId: inviterId, organizationId: orgId })

        await Promise.all([
            organizationsRepository.create(org),
            membershipsRepository.create(membership),
            usersRepository.create(inviter),
            usersRepository.create(invitedUser)
        ])

        const result = await sut.execute({
            role: Role.MANAGER,
            orgId,
            inviterId,
            invitedUserId
        })

        expect(membershipsRepository.items).toHaveLength(2)
        expect(result.membership.status).toBe(Status.PENDING)
        expect(result.membership.role).toBe(Role.MANAGER)
        expect(result.membership.userId.equals(invitedUserId)).toBe(true)

        expect(
            result.membership.organizationId.equals(orgId)
        ).toBe(true)

    })

    // inviter não possui Membership naquela Organization → erro
    // inviter é MEMBER → erro
    // usuário convidado não existe → erro
    // usuário convidado já possui Membership na Organization → erro
    // MANAGER tenta convidar outro MANAGER → erro
    // MANAGER convida MEMBER → sucesso

    it("should can not invite if user inviter is not membership in the organization", async () => {
        const inviter = User.create({ name: "Pedro Marques", email: "phmarkes@teste.com" })
        const invitedUser = User.create({ name: "Joao Lucas", email: "joaolucas@teste.com" })
        const anotherUser = User.create({ name: "Fernando", email: "fernando@teste.com" })
        const org = Organization.create({ name: "Lumina" })

        const orgId = org.id;
        const inviterId = inviter.id;
        const invitedUserId = invitedUser.id;

        const membership = Membership.createOwner({ userId: inviterId, organizationId: orgId })

        await Promise.all([
            organizationsRepository.create(org),
            membershipsRepository.create(membership),
            usersRepository.create(inviter),
            usersRepository.create(invitedUser),
            usersRepository.create(anotherUser)
        ])

        await expect(
            sut.execute({
                role: Role.MANAGER,
                orgId,
                inviterId: anotherUser.id,
                invitedUserId
            })
        ).rejects.toThrow()

    })

    it("should can not invite if user inviter is a MEMBER ROLE", async () => {
        const inviter = User.create({ name: "Pedro Marques", email: "phmarkes@teste.com" })
        const invitedUser = User.create({ name: "Joao Lucas", email: "joaolucas@teste.com" })
        const user = User.create({ name: "Joao pedro", email: "joaopedro@teste.com" })
        const org = Organization.create({ name: "Lumina" })

        const orgId = org.id;
        const inviterId = inviter.id;
        const invitedUserId = invitedUser.id;

        const membership = Membership.createOwner({ userId: inviterId, organizationId: orgId })
        const membershipInvited = Membership.createInvite({ organizationId: orgId, userId: invitedUserId, role: Role.MEMBER, invitedByUserId: inviterId })

        await Promise.all([
            organizationsRepository.create(org),
            membershipsRepository.create(membership),
            membershipsRepository.create(membershipInvited),
            usersRepository.create(inviter),
            usersRepository.create(invitedUser),
            usersRepository.create(user)
        ])

        await expect(
            sut.execute({
                role: Role.MANAGER,
                orgId,
                inviterId: invitedUserId,
                invitedUserId: user.id
            })
        ).rejects.toThrow('This Membership hasn`t permission by invite')

    })

    it("should not invite a user that does not exist", async () => {
        const inviter = User.create({
            name: "Pedro Marques",
            email: "phmarkes@teste.com",
        })

        const org = Organization.create({
            name: "Lumina",
        })

        const orgId = org.id
        const inviterId = inviter.id

        const membership = Membership.createOwner({
            userId: inviterId,
            organizationId: orgId,
        })

        await Promise.all([
            organizationsRepository.create(org),
            membershipsRepository.create(membership),
            usersRepository.create(inviter),
        ])

        await expect(
            sut.execute({
                role: Role.MANAGER,
                orgId,
                inviterId,
                invitedUserId: new UniqueEntityId(),
            }),
        ).rejects.toThrow()

        expect(membershipsRepository.items).toHaveLength(1)
    })

    it("should can not invite if user invited already be in the org", async () => {
        const inviter = User.create({ name: "Pedro Marques", email: "phmarkes@teste.com" })
        const invitedUser = User.create({ name: "Joao Lucas", email: "joaolucas@teste.com" })
        const org = Organization.create({ name: "Lumina" })

        const orgId = org.id;
        const inviterId = inviter.id;
        const invitedUserId = invitedUser.id;

        const membership = Membership.createOwner({ userId: inviterId, organizationId: orgId })
        const newMembership = Membership.createInvite({ userId: invitedUserId, organizationId: orgId, role: "MANAGER",  invitedByUserId: inviterId  })

        newMembership.accept()

        await Promise.all([
            organizationsRepository.create(org),
            membershipsRepository.create(membership),
            membershipsRepository.create(newMembership),
            usersRepository.create(inviter),
            usersRepository.create(invitedUser)
        ])

        await expect(
            sut.execute({
                role: Role.MANAGER,
                orgId,
                inviterId,
                invitedUserId
            })
        ).rejects.toThrow()

    })

})