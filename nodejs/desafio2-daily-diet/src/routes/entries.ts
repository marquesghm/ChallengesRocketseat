import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'
import { request } from 'node:http'

export async function entriesRoutes(app: FastifyInstance) {
  app.get('/entries', async () => {
    const tables = await knex('entries').select('*')
    return tables
  })

  app.get('/summary', async () => {
    const TMR = await knex('entries')
      .count('*', {
        as: 'TotalMealRegistered',
      })
      .first()
    const TMInD = await knex('entries')
      .count('*', {
        as: 'TotalMealInsideDiet',
      })
      .where('stillInDiet', true)
      .first()
    const TMOutD = await knex('entries')
      .count('*', {
        as: 'TotalMealOutsideDiet',
      })
      .where('stillInDiet', false)
      .first()
    const BSInD = await knex('entries').select('*')
    const sequence = []
    for (const [key, entry] of Object.entries(BSInD)) {
      if (entry.stillInDiet) sequence.push(entry)
      else {
        if (sequence.length > 0) break
      }
    }

    const result = {
      ...TMR,
      ...TMInD,
      ...TMOutD,
      BestSequenceInsideDiet: sequence.length,
    }
    return result
  })

  app.get('/entry/:mealId', async (request, reply) => {
    const getEntryParamsSchema = z.object({
      mealId: z.string().uuid(),
    })
    const { mealId } = getEntryParamsSchema.parse(request.params)
    const entry = await knex('entries').where('meal_id', mealId).first()
    return { entry }
  })

  app.post('/new_meal', async (request, reply) => {
    // Valida os valores informados no post
    const createEntryBodySchema = z.object({
      mealName: z.string(),
      description: z.string().optional().default(''),
      date: z.coerce.date().optional().default(new Date('2024-02-03 02:11:06')),
      stillInDiet: z.boolean(),
    })

    const { mealName, description, date, stillInDiet } =
      createEntryBodySchema.parse(request.body)

    const entry = await knex('entries')
      .insert({
        meal_id: crypto.randomUUID(),
        meal_name: mealName,
        description,
        date,
        stillInDiet,
      })
      .returning('*')

    // Recurso criado com sucesso
    return reply.status(201).send(entry)
  })
}
