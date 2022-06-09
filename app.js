const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const morgan = require('morgan')
const authorsRouter = require('./controllers/authors')

morgan.token('blog', (req) => JSON.stringify(req.body))

logger.info('connecting to postgres')

app.use(cors())
app.use(express.json())

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :blog')
)

// app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
