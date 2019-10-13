const test = require('tape')
const index = require('../index')
const fs = require('fs').promises

const mockTemplateFn = pageData => `<title>${pageData.metadata.title}</title>`

test('The index function creates an html file in the chosen directory with the contents from the source file parsed as markdown and yaml and rendered by the supplied template function.', async t => {
  await index('./test/data/example.md', './test-public', mockTemplateFn)
    .catch(err => t.end(err))

  fs.readFile('./test-public/example.html')
    .then(async data => {
      const expected = '<title>Page Title</title>'
      t.equal(data.toString(), expected)
      await fs.unlink('./test-public/example.html')
      await fs.rmdir('./test-public')
      t.end()
    })
    .catch(err => t.end(err))
})
