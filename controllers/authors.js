const authorsRouter = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../utils/db')

authorsRouter.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    order: [[sequelize.fn('max', sequelize.col('likes')), 'DESC']],
    group: 'author',
  })
  authors ? res.json(authors) : res.status(404).end()
})

module.exports = authorsRouter
