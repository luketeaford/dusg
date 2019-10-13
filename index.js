const fs = require('fs').promises

module.exports = async (aFilepath) => {
  const data = await fs.readFile(aFilepath)
  return fs.writeFile('./index.txt', data)
}
