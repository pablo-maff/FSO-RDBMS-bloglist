const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { randomBytes } = require('crypto')

const sessionRouter = require('express').Router()

const { SECRET } = require('../utils/config')
const { User } = require('../models')
const Session = require('../models/session')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

sessionRouter.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({
    where: {
      username,
    },
  })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password',
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'Account disabled, please contact admin',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
    sessionToken: randomBytes(64).toString('hex'),
  }

  const token = jwt.sign(
    userForToken,
    SECRET
    //{ expiresIn: 60*60 }
  )

  await Session.create({
    userId: user.id,
    sessionToken: userForToken.sessionToken,
  })

  res.status(200).send({ token, username: user.username, name: user.name })
})

sessionRouter.delete(
  '/logout',
  tokenExtractor,
  userExtractor,
  async (req, res) => {
    if (req.token) {
      await Session.destroy({
        where: { userId: req.user.id },
      })
    }

    res.status(204).end()
  }
)

module.exports = sessionRouter
