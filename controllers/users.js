const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')


usersRouter.get('/', async (request, response) =>{
    const users =await User.find({}).populate('notes') //El método populate lo que hace es mostrarme toda la información que contiene notes ya que al crear el schema de users, le pasamos como párametro el modelo de notas como referencia
    response.status(200).json(users)
})

//Aquí estaría accediendo a /api/users, pero no tengo que añadirlo aquí así ya que al usar el controlador desde el index ya le estamos espicificando ahí la ruta
usersRouter.post('/', async (request, response) =>{
    try {
        const {body} = request
        const {username, name, password} = body

        const hashedPassword = await bcrypt.hash(password, 10)
    

        const user = new User({
            username, //Cuando el valor que le queremos meter a nuestra key es el mismo que el valor, con añadir solo el valor basta
            name,
            passwordHash: hashedPassword
        })

        const savedUser = await user.save()
        response.status(201).json(savedUser)
        
    } catch (error) {
        response.status(400).json(error)
    }
    

})

module.exports = usersRouter

    