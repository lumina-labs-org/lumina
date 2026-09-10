import swagger from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import fastify from "fastify"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { membershipsRoutes } from "../modules/organizations/http/routes/memberships.routes.js"
import { organizationsRoutes } from "../modules/organizations/http/routes/organizations.routes.js"
import { errorHandler } from "../shared/http/error-handler.js"
import { healthRoutes } from "./routes/health.routes.js"

export function buildApp() {
    const app = fastify({ logger: true })

    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    app.setErrorHandler(errorHandler)

    app.register(swagger, {
        openapi: {
            openapi: '3.0.3',
            info: {
                title: 'Minha API',
                description: 'Documentação da minha API',
                version: '1.0.0',
            },
            servers: [
                {
                    url: 'http://localhost:3333',
                    description: 'Development',
                },
            ],

        },
        transform: jsonSchemaTransform,
    })



    app.register(healthRoutes)
    app.register(organizationsRoutes, {
        prefix: "/api"
    })

    app.register(membershipsRoutes, {
        prefix: "/api",
    })

    app.register(ScalarApiReference, {
        routePrefix: '/docs',
        configuration: {
            layout: 'modern',
        },
    })


    return app
}