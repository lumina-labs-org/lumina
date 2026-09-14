
import { z } from "zod"

export const createOrganizationBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organization name is required."),
  userId: z.uuid("User ID must be a valid UUID."),
})


export type CreateOrganizationBody  = z.infer<typeof createOrganizationBodySchema>
