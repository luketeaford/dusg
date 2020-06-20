const test = require('tape')
const build = require('../lib/build')
const fs = require('fs').promises

test('The build function', async t => {
  await build({
    src: './test/data',
    dest: './test-output',
    template: aPageObject => {
      const { metadata, html } = aPageObject
      if (metadata && metadata.private === true) return
      return `<title>${metadata && metadata.title}</title>${html}`
    }
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

  // Test site map
  await build({
    src: './test/data',
    dest: './test-output/test-site-map',
    template: aPageObject => {
      const { siteMap } = aPageObject

      const { path, metadata: pageMetadata } = siteMap['/marx-bros/groucho/index.html']

      return `<a href="${path}">${pageMetadata && pageMetadata.title}</a>`
    }
  })

  fs.readFile('./test-output/test-site-map/marx-bros/index.html')
    .then(async data => {
      t.equal(data.toString(), '<a href="./test-output/test-site-map/marx-bros/groucho/index.html">Groucho Marx</a>', 'includes a siteMap object with keys for the path of each file.')
    })
    .catch(err => t.fail(err))

  // Test configurations
  await build({
    src: './test/data',
    dest: './test-output/test-configuration',
    cleanUrls: false,
    extension: '.htm',
    template: aPageObject => 'any data'
  })

  fs.readFile('./test-output/test-configuration/curveball.htm')
    .then(async data => {
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

  // Test CLI basic usage
  fs.readFile('./test-output/test-cli/index.html')
    .then(async data => {
      t.ok(data.toString().includes('<title>Welcome to my webpage!</title>'), 'parses YAML at the top of a source file and assigns the value to the metadata key.')

      t.ok(data.toString().includes('<h1>Hello, world!</h1>'), 'parses markdown in a source file and assigns the value to the html key.')
    })
    .catch(err => t.fail(err))

  t.end()
})

test.onFinish(async () => {
  await fs.rmdir('./test-output', { recursive: true })
})
