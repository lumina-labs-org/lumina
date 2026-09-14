import type {
  FastifyError,
  FastifyReply,
  FastifyRequest,
} from "fastify"

import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod"

const applicationErrorStatusByMessage = new Map<string, number>([
  ["Organization not found", 404],
  ["User not found", 404],
  ["Membership not found", 404],

  ["Org slug already exists!", 409],
  ["The invited user already be in the Organization", 409],

  ["Inviter not found", 403],
  ["This Membership hasn`t permission by invite", 403],
  ["Managers can only invite members.", 403],
  ["This user not allowed accept this invite.", 403],
  ["This user not allowed decline this invite.", 403],
  ["User does not belong to this organization", 403],
  ["User is not allowed to revoke this invite", 403],
  ["Actor does not belong to this organization", 403],
  ["Only active members can change roles", 403],
  ["Members cannot change roles", 403],
  ["Membership does not belong to this organization", 403],
  ["Managers can only change members", 403],
  ["Managers cannot promote members to owner", 403],
])

const errorNameByStatus = new Map<number, string>([
  [403, "Forbidden"],
  [404, "NotFound"],
  [409, "Conflict"],
])

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

  const statusCode = applicationErrorStatusByMessage.get(error.message)

  if (statusCode) {
    return reply.status(statusCode).send({
      statusCode,
      error: errorNameByStatus.get(statusCode),
      message: error.message,
    })
  }

  request.log.error(error)

  return reply.status(500).send({
    statusCode: 500,
    error: "InternalServerError",
    message: "An unexpected error occurred.",
  })
}
