const bcrypt = require('bcrypt')
const { json } = require('express')
const { response } = require('../app')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request,response)=> {

  let users = await User.find({}).populate('blogs')

  response.status(200).json(users)
})

usersRouter.get('/:id', async (request,response)=> {
  let user = await User.findById(request.params.id).populate('blogs')
  response.status(200).json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  let error = {}

  let existingUser = await User.findOne({username})

  if(existingUser){
    error.existingUser = 'user already exists'
  }
  if(password.length < 3){
    error.password = 'password length cannot be less than 3'
  }if(username.length < 3){
    error.username = 'username length cannot be less than 3'
  }

  if(Object.keys(error).length !== 0){
    return response.status(400).json({error})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
  username,
  name,
  passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter