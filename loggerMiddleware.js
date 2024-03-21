//Los middleware siempre tienen que estar arriba del todo, el use son todas las peticiones que hago, post, get, delete, etc.. A no ser que queramos hacer un error 404 si ponemos otra ruta que no existe, para eso deberíamos poner abajo del todo el app.use. Ya que como ninguna ruta cumple con la que le hemos especificado en los gets y tal, pues entra en ese middleware
const logger=((request, response, next)=>{
    console.log(request.method)
    console.log(request.path)
 
    next() //El método next, hace que una vez se haya ejecutado este middleware, sija ejecutandose el código hacia abajo, si no se queda aquí

})

//Esta sería la forma de exportar módulos commonJS
module.exports=logger