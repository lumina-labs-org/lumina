export type Role = "OWNER" | "MANAGER" | "MEMBER"
export type Status = "ACTIVE" | "PENDING"| "DECLINED" | "REVOKED"



export interface Membership {
  id: string;
  role: Role;
  status: Status;
  invitedUser: User;
  invitedByUser: User;
}

export interface OrganizationMembersResponse {
  memberships: Membership[]
}
