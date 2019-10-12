const test = require('tape')
const index = require('../index')
const fs = require('fs').promises

test('The index function creates a text file with the contents "Hello, World!"', async t => {
  await index()
  await fs.readFile('./index.txt', { encoding: 'utf8' })
    .then(async data => {
      t.equal(data, 'Hello, world!\n')
      await fs.unlink('./index.txt')
      t.end()
    })
    .catch(err => t.end(err))
})
