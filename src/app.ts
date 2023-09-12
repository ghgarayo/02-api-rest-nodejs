import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'
import { showMethodAndRoute } from './middlewares/show-method-and-route'

export const app = fastify()

app.register(cookie)
app.addHook('preHandler', showMethodAndRoute)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
