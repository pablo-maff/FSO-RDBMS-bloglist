const readingListsRouter = require('express').Router()
const { ReadingList } = require('../models')

readingListsRouter.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const list = await ReadingList.create({
    blogId,
    userId,
  })

  res.status(201).json(list)
})

module.exports = readingListsRouter
