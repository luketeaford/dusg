const fs = require('fs').promises
const getSourceFiles = require('./get-source-files')
const makeMapToNewPath = require('./make-map-to-new-path')
const parse = require('./parse')
const checkRequirements = require('./check-requirements')

const writeFiles = async settings => {
  const {
    src,
    dest,
    template,
    preprocessor = x => x,
    cleanUrls = true,
    extension = '.html',
    htmlKey = 'html',
    metadataKey = 'metadata',
    pathKey = 'path'
  } = settings

  const file = (cleanUrls ? '/index' : '').concat(extension)
  const mapToOutputPath = makeMapToNewPath(src, dest, file)
  const sourceFiles = await getSourceFiles(src)
  const outputFiles = sourceFiles.map(mapToOutputPath)

  const parseFile = async (aFilename, anIndex) => {
    const data = await fs.readFile(aFilename)
    const { html, metadata } = parse(data.toString())
    return {
      // Construct the complete object here
      [htmlKey]: html,
      [metadataKey]: metadata,
      [pathKey]: outputFiles[anIndex]
    }
  }

  const siteObj = await Promise.all(sourceFiles.map(parseFile))

  const createFile = async (aFileObject) => {
    const templateResult = template({ ...aFileObject })
    if (!templateResult) return
    const path = aFileObject[pathKey]
    const outputDir = path.slice(0, path.lastIndexOf('/'))
    await fs.mkdir(outputDir, { recursive: true })
    return fs.writeFile(path, templateResult)
  }

  return Promise.all(
    siteObj
      .filter(x => x[htmlKey])
      .map(preprocessor)
      .map(createFile)
  )
}

module.exports = async x => writeFiles(checkRequirements(x))
