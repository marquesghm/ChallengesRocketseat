import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    entries: {
      meal_id: string
      meal_name: string
      description?: string
      date?: Date
      stillInDiet: boolean
      created_at: string
    }
  }
}
