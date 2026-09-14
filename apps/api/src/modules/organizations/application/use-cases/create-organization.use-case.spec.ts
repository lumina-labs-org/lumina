import type { TransactionContext, TransactionManager } from "../../../../shared/application/transactions/transaction-manager.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js";
import { InMemoryOrganizationsRepository } from "../repositories/in-memory/in-memory-organizations.repository.js";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users.repository.js";
import { CreateOrganizationUseCase } from "./create-organization.use-case.js";
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Role, Status } from "../../domain/enums/memberships.enums.js";
import { User } from "../../domain/entities/user.entity.js";

let organizationsRepository: InMemoryOrganizationsRepository
let membershipsRepository: InMemoryMembershipsRepository
let usersRepository: InMemoryUsersRepository
let transactionManager: TransactionManager
let sut: CreateOrganizationUseCase

describe("Create Organization Use Case", () => {

    beforeEach(() => {
        organizationsRepository = new InMemoryOrganizationsRepository()
        membershipsRepository = new InMemoryMembershipsRepository()
        usersRepository = new InMemoryUsersRepository()
        transactionManager = {
            async execute<T>(callback: (context: TransactionContext) => Promise<T>): Promise<T> {
                return callback({ organizationsRepository, membershipsRepository })
            },
        }
        vi.spyOn(transactionManager, "execute")
        sut = new CreateOrganizationUseCase(organizationsRepository, membershipsRepository, usersRepository, transactionManager)
    })

    it("should create an organization with its owner membership", async () => {
        const user = User.create({ name: "Pedro Marques", email: "pedro@example.com" })
        const userId = user.id
        await usersRepository.create(user)

        await sut.execute({
            name: "Pedro Marques Enterprises",
            userId
        })

        const organization = organizationsRepository.items[0]
        const membership = membershipsRepository.items[0]

        expect(organization.slug.toString()).toEqual("pedro-marques-enterprises")
        expect(membership.role).toBe(Role.OWNER)
        expect(membership.status).toBe(Status.ACTIVE)
        expect(organizationsRepository.items).toHaveLength(1)
        expect(membershipsRepository.items).toHaveLength(1)
        expect(userId.equals(membership.userId)).toBe(true)
        expect(organization.id.equals(membership.organizationId)).toBe(true)
    })

    it("should create the organization and owner using the transaction repositories", async () => {
        const transactionalOrganizations = new InMemoryOrganizationsRepository()
        const transactionalMemberships = new InMemoryMembershipsRepository()
        vi.mocked(transactionManager.execute).mockImplementation(async (callback) => {
            return callback({
                organizationsRepository: transactionalOrganizations,
                membershipsRepository: transactionalMemberships,
            })
        })
        const findBySlug = vi.spyOn(organizationsRepository, "findBySlug")
        const user = User.create({ name: "Pedro Marques", email: "pedro@example.com" })
        const userId = user.id
        await usersRepository.create(user)

        const { org } = await sut.execute({ name: "Transactional Organization", userId })

        expect(findBySlug).toHaveBeenCalledWith(org.slug)
        expect(transactionManager.execute).toHaveBeenCalledTimes(1)
        expect(organizationsRepository.items).toHaveLength(0)
        expect(membershipsRepository.items).toHaveLength(0)
        expect(transactionalOrganizations.items).toEqual([org])
        expect(transactionalMemberships.items).toHaveLength(1)
        const owner = transactionalMemberships.items[0]
        expect(owner.role).toBe(Role.OWNER)
        expect(owner.status).toBe(Status.ACTIVE)
        expect(owner.userId.equals(userId)).toBe(true)
        expect(owner.organizationId.equals(org.id)).toBe(true)
    })

    it("should propagate transaction failures", async () => {
        const error = new Error("Transaction failed")
        vi.mocked(transactionManager.execute).mockRejectedValueOnce(error)
        const user = User.create({ name: "Pedro Marques", email: "pedro@example.com" })
        await usersRepository.create(user)

        await expect(sut.execute({ name: "Organization", userId: user.id }))
            .rejects.toBe(error)
        expect(organizationsRepository.items).toHaveLength(0)
        expect(membershipsRepository.items).toHaveLength(0)
    })

    it("should not create an organization with an existing slug", async () => {
        const user = User.create({ name: "Pedro Marques", email: "pedro@example.com" })
        const userId = user.id
        await usersRepository.create(user)

        await sut.execute({
            name: "Pedro Marques Enterprises",
            userId
        })

        vi.mocked(transactionManager.execute).mockClear()

        await expect(
            sut.execute({
                name: "Pedro Marques Enterprises",
                userId,
            })
        ).rejects.toThrow()

        expect(transactionManager.execute).not.toHaveBeenCalled()

        expect(organizationsRepository.items).toHaveLength(1)
        expect(membershipsRepository.items).toHaveLength(1)
    })

    it("should not create an organization for a user that does not exist", async () => {
        await expect(
            sut.execute({
                name: "Pedro Marques Enterprises",
                userId: new UniqueEntityId(),
            }),
        ).rejects.toThrow("User not found")

        expect(transactionManager.execute).not.toHaveBeenCalled()
        expect(organizationsRepository.items).toHaveLength(0)
        expect(membershipsRepository.items).toHaveLength(0)
    })
})
