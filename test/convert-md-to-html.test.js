const test = require('tape')
const convertMdToHtml = require('../lib/convert-md-to-html')
const fs = require('fs').promises

const mockTemplateFn = pageData => `<title>${pageData.metadata.title}</title>`

test('The convert md to html function creates an html file from the source file.', async t => {
  await convertMdToHtml('./test/data/example.md', '.', x => x)
    .catch(err => t.end(err))

  fs.readFile('./example.html')
    .then(async data => {
      t.equal(data.length > 0, true)
      await fs.unlink('./example.html')
      t.end()
    })
    .catch(err => t.end(err))
})

test('The convert md to html function uses the template function the user supplies to create an html file from the source file parsed as Markdown and YAML.', async t => {
  await convertMdToHtml('./test/data/example.md', '.', mockTemplateFn)
    .catch(err => t.end(err))

  fs.readFile('./example.html')
    .then(async data => {
      t.equal(data.toString(), '<title>Page Title</title>')
      await fs.unlink('./example.html')
      t.end()
    })
    .catch(err => t.end(err))
})

test('The convert md to html function creates an html file in the chosen directory with the contents from the source file.', async t => {
  await convertMdToHtml('./test/data/example.md', './test-public', mockTemplateFn)
    .catch(err => t.end(err))

  fs.readFile('./test-public/example.html')
    .then(async data => {
      const expected = '<title>Page Title</title>'
      t.equal(data.toString(), expected)
      fs.unlink('./test-public/example.html')
      await fs.rmdir('./test-public')
      t.end()
    })
    .catch(err => t.end(err))
})