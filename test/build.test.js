const test = require('tape')
const build = require('../lib/build')
const fs = require('fs').promises

test('The build function', async t => {
  await build('./test/data')
    .catch(err => t.end(err))

  fs.readFile('./test-output/very/very/very/deep/nesting/stinks.txt')
    .then(async data => {
      t.equal(data.toString().trim(), 'Something fishy', 'copies files a little.')
      fs.unlink('./test-output/very/very/very/deep/nesting/stinks.txt')
      await fs.rmdir('./test-output', { recursive: true })
        .catch(err => t.end(err))
      t.end()
    })
    .catch(err => t.end(err))
})
