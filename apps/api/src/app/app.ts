import fastify from "fastify"
import { healthRoutes } from "./routes/health.routes.js"

export function buildApp() {
    const app = fastify({ logger: true })

    app.register(healthRoutes)

    return app
}