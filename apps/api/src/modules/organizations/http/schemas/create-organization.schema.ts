
import { z } from "zod"

export const createOrganizationBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organization name is required."),
})


export type CreateOrganizationBody  = z.infer<typeof createOrganizationBodySchema>