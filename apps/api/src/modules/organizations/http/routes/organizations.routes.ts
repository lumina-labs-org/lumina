import { FastifyPluginAsync } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod/v4"

import { makeCreateOrganizationController } from "../../../../app/factories/make-create-organization-controller.js"

import { makeGetOrganizationByIdController } from "../../../../app/factories/make-get-organization-by-id-controller.js"
import { makeListOrganizationMembersController } from "../../../../app/factories/make-list-organization-members.js"
import { makeListUsersOrganizationsController } from "../../../../app/factories/make-list-users-organization-controller.js"
import { createOrganizationBodySchema } from "../schemas/create-organization.schema.js"
import { inviteMemberBodySchema } from "../schemas/invite-member.schema.js"
import { Role, Status } from "../../domain/enums/memberships.enums.js"
import { makeInviteMemberController } from "../../../../app/factories/make-invite-member-controller.js"

export const organizationsRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>()

  const createOrganizationController =
    makeCreateOrganizationController()
  const listUsersOrganizationController = makeListUsersOrganizationsController()
  const getOrganizationByIdController = makeGetOrganizationByIdController()
  const listOrganizationMembersController = makeListOrganizationMembersController()
  const inviteMemberController = makeInviteMemberController()

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
              userId: z.string(),
            }),
          }),
        },
      },
    },

    async (request, reply) => {
      return createOrganizationController.handle(request, reply)
    },
  )

  server.get(
    "/organizations",
    {
      schema: {
        tags: ["Organizations"],
        summary: "List all organizations of a user",

        querystring: z.object({
          userId: z.string(),
        }),

        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),
              role: z.enum(["OWNER", "MEMBER", "MANAGER"]),
            }),
          ),
        },
      },
    },

    async (request, reply) => {
      return listUsersOrganizationController.handle(request, reply)
    },
  )

  server.get(
    "/organizations/:id",
    {
      schema: {
        tags: ["Organizations"],
        summary: "Get an organization by ID",

        params: z.object({
          id: z.string(),
        }),

        response: {
          200: z.object({
            organization: z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),

            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },

    async (request, reply) => {
      return getOrganizationByIdController.handle(request, reply)
    }
  )

  server.get(
    "/organizations/:id/members",
    {
      schema: {
        tags: ["Organizations"],
        summary: "List all members of an organization",

        params: z.object({
          id: z.string(),
        }),

        response: {
          200: z.array(
            z.object({
              id: z.string(),
              status: z.enum(["PENDING", "ACTIVE", "DECLINED", "REVOKED"]),
              role: z.enum(["OWNER", "MEMBER", "MANAGER"]),
            }),
          ),
        },
      },
    },

    async (request, reply) => {
      return listOrganizationMembersController.handle(request, reply)
    }
  )

  server.post(
    "/organizations/:id/invitations",
    {
      schema: {
        title: "Invite a member from Organization",
        params: z.object({
          id: z.string()
        }),
        body: inviteMemberBodySchema,
        response: {
          200: z.object({
            membership: z.object(
              {
                id: z.string(),
                userId: z.string(),
                role: z.enum(["MANAGER", "MEMBER"]),
                status: z.enum(Status)
              }
            )
          })
        }
      }
    },

    async (request, reply) => {
      return inviteMemberController.handle(request, reply)
    }
  )
}