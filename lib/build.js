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
    extension = '.html',
    htmlKey = 'html',
    metadataKey = 'metadata',
    filesKey = 'files'
  } = settings

  const file = (cleanUrls ? '/index' : '').concat(extension)
  const mapToOutputPath = makeMapToNewPath(src, dest, file)
  const sourceFiles = await getSourceFiles(src)
  const outputFiles = sourceFiles.map(mapToOutputPath)
  const nameKeys = x => ({ [htmlKey]: x.html, [metadataKey]: x.metadata })

  const siteObj = await Promise.all(sourceFiles.map(
    async (aFilename, anIndex) => {
      const data = await fs.readFile(aFilename)
      return {
        ...nameKeys(parse(data.toString())),
        path: outputFiles[anIndex],
        inputPath: aFilename
      }
    }
  ))

  return Promise.all(siteObj.map(
    async (fileObj, anIndex, siteInfo) => {
      const { path, inputPath } = fileObj
      const htmlAndMetadata = {
        [htmlKey]: fileObj[htmlKey],
        [metadataKey]: fileObj[metadataKey],
        [filesKey]: siteInfo,
        inputPath: inputPath
      }

      if (!htmlAndMetadata[htmlKey]) return

      const outputDir = path.slice(0, path.lastIndexOf('/'))
      await fs.mkdir(outputDir, { recursive: true })

      const templateResult = template({ ...htmlAndMetadata })
      return fs.writeFile(path, templateResult)
    }
  ))
}

const build = async x => writeFiles(checkRequirements(x))

module.exports = build
