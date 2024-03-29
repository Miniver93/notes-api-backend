/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const logingRouter = require('express').Router()
const User = require('../models/User')

logingRouter.post('/', async (request, response) =>{
    const { body } = request
    const { username, password } = body
    
    const user = await User.findOne({ username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    //Si el usuario no existe y la contraseña tampoco
    if(!(user && passwordCorrect)){
        return response.status(401).json({ error: 'password or user incorrected' })
    }

    //Guardamos la id y el usuario para después fimar nuestro token de inicio de sesión con estos datos
    const userForToken = {
        id: user._id,
        username: user.username
    }

    //Creamos el token firmando con nuestro usuario, el segundo parámetro es la palabra secreta para nuestro token, esto siempre tiene que estar oculto y no usarla en ninguna otra parte
    const token = jwt.sign(userForToken, process.env.SECRET_WORD, {
        expiresIn: 60 * 60 * 24 * 7 //60 seg * 60 min * 24h * 7 dias
    }) //Si le pasamos otro parametros ahora expirará el token para más seguridad

    //Aquí me devolverá el nombre, el usuario y el token
    response.send({
        name: user.name,
        username: user.username,
        token
    })
})

module.exports = logingRouter
