import { describe, expect, it } from "vitest";
import { Slug } from "./slug.js";


describe("Slug", () => {
    it("should normalize a value into a slug", () => {
        const slug = new Slug("Minha Organização")

        expect(slug.toString()).toBe("minha-organizacao")
    })

    it("should not be able to create a empty slug", () => {

        expect(() => {
            new Slug("")
        }).toThrow()
    })

    it("should not create a slug when normalization results in an empty value", () => {
        expect(() => {
            new Slug("!!!")
        }).toThrow()
    })

    it("should consider slugs with the same value equal", () => {
        const first = new Slug("Minha Organização")
        const second = new Slug("minha-organizacao")
    

        expect(first.equals(second)).toBe(true)
    })

    it("should consider slugs with the differents value", () => {
        const first = new Slug("Minha Organização")
        const second = new Slug("Outra Organização")
    

        expect(first.equals(second)).toBe(false)
    })
})