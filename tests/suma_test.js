//Básicamente lo que estamos haciendo es un test para mirar si nuestro código está bien.Los asserts serían los test

//Esto sería una prueba de como hacer test, no vamos a hacer los test de esta forma, ya que tenemos herramientas que nos ayudan a hacer esto



const suma = (a, b) => {
    return a - b
}

const checks = [
    { a: 0, b: 0, result: 0},
    { a: 1, b: 3, result: 4},
    { a: -3, b: 3, result: 0}
]

checks.forEach(check => {
    const {a, b, result} = check //esto es para destructuturar el código, en cada iteracción se está guardando cada objeto { a: 0, b: 0, result: 0}, { a: 1, b: 3, result: 4} ,{ a: -3, b: 3, result: 0}

    console.assert(
        suma(a, b) === result,
        `Suma of ${a} and ${b} expected to be ${result}`
    )
})

//Esta función lo que hace es, devolverme en consola el string si el resultado es false, en este caso como la función de arriba está mal y está restando en vez de sumar, pues no devuelve 4
console.assert(
    suma(1, 3) === 4,
    'Suma of 1 and 3 expected to be 4'
)

//Esta no apareceria, ya que el resultado es true
console.assert(
    suma(0, 0) === 0,
    'Suma of 0 and 0 expected to be 0'
)


console.log(`${checks.length} checks performed ...`)