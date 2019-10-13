const test = require('tape')
const parse = require('../lib/parse')

test('The parse function takes a string containing YAML and Markdown and returns an object with an html key containing the parsed Markdown.', t => {
  const mockData = `
---
title: whatever
---
# cool`
  t.equal(parse(mockData).html, '<h1>cool</h1>\n')
  t.end()
})

test('The parse function takes a string containing YAML and Markdown and returns an object with a metadata key containg the parsed YAML.', t => {
  const mockData = `
---
title: whatever
---
# cool`
  t.equal(parse(mockData).metadata.title, 'whatever')
  t.end()
})
