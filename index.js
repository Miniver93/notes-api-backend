require('dotenv').config() //Para que no de error, tengo que iniciar la dependencia dotenv con el método config. Esto siempre lo tenemos que iniciar lo primero del todo, esto por defecto buscará el archivo .env
require('./mongo.js') //Como no voy a usar ninguna variable y lo único que voy a hacer es conectarme a la base de datos, lo que hará esto es añadir el módulo ejecutándolo sin yo hacer nada más
const Sentry = require('@sentry/node')
const { nodeProfilingIntegration } = require('@sentry/profiling-node')

const Note = require('./models/Note.js')

const express=require('express')
const cors=require('cors')

const app=express() //Con esto creo un servidor express, es un framework que me permite hacer servidores sencillamente


Sentry.init({
    dsn: 'https://df6703aee49105d5e2e13f7daa2f8a65@o4506962035998720.ingest.us.sentry.io/4506962039341056',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
})

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler())

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())



app.use(express.json()) //Esto es un middleweare que se utiliza para analizar el cuerpo de las solicitudes http entrantes con formate JSON. Esto es especialmente útil cuando se envían datos en el cuerpo de una solicitud POST o PUT en formate JSON, ya que permite acceder a estos datos fácilmente en las rutas definidas en la aplicación Express


//Cuando de este error al intentar acceder a mi API: Access to XMLHttpRequest at 'http://localhost:3001/api/notes' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

//Tengo que usar el middleware cors

app.use(cors()) //Con esto hacemos que cualquier origen pueda acceder a mi API, puerto en localhost en mi caso

//Para añadir añadir archivos estáticos como imagenes, tengo que usar un middleware
app.use('/images', express.static('images'))

app.use(express.static('dist')) //Con esto esto añadiendo mi front-end a mi backend, al hacer npm run build en mi frontend, hice una carpeta dist, que lueg copie con un comando desde el frontend aquí al backend, que contiene mi front-end


// let notes=[]

app.get('/', (request,response)=>{
    response.send('<h1>Hello world</h1>')

})

app.get('/api/notes', (request,response)=>{ //Ruta de todas las notas
    Note.find({}) //Con esto le estoy diciendo que busque en la colección de notas de mi db todos los objetos y me los devuelva en formato json
        .then(notes=>{
            response.json(notes)
        })
    
})

app.get('/api/notes/:id', (request,response, next)=>{ //Ruta para que nos devuelva la nota por id, con el parámetro :id los : significan el parámetro
    // const id=Number(request.params.id) //Guardamos el parámetro de nuestra ruta en id, lo pasamos a número ya que por defecto un parámetro de nuestra ruta/url es string

    // Extraer el parámetro id del objeto params de la solicitud
    const {id} = request.params //Ahora como nuestra id es un string, le quitamos el parse a number

    
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

app.delete('/api/notes/:id', (request,response, next)=>{
    // const id=Number(request.params.id)
    const {id}=request.params
    
    
    Note.findByIdAndDelete(id)
        .then(result=>{
            response.send({message:'Note has been deleted'}).end()
            
        })
        .catch(err=>next(err))
    // notes= notes.filter(note=>note.id !== id) //Aquí se guardarán todas las notas excepto la que estoy borrando
    
    // response.status(204).end() //Dame una respuesta de 204 que significa que no hay contenido
})

app.put('/api/notes/:id', (request, response, next)=>{
    const {id}=request.params
    const note=request.body

    //Aquí cuando hacemos un findByIdAndUptade, lo que nos devuelve es lo que ha encontrado por id, es decir, el objeto que está en nuestra db. Si queremos recuperar el objeto que acabamos de actualizar, debemos de decirle al método que nos devuelva el nuevo
    Note.findByIdAndUpdate(id, note, { new: true })
        .then(result=>{
            response.json(result)
        })
        .catch(err=>next(err))
})

app.post('/api/notes', (request,response)=>{ //Para hacer un post tengo que importar un modulo para la app
    const note=request.body //Aquí le estamos pasando a note, la nota que queremos crear nueva, que está en el archivo post_note.rest

    //Aquí creamos la nueva nota pasándole los datos que obtenemos del post, que los cogemos de la variable note
    const newNote = new Note({
        content: note.content,
        date: new Date(),
        important: typeof note.important !== 'undefined' ? note.important : false //Aquí le estamos diciendo que, si el objeto que creamos no tiene important, que este sea false y si contiene important, pues que se agregue
    })

    //Guardamos la nota en la base de datos con save y como nos devuelve una promesa, recuperamos la nota
    newNote.save()
        .then(savedNote=>{
            response.json(savedNote) //Nos devuelve la nota de la base de datos ya creada
        })
        .catch(err=>{
            console.error(err)
        })
    

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


app.use(require('./middleware/notFound.js'))

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(require('./middleware/handleError.js'))



// eslint-disable-next-line no-undef
const PORT= process.env.PORT
app.listen(PORT, ()=>{ //Este servidor a diferencia de http, es asíncrono, por lo que tengo que pasarle un callback indicándole que cuando termine de levantarse, me corra este console.log
    console.log('Server running on port 3001')
})
