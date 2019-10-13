const fs = require('fs').promises
const parse = require('./lib/parse')

const compose = (f, g) => x => f(g(x))

const index = async function (aFilePath, aDestDir, aTemplateFn) {
  const data = await fs.readFile(aFilePath)
  const template = compose(aTemplateFn, parse)
  await fs.mkdir(`${aDestDir}`, { recursive: true })
  return fs.writeFile(`${aDestDir}/example.html`, template(data))
}

module.exports = index
