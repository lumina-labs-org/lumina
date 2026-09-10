import { FastifyPluginAsync } from "fastify"
import { z } from "zod/v4"
import { makeChangeMemberRoleController } from "../../../../app/factories/make-change-member-role.controller.js"
import { makeRevokeInviteController } from "../../../../app/factories/make-revoke-invite.controller.js"
import { makeDeclineInviteController } from "../../../../app/factories/make-decline-invite.controller.js"
import { makeAcceptInviteController } from "../../../../app/factories/make-accept-invite.controller.js"
import { ZodTypeProvider } from "fastify-type-provider-zod"


export const membershipsRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>()

  const acceptInviteController = makeAcceptInviteController()
  const declineInviteController = makeDeclineInviteController()
  const revokeInviteController = makeRevokeInviteController()
  const changeMemberRoleController = makeChangeMemberRoleController()

  server.post(
    "/memberships/:id/accept",
    {
      schema: {
        tags: ["Memberships"],
        summary: "Accept a membership invitation",

        params: z.object({
          id: z.string(),
        }),

        body: z.object({
          userId: z.string(),
        }),

        response: {
          200: z.object({
            membership: z.object({
              id: z.string(),
              status: z.literal("ACTIVE"),
              role: z.enum(["OWNER", "MANAGER", "MEMBER"]),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      return acceptInviteController.handle(request, reply)
    },
  )

  server.post(
    "/memberships/:id/decline",
    {
      schema: {
        tags: ["Memberships"],
        summary: "Decline a membership invitation",

        params: z.object({
          id: z.string(),
        }),

        body: z.object({
          userId: z.string(),
        }),

        response: {
          200: z.object({
            membership: z.object({
              id: z.string(),
              status: z.literal("DECLINED"),
              role: z.enum(["OWNER", "MANAGER", "MEMBER"]),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      return declineInviteController.handle(request, reply)
    },
  )

   server.delete(
    "/memberships/:id/invitation",
    {
      schema: {
        tags: ["Memberships"],
        summary: "Revoke a membership invitation",

        params: z.object({
          id: z.string(),
        }),

        body: z.object({
          userId: z.string(),
        }),

        response: {
          200: z.object({
            membership: z.object({
              id: z.string(),
              organizationId: z.string(),
              userId: z.string(),
              role: z.enum(["OWNER", "MANAGER", "MEMBER"]),
              status: z.literal("REVOKED"),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      return revokeInviteController.handle(request, reply)
    },
  )

  server.patch(
    "/organizations/:organizationId/memberships/:id/role",
    {
      schema: {
        tags: ["Memberships"],
        summary: "Change a member role",

        params: z.object({
          organizationId: z.string(),
          id: z.string(),
        }),

        body: z.object({
          actorUserId: z.string(),
          role: z.enum(["OWNER", "MANAGER", "MEMBER"]),
        }),

        response: {
          200: z.object({
            membership: z.object({
              id: z.string(),
              organizationId: z.string(),
              userId: z.string(),
              role: z.enum(["OWNER", "MANAGER", "MEMBER"]),
              status: z.enum([
                "PENDING",
                "ACTIVE",
                "DECLINED",
                "REVOKED",
              ]),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      return changeMemberRoleController.handle(request, reply)
    },
  )
}