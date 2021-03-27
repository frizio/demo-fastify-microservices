const securePassword = require('secure-password')
const S = require('fluent-schema')

const DUPLICATE_KEY_ERROR = 11000

module.exports = async function (fastify, opts) {

  const users = fastify.mongo.db.collection('users')
  
  const pwd = securePassword()
  
  users.createIndex(
    {username: 1}, 
    {unique: true}
  )

  // Consente la registrazione di un utente
  fastify.post(
    '/signup', 
    { 
      schema: {
        body: S.object().prop('username', S.string().maxLength(10).required())
                        .prop('password', S.string().required())
                        .prop('fullName', S.string().maxLength(50).required()),
        response: {
          200: 
            S.object().prop('token', S.string()),
          400: 
            S.object().prop('message', S.string())
        }
      }
    }, 
    async function (request, reply) {
      const { fullName, username, password } = request.body
      const hashedPassword = await pwd.hash(Buffer.from(password))
      try {
        await users.insertOne({
          'fullName': fullName,
          'username': username,
          'password': hashedPassword
        })
      } catch (err) {
        // duplicate key error
        if (err.code === DUPLICATE_KEY_ERROR) {
          return reply.code(400).send( {message: 'username already registered'} )
        }
      }
      const token = await reply.jwtSign( {username: username, fullName: user.fullName} )
      return {token: token}
    }
  ) // fastify.post('/signup',...

  // Consente ad un utente di effettuare il login
  fastify.post(
    '/signin',  // 1
    {           // 2
      schema: {
        body: S.object().prop('username', S.string().required())
                        .prop('password', S.string().required()),
        response: {
          200: 
            S.object().prop('token', S.string()),
          404: 
            S.object().prop('message', S.string()),
          400: 
            S.object().prop('message', S.string())
        }
      }
    }, 
    async function (request, reply) {   // 3
      const { username, password } = request.body
      const user = await users.findOne( {username: username} )
      if (!user) {
        reply.code(404).send( {message: 'username not found'} )
      return
      }
      const res = await pwd.verify(Buffer.from(password), user.password.buffer)
      switch (res) {
        case securePassword.INVALID_UNRECOGNIZED_HASH:
         reply.code(400).send( {message: 'This hash was not made with secure-password. Attempt legacy algorithm'} )
         return
        case securePassword.INVALID:
          reply.code(400).send( {message: 'Invalid password'} )
          return
        case securePassword.VALID_NEEDS_REHASH:
          const hashedPassword = await pwd.hash(Buffer.from(password))
          await users.update( { _id: user._id }, { hashedPassword } )
          break
    }
    const token = await reply.jwtSign( {username: username, fullName: user.fullName} )
    return {token: token}
    }
  ) // fastify.post('/signin',...

} // module.exports


/*
Nel momento in cui l’operazione di autenticazione o registrazione è andata a buon fine,
il microservizio restituisce un token utilizzato per invocare gli altri servizi.
*/
