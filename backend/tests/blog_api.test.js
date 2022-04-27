const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
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


describe('deleting a blog', () => {
  let accessToken 
  let blogId
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'root', passwordHash })

    await user.save()
    let response = await api.post('/api/login').send({username:"root", password:"sekret"})
    accessToken = response.body.token

    let newBlog = {
      title: "Derp is in the house",
      author: "Yong Qin",
      url: "https://yongqin.com/",
      likes: 12
    }
    let blogRes = await api
                          .post('/api/blogs')
                          .set('Authorization', `bearer ${accessToken}`)
                          .send(newBlog)
    blogId = blogRes.body.id
  })

  test('deleting a valid blog', async () => {
    await api
            .delete(`/api/blogs/${blogId}`)
            .set('Authorization', `bearer ${accessToken}`)
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

    const blogsAtStart = await helper.blogsInDb()
    await api
            .delete(`/api/blogs/${deletedBlogId}`)
            .set('Authorization', `bearer ${accessToken}`)
            .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('updating a blog', () => {
  let accessToken 
  let blogId
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'root', passwordHash })

    await user.save()
    let response = await api.post('/api/login').send({username:"root", password:"sekret"})
    accessToken = response.body.token

    let newBlog = {
      title: "Derp is in the house",
      author: "Yong Qin",
      url: "https://yongqin.com/",
      likes: 12
    }
    let blogRes = await api
                          .post('/api/blogs')
                          .set('Authorization', `bearer ${accessToken}`)
                          .send(newBlog)
    blogId = blogRes.body.id
  })
  
  test('updating a single blog', async () => {
    const updatedBlog = await api.get(`/api/blogs/${blogId}`).expect(200)
    const {title, author, url, id, user} = updatedBlog.body
    const updated = {likes: 9000}
    
    await api
            .put(`/api/blogs/${blogId}`)
            .set('Authorization', `bearer ${accessToken}`)
            .send(updated)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toContainEqual({
      title,
      author,
      url,
      likes: updated.likes,
      id,
      user: new mongoose.Types.ObjectId(user.id)
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

    expect(result.body.error.existingUser).toContain('user already exists')

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

    expect(result.body.error.username).toContain('Username should not be less than 3 characters!')

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

    expect(result.body.error.password).toContain('Password should not be less than 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('posting a blog', () => {
  let accessToken 
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'root', passwordHash })

    await user.save()
    let response = await api.post('/api/login').send({username:"root", password:"sekret"})
    accessToken = response.body.token
  })

  test('post without token is unauthorised', async () => {
    let newBlog = {
      title: "Derp is in the house",
      author: "Yong Qin",
      url: "https://yongqin.com/",
      likes: 12,
    }

    await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
  
  test('post with token is successful', async () => {
    let newBlog = {
      title: "Derp is in the house",
      author: "Yong Qin",
      url: "https://yongqin.com/",
      likes: 12
    }

    await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${accessToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
  


    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
  })

  test('if likes property missing, default to 0', async () => {
    let newBlog = {
      title: "Tiff is in the house",
      author: "Tiffany",
      url: "https://tiffany.com/",
    }
  
    await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${accessToken}`)
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
            .set('Authorization', `bearer ${accessToken}`)
            .send(newBlog)
            .expect(400)
  
  },15000)
})

afterAll(()=>{
  mongoose.connection.close()
})