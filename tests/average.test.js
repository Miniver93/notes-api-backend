/* eslint-disable no-undef */
const { average } = require('../utils/for_testing')

//Esto sirve para agrupar los test y para ejecutar todos los test con un mismo nombre
describe.skip('average', () => {
    test('of one value is the value itself', () => { //De un valor es el valor de el mismo
        expect(average([1])).toBe(1) //Espero que de este valor sea la media
    })
    test('of many is calculated correctly', () => { //La media is calculated correctly
        expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5) //Espero que de este valor sea la media
    })
    //Este daria 0, porque no se puede dividir entre 0
    test('of empty array is zero', () => { //De un array vacio sea 0
        expect(average([])).toBe(0) //Espero que la media sea 0

    })
})