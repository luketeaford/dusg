const convert = require('./convert-md-to-html')
const fs = require('fs').promises

const build = async function (someFiles, aDestDir, aTemplateFn) {

  const writeFile = x => convert(`${someFiles}/${x}`, aDestDir, aTemplateFn)

  const filenames = await fs.readdir(someFiles)

  return Promise.all(filenames.map(writeFile))
}

module.exports = build
