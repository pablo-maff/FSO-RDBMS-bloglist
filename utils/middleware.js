const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')
const { SECRET } = require('./config')
const Session = require('../models/session')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknwonw endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'TypeError') {
    return res.status(400).send({
      error: error.message,
    })
  } else if (error.errors[0].message === 'UsernameValidationError') {
    return res.status(400).json({
      error: 'Validation isEmail on username failed',
    })
  } else if (error.errors[0].message === 'BlogYearValidationError') {
    return res.status(400).json({
      error: 'Year must be greater than 1991 and less than 2022',
    })
  } else if (error.name === 'UsernameExists') {
    return res.status(400).json({
      error: 'Validation userExists on username failed',
    })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    })
  }

  logger.error(error.message)

  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    req.token = jwt.verify(token, SECRET)
    req.sessionToken = await Session.findOne({
      where: { sessionToken: req.token.sessionToken },
    })

    if (!req.sessionToken) {
      res.status(401).json({ error: 'token missing' })
    }

    next()
  } else {
    res.status(401).json({ error: 'token missing' })
  }
}

const userExtractor = async (req, res, next) => {
  req.user = await User.findByPk(req.token.id)
  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  blogFinder,
}
