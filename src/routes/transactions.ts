import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/summary', async () => {
    const summary = await knex('transactions').sum('amount', {
      as: 'amount',
    })

    return {
      summary,
    }
  })

  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return {
      transactions,
    }
  })

  app.get('/:id', async (request) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)
    const transaction = await knex('transactions')
      .where({ id })
      .select('*')
      .first()

    return {
      transaction,
    }
  })

  app.post('/', async (request, reply) => {
    const createTransationBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const body = createTransationBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title: body.title,
      amount: body.type === 'credit' ? body.amount : body.amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
