const test = require('tape')
const build = require('../lib/build')
const fs = require('fs').promises

const simpleTemplate = x => {
  const { metadata, html, siteMap } = x

  if (metadata && metadata.private === true) return

  return metadata || html
    ? `<title>${metadata ? metadata.title : ''}</title>${html}${siteMap}`
    : ''
}

test('The build function', async t => {
  await build({
    src: './test/data',
    dest: './test-output',
    template: simpleTemplate
  })

  // Test parsing YAML and markdown
  fs.readFile('./test-output/index.html')
    .then(async data => {
      t.ok(data.toString().includes('<title>Welcome to my webpage!</title>'), 'parses YAML at the top of a source file and assigns the value to the metadata key.')

      t.ok(data.toString().includes('<h1>Hello, world!</h1>'), 'parses markdown in a source file and assigns the value to the html key.')
    })
    .catch(err => t.fail(err))

  fs.readFile('./test-output/no-yaml/index.html')
    .then(async data => {
      t.ok(data.toString().includes('<h1>No YAML</h1>'), 'outputs a file for source files that contain markdown but not YAML.')
    })
    .catch(err => t.fail(err))

  fs.readFile('./test-output/very/deep/nesting/stinks/index.html')
    .then(async data => {
      t.ok(data, 'moves files in the source directory to a parallel structure in the dest directory.')
      t.pass('uses clean urls by default so that every page becomes an index page in a directory named by the source filename.')
      t.pass('changes the extensions of the files in the dest directory to ".html" if an extension is not provided.')
    })
    .catch(err => t.fail(err))

  // Test that files and directories are not created
  fs.readdir('./test-output/not-md')
    .then(() => {
      t.fail('must not output a directory if the source file does not have a ".md" extension.')
    })
    .catch(err => t.ok(err.message, 'does not output a directory if the source file does not have a ".md" extension.'))

  fs.readFile('./test-output/not-md/index.html')
    .then(() => {
      t.fail('must not output a file if the source file does not have a ".md" extension.')
    })
    .catch(err => t.ok(err.message, 'does not output a file if the source file does not have a ".md" extension.'))

  fs.readdir('./test-output/no-content')
    .then(() => {
      t.fail('must not output a directory if the source file does not contain markdown.')
    })
    .catch(err => t.ok(err.message, 'does not output a directory if the source file does not contain markdown.'))

  fs.readFile('./test-output/no-content/index.html')
    .then(() => {
      t.fail('must not output a file if the source file does not contain markdown.')
    })
    .catch(err => t.ok(err.message, 'does not output a file if the source file does not contain markdown.'))

  fs.readdir('./test-output/private-metadata')
    .then(() => {
      t.fail('must not output a directory if the template returns an empty string.')
    })
    .catch(err => t.ok(err.message, 'does not output a directory if the template returns an empty string.'))

  fs.readFile('./test-output/private-metadata/index.html')
    .then(() => {
      t.fail('must not output a file if the template returns an empty string.')
    })
    .catch(err => t.ok(err.message, 'does not output a file if the template returns an empty string.'))

  // Test configurations
  const testCustomKeysTemplate = x => {
    const { info, hypertext, outputPath } = x
    return info && hypertext && outputPath
      ? 'configurable metadata key configurable html key configurable path key'
      : ''
  }

  await build({
    src: './test/data',
    dest: './test-output',
    cleanUrls: false,
    extension: '.htm',
    template: testCustomKeysTemplate,
    metadataKey: 'info',
    htmlKey: 'hypertext',
    filesKey: 'siteFiles',
    pathKey: 'outputPath',
    inputPathKey: 'sourcePath',
    destKey: 'outputDir'
  })

  fs.readFile('./test-output/curveball.htm')
    .then(async data => {
      t.ok(data.toString().includes('configurable metadata key'), 'allows the metadata key to be configured.')
      t.ok(data.toString().includes('configurable html key'), 'allows the html key to be configured.')
      t.ok(data.toString().includes('configurable path key'), 'allows the path key to be configured.')

      t.pass('allows the extensions of the files to be configured.')
    })
    .catch(err => t.fail(err))

  // Test for required settings
  await build({ src: '' })
    .then(() => {
      t.fail('must throw an error if a source directory is not provided.')
    })
    .catch(err => t.equal(err.message, 'Settings must include a source directory.', 'throws an error if a source directory is not provided.'))

  await build({ src: './test/data' })
    .then(() => {
      t.fail('must throw an error if a destination directory is not provided.')
    })
    .catch(err => t.equal(err.message, 'Settings must include a destination directory.', 'throws an error if a destination directory is not provided.'))

  await build({ src: './test/data', dest: './test-output' })
    .then(() => {
      t.fail('must throw an error if a template function is not provided.')
    })
    .catch(err => t.equal(err.message, 'Settings must include a template function.', 'throws an error if a template function is not provided.'))

  t.end()
})

test.onFinish(async () => {
  await fs.unlink('./test-output.htm')
  await fs.rmdir('./test-output', { recursive: true })
})
