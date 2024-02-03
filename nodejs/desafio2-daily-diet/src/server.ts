import fastify from 'fastify'
import { env } from './env'
import { entriesRoutes } from './routes/entries'

const app = fastify()

app.register(entriesRoutes)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server Running...')
  })
