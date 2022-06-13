const readingListsRouter = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

readingListsRouter.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const list = await ReadingList.create({
    blogId,
    userId,
  })

  res.status(201).json(list)
})

readingListsRouter.put(
  '/:id',
  [tokenExtractor, userExtractor],
  async (req, res) => {
    const loggedUserId = req.user.id

    const readingListItem = await ReadingList.findByPk(req.params.id)

    if (!readingListItem)
      res.status(404).send({ error: 'Reading List Item not found' })

    if (readingListItem.read === req.body.read) {
      res
        .status(400)
        .send({
          error: 'This item already have the state you are trying to set it on',
        })
    }

    if (loggedUserId === readingListItem.userId) {
      readingListItem.read = req.body.read

      const updatedReadingListItem = await readingListItem.save()
      res.json(updatedReadingListItem)
    }

    res.status(401).send({
      error: "You are not allowed to modify someone else's reading list",
    })
  }
)

module.exports = readingListsRouter
