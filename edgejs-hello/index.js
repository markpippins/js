import { createServer } from 'node:http'
import { Edge } from 'edge.js'

const edge = new Edge()
edge.mount(new URL('./views', import.meta.url))

const server = createServer(async (req, res) => {
  const data = { username: 'Mark' }
  const html = await edge.render('home', data)

  res.setHeader('content-type', 'text/html')
  res.end(html)
})

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001')
})
