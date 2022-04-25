const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

usersRouter.get('/', async (request,response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request,response) => {
    const body = request.body
    const saltRounds = 10
    
    if(body.password.length < 3){
        return response.status(400).json({
        error: 'Password must be more than 3 characters'
        })
    }
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })
    
    const result = await user.save()

    response.status(201).json(result)
})

module.exports = usersRouter