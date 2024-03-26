/* eslint-disable no-undef */
const mongoose=require('mongoose')

const {MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env //Guardo todas mis variables de entorno 


const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI //Aquí cojo una db según el entorno de desarrollo que este ejecutando en ese momento

//Conexión a mongoDB
mongoose.connect(connectionString)
    .then(()=>{
        console.log('Database connected')
    }).catch(err=>{
        console.error(err)
    })

//Con esto estoy diciendo de que si hay un error que no se ha capturado, se cierre la conexión de mongo
process.on('uncaughtException', () => {
    mongoose.disconnect()
})




// //Creamos una nota
// const note = new Note({
//     content: 'Probando',
//     date: new Date(),
//     important: true
// })


// //Con esto guardamos nuestra nota en la base de datos
// note.save()
//     .then(result=>{
//         console.log(result)
//         mongoose.connection.close() //Una vez que hagamos lo que tengamos que hacer, cerramos la conexión de mongoose
//     })
//     .catch(err=>{
//         console.error(err)
//         mongoose.connection.close()
//     })
