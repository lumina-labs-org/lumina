import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMembershipsRepository } from "../repositories/in-memory/in-memory-memberships.repository.js";
import { InMemoryOrganizationsRepository } from "../repositories/in-memory/in-memory-organizations.repository.js";
import { CreateOrganizationUseCase } from "./create-organization.use-case.js";
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Role, Status } from "../../domain/enums/memberships.enums.js";

let organizationsRepository: InMemoryOrganizationsRepository
let membershipsRepository: InMemoryMembershipsRepository
let sut: CreateOrganizationUseCase

describe("Create Organization Use Case", () => {

    beforeEach(() => {
        organizationsRepository = new InMemoryOrganizationsRepository()
        membershipsRepository = new InMemoryMembershipsRepository()
        sut = new CreateOrganizationUseCase(organizationsRepository, membershipsRepository)
    })

    it("should create an organization with its owner membership", async () => {
        const userId = new UniqueEntityId()
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
})