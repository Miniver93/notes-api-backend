module.exports = (request,response)=>{ //Esta sería la forma más razonable de hacer un error 404 si queremos acceder a una url que no existe
    response.status(404).send('<h1>Error 404</h1>')
}

