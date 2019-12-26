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

const sliceBetween = (a, b) => x => x.slice(x.indexOf(a) + a.length, x.lastIndexOf(b))
const sliceAfterLast = a => x => x.slice(x.lastIndexOf(a))
const sliceAfterLastSlash = sliceAfterLast('/')
const sliceBefore = a => x => x.slice(0, x.indexOf(a))
const sliceBeforeDot = sliceBefore('.')
const compose = (f, g) => x => f(g(x))
const prepend = x => y => `${x}${y}`
const append = x => y => `${y}${x}`

const build = async function (settings) {
  const { src, dest, extension } = settings

  const sourceFiles = await getSourceFiles(src)

  const prependDestDir = prepend(dest)
  const getFilePath = sliceBetween(src, '/')
  const makeOutputDirName = compose(prependDestDir, getFilePath)

  return Promise.all(sourceFiles.map(async function (aFilename) {
    const outputDirName = makeOutputDirName(aFilename)
    const makeOutputPath = [
      sliceAfterLastSlash,
      sliceBeforeDot,
      append(extension || '.html'),
      prepend(outputDirName)
    ].reduceRight(compose)
    const outputPath = makeOutputPath(aFilename)
    const data = await fs.readFile(aFilename)
    await fs.mkdir(outputDirName, { recursive: true })
    return fs.writeFile(outputPath, data)
  }))
}

module.exports = build
