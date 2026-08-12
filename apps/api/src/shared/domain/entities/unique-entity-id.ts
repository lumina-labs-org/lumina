import { randomUUID } from "node:crypto";

export class UniqueEntityId {
    private readonly value: string;

    constructor(value?: string) {
        this.value = value ?? randomUUID()
    }

    public toString() { return this.value }

    public equals(other: UniqueEntityId): boolean {
        return this.value === other.value
    }
}