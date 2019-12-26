const test = require('tape')
const build = require('../lib/build')
const fs = require('fs').promises

test('The build function', async t => {
  await build({
    src: './test/data',
    dest: './test-output'
  })
    .catch(err => t.end(err))

  fs.readFile('./test-output/very/very/very/deep/nesting/stinks.html')
    .then(async data => {
      t.ok(data, 'moves files in the source directory to a parallel structure in the dest directory.')
      t.pass('changes the extensions of the files in the dest directory to ".html" if an extension is not provided.')
      fs.unlink('./test-output/very/very/very/deep/nesting/stinks.html')
      await fs.rmdir('./test-output', { recursive: true })
        .catch(err => t.end(err))
    })
    .catch(err => t.end(err))

  await build({
    src: './test/data',
    dest: './test-output',
    extension: '.htm'
  })
    .catch(err => t.end(err))

  fs.readFile('./test-output/whatever.htm')
    .then(async data => {
      t.pass('allows the extensions of the files to be configured.')
      fs.unlink('./test-output/whatever.htm')
      await fs.rmdir('./test-output', { recursive: true })
        .catch(err => t.end(err))
    })
    .catch(err => t.end(err))

  t.end()
})
