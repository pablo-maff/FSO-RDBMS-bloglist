const blogsRouter = require('express').Router()
const { Blog, User } = require('../models')
const {
  userExtractor,
  blogFinder,
  tokenExtractor,
} = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  })
  blogs ? res.json(blogs) : res.status(404).end()
})

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  req.blog ? res.json(req.blog) : res.status(404).end()
})

blogsRouter.post('/', [tokenExtractor, userExtractor], async (req, res) => {
  const { title, author, url, likes } = req.body
  const userId = req.user.id

  const blog = await Blog.create({
    title,
    author,
    url,
    likes,
    userId,
  })

  res.status(201).json(blog)
})

blogsRouter.delete(
  '/:id',
  [blogFinder, tokenExtractor, userExtractor],
  async (req, res) => {
    const blogAuthorId = req.blog.userId
    const userId = req.user.id

    if (blogAuthorId === userId && req.blog) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      res
        .status(401)
        .send({ error: "You are not allowed to delete someone else's blogs" })
    }
  }
)

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  if (!req.body.likes) {
    return res.status(400).end()
  }

  req.blog.likes = req.body.likes

  const updatedBlog = await req.blog.save()
  updatedBlog ? res.json(updatedBlog) : res.status(404).end()
})

module.exports = blogsRouter
