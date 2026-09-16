import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";

import { makeListUsersController } from "../../../../app/factories/make-list-users.controller.js";

export const usersRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const listUsersController = makeListUsersController();

  server.get(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "List all users",

        querystring: z.object({
          name: z.string().optional(),
          email: z.string().optional(),
        }),

        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            }),
          ),
        },
      },
    },

    async (request, reply) => {
        console.log(request.query)
      return listUsersController.handle(request, reply);
    },
  );
};
