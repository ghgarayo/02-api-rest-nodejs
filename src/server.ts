import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import { showMethodAndRoute } from './middlewares/show-method-and-route'

const app = fastify()

app.register(cookie)
// Cria um hook que é executado antes de cada requisição
app.addHook('preHandler', showMethodAndRoute)

app.register(transactionsRoutes, {
  prefix: '/transactions',
})

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`)
})
