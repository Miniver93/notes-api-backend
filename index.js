require('dotenv').config() //Para que no de error, tengo que iniciar la dependencia dotenv con el método config. Esto siempre lo tenemos que iniciar lo primero del todo, esto por defecto buscará el archivo .env
require('./mongo.js') //Como no voy a usar ninguna variable y lo único que voy a hacer es conectarme a la base de datos, lo que hará esto es añadir el módulo ejecutándolo sin yo hacer nada más
const Sentry = require('@sentry/node')
const { nodeProfilingIntegration } = require('@sentry/profiling-node')

const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes.js')

const express=require('express')
const cors=require('cors')

const app = express() //Con esto creo un servidor express, es un framework que me permite hacer servidores sencillamente


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



app.use('/api/users', usersRouter) //Con esto estoy diciendo que mi aplicación use el controlador de users
app.use('/api/notes', notesRouter) //Con esto estoy diciendo que mi aplicación use el controlador de users

app.use(require('./middleware/notFound.js'))

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(require('./middleware/handleError.js'))



// eslint-disable-next-line no-undef
const PORT= process.env.PORT
//app.listen me devuelve un objeto server que representa el servidor http creado, que despues sirve para hacer operaciones adicionales, como cerrarlo después
const server = app.listen(PORT, ()=>{ //Este servidor a diferencia de http, es asíncrono, por lo que tengo que pasarle un callback indicándole que cuando termine de levantarse, me corra este console.log
    console.log('Server running on port 3001')
})

module.exports = {app, server} //Aquí estoy exportando tanto la aplicación express como el servidor http