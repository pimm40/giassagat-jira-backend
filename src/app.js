
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/api', routes)

app.use('/api', (req, res)=> {
  return res.json({ message: 'api is running!'})
})

app.use('/api', (error, req, res, next) => {
  console.err('error', error);
  next()
})

module.exports = app