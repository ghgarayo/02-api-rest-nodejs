import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // define o schema do body da requisição
    const createTransationBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    // verifica se o body da requisição está de acordo com o schema
    const body = createTransationBodySchema.parse(request.body)

    // insere a transação no banco de dados
    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title: body.title,
      amount: body.type === 'credit' ? body.amount : body.amount * -1,
    })

    return reply.status(201).send()
  })
}
