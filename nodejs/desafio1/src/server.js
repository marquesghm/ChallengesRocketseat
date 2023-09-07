import http from 'node:http'
import { routes } from './routes.js'
import { json } from './midlewares/json.js'

const server = http.createServer(async (req, res) => {
  await json(req, res) //feed body

  const route = routes.find(route => 
    route.method === req.method && route.path === req.url
  )

  if(route){
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)