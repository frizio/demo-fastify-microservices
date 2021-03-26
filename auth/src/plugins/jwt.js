const fp = require(‘fastify-plugin’)
const JWT = require(‘fastify-jwt’)

module.exports = fp( 
  async (fastify, opts) => {
    let jwtOpts = Object.assign(
      {}, 
      {
        secret: process.env.JWT_SECRET || ‘Th1s1sY0ur53cr3t’
      }, 
      opts.jwt
    )
    fastify.register(JWT, jwtOpts)
  }
)


/*
Per queste linee di codice utilizziamo fastify-jwt 
che decora l' istanza fastify con i metodi standard di jsonwebtokens ossia decode, sign, e verify. 
Inoltre saranno disponibili anche i metodi request.jwtVerify e reply.jwtSign.
*/
