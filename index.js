const fs = require('fs').promises
const parse = require('./lib/parse')

const index = async function (aFilePath) {
  const data = await fs.readFile(aFilePath)
  const template = (html, metadata) => `
<!doctype html>
<title>${metadata.title}</title>
${html}`.trim()
  const { html, metadata } = parse(data.toString())
  return fs.writeFile('./index.html', template(html, metadata))
}

module.exports = index
