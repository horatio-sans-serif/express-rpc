#!/usr/bin/env node

require('dotenv').config()

const _ = require('lodash')
const express = require('express')
const debug = require('debug')('express-rpc')

const app = express()
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '100kb' }))

const rpcs_path = process.env.RPCS_PATH || process.argv[2]
if (!rpcs_path) {
  console.error('usage: express-rpc </path/to/rpcs.js>')
  process.exit(1)
}
debug(`loading RPCs from ${rpcs_path}`)

const rpcs = require(rpcs_path)
if (_.isEmpty(rpcs)) {
  console.error(`ERROR: no RPCs were found: ${rpcs_path}`)
  process.exit(1)
}
debug('RPCs:', Object.keys(rpcs).join(', '))

app.post('/rpc/:rpc', async (req, res, next) => {
  const rpc_name = (req.params.rpc || '').trim()

  const fn = _.get(rpcs, rpc_name)
  if (!_.isFunction(fn)) return next(new Error('invalid rpc'))

  try {
    const value = await fn.call(req, req.body)
    debug('rpc res for', rpc_name, 'is', value)
    res.send(value)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.code || 500).send({ error: { message: err.message }})
})

const port = process.env.PORT || 2999
app.listen(port, err => {
  if (err) throw err
  debug('listening on', port)
})
