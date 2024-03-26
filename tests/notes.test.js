/* eslint-disable no-undef */
const mongoose = require('mongoose')

const {server} = require('../index')
const Note = require('../models/Note')
const {initialNotes, api, getAllContentFromNotes} = require('./helpers') 





//Con esto estoy diciendo que antes de ejecutar los test me borre las notas que tengo en la base de datos y me guarde las de initialNotes
beforeEach(async () =>{
    await Note.deleteMany({}) //Con esto estamos borrando todas las notas que tenemos en la base de datos de notes-app-test

    //Esto lo hace en paralelo, más rápido pero no ordenado
    // const noteObjects = initialNotes.map(note => new Note(note))
    // const promises = noteObjects.map(note => note.save())
    // await Promise.all(promises)
    
    //Esto lo hace sequencial, más lento pero ordenado
    for(let note of initialNotes){ //Recuperamos todas las notas de initialNotes
        const objectNote =new Note(note) //Guardamos el objeto de cada nota
        await objectNote.save() //Guardamos el object en nuestra base de datos
    }

})

describe('GET all notes', () =>{

    test('notes are returned as json', async () => { //Para que funcione el test correctamente, como lo que estamos validando es asyncrono tenemos que espicifarlo, si no no validará nada 
        await api
            .get('/api/notes')
            .expect(200) //Con esto espero que sea un código 200 
            .expect('Content-Type', /application\/json/) //Con esto espero que sea un tipo json, por eso lo pongo como un regex
    })
    
    test('there are two notes', async () => { //Para que funcione el test correctamente, como lo que estamos validando es asyncrono tenemos que espicifarlo, si no no validará nada 
        const {response} = await getAllContentFromNotes()
        expect(response.body).toHaveLength(initialNotes.length) //Aquí estamos diciendo que esperamos que el contenido del body tenga la longitud de las notas que hemos añido a nuestra base de datos, osea el número de notas
    
    })

    test('the first note is about mongoDB' , async () => {
        const {response} = await getAllContentFromNotes()
        expect(response.body[0].content).toBe('Estoy aprendiedno mongoDB para ser un buen developer y ganarme la vida con ello') //Aquí estamos diciendo que esperamos que la primera nota tenga el siguiente texto
    })
    
    test('there is a note about mongoDB' , async () => {
        const {contents} = await getAllContentFromNotes()
    
        expect(contents).toContain('Estoy aprendiedno mongoDB para ser un buen developer y ganarme la vida con ello') //Aquí estamos diciendo que esperamos que haya una nota en nuestra base de datos con ese contenido
    })
})


describe('POST notes', () => {

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
    
        const {contents, response} = await getAllContentFromNotes()
    
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
    
        const {response} = await getAllContentFromNotes()
    
        expect(response.body).toHaveLength(initialNotes.length)
    })

})

describe('DELETE note', () => {

    test('a note can be deleted' , async () =>{
        const { response:firstResponse } = await getAllContentFromNotes()
        const { body:notes } = firstResponse //De aquí obtenemos las notas de nuestro response.body con el nombre cambiado a notes
        const [noteToDelete] = notes //Esto es una desestructuración de arrays, aquí estoy cogiendo el primer elemento del array
        // const noteToDelete = notes[0] //También sirve esto
        await api
            .delete(`/api/notes/${noteToDelete.id}`) //Del primer elemento de nuestro array cogemos la id y se la pasamos como id
            .expect( { message: 'Note has been deleted'} ) //Esperamos que al borrar tengamos esta respuesta
    
        const { contents, response:secondResponse } = await getAllContentFromNotes() //Obtenemos de nuevo la respuesta
        expect(secondResponse.body).toHaveLength(initialNotes.length -1)
    
        expect(contents).not.toContain(noteToDelete) //Con esto estoy diciendo que esperamos que la nota que acabamos de borrar no exista en nuestras notas
    
    })
    
    test('a note that does not exist cannot be deleted' , async () =>{
    
        //Con esto estamos buscando dentro de nuestra base de datos una nota que no existe
        await api
            .delete('/api/notes/24234') //Nota que no existe
            .expect(400) //Esperamos que como no existe nos devuelva este código de error
    
        const {response} = await getAllContentFromNotes() //Obtenemos la respuesta de nuestra base de datos
        expect(response.body).toHaveLength(initialNotes.length) //Tenga la misma longitud
    
    
    })
})

describe('PUT notes', () =>{
    
})

//Con esto estoy diciendo que una vez se ejecuten todos los test, se cierre el servidor para que no se quede abierto
afterAll(() =>{
    server.close() //Con esto cerramos la conexión de nuestro servidor
    mongoose.connection.close() //Con esto cerramos la conexión con nuestra base de datos
})
