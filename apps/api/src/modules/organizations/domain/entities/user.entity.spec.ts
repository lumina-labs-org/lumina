import { describe, expect, it } from "vitest"

import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { User } from "./user.entity.js"

describe("User Entity", () => {
  it("should create a user", () => {
    const user = User.create({
      name: "João",
      email: "joao@example.com",
    })

    expect(user.name).toBe("João")
    expect(user.email).toBe("joao@example.com")
    expect(user.id).toBeInstanceOf(UniqueEntityId)
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
  })

  it("should not create a user without a name", () => {
    expect(() => {
      User.create({
        name: "",
        email: "joao@example.com",
      })
    }).toThrow()
  })

  it("should not create a user without an email", () => {
    expect(() => {
      User.create({
        name: "João",
        email: "",
      })
    }).toThrow()
  })
})