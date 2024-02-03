import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function entriesRoutes(app: FastifyInstance) {
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
}
