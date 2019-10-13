const test = require('tape')
const index = require('../index')
const fs = require('fs').promises

test('The index function creates a text file with the contents from the source file.', async t => {
  await index('./test/data/example.md').catch(err => t.end(err))
  fs.readFile('./index.txt')
    .then(async data => {
      t.equal(data.toString(), '---neat---\n')
      await fs.unlink('./index.txt')
      t.end()
    })
    .catch(err => t.end(err))
})
