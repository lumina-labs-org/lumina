import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js"

interface UserProps {
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

interface CreateUserProps {
  name: string
  email: string
}

export class User {
  private readonly _id: UniqueEntityId
  private _name: string
  private _email: string
  private readonly _createdAt: Date
  private _updatedAt: Date

  private constructor(
    props: UserProps,
    id?: UniqueEntityId,
  ) {
    this._id = id ?? new UniqueEntityId()
    this._name = props.name
    this._email = props.email
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  public get id(): UniqueEntityId {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get email(): string {
    return this._email
  }

  public get createdAt(): Date {
    return this._createdAt
  }

  public get updatedAt(): Date {
    return this._updatedAt
  }

  public static create(
    props: CreateUserProps,
    id?: UniqueEntityId,
  ): User {
    if (!props.name) {
      throw new Error("User name cannot be empty.")
    }

    if (!props.email) {
      throw new Error("User email cannot be empty.")
    }

    const now = new Date()

    return new User(
      {
        name: props.name,
        email: props.email,
        createdAt: now,
        updatedAt: now,
      },
      id,
    )
  }
}