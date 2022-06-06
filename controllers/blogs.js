const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor, blogExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1})
  blogs ?
    res.status(200).json(blogs)
    : res.status(404).end()
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  blog ? 
    res.status(200).json(blog.toJSON())
    : res.status(404).end()
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body
  
  if (!title && !url) {
    res.status(400).end()
  }

  const user = req.user

  const blog = new Blog ({
    title,
    author,
    url,
    likes,
    user: user.id
  })

  const savedPost = await blog.save()
  user.blogs = user.blogs.concat(savedPost.id)
  await user.save()

  res.status(201).json(savedPost)
})

blogsRouter.delete('/:id', blogExtractor, async (req, res) => {
  const authorId = req.blog.user.toString()
  const userId = req.token.id

  if (authorId === userId) {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end() 
  }
  else res.status(401).send({ error: 'You are not allowed to delete someone else\'s blogs' })

})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  updatedBlog ? 
    res.status(200).json(updatedBlog.toJSON())
    : res.status(404).end()
})

module.exports = blogsRouter