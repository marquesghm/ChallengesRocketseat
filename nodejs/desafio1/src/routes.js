import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const filter = req.query
      const tasks = database.select('tasks', filter)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      // Get current time in ms converted to GMT
      const timestamp = new Date(Date.now()).toString()

      const task = { 
        id: randomUUID(),
        title: req.body.title,
        description: req.body.description,
        completed_at: null,
        created_at: timestamp,
        updated_at: timestamp
      }

      database.insert('tasks', task)

      return res.end("Task created!")
    }
  }
] 