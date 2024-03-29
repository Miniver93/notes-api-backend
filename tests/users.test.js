/* eslint-disable no-undef */
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getAllContentFromUsers } = require('./helpers')
const { default: mongoose } = require('mongoose')
const { server } = require('..')



describe('creating a new user', () =>{
    beforeEach(async () =>{
        await User.deleteMany({})

        const hashedPassword = await bcrypt.hash('sdf2342sdf2', 10)
        const newUser = new User({
            username: 'Pepin043',
            name: 'Pepin',
            passwordHash: hashedPassword 
        })

        await newUser.save()
    })

    test('works as expected creating a fresh username', async () => {
        
        const {users:usersAtStart} = await getAllContentFromUsers()

        const newUser = {
            username: 'alonso75',
            name: 'Alonso',
            password: '12345'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const {users:usersAtEnd} = await getAllContentFromUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })
})

test('creation fails with proper statuscode and message if username is already taken', async () =>{
    const usersAtStart = (await getAllContentFromUsers()).users

    const newUser = {
        username: 'Pepin043',
        name: 'Pedro',
        password: '234234'
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-type', /application\/json/)
        
    expect(result.body.errors.username.message).toContain('`username` to be unique')
    
    const usersAtEnd = (await getAllContentFromUsers()).users
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

describe('GET users', () =>{
    test('users are returned as json', async () => {

        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })
})

afterAll(() =>{
    server.close()
    mongoose.connection.close()
})