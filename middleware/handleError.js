/* eslint-disable no-unused-vars */
//Esto sería un middleware llamado handleError, que sirve para manejar errores

const ERROR_HANDLERS = {
    CastError: response => 
        response.status(400).send({ error: 'Id used is malformed'}),

    ValidationError: (response, error) => 
        response.status(409).send({ error: error.message}),

    JsonWebTokenError: response => 
        response.status(401).json({ error: 'token missing or invalid' }),

    TokenExpirerError: response =>
        response.status(401).json( { error: 'token expired' }),

    defaultError: response => response.status(500).end()
}

module.exports = (error, request, response, next) =>{
    console.error(error)
    const handler = 
    ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

    handler (response, error)
}

// module.exports = (error, request, response, next)=>{ //Con este middleware vamos a recoger el nombre del error
//     console.error(error)

//     //Aquí decimos que si da el error con el nombre castError, que me de error 404 y si no 500
//     if(error.name==='CastError'){
//         response.status(400).send({ error: 'Id used is malformed'}).end()
//     }else if(error.name === 'ValidationError'){
//         response.status(409).end()
//     }else if (error.name === 'JsonWebTokenError'){
//         response.status(401).json({ error: 'token missing or invalid' })
//     }
    
//     else{
//         response.status(500).end()
//     }
// }