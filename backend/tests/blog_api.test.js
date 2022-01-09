const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')

const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  for(blog of helper.initialBlogs){
    let blogObject = new Blog(blog)
    blogObject.save()
  }
})

test('get correct amount of blog posts', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},10000)

test('unique id has property called id', async () => {
  let blogs = await api.get('/api/blogs')
  for(let blog of blogs.body){
    expect(blog.id).toBeDefined()
  }
})

test('post creates a new blog post', async () => {
  let newBlog = {
    title: "Derp is in the house",
    author: "Yong Qin",
    url: "https://yongqin.com/",
    likes: 12,
  }

  await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)

  const content = blogsAtEnd.map(b => b.title)

  expect(content).toContain('Derp is in the house')
})

test('if likes property missing, default to 0', async () => {
  let newBlog = {
    title: "Tiff is in the house",
    author: "Tiffany",
    url: "https://tiffany.com/",
  }

  await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)

  const content = blogsAtEnd.map(b => {return {title: b.title, author: b.author, likes: b.likes}})

  expect(content).toContainEqual({
    title: "Tiff is in the house",
    author: "Tiffany",
    likes: 0
  })
})

test('if title and url properties are missing return 400 Bad request', async () => {
  let newBlog = {
    url: "https://tiffany.com/",
  }

  await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)

},15000)

afterAll(()=>{
  mongoose.connection.close()
})