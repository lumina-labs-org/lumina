import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js"
import { User } from "../../../domain/entities/user.entity.js"
import { UsersRepository } from "../users.repository.js"

export class InMemoryUsersRepository implements UsersRepository {

  public items: User[] = []

   async create(user: User): Promise<void> {
      this.items.push(user)
    }

  async findById(id: UniqueEntityId): Promise<User | null> {
     const userExists = this.items.find(item => item.id.equals(id))

      if (!userExists) return null

      return userExists
  }

  async findByEmail(email: string): Promise<User | null> {
      const emailExists = this.items.find(item => item.email === email)

      if (!emailExists) return null

      return emailExists
  }
}