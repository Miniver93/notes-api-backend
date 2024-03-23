/* eslint-disable no-undef */
const mongoose=require('mongoose')

const connectionString = process.env.MONGO_DB_URI //Esto está en el archivo env

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
