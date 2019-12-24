const test = require('tape')
const renamePath = require('../lib/rename-path')

// Note: These tests can be deleted once the public API is completed.

test('The renamePath function changes the extension from md to html.', t => {
  t.equal(renamePath('./a/b/c/foo.md', { useCleanUrls: false }), './a/b/c/foo.html')
  t.end()
})

test('The rename function creates a directory for each file when the useCleanUrls option is set to true.', t => {
  t.equal(renamePath('./a.md', { useCleanUrls: true }), './a/index.html')
  t.end()
})

test('The rename function creates directories to any depth for each file when the useCleanUrls option is set to true.', t => {
  t.equal(renamePath('./a/b/c/d/e.md', { useCleanUrls: true }), './a/b/c/d/e/index.html')
  t.end()
})

test('The rename function does not make an index directory for files already named index.md when the useCleanUrls option is set to true.', t => {
  t.equal(renamePath('./photos/index.md', { useCleanUrls: true }), './photos/index.html')
  t.end()
})
