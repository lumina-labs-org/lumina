import { eq, ilike, inArray, or } from "drizzle-orm";

import { UniqueEntityId } from "../../../../../shared/domain/entities/unique-entity-id.js";
import { db } from "../../../../../shared/infrastructure/database/connection.js";
import type { DatabaseExecutor } from "../../../../../shared/infrastructure/database/database-executor.js";
import { DrizzleUserMapper } from "../../../../../shared/infrastructure/database/mappers/drizzle-user-mapper.js";
import { usersTable } from "../../../../../shared/infrastructure/database/schemas/users.js";
import { User } from "../../../domain/entities/user.entity.js";
import { UsersRepository } from "../users.repository.js";

export class DrizzleUsersRepository implements UsersRepository {
  constructor(private readonly database: DatabaseExecutor = db) {}

  async create(user: User): Promise<void> {
    await this.database
      .insert(usersTable)
      .values(DrizzleUserMapper.toPersistence(user));
  }

  async findById(id: UniqueEntityId): Promise<User | null> {
    const [row] = await this.database
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id.toString()))
      .limit(1);

    return row ? DrizzleUserMapper.toDomain(row) : null;
  }

  async findByManyId(ids: UniqueEntityId[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.database
      .select()
      .from(usersTable)
      .where(
        inArray(
          usersTable.id,
          ids.map((id) => id.toString()),
        ),
      );

    return rows.map(DrizzleUserMapper.toDomain);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await this.database
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return row ? DrizzleUserMapper.toDomain(row) : null;
  }

  async findAll(query?: string): Promise<User[]> {
    const search = query?.trim();

    const rows = await this.database
      .select()
      .from(usersTable)
      .where(
        search
          ? or(
              ilike(usersTable.email, `%${search}%`),
              ilike(usersTable.name, `%${search}%`),
            )
          : undefined,
      );

    return rows.map(DrizzleUserMapper.toDomain);
  }
}
