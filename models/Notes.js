const mongoose=require('mongoose')

//Al ser una clase Schema, tengo que crear un objeto de esa clase.
//El schema contendrá el esquema de mi database, como tienen que estar definidas las propiedades dentro de mi db
const noteScheema= new mongoose.Schema({ 
    content: String,
    date: Date,
    important: Boolean
})

//Aquí le estoy dando una configuración al Json, para que a la hora que me devuelva las notas, me las devuelva como yo quiero
noteScheema.set('toJSON', {
    transform: (document, returnedObject)=>{ //ReturnedObject sería las notas que estoy recuperando
        returnedObject.id = returnedObject._id //Aquí estoy diciendole que me devuelva mi json con un parámetro llamado id, que lo cojo de _id
        delete returnedObject.__v
        delete returnedObject._id //Delete no se suele utilizar porque es una mala practica, pero aquí si se puede utilizar porque no estamos mutando el objeto que hay en la base de datos, estamos si no mutando el objeto que nos devuelve, que no pasa nada por mutarlo ya que no modifica el objeto en la base de datos, el objeto que recuperamos es una visual de él
    }

})

/*Con esto estamos creando un modelo/colección en nuestra base de datos llamado notes, ya que al crearse se pasa a minúsuculas y se pone una s al final
--------------IMPORTANTE-----------------------------
Esto nos servirá solo a nivel de aplicación, para que creemos notas desde aquí con un esquema predefinido y al trabajar desde aquí que no nos permita poner lo que nos de la gana en cada parámetro, por ejemplo en content poner un booleano o un int.
Pero si añadimos una nota desde un gui de mongo, por ejemplo en studio 3T, podremos crear la nota con el tipo que a nosotros nos de la gana, ejemplo: content: array[]*/
const Note = mongoose.model('Note', noteScheema)


//Esto nos sirve para buscar en la base de datos 
// Note.find({}).then(result=>{
//     console.log(result)
//     mongoose.connection.close()
// })

module.exports = Note