//Un palindrome es una palabra dada la vuelta, lo que sería el espejo
const palindrome = (string) => {
    if (typeof string === 'undefined') return //Con esto le estamos indicando que si añadimos un string vacio, que nos devuelva undefined
    return string
        .split('') //Divido el string en carácteres
        .reverse() //Doy la vuelta a esos carácteres
        .join('') //Volvemos a juntar el array y lo volvemos a convertir en un string
}

const average = array => {
    if(typeof array ==='undefined' || array.length === 0) return 0
    let suma = 0 
    array.forEach(num =>{ suma += num}) //Con esto lo que hago es, en cada iteracción del array voy incrementando en suma los valores de nuestro array
    return suma / array.length //Aquí estoy devolviendo la suma de todos los numeros entre la longitud de mi array
}

module.exports = {
    palindrome,
    average
}