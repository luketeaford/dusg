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
  try {
    const data = await fs.readFile('./test-output/index.html')
    const dataString = data.toString()
    t.ok(
      dataString.includes('<title>Welcome to my webpage!</title>'),
      'parses YAML at the top of a source file and assigns the value to the metadata key.'
    )

    t.ok(
      dataString.includes('<h1>Hello, world!</h1>'),
      'parses markdown in a source file and assigns the value to the html key.'
    )
  } catch (err) {
    t.fail(err)
  }

  try {
    const data = await fs.readFile('./test-output/no-yaml/index.html')
    t.ok(
      data.toString().includes('<h1>No YAML</h1>'),
      'outputs a file for source files that contain markdown but not YAML.'
    )
  } catch (err) {
    t.fail(err)
  }

  try {
    const data = await fs.readFile('./test-output/very/deep/nesting/stinks/index.html')
    t.ok(data, 'moves files in the source directory to a parallel structure in the dest directory.')
    t.pass('uses clean urls by default so that every page becomes an index page in a directory named by the source filename.')
    t.pass('changes the extensions of the files in the dest directory to ".html" if an extension is not provided.')
  } catch (err) {
    t.fail(err)
  }

  // Test that files and directories are not created
  try {
    await fs.readdir('./test-output/not-md')
    t.fail('must not output a directory if the source file does not have a ".md" extension.')
  } catch (err) {
    t.ok(err.message, 'does not output a directory if the source file does not have a ".md" extension.')
  }

  try {
    await fs.readFile('./test-output/not-md/index.html')
    t.fail('must not output a file if the source file does not have a ".md" extension.')
  } catch (err) {
    t.ok(err.message, 'does not output a file if the source file does not have a ".md" extension.')
  }

  try {
    await fs.readdir('./test-output/private-metadata')
    t.fail('must not output a directory if the template returns an empty string.')
  } catch (err) {
    t.ok(err.message, 'does not output a directory if the template returns an empty string.')
  }

  try {
    await fs.readFile('./test-output/private-metadata/index.html')
    t.fail('must not output a file if the template returns an empty string.')
  } catch (err) {
    t.ok(err.message, 'does not output a file if the template returns an empty string.')
  }

  // Test site map, root relative url and stats times
  await build({
    src: './test/data',
    dest: './test-output/test-site-map',
    template: aPageObject => {
      const { pageObjects } = aPageObject

      const grouchoPageObject = pageObjects.find(element => element.rootRelativeUrl === '/marx-bros/groucho/index.html')

      const { path, metadata: pageMetadata, stats } = grouchoPageObject

      const {
        atime,
        atimeMs,
        mtime,
        mtimeMs,
        ctime,
        ctimeMs,
        birthtime,
        birthtimeMs
      } = stats || {}

      const hasStatsTimes = atimeMs &&
        mtimeMs &&
        ctimeMs &&
        birthtimeMs &&
        atime &&
        mtime &&
        ctime &&
        birthtime &&
        'stats included'

      return `<a href="${path}">${pageMetadata && pageMetadata.title}</a>${hasStatsTimes}`
    }
  })

  try {
    const data = await fs.readFile('./test-output/test-site-map/marx-bros/index.html')
    const dataString = data.toString()
    t.ok(
      dataString.includes('<a href="./test-output/test-site-map/marx-bros/groucho/index.html">Groucho Marx</a>'),
      'includes an array named pageObjects containing each pageObject that makes up the site.'
    )
    t.ok(
      dataString.includes('stats included'),
      'each file has its stats object.'
    )
  } catch (err) {
    t.fail(err)
  }

  // Test configurations
  await build({
    src: './test/data',
    dest: './test-output/test-configuration',
    cleanUrls: false,
    extension: '.htm',
    template: aPageObject => 'any data'
  })

  try {
    const data = await fs.readFile('./test-output/test-configuration/curveball.htm')
    t.ok(data, 'allows the extensions of the files to be configured.')
  } catch (err) {
    t.fail(err)
  }

  // Test for required settings
  try {
    await build()
    t.fail('must throw an error if a settings object is not provided.')
  } catch (err) {
    t.equal(
      err.message,
      'A settings object must be provided.',
      'throws an error if a settings object is not provided.'
    )
  }

  try {
    await build({ src: '' })
    t.fail('must throw an error if a source directory is not provided.')
  } catch (err) {
    t.equal(
      err.message,
      'Settings must include a source directory string.',
      'throws an error if a source directory is not provided.'
    )
  }

  try {
    await build({ src: './test/data' })
    t.fail('must throw an error if a destination directory is not provided.')
  } catch (err) {
    t.equal(
      err.message,
      'Settings must include a destination directory string.',
      'throws an error if a destination directory is not provided.'
    )
  }

  try {
    await build({ src: './test/data', dest: './test-output' })
    t.fail('must throw an error if a template function is not provided.')
  } catch (err) {
    t.equal(
      err.message,
      'Settings must include a template function.',
      'throws an error if a template function is not provided.'
    )
  }

  try {
    await build({
      src: './test/data',
      dest: './test-output',
      template: 'no'
    })
    t.fail('must throw an error if the template is not a function.')
  } catch (err) {
    t.equal(
      err.message,
      'Settings must include a template function.',
      'throws an error if the template is not a function.'
    )
  }

  // Test CLI basic usage
  try {
    const data = await fs.readFile('./test-output/test-cli/index.html')
    const dataString = data.toString()
    t.ok(
      dataString.includes('<title>Welcome to my webpage!</title>'),
      'parses YAML at the top of a source file and assigns the value to the metadata key.'
    )

    t.ok(
      dataString.includes('<h1>Hello, world!</h1>'),
      'can be called from the command line.'
    )
  } catch (err) {
    t.fail(err)
  }

  // Test CLI aliases and settings
  try {
    const data = await fs.readFile('./test-output/test-cli/marx-bros/harpo.txt')
    t.equal(
      data.toString(),
      'Harpo Marx',
      'can be called from the command line and all the options and single-letter aliases are supported.'
    )
  } catch (err) {
    t.fail(err)
  }
})

test.onFinish(async () => {
  await fs.rm('./test-output', { recursive: true })
})
