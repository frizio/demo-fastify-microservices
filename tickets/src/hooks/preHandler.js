'use strict'

const fp = require('fastify-plugin')

module.exports = fp(
  async (fastify, opts) => {
    fastify.addHook(
      'preHandler', 
      async (request, reply) => {
        return request.jwtVerify()
      }
    )
  }
)

/*
Questo hook controlla:
1. Se la richiesta che stiamo effettuando al microservizio ha un token nell’header della richiesta.
2. Se il token presente nell’header della richiesta è valido.
Nel caso in cui questi controlli vadano a buon fine, 
nell'handler della richiesta (la funzione che gestisce effettivamente la richiesta) 
è possibile accedere ai dati utente attraverso request.user. 
Siccome nella definizione della rotta abbiamo salvato nel nostro token di autenticazione le proprietà username e fullName, 
queste saranno accessibili ed eventualmente utilizzate dai vostri handler.
*/
