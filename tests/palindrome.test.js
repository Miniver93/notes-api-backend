/* eslint-disable no-undef */
const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of jose', () => { //Aquí hacemos un test con el nombre que nosotros queramos
    const result = palindrome('jose')

    expect(result).toBe('esoj') //Aquí estamos diciendole que espero que este resultado sea el que le estamos pasando con toBe
})

test.skip('palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
})

test.skip('palindrome of empty undefined', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})