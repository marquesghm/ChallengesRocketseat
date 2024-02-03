import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.get('/entries', async () => {
  const tables = await knex('entries').select('*')
  return tables
})

app.get('/add', async () => {
  const entry = await knex('entries')
    .insert({
      meal_id: crypto.randomUUID(),
      meal_name: 'Janta',
      stillInDiet: true,
    })
    .returning('*')
  return entry
})

app.listen({ port: 3000 }).then(() => {
  console.log('Server Running...')
})
