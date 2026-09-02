import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"
import { User } from "../../domain/entities/user.entity.js"

export interface UsersRepository {
    create(user: User): Promise<void>
    findById(id: UniqueEntityId): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
}