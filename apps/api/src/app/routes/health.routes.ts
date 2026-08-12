import { FastifyInstance, FastifyPluginAsync } from "fastify";

interface HealthRouteResponse {
    status: "ok";
    service: "lumina-api";
    version: string;
}

export const healthRoutes: FastifyPluginAsync = async (app) => {
    app.get('/health', (): HealthRouteResponse => {
        return {
            status: "ok",
            service: "lumina-api",
            version: "0.0.0"
        }
    })
}
