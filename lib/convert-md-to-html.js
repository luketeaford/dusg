const fs = require('fs').promises
const parse = require('./parse')
const compose = (f, g) => x => f(g(x))

const stringAfter = char => x => x.slice(x.lastIndexOf(char) + 1)
const stringUntil = char => x => x.slice(0, x.indexOf(char))

const makeFilename = compose(stringUntil('.'), stringAfter('/'))

const convertMdToHtml = async function (aFilePath, aDestDir, aTemplateFn) {
  const data = await fs.readFile(aFilePath)
  const template = compose(aTemplateFn, parse)
  await fs.mkdir(`${aDestDir}`, { recursive: true })
  const filename = makeFilename(aFilePath)
  return fs.writeFile(`${aDestDir}/${filename}.html`, template(data))
}

module.exports = convertMdToHtml
