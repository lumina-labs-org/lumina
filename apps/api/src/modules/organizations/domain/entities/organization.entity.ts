import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";
import { Slug } from "../value-objects/slug.js";

interface OrganizationProps {
    name: string;
    slug: Slug;
    contactEmail: string | null;
    contactPhone: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateOrganizationProps {
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
}

export class Organization {
    private readonly _id: UniqueEntityId;
    private _name: string;
    private _slug: Slug;
    private _contactEmail: string | null;
    private _contactPhone: string | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: OrganizationProps, id?: UniqueEntityId) {
        this._id = id ?? new UniqueEntityId();
        this._name = props.name
        this._slug = props.slug
        this._contactEmail = props.contactEmail
        this._contactPhone = props.contactPhone


        const now = new Date()
        this._createdAt = props.createdAt ?? now
        this._updatedAt = props.updatedAt ?? now
    }

    public get id(): UniqueEntityId { return this._id }

    public get name(): string { return this._name }

    public get slug(): Slug { return this._slug }

    public get contactEmail(): string | null { return this._contactEmail }

    public get contactPhone(): string | null { return this._contactPhone }

    public get createdAt(): Date { return this._createdAt }

    public get updatedAt(): Date { return this._updatedAt }


    public rename(name: string): void {
        if (name === this._name) return;
        
        Organization.validateName(name)

        this._name = name
        this.touch()
    }

    public changeSlug(slug: Slug): void {
        if (this._slug.equals(slug)) return
        this._slug = slug
        this.touch()
    }

    public changeContactEmail(contactEmail: string | null): void {
        if (contactEmail === this._contactEmail) return
        this._contactEmail = contactEmail
        this.touch()
    }

    public changeContactPhone(contactPhone: string | null): void {
        if (contactPhone === this._contactPhone) return
        this._contactPhone = contactPhone
        this.touch()
    }

    public hasPublicContactInformation(): boolean { return Boolean(this._contactEmail && this._contactPhone) }

    private touch() {
        this._updatedAt = new Date()
    }

    public static create(
        props: CreateOrganizationProps,
        id?: UniqueEntityId,
    ): Organization {
        const now = new Date()

        Organization.validateName(props.name)

        return new Organization(
            {
                name: props.name,
                slug: new Slug(props.name),
                contactEmail: props.contactEmail ?? null,
                contactPhone: props.contactPhone ?? null,
                createdAt: now,
                updatedAt: now,
            },
            id,
        )
    }

    private static validateName(name: string): void {
        if (name.trim().length === 0) {
            throw new Error("Organization name cannot be empty.")
        }
    }

}