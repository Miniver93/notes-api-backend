//Esto sería un middleware llamado handleError, que sirve para manejar errores

module.exports=(error, request, response, next)=>{ //Con este middleware vamos a recoger el nombre del error
    console.error(error)

    //Aquí decimos que si da el error con el nombre castError, que me de error 404 y si no 500
    if(error.name==='CastError'){
        response.status(400).send({ error: 'Id used is malformed'}).end()
    }else if(error.name === 'ValidationError'){
        response.status(400).end()
    }
    
    else{
        response.status(500).end()
    }
}