const test = require('tape')
const build = require('../lib/build')
const fs = require('fs').promises

const mockTemplateFn = pageData => `<title>${pageData.metadata.title}</title>`

test('The build function creates an html file from each markdown file in a directory.', async t => {
  await build('./test/data/marx-bros', './test-marx', mockTemplateFn)
    .catch(err => t.end(err))

  fs.readFile('./test-marx/harpo.html')
    .then(async data => {
      const expected = '<title>Harpo</title>'
      t.equal(data.toString(), expected)
      fs.unlink('./test-marx/chico.html')
      fs.unlink('./test-marx/groucho.html')
      fs.unlink('./test-marx/harpo.html')
      await fs.rmdir('./test-marx')
      t.end()
    })
    .catch(err => t.end(err))
})
