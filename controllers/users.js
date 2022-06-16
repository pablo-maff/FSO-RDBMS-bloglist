const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User, Blog } = require('../models')
const Session = require('../models/session')
const { tokenExtractor } = require('../utils/middleware')

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { password, ...userDetails } = req.body

  const user = await User.findOne({
    attributes: { exclude: ['passwordHash'] },
    where: {
      username: userDetails.username,
    },
  })

  if (user) {
    return res
      .status(400)
      .json({ error: 'This username already exists. Choose a different one' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = {
    ...userDetails,
    passwordHash,
  }

  const createUser = await User.create(newUser)
  res.status(201).json(createUser)
})

usersRouter.get('/:id', async (req, res) => {
  let where = {}

  if (req.query.read) {
    where = {
      '$readings.readingList.read$': req.query.read,
    }
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash', 'id'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['id', 'read'], // Example of when a BUG becomes a feature
        },
        where,
        // include: {  // This was the feature on top of the BUG
        //   model: ReadingList,
        //   attributes: ['id', 'read'],
        //   where: {
        //     userId: req.params.id,
        //   },
        // },
      },
    ],
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

usersRouter.put('/:username', tokenExtractor, async (req, res) => {
  const user = await User.findOne({
    attributes: { exclude: ['passwordHash'] },
    where: {
      username: req.params.username,
    },
  })

  if (!user) {
    res.status(404).end()
  }

  if (req.body.disabled !== undefined) {
    const isAdmin = await User.findByPk(req.token.id)
    if (!isAdmin.admin) {
      return res.status(401).json({ error: 'operation not allowed' })
    }
    if (!user.disabled) {
      await Session.destroy({
        where: { userId: user.id },
      })
    }
    user.disabled = req.body.disabled
  }

  if (req.body.username) {
    user.username = req.body.username
  }

  const updatedUser = await user.save()
  res.json(updatedUser)
})

module.exports = usersRouter
