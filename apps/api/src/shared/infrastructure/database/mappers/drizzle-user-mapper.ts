import { User } from "../../../../modules/organizations/domain/entities/user.entity.js"
import { UniqueEntityId } from "../../../domain/entities/unique-entity-id.js"
import { usersTable } from "../schemas/users.js"

type UserRow = typeof usersTable.$inferSelect

type NewUserRow = typeof usersTable.$inferInsert

export class DrizzleUserMapper {
  static toPersistence(user: User): NewUserRow {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  static toDomain(row: UserRow): User {
    return User.restore(
      {
        name: row.name,
        email: row.email,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      new UniqueEntityId(row.id),
    )
  }
}
