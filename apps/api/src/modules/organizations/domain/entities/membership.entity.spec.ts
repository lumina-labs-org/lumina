import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Membership } from "./membership.entity.js";
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Role, Status } from "../enums/memberships.enums.js";

describe("Membership", () => {

    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })


    it("should create an owner membership", () => {
        const organizationId = new UniqueEntityId()
        const userId = new UniqueEntityId()

        const owner = Membership.createOwner({
            organizationId,
            userId
        })
        expect(owner.role).toBe(Role.OWNER)
        expect(owner.status).toBe(Status.ACTIVE)
        expect(owner.organizationId).toBeInstanceOf(UniqueEntityId)
        expect(owner.userId).toBeInstanceOf(UniqueEntityId)
        expect(owner.organizationId.equals(organizationId)).toBe(true)
        expect(owner.userId.equals(userId)).toBe(true)
    })

    it('should create an invite to membership', () => {
        const organizationId = new UniqueEntityId()
        const userId = new UniqueEntityId()


        const membership = Membership.createInvite({
            organizationId,
            userId,
            role: Role.MANAGER
        })


        expect(membership.role).toBe(Role.MANAGER)
        expect(membership.status).toBe(Status.PENDING)
        expect(membership.organizationId).toBeInstanceOf(UniqueEntityId)
        expect(membership.userId).toBeInstanceOf(UniqueEntityId)
        expect(membership.organizationId.equals(organizationId)).toBe(true)
        expect(membership.userId.equals(userId)).toBe(true)
    })

    it("should accept a pending membership", () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const membership = Membership.createInvite({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId(),
            role: Role.MANAGER
        })


        vi.setSystemTime(updatedAt)

        membership.accept()

        expect(membership.status).toBe(Status.ACTIVE)
        expect(membership.updatedAt).toEqual(updatedAt)

    })

    it("should not accept a membership that is not pending", () => {
        const membership = Membership.createOwner({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId(),
        })


        expect(() => membership.accept()).toThrow()

    })

    it("should decline a pending membership", () => {
            const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const membership = Membership.createInvite({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId(),
            role: Role.MANAGER
        })

        vi.setSystemTime(updatedAt)

        membership.decline()

        expect(membership.status).toBe(Status.DECLINED)
        expect(membership.updatedAt).toEqual(updatedAt)

    })

      it("should not decline a membership that`s not pending", () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const membership = Membership.createOwner({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId()
        })

        const originalUpdatedAt = membership.updatedAt
      

        vi.setSystemTime(updatedAt)

        expect(() => membership.decline()).toThrow(Error)
        expect(membership.updatedAt).toEqual(originalUpdatedAt)

    })

     it("should revoke a pending membership", () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const membership = Membership.createInvite({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId(),
            role: Role.MANAGER
        })

        vi.setSystemTime(updatedAt)

        membership.revoke()

        expect(membership.status).toBe(Status.REVOKED)
        expect(membership.updatedAt).toEqual(updatedAt)

    })

      it("should not revoke a membership that`s not pending", () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const membership = Membership.createOwner({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId()
        })

        const originalUpdatedAt = membership.updatedAt
      

        vi.setSystemTime(updatedAt)

        expect(() => membership.revoke()).toThrow()
        expect(membership.updatedAt).toEqual(originalUpdatedAt)

    })


     it("should change a membership role", () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const membership = Membership.createInvite({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId(),
            role: 'MANAGER'
        })

        vi.setSystemTime(updatedAt)

        membership.accept()
        membership.changeRole('MEMBER')

        expect(membership.role).toBe(Role.MEMBER)
        expect(membership.updatedAt).toEqual(updatedAt)

    })

     it("should not change a membership status that`s not be pending", () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const membership = Membership.createInvite({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId(),
            role: 'MANAGER'
        })

        const originalUpdatedAt = membership.updatedAt
      
        vi.setSystemTime(updatedAt)

        expect(() => membership.changeRole('MEMBER')).toThrow()
        expect(membership.updatedAt).toEqual(originalUpdatedAt)
    })

    it("should not update a membership role with same value", () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const membership = Membership.createInvite({
            organizationId: new UniqueEntityId(),
            userId: new UniqueEntityId(),
            role: 'MANAGER'
        })

        const originalUpdatedAt = membership.updatedAt
      
        vi.setSystemTime(updatedAt)

        membership.changeRole('MANAGER')

        expect(membership.updatedAt).toEqual(originalUpdatedAt)

    })

})

