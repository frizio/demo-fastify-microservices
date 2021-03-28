'use strict'

const fp = require('fastify-plugin')
const isDocker = require('is-docker')
const MongoDB = require('fastify-mongodb')

module.exports = fp(
  async (fastify, opts) => {
    let mongoOpts = Object.assign(
      {},
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        url:`mongodb://${ isDocker() ? 'mongodb-web' : 'localhost'}:27017/wetalk`,
      }, 
      opts.mongodb
    )
    fastify.register(MongoDB, mongoOpts)
  }
)

/*
Anche in questo caso utilizziamo un plugin sviluppato dal core team di fastify, fastify-mongodb , 
che decora il nostro microservizio aggiungendogli la possibilità di connettersi ad un istanza MongoDB.
*/