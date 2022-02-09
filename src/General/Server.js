import fastify from 'fastify'

const Server = fastify()

Server.get('/', async (request, reply) => {
  return 'pong\n'
})

Server.listen(3001, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})