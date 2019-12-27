const fs = require('fs').promises

const getSourceFiles = async function (aSourceDirectory) {
  const firstPass = await fs.readdir(aSourceDirectory, { withFileTypes: true })

  const filePathReducer = function (acc, cur) {
    const filePath = `${aSourceDirectory}/${cur.name}`
    return [...acc, cur.isDirectory() ? getSourceFiles(filePath) : filePath]
  }

  const allFiles = await Promise.all(firstPass.reduce(filePathReducer, []))
  return allFiles.flat(Infinity)
}

const makeMapToNewPath = (src, dest, file) => x => {
  return x.slice(0, x.indexOf('/index.', x.lastIndexOf('/')) >= 0
    ? x.indexOf('/index.', x.lastIndexOf('/'))
    : x.indexOf('.', x.lastIndexOf('/'))
  )
    .concat(file)
    .replace(src, dest)
}

const build = async function (settings) {
  const { src, dest, cleanUrls, extension } = settings

  const file = (cleanUrls !== false ? '/index' : '')
    .concat(extension || '.html')

  const mapToOutputPath = makeMapToNewPath(src, dest, file)

  const sourceFiles = await getSourceFiles(src)

  return Promise.all(sourceFiles.map(async function (aFilename) {
    const outputPath = mapToOutputPath(aFilename)
    const outputDir = outputPath.slice(0, outputPath.lastIndexOf('/'))

    const data = await fs.readFile(aFilename)
    await fs.mkdir(outputDir, { recursive: true })
    return fs.writeFile(outputPath, data)
  }))
}

module.exports = build
