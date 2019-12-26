const fs = require('fs').promises

const getSourceFiles = async function (srcDir) {
  const firstPass = await fs.readdir(srcDir, { withFileTypes: true })

  const filePathReducer = function (acc, cur) {
    const filePath = `${srcDir}/${cur.name}`
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

const build = async function (aSourceDir, aDestDir) {
  const sourceFiles = await getSourceFiles(aSourceDir)

  const prependDestDir = prepend(aDestDir)
  const getFilePath = sliceBetween(aSourceDir, '/')
  const makeOutputDirName = compose(prependDestDir, getFilePath)
  const makeOutputName = [
    sliceAfterLastSlash,
    sliceBeforeDot,
    append('.html')
  ].reduceRight(compose)

  return Promise.all(sourceFiles.map(async function (aFilename) {
    const outputDir = makeOutputDirName(aFilename)
    const outputName = makeOutputName(aFilename)
    const data = await fs.readFile(aFilename)
    await fs.mkdir(outputDir, { recursive: true })
    return fs.writeFile(`${outputDir}${outputName}`, data)
  }))
}

module.exports = build
