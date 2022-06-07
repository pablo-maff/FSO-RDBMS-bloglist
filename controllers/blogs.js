const blogsRouter = require('express').Router()
const { Blog } = require('../models')
const {
  userExtractor,
  blogExtractor,
  blogFinder,
} = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  blogs ? res.json(blogs) : res.status(404).end()
})

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  req.blog ? res.json(req.blog) : res.status(404).end()
})

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body

  if (!title && !url) {
    res.status(400).end()
  }

  // const user = req.user

  const blog = await Blog.create({
    title,
    author,
    url,
    likes,
    // user: user.id,
  })

  // const savedPost = await blog.save()
  // user.blogs = user.blogs.concat(savedPost.id)
  // await user.save()

  res.status(201).json(blog)
})

blogsRouter.delete('/:id', blogFinder, async (req, res) => {
  // const authorId = req.blog.user.toString()
  // const userId = req.token.id

  // if (authorId === userId) {
  if (req.blog) {
    await req.blog.destroy()
  }
  res.status(204).end()
  // } else
  //   res
  //     .status(401)
  //     .send({ error: "You are not allowed to delete someone else's blogs" })
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  if (!req.body.likes) {
    return res.status(400).end()
  }

  req.blog.likes = req.body.likes

  const updatedBlog = await req.blog.save()
  updatedBlog ? res.json(updatedBlog) : res.status(404).end()
})

module.exports = blogsRouter
