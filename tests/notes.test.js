const mongoose = require('mongoose')
const supertest = require('supertest')
const {app, server} = require('../index')
const Note = require('../models/Note')

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

//Con esto estoy diciendo que antes de ejecutar los test me ejecute esto
beforeEach(async () =>{
    await Note.deleteMany({}) //Con esto estamos borrando todas las notas que tenemos en la base de datos de notes-app-test
    const note1 = new Note(initialNotes[0]) //Con esto estamos creando una nueva nota que será la que está en la posición 1 del array 
    const note2 = new Note(initialNotes[1])
    await note1.save()
    await note2.save() //Guardamos las notas en nuestra base de datos 
})

test('notes are returned as json', async () => { //Para que funcione el test correctamente, como lo que estamos validando es asyncrono tenemos que espicifarlo, si no no validará nada 
    await api
        .get('/api/notes')
        .expect(200) //Con esto espero que sea un código 200 
        .expect('Content-Type', /application\/json/) //Con esto espero que sea un tipo json, por eso lo pongo como un regex
})

test('there are two notes', async () => { //Para que funcione el test correctamente, como lo que estamos validando es asyncrono tenemos que espicifarlo, si no no validará nada 
    const response = await api.get('/api/notes') //Aquí almacenamos la respuesta de nuestra api 
    expect(response.body).toHaveLength(initialNotes.length) //Aquí estamos diciendo que esperamos que el contenido del body tenga la longitud de las notas que hemos añido a nuestra base de datos, osea el número de notas

})

test('the first note is about mongoDB' , async () => {
    const response = await api.get('/api/notes') //Aquí almacenamos la respuesta de nuestra api 
    expect(response.body[0].content).toBe('Estoy aprendiedno mongoDB para ser un buen developer y ganarme la vida con ello') //Aquí estamos diciendo que esperamos que la primera nota tenga el siguiente texto
})

test('there is a note about mongoDB' , async () => {
    const response = await api.get('/api/notes') //Aquí almacenamos la respuesta de nuestra api 
    const content = response.body.map(note => note.content) //Aquí guardamos todos los contenidos de nuestras notas en un array

    expect(content).toContain('Estoy aprendiedno mongoDB para ser un buen developer y ganarme la vida con ello') //Aquí estamos diciendo que esperamos que haya una nota en nuestra base de datos con ese contenido
})

test('a valid note can be added', async () =>{
    const newNote = {
        content: 'Próximamente async/await',
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote) //Con esto estamos enviando la nota a la base de datos
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/notes') //Guardamos la respuesta 

    const contents = response.body.map(note => note.content) //Guardamos el contenido de todas nuestras notas de nuestra api

    expect(response.body).toHaveLength(initialNotes.length + 1) //Aquí estamos diciendo que esperamos que la cantidad de notas que tenemos en la api sea las notas que ya tenemos más esta nueva nota
    expect(contents).toContain(newNote.content) //Esperamos que entre los contenidos de la api esté nuestra nota
})

test('note without content is not added', async () =>{
    const newNote = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote) //Con esto estamos enviando la nota a la base de datos
        .expect(400)

    const response = await api.get('/api/notes') //Guardamos la respuesta 

    expect(response.body).toHaveLength(initialNotes.length)
})

//Con esto estoy diciendo que una vez se ejecuten todos los test, se cierre el servidor para que no se quede abierto
afterAll(() =>{
    server.close() //Con esto cerramos la conexión de nuestro servidor
    mongoose.connection.close() //Con esto cerramos la conexión con nuestra base de datos
})
