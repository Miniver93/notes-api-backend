const jwt = require('jsonwebtoken')

module.exports = (request, response, next) =>{
    //Esto es una opción de express, sin express sería request.headers...
    const authorization = request.get('authorization') //Con esto recupero la cabezera authorization

    let token = ''
    //Lo pasamos a lowerCase porque lo que nos pasa que sería Bearer..token.. puede ser en minúsculas, mayúsculas etc... y validamos que la primera palabra tenga bearer
    if(authorization && authorization.toLowerCase().startsWith('bearer')) { 
        token = authorization.substring(7) //Al devolvernos "bearer 423423aer2342342" nosotros lo que queremos es el token, por eso le decimos que nos devuelva el substring a partir de la posición 7
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_WORD) //Verificamos si el token coincide con nuestra palabra secreta y lo decodificamos

   

    //Si no tenemos token o no tenemos en el token la id del usuario
    if(!token ||!decodedToken.id){
        return response.status(401).json({ error: 'token missing or invalid'})
    }
    //Cojo la id del usuario desde el token
    const { id: userId} = decodedToken
    request.userId = userId //Aquí estamos cogiendo la id de nuestro token del usuario y estamos mutando nuestra request para que ahora tenga un parámetro llamado userId que contendrá la id de nuestro usuario, que nos servirá para usarla después

    next() //Una vez se ejecute todo el código, ejecuta lo siguiente
}