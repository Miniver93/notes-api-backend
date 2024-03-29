/* eslint-disable no-undef */
const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

notesRouter.get('/', async (request,response)=>{ //Ruta de todas las notas
    const notes = await Note.find({}) 
    response.json(notes)
    
    
    
    // Note.find({}) //Con esto le estoy diciendo que busque en la colección de notas de mi db todos los objetos y me los devuelva en formato json
    //     .then(notes=>{
    //         response.json(notes)
    //     })
})

notesRouter.get('/:id', (request,response, next)=>{ //Ruta para que nos devuelva la nota por id, con el parámetro :id los : significan el parámetro
    // const id=Number(request.params.id) //Guardamos el parámetro de nuestra ruta en id, lo pasamos a número ya que por defecto un parámetro de nuestra ruta/url es string

    // Extraer el parámetro id del objeto params de la solicitud
    const {id} = request.params //Ahora como nuestra id es un string, le quitamos el parse a number


    // const note = await Note.findById(id)
    // try {
    //     return note ? response.json(note) : response.status(404).end()
    // } catch (error) {
    //     next(error)
    // }
    
    Note.findById(id)
        .then(note=>{
            //Puedo ponerlo con return o sin return, no cambia el funcionamiento, pero. Si lo pongo con return, si se ejecuta mi devolución de llamada, dejará de ejecutarse el código y no llamará al catch, si lo pongo sin retún, seguirá ejecutandose el código y llamará al catch si hay un error
            return note ? response.json(note) : response.status(404).end

        })
        .catch(err=>{
            next(err) //Con esto le estamos diciendo que vaya al siguiente middleware con el error
        })

    
        

    // const note=notes.find(note=>note.id === id) //Guardamos en note la nota que queramos recibir al poner la id en nuestra ruta
    
    // if (note) { //Si existe la nota
    //     response.json(note) //Devolvemos la nota guardada

    // }else{ //Si no existe nota, dame un error 404 y remplazame la página de error por un h1
    //     response.status(404).send('<h1>Id invalid</h1>').end() 
    // }
})

//El userExtractor es el token de usuario, si tienes el token de usuario puedes utilizar estas rutas, si no no
notesRouter.delete('/:id', userExtractor, async (request,response, next)=>{
    // const id=Number(request.params.id)
    const {id}=request.params

    try {
        await Note.findByIdAndDelete(id)
        response.send( { message: 'Note has been deleted'}).end()
    } catch (error) {
        next(error)
    }
    

    // Note.findByIdAndDelete(id)
    //     .then(result=>{
    //         response.send({message:'Note has been deleted'}).end()
            
    //     })
    //     .catch(err=>next(err))



    // notes= notes.filter(note=>note.id !== id) //Aquí se guardarán todas las notas excepto la que estoy borrando
    
    // response.status(204).end() //Dame una respuesta de 204 que significa que no hay contenido
})

notesRouter.put('/:id', userExtractor, (request, response, next)=>{
    const {id}=request.params
    const note=request.body

    //Aquí cuando hacemos un findByIdAndUptade, lo que nos devuelve es lo que ha encontrado por id, es decir, el objeto que está en nuestra db. Si queremos recuperar el objeto que acabamos de actualizar, debemos de decirle al método que nos devuelva el nuevo
    Note.findByIdAndUpdate(id, note, { new: true })
        .then(result=>{
            response.json(result)
        })
        .catch(err=>next(err))
})

//Llamamos a nuestro middleware privado antes de nada
notesRouter.post('/', userExtractor, async (request,response,next)=>{ //Para hacer un post tengo que importar un modulo para la notesRouter
    const { content, important = false} = request.body 

    //Sacar userId de request
    const {userId} = request //Ahora nuestra request tendrá userId que la hemos añadido en nuestro middleware userExtractor
    //Aquí busco la id del usuario de la nota que quiero crear y lo almaceno
    const user = await User.findById(userId)

    if(!content){
        return response.status(404).json({
            error: 'required "content" field is missing'
        })
    }

    const newNote = new Note({
        content: content,
        date: new Date(),
        important,
        user: user._id //Al no haber pasado todaví la id a json, tenemos que usar el _id en vez de id
    })

    try {
        const savedNote = await newNote.save()
        user.notes = user.notes.concat(savedNote._id) //Aquí recupero las notas del usuario y le concateno la nueva nota que acabamos de crear
        await user.save() //Aquí guardamos los cambios que le hemos hecho al usuario en la base de datos
        response.status(201).json(savedNote)
    } catch (error) {
        next(error)
    }

    // if(!note){
    //     return response.status(404).json({
    //         error: 'required "content" field is missing'
    //     })
    // }

    // //Aquí creamos la nueva nota pasándole los datos que obtenemos del post, que los cogemos de la variable note
    // const newNote = new Note({
    //     content: note.content,
    //     date: new Date(),
    //     important: typeof note.important !== 'undefined' ? note.important : false //Aquí le estamos diciendo que, si el objeto que creamos no tiene important, que este sea false y si contiene important, pues que se agregue
    // })

    // //Guardamos la nota en la base de datos con save y como nos devuelve una promesa, recuperamos la nota
    // newNote.save()
    //     .then(savedNote=>{
    //         response.json(savedNote) //Nos devuelve la nota de la base de datos ya creada
    //     })
    //     .catch(err=>{
    //         next(err)
    //     })
    

    // //Si quiero hacer post de una nota vacia o no hay contenido mandame un error en formato json
    // if(!note || !note.content){
    //     return response.status(400).json({
    //         error: 'note.content is missing'
    //     })
    // }

    

    // const ids=notes.map(note=>note.id) //Recupero todas las ids de mis notas
    // const maxId=Math.max(...ids) //Recupero la id más alta de todas mis ids
    // const newNote={
    //     id: maxId + 1,
    //     content: note.content,
    //     important: typeof note.important !== 'undefined' ? note.important : false //Aquí le estamos diciendo que, si el objeto que creamos no tiene important, que este sea false y si contiene important, pues que se agregue
    // }

    // const updateNotes=[...notes, newNote] //Guardamos la nota en un array para no sustituir mis notas

    // notes=updateNotes

    //response.status(201).json(note)
    
})

module.exports = notesRouter
