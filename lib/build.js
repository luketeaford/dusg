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
    cleanUrls = true,
    extension = '.html'
  } = settings

  const file = (cleanUrls ? '/index' : '').concat(extension)
  const mapToOutputPath = makeMapToNewPath(src, dest, file)
  const sourceFiles = await getSourceFiles(src)
  const outputFiles = sourceFiles.map(mapToOutputPath)

  const parseFile = async (aFilename, anIndex) => {
    const stats = await fs.stat(aFilename)
    const data = await fs.readFile(aFilename)
    return {
      ...parse(data.toString()),
      path: outputFiles[anIndex],
      rootRelativeUrl: outputFiles[anIndex].slice(dest.length),
      stats
    }
  }

  const siteObject = await Promise.all(sourceFiles.map(parseFile))

  const createFile = async (aPageObject) => {
    const templateResult = template({ ...aPageObject })
    if (!templateResult) return

    const path = aPageObject.path
    const outputDir = path.slice(0, path.lastIndexOf('/'))
    await fs.mkdir(outputDir, { recursive: true })
    return fs.writeFile(path, templateResult)
  }

  return Promise.all(siteObject.map(x => createFile({ ...x, siteObject })))
}

module.exports = async x => writeFiles(checkRequirements(x))
