import { z } from "zod"
import { Role } from "../../domain/enums/memberships.enums.js"
    
    export const inviteMemberBodySchema = z.object({
        inviterId: z.uuid(),
      invitedUserId: z.uuid(),
      role: z.enum([Role.MANAGER, Role.MEMBER])
    })
    
    
    export type InviteMemberBody  = z.infer<typeof inviteMemberBodySchema>