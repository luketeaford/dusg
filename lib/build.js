const fs = require('fs').promises
const getSourceFiles = require('./get-source-files')
const makeMapToNewPath = require('./make-map-to-new-path')
const parse = require('./parse')
const checkRequirements = require('./check-requirements')

const build = async settings => {
  checkRequirements(settings)

  const {
    src,
    dest,
    template,
    cleanUrls = true,
    extension = '.html',
    htmlKey = 'html',
    metadataKey = 'metadata'
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
        path: outputFiles[anIndex]
      }
    }
  ))

  return Promise.all(siteObj.map(
    async (fileObj, anIndex, siteInfo) => {
      const { path } = fileObj
      const htmlAndMetadata = {
        [htmlKey]: fileObj[htmlKey],
        [metadataKey]: fileObj[metadataKey]
      }

      if (!htmlAndMetadata[htmlKey]) return

      const outputDir = path.slice(0, path.lastIndexOf('/'))
      await fs.mkdir(outputDir, { recursive: true })

      const templateResult = template({ ...htmlAndMetadata, siteInfo })
      return fs.writeFile(path, templateResult)
    }
  ))
}

module.exports = build
