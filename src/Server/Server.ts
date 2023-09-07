import Fastify, { FastifyRequest } from 'fastify'
import fastifyCookie from 'fastify-cookie'
import fastifyCors from 'fastify-cors'
import Mercurius from 'mercurius'
import Prisma from '@prisma/client'
import UserValidation from '../User/UserValidation.js'
import { Schema as schema } from './Schema.js'
import { Resolvers as resolvers } from './Resolvers.js'

const { PrismaClient } = Prisma,
      Server = Fastify(),
      Conn = new PrismaClient()

let Authenticate: Promise<UserValidation>,
    Authenticated: UserValidation

Server.register(fastifyCookie)

Server.register(fastifyCors, {
  origin: true
})

Server.addHook('preValidation', async function (Req, Rep) {
  Authenticate = new UserValidation().authenticateUser(Req.cookies.AccessToken, Req.cookies.RefreshToken, Rep)
  await Authenticate.then((Authenticate) => {
      Authenticated = Authenticate
  })
  if (Authenticated.Error) {
    if (Req.body.query.includes('createUser') || Req.body.query.includes('loginUser')) return
    Rep.code(401)
    Rep.send( { data: { __typename: 'Error', Message: Authenticated.getError() }})
  }
  if (await Authenticated.Success) {
    if (Req.body.query.includes('createUser') || Req.body.query.includes('loginUser')) {
      Rep.code(401)
      Rep.send( { data: { __typename: 'Error', Message: 'You are already logged in' }})
      return
    }
    Authenticated = Authenticated.getSuccess()
    return
  }
  // console.log(Req)
  // Rep.code(401)
  // Rep.send( { data: { __typename: 'Error', Message: 'Login Again' }})
  // console.log('preExecution called')
  // let Authenticated = new UserValidation().authenticateUser(Req.cookies.AccessToken, Req.cookies.RefreshToken)
  // await Authenticated.then((Authenticate) => {
  //   Authenticated = Authenticate
  // })
  // if (Authenticated.Error) 
  // return { __typename: 'Error', Message: Authenticated.getError() }
  // console.log(Authenticate)
})

Server.register(Mercurius, {
  schema,
  resolvers,
  path: '/api',
  context: (Req, Rep) => ({ Conn, Req, Rep, Authenticated })
})

// await Server.ready()

// Server.graphql.addHook('preExecution', function (Schema, Document, { Req, Rep }) {
//   Rep.code(401)
//   Rep.send({ __typename: 'Error', Message: 'Login Again' })
//   return
//   console.log('preExecution called')
//     return {
//       Document,
//       data: [
//         new Error('foo')
//       ]
//     }
//   // let Authenticated = new UserValidation().authenticateUser(Req.cookies.AccessToken, Req.cookies.RefreshToken)
//   // await Authenticated.then((Authenticate) => {
//   //   Authenticated = Authenticate
//   // })
//   // if (Authenticated.Error) 
//   // return { __typename: 'Error', Message: Authenticated.getError() }
//   // console.log(Authenticate)
// })

Server.listen(3001)
console.log(`Server listening!`)