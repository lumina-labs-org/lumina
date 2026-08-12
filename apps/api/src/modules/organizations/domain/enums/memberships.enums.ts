export const Role = {
    OWNER: "OWNER",
    MANAGER: "MANAGER",
    MEMBER: "MEMBER"
} as const

export const Status = {
    ACTIVE: "ACTIVE",
    PENDING: "PENDING",
    DECLINED: "DECLINED",
    REVOKED: "REVOKED"
} as const


export type MembershipRole = typeof Role[keyof typeof Role]
export type MembershipStatus = typeof Status[keyof typeof Status]
