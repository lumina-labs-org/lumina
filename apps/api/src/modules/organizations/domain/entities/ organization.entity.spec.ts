import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { Organization } from "./organization.entity.js";




describe("Organization", () => {

    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should create a organization", () => {
        const org = Organization.create({
            name: "Pedro Marques Enterprises",
        })

        expect(org.name).toBe("Pedro Marques Enterprises")
        expect(org.slug.toString()).toBe("pedro-marques-enterprises")
    })

    it('should have public contact information', () => {
        const org = Organization.create({
            name: "Pedro Marques Enterprises",
            contactEmail: 'pedro@example.com',
            contactPhone: "71993521604"
        })

        expect(org.hasPublicContactInformation()).toBe(true)
    })

    it('should not have public contact information when contact data is incomplete', () => {
        const incompleteContacts = [
            { contactEmail: null, contactPhone: null },
            { contactEmail: "contact@org.com", contactPhone: null },
            { contactEmail: null, contactPhone: "11999999999" },
        ]

        incompleteContacts.forEach(({ contactEmail, contactPhone }) => {
            const org = Organization.create({
                name: 'Empresa LTDA',
                contactEmail,
                contactPhone
            })

            expect(org.hasPublicContactInformation()).toBe(false)
        })
    })

    it('should be rename the organization name', () => {

        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const org = Organization.create({
            name: "Pedro Marques Enterprises",
        })

        vi.setSystemTime(updatedAt)

        org.rename("Pedro")

        expect(org.name).toBe("Pedro")
        expect(org.updatedAt).toEqual(updatedAt)
    })

    it('should not be rename the organization with same name', () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const org = Organization.create({
            name: "Pedro Marques Enterprises",
        })

        const originalUpdatedAt = org.updatedAt

        vi.setSystemTime(updatedAt)

        org.rename("Pedro Marques Enterprises")

        expect(org.name).toBe("Pedro Marques Enterprises")
        expect(org.updatedAt).toEqual(originalUpdatedAt)
    })


    it('should be change the organization email', () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const org = Organization.create({
            name: "Pedro Marques Enterprises",
            contactEmail: "pedro@example.com"
        })

        vi.setSystemTime(updatedAt)

        org.changeContactEmail("pedro2@example.com")

        expect(org.contactEmail).toBe("pedro2@example.com")
        expect(org.updatedAt).toEqual(updatedAt)
    })

    it('should not be change the organization email with same value', () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const org = Organization.create({
            name: "Pedro Marques Enterprises",
            contactEmail: "pedro@example.com"
        })

        const originalUpdatedAt = org.updatedAt

        vi.setSystemTime(updatedAt)

        org.changeContactEmail("pedro@example.com")

        expect(org.contactEmail).toBe("pedro@example.com")
        expect(org.updatedAt).toEqual(originalUpdatedAt)
    })


    it('should be change the organization phone', () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const org = Organization.create({
            name: "Pedro Marques Enterprises",
            contactPhone: "71993521604"
        })

        vi.setSystemTime(updatedAt)

        org.changeContactPhone("71 999999999")

        expect(org.contactPhone).toBe("71 999999999")
        expect(org.updatedAt).toEqual(updatedAt)
    })

    it('should not be change the organization phone with same value', () => {
        const createdAt = new Date("2026-08-08T10:00:00.000Z")
        const updatedAt = new Date("2026-08-08T11:00:00.000Z")

        vi.setSystemTime(createdAt)

        const org = Organization.create({
            name: "Pedro Marques Enterprises",
            contactPhone: "71993521604"
        })

        const originalUpdatedAt = org.updatedAt

        vi.setSystemTime(updatedAt)

        org.changeContactPhone("71993521604")

        expect(org.contactPhone).toBe("71993521604")
        expect(org.updatedAt).toEqual(originalUpdatedAt)
    })

    it("should be not create a organization with empty name", () => {

        expect(() => {
            Organization.create({
                name: "",
            })
        }).toThrow()


    })

      it("should be not rename a organization with empty name", () => {
        const org = Organization.create({
            name: "Empresa"
        })

        expect(() => {
           org.rename("")
        }).toThrow()


    })

})

