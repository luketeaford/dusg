const fs = require('fs').promises

const build = async function (aSourceDir) {
  const getSourceFiles = async function (srcDir) {
    const firstPass = await fs.readdir(srcDir, { withFileTypes: true })

    const filePathReducer = function (acc, cur) {
      const filePath = `${srcDir}/${cur.name}`
      return [...acc, cur.isDirectory() ? getSourceFiles(filePath) : filePath]
    }

    const allFiles = await Promise.all(firstPass.reduce(filePathReducer, []))
    return allFiles.flat(Infinity)
  }

  const sourceFiles = await getSourceFiles(aSourceDir)
  return Promise.all(sourceFiles.map(async function (aFilename) {
    const data = await fs.readFile(aFilename)
    const weirdDir = aFilename.slice(aFilename.indexOf(aSourceDir) + aSourceDir.length, aFilename.lastIndexOf('/'))
    await fs.mkdir(`./test-output${weirdDir}`, { recursive: true })
    const outputName = aFilename.slice(aFilename.lastIndexOf('/'))
    return fs.writeFile(`./test-output${weirdDir}${outputName}`, data)
  }))
}

module.exports = build
