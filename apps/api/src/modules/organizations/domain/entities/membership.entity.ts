import { MembershipRole, MembershipStatus, Role, Status } from '../enums/memberships.enums.js';
import { UniqueEntityId } from "../../../../shared/domain/entities/unique-entity-id.js";


interface MembershipProps {
    role: MembershipRole
    userId: UniqueEntityId
    organizationId: UniqueEntityId
    status: MembershipStatus
    createdAt: Date;
    updatedAt: Date;
}

interface CreateOwnerMembershipProps {
    userId: UniqueEntityId
    organizationId: UniqueEntityId
}

type InviteMembershipRole =
    Exclude<MembershipRole, typeof Role.OWNER>

interface CreateInviteMembershipProps {
    userId: UniqueEntityId
    organizationId: UniqueEntityId
    role: InviteMembershipRole
}

export class Membership {
    private readonly _id: UniqueEntityId;
    private _role: MembershipRole
    private readonly _userId: UniqueEntityId
    private readonly _organizationId: UniqueEntityId
    private _status: MembershipStatus
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: MembershipProps, id?: UniqueEntityId) {
        this._id = id ?? new UniqueEntityId();
        this._role = props.role
        this._userId = props.userId
        this._organizationId = props.organizationId
        this._status = props.status
        this._createdAt = props.createdAt
        this._updatedAt = props.updatedAt
    }

    public get id(): UniqueEntityId { return this._id }

    public get role(): MembershipRole { return this._role }

    public get status(): MembershipStatus { return this._status }

    public get userId(): UniqueEntityId { return this._userId }

    public get organizationId(): UniqueEntityId { return this._organizationId }

    public get createdAt(): Date { return this._createdAt }

    public get updatedAt(): Date { return this._updatedAt }


    private touch() {
        this._updatedAt = new Date()
    }

    public accept(): void {
        if (this._status !== Status.PENDING) {
            throw new Error("Only pending memberships can be accepted.")
        }

        this._status = Status.ACTIVE
        this.touch()
    }

    public decline(): void {
        if (this._status !== Status.PENDING) {
            throw new Error("Only pending memberships can be accepted.")
        }

        this._status = Status.DECLINED
        this.touch()
    }


    public revoke(): void {
        if (this._status !== Status.PENDING) {
            throw new Error("Only pending memberships can be accepted.")
        }

        this._status = Status.REVOKED
        this.touch()
    }

    public changeRole(newRole: MembershipRole): void {
        if (this._role === newRole) return

        if (this._status !== Status.ACTIVE) {
            throw new Error("Only active memberships can have their role changed")
        }

        this._role = newRole
        this.touch()
    }

    public static createOwner(owner: CreateOwnerMembershipProps): Membership {
        const now = new Date()
        const memberShip = new Membership({
            ...owner,
            role: Role.OWNER,
            status: Status.ACTIVE,
            createdAt: now,
            updatedAt: now
        })

        return memberShip;
    }

    public static createInvite(member: CreateInviteMembershipProps): Membership {

        const now = new Date()
        const memberShip = new Membership({
            ...member,
            status: Status.PENDING,
            createdAt: now,
            updatedAt: now
        })

        return memberShip;
    }


}