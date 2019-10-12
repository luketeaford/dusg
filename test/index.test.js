const test = require('tape')
const index = require('../index')

test('The index function returns "Hello, World!"', t => {
  t.equal(index(), 'Hello, World!')
  t.end()
})
