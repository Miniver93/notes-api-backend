const express=require('express')
const logger=require('./loggerMiddleware.js')
const cors=require('cors')

const app=express() //Con esto creo un servidor express, es un framework que me permite hacer servidores sencillamente

app.use(express.json()) //Esto es un middleweare que se utiliza para analizar el cuerpo de las solicitudes http entrantes con formate JSON. Esto es especialmente útil cuando se envían datos en el cuerpo de una solicitud POST o PUT en formate JSON, ya que permite acceder a estos datos fácilmente en las rutas definidas en la aplicación Express

app.use(logger) //Para más información de este Middleware, ve al archivo loggerMiddleware.js

//Cuando de este error al intentar acceder a mi API: Access to XMLHttpRequest at 'http://localhost:3001/api/notes' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

//Tengo que usar el middleware cors

app.use(cors()) //Con esto hacemos que cualquier origen pueda acceder a mi API, puerto en localhost en mi caso

let notes=[
    {
        'id': '1',
        'content': 'HTML is easy',
        'important': true
    },
    {
        'id': '2',
        'content': 'Browser can execute only JavaScript',
        'important': false
    },
    {
        'id': '3',
        'content': 'GET and POST are the most important methods of HTTP protocol',
        'important': true
    }
]

app.get('/', (request,response)=>{
    response.send('<h1>Hello world</h1>')

})

app.get('/api/notes', (request,response)=>{ //Ruta de todas las notas
    response.json(notes)
})

app.get('/api/notes/:id', (request,response)=>{ //Ruta para que nos devuelva la nota por id, con el parámetro :id los : significan el parámetro
    const id=Number(request.params.id) //Guardamos el parámetro de nuestra ruta en id, lo pasamos a número ya que por defecto un parámetro de nuestra ruta/url es string

    const note=find(note=>note.id === id) //Guardamos en note la nota que queramos recibir al poner la id en nuestra ruta
    
    if (note) { //Si existe la nota
        response.json(note) //Devolvemos la nota guardada

    }else{ //Si no existe nota, dame un error 404 y remplazame la página de error por un h1
        response.status(404).send('<h1>Id invalid</h1>').end() 
    }
})

app.delete('/api/notes/:id', (request,response)=>{
    const id=Number(request.params.id)

    notes= notes.filter(note=>note.id !== id) //Aquí se guardarán todas las notas excepto la que estoy borrando
    
    response.status(204).end() //Dame una respuesta de 204 que significa que no hay contenido
})

app.post('/api/notes', (request,response)=>{ //Para hacer un post tengo que importar un modulo para la app

    const note=request.body //Aquí le estamos pasando a note, la nota que queremos crear nueva, que está en el archivo post_note.rest

    //Si quiero hacer post de una nota vacia o no hay contenido mandame un error en formato json
    if(!note || !note.content){
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const ids=notes.map(note=>note.id) //Recupero todas las ids de mis notas
    const maxId=Math.max(...ids) //Recupero la id más alta de todas mis ids
    const newNote={
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false //Aquí le estamos diciendo que, si el objeto que creamos no tiene important, que este sea false y si contiene important, pues que se agregue
    }

    const updateNotes=[...notes, newNote] //Guardamos la nota en un array para no sustituir mis notas

    notes=updateNotes
    response.status(201).json(newNote)
    
})

app.use((request,response)=>{ //Esta sería la forma más razonable de hacer un error 404 si queremos acceder a una url que no existe
    response.status(404).send('<h1>Error 404</h1>')
})

// eslint-disable-next-line no-undef
const PORT= process.env.PORT || 3001
app.listen(PORT, ()=>{ //Este servidor a diferencia de http, es asíncrono, por lo que tengo que pasarle un callback indicándole que cuando termine de levantarse, me corra este console.log
    console.log('Server running on port 3001')
})
