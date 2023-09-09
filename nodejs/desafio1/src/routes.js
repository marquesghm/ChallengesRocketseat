import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"
import { json } from "./midlewares/json.js"

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
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'), // O : quer dizer que o id vai ser dinamico, ou seja, pode receber qualquer valor
    handler: (req, res) => {
      const updateResult = database.update('tasks', req.params.id, {
        title: req.body.title, 
        description: req.body.description,
      })

      return res.writeHead(200).end(JSON.stringify(updateResult))
    }
  },
] 