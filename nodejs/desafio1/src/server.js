import http from 'node:http'
import { routes } from './routes.js'
import { json } from './midlewares/json.js'
import { extractQueryParams } from './utils/extract-query-path.js'

const server = http.createServer(async (req, res) => {
  await json(req, res) //feed body

  const route = routes.find(route => 
    route.method === req.method && route.path.test(req.url)
  )

  if(route){
    const routeParams = req.url.match(route.path)
    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    console.log('query',req.query)
    console.log('params', req.params)
    console.log('body', req.body)
    console.log('')

    return route.handler(req, res)
  }
  else {
    return res.writeHead(404).end()
  }
})

server.listen(3333)