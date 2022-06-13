const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User, Blog } = require('../models')

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

usersRouter.put('/:username', async (req, res) => {
  const { username } = req.body
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })
  if (user) {
    user.username = username
    const updatedUser = await user.save()
    res.json(updatedUser)
  } else {
    res.status(404).end()
  }
})

module.exports = usersRouter
