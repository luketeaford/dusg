const fs = require('fs').promises

module.exports = async (aFilepath) => {
  const data = await fs.readFile(aFilepath, { encoding: 'utf8' })
  return fs.writeFile('./index.txt', data)
}
