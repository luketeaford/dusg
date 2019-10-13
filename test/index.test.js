const test = require('tape')
const index = require('../index')
const fs = require('fs').promises

test('The index function creates an html file with the contents from the source file parsed as markdown and yaml.', async t => {
  await index('./test/data/example.md').catch(err => t.end(err))
  fs.readFile('./index.html')
    .then(async data => {
      const expected = `
<!doctype html>
<title>Page Title</title>
<h1>Headline</h1>
<p>Hello, world!</p>
`
      t.equal(data.toString(), expected.trim())
      await fs.unlink('./index.html')
      t.end()
    })
    .catch(err => t.end(err))
})
