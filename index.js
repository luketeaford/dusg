const fs = require('fs').promises
const parse = require('./lib/parse')

module.exports = async (aFilepath) => {
  const data = await fs.readFile(aFilepath)
  const template = (html, metadata) => `
<!doctype html>
<title>${metadata.title}</title>
${html}
<p>Last edited: ${metadata.date}</p>`
  const { html, metadata } = parse(data.toString())
  return fs.writeFile('./index.html', template(html, metadata))
}
