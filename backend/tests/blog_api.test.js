const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')

const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there are some blogs saved', () => {
  test('blog post returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  },10000)

  test('get correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  },10000)
})

describe('viewing a specific blog', () => {
  test('unique id has property called id', async () => {
    let blogs = await api.get('/api/blogs')
    for(let blog of blogs.body){
      expect(blog.id).toBeDefined()
    }
  })

})

describe('posting a blog', () => {
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
})

describe('deleting a blog', () => {
  test('deleting a valid blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const deletedBlog = blogsAtStart[0]

    await api
            .delete(`/api/blogs/${deletedBlog.id}`)
            .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
  
  
    expect(blogsAtEnd).not.toContainEqual({
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    })
  })

  test('deleting a invalid blog', async () => {
    const deletedBlogId = await helper.nonExistingId()

    await api
            .delete(`/api/blogs/${deletedBlogId}`)
            .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('updating a single blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updatedBlog = blogsAtStart[0]
    const {title, author, url, likes, id} = updatedBlog
    const updated = {likes: 9000}
    
    await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send(updated)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toContainEqual({
      title,
      author,
      url,
      likes: updated.likes,
      id
    })
  })
})


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username: Error, expected `username` to be unique.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username less than 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password less than 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roed',
      name: 'Superuser',
      password: 'rt',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password must be more than 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(()=>{
  mongoose.connection.close()
})