const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',  { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id).populate('user',  { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  let body = request.body
  body.likes = request.body.likes || 0

  const user = request.user
  
  const blog = new Blog({...request.body,user})

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if(!blog){
    return response.status(204).json({error: 'blog does not exist'})
  }
  
  const user = request.user
  
  if(blog.user.toString() === user._id.toString()){
    await Blog.findByIdAndDelete(blogId)
    return response.status(204).json({success: 'blog deleted'})
  }else{
    return response.status(401).json({ error: 'blog does not exist' })
  }

})


blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(401).json({ error: 'blog does not exist' })
  }

  if(blog.user.toString() === user._id.toString()){
    let newLikes = {
      likes: body.likes, 
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newLikes, {new: true})
    response.json(updatedBlog)
  }else{
    return response.status(401).json({ error: 'Unauthorized change of blogpost!' })
  }
})

module.exports = blogsRouter