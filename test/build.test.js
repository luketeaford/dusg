const test = require('tape')
const build = require('../lib/build')
const fs = require('fs').promises

test('The build function', async t => {
  await build({
    src: './test/data',
    dest: './test-output'
  }).catch(err => t.end(err))

  fs.readFile('./test-output/marx-bros/groucho/index.html')
    .then(async data => {
      const actualData = data.toString()
      t.ok(actualData.includes('<title>Groucho Marx</title>'), 'interprets YAML at the top of the source file as the metadata key.')
      t.ok(actualData.includes('<h1>A Heading about Groucho Marx</h1>'), 'interprets markdown in the source file as HTML.')
      await fs.rmdir('./test-output', { recursive: true })
        .catch(err => t.end(err))
    })

  fs.readFile('./test-output/very/very/very/deep/nesting/stinks/index.html')
    .then(async data => {
      t.ok(data, 'moves files in the source directory to a parallel structure in the dest directory.')
      t.pass('uses clean urls by default so that every page becomes an index page in a directory named by the source filename.')
      t.pass('changes the extensions of the files in the dest directory to ".html" if an extension is not provided.')
      fs.unlink('./test-output/very/very/very/deep/nesting/stinks/index.html')
      await fs.rmdir('./test-output', { recursive: true })
        .catch(err => t.end(err))
    })
    .catch(err => t.end(err))

  await build({
    src: './test/data',
    dest: './test-output',
    cleanUrls: false,
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
