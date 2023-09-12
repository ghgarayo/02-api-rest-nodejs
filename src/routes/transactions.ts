import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

// middlewares
import { checkIfSessionIdExists } from '../middlewares/check-if-session-id-exists'

/*
    ===== Piramide de testes =====: 

    Unitários: unidade da aplicação
    Integração: comunicação entre duas ou mais unidades  
    e2e - ponta à ponta: simulam um usário oprando na nossa aplicação (não dependem de nenhuma tecnologia, nao dependem de arquitetura de software )

*/

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkIfSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return {
        transactions,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkIfSessionIdExists],
    },
    async (request) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionsParamsSchema.parse(request.params)
      const transaction = await knex('transactions')
        .where({
          session_id: request.cookies.sessionId,
          id,
        })
        .select('*')
        .first()

      return {
        transaction,
      }
    },
  )

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const body = createTransactionBodySchema.parse(request.body)

    let { sessionId } = request.cookies

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
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

  app.get(
    '/summary',
    {
      preHandler: [checkIfSessionIdExists],
    },
    async (request) => {
      const summary = await knex('transactions')
        .where({
          session_id: request.cookies.sessionId,
        })
        .sum('amount', {
          as: 'amount',
        })

      return {
        summary,
      }
    },
  )
}
