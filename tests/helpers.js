const { app } = require('../index')
const supertest = require('supertest')
const User = require('../models/User')

//Aquí se está importando la función supertest y se está creando una instancia de la API a probar. supertest es una biblioteca que permite realizar solicitudes HTTP a una aplicación Node.js sin necesidad de ejecutar un servidor real. app representa la aplicación Node.js que se desea probar.
const api = supertest(app) 

const initialNotes = [
    { 
        content: 'Estoy aprendiedno mongoDB para ser un buen developer y ganarme la vida con ello',
        date: new Date(),
        important: true
    },
    { 
        content: 'Api rest is the best',
        date: new Date(),
        important: true

    }
]

const getAllContentFromNotes = async () =>{
    const response = await api.get('/api/notes') //Guardamos la respuesta 
    return {
        contents: response.body.map(note => note.content), //Guardamos el contenido de todas nuestras notas de nuestra api
        response //returnamos también la response
    } 
}

const getAllContentFromUsers = async () => {
    const usersDB = await User.find({})
    const users = usersDB.map(user => user.toJSON())
    return{
        usersDB, users
    }
}

module.exports = {
    initialNotes,
    api,
    getAllContentFromNotes,
    getAllContentFromUsers
}