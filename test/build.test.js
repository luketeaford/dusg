const test = require('tape')
const build = require('../lib/build')
const fs = require('fs').promises

const siteTemplate = function (x) {
  const { metadata, html, siteInfo } = x
  const nav = siteInfo
    .filter(x => x.path.includes('./test-output/marx-bros'))
    .reduce((acc, cur) => {
      return `${acc}<a href="${cur.path}">${cur.metadata.title}</a>`
    }, '')
  return metadata || html
    ? `<title>${metadata ? metadata.title : ''}</title>${html}${nav}`
    : ''
}

test('The build function', async t => {
  await build({
    src: './test/data',
    dest: './test-output',
    template: siteTemplate
  })

  fs.readFile('./test-output/marx-bros/groucho/index.html')
    .then(async data => {
      const actualData = data.toString()
      t.ok(actualData.includes('<title>Groucho Marx</title>'), 'interprets YAML at the top of the source file as the metadata key.')
      t.ok(actualData.includes('<h1>A Heading about Groucho Marx</h1>'), 'interprets markdown in the source file as HTML.')
      t.ok(actualData.includes('<a href="./test-output/marx-bros/harpo/index.html">Harpo Marx</a>'), 'passes the site info into the template function so that site maps can be built.')
    })

  fs.readFile('./test-output/very/very/very/deep/nesting/stinks/index.html')
    .then(async data => {
      t.ok(data, 'moves files in the source directory to a parallel structure in the dest directory.')
      t.pass('uses clean urls by default so that every page becomes an index page in a directory named by the source filename.')
      t.pass('changes the extensions of the files in the dest directory to ".html" if an extension is not provided.')
    })

  fs.readFile('./test-output/no-content/index.html')
    .then(() => {
      t.fail('must not output a file if the template function returns an empty string.')
    })
    .catch(err => t.ok(err.message, 'does not output a file if the template function returns an empty string.'))

  fs.readdir('./test-output/no-content')
    .then(() => {
      t.fail('must not output a directory if the template function returns an empty string.')
    })
    .catch(err => t.ok(err.message, 'does not output a directory if the template function returns an empty string.'))

  fs.readFile('./test-output/no-yaml/index.html')
    .then(async data => {
      t.ok(data.toString().includes('<h1>No YAML</h1>'), 'works on source files that contain markdown but not YAML.')
    })

  fs.readFile('./test-output/not-md/index.html')
    .then(() => {
      t.fail('must not output a file if the source file does not have a ".md" extension.')
    })
    .catch(err => t.ok(err.message, 'does not output a file if the source files does not have a ".md" extension.'))

  await build({
    src: './test/data',
    dest: './test-output',
    cleanUrls: false,
    extension: '.htm',
    template: x => {
      return x && x.info ? `${x.info.title}${x.hypertext}` : ''
    },
    metadataKey: 'info',
    htmlKey: 'hypertext'
  })

  fs.readFile('./test-output/curveball.htm')
    .then(async data => {
      t.ok(data.toString().includes('configurable metadata key'), 'allows the metadata key to be configured.')
      t.ok(data.toString().includes('configurable html key'), 'allows the html key to be configured.')
      t.pass('allows the extensions of the files to be configured.')
    })

  await build({})
    .then(() => {
      t.fail('must throw an error if a template function is not provided.')
    })
    .catch(err => t.equal(err.message, 'Settings must include a template function.', 'throws an error if a template function is not provided.'))

  t.end()
})

test.onFinish(async () => {
  await fs.rmdir('./test-output', { recursive: true })
})
