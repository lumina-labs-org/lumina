import type {
  FastifyError,
  FastifyReply,
  FastifyRequest,
} from "fastify"

import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod"

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      statusCode: 400,
      error: "ValidationError",
      message: "Invalid request data.",
      issues: error.validation.map((issue) => ({
        field: issue.instancePath.replace(/^\//, ""),
        message: issue.message,
      })),
    })
  }

  if (isResponseSerializationError(error)) {
    request.log.error(error)

    return reply.status(500).send({
      statusCode: 500,
      error: "InternalServerError",
      message: "Invalid server response.",
    })
  }

  request.log.error(error)

  return reply.status(500).send({
    statusCode: 500,
    error: "InternalServerError",
    message: "An unexpected error occurred.",
  })
}