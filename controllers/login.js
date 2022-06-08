const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const loginRouter = require('express').Router()

const { SECRET } = require('../utils/config')
const { User } = require('../models')

loginRouter.post('/', async (req, res) => {
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

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(
    userForToken,
    SECRET
    //{ expiresIn: 60*60 }
  )

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
