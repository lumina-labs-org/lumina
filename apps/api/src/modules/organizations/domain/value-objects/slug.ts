export class Slug {
    private readonly value: string;
    constructor(value: string) {
        this.value = this.format(value);
        this.validate();
    }

    private format(text: string) {

        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")      // Substitui espaços por hífen
    }

    private validate() {
        if (!this.value) {
            throw new Error("Slug não pode ser vazio.")
        }
    }

    toString(): string {
        return this.value
    }

    public equals(other: Slug): boolean {
        return this.value === other.value
    }

}