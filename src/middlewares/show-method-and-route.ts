import { FastifyRequest } from 'fastify'

export async function showMethodAndRoute(request: FastifyRequest) {
  console.log(`[${request.method}] ${request.url}`)
}
