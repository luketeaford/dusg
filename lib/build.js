const fs = require('fs').promises

const build = async function (aSourceDir, aDestDir) {
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
    const getOutputDirName = function (x, srcDir, lastIndex) {
      return x.slice(x.indexOf(srcDir) + srcDir.length, lastIndex)
    }

    const lastIndexOfSlash = aFilename.lastIndexOf('/')

    const outputDir = getOutputDirName(aFilename, aSourceDir, lastIndexOfSlash)

    const outputName = aFilename.slice(lastIndexOfSlash)

    await fs.mkdir(`${aDestDir}${outputDir}`, { recursive: true })
    const data = await fs.readFile(aFilename)
    return fs.writeFile(`${aDestDir}${outputDir}${outputName}`, data)
  }))
}

module.exports = build
