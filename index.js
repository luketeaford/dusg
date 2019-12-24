const fs = require('fs').promises
const parse = require('./lib/parse')

const compose = (f, g) => x => f(g(x))

const getFilename = x => x.slice(x.lastIndexOf('/'))

const index = async function (aFilePath, aDestDir, aTemplateFn) {
  const data = await fs.readFile(aFilePath)
  const template = compose(aTemplateFn, parse)
  await fs.mkdir(`${aDestDir}`, { recursive: true })
  const filename = getFilename(aFilePath).replace('.md', '.html')
  return fs.writeFile(`${aDestDir}${filename}`, template(data))
}

module.exports = index
