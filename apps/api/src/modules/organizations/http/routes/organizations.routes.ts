import { FastifyPluginAsync } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod/v4"

import { makeCreateOrganizationController } from "../../../../app/factories/make-create-organization-controller.js"

import { createOrganizationBodySchema } from "../schemas/create-organization.schema.js"

export const organizationsRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>()

  const createOrganizationController =
    makeCreateOrganizationController()

  server.post(
    "/organizations",
    {
      schema: {
        tags: ["Organizations"],
        summary: "Create an organization",

        body: createOrganizationBodySchema,

        response: {
          201: z.object({
            organization: z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),
            }),
          }),
        },
      },
    },

    async (request, reply) => {
      return createOrganizationController.handle(request, reply)
    },
  )
}