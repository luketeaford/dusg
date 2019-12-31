const fs = require('fs').promises
const getSourceFiles = require('./getSourceFiles')
const makeMapToNewPath = require('./makeMapToNewPath')
const parse = require('./parse')

const build = async function (settings) {
  const {
    src,
    dest,
    template,
    cleanUrls = true,
    extension = '.html',
    htmlKey = 'html',
    metadataKey = 'metadata'
  } = settings

  if (!template) {
    throw Error('You must provide a template function in the settings object passed to build.')
  }

  const file = (cleanUrls ? '/index' : '').concat(extension)

  const mapToOutputPath = makeMapToNewPath(src, dest, file)

  const sourceFiles = await getSourceFiles(src)
  const outputFiles = sourceFiles.map(mapToOutputPath)

  const nameKeys = x => {
    const { html, metadata } = x
    return {
      [htmlKey]: html,
      [metadataKey]: metadata
    }
  }

  const siteObj = await Promise.all(sourceFiles.map(async function (aFilename, anIndex) {
    const data = await fs.readFile(aFilename)
    return {
      ...nameKeys(parse(data.toString())),
      path: outputFiles[anIndex]
    }
  }))

  return Promise.all(siteObj.map(async function (fileObj, anIndex, siteInfo) {
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
  }))
}

module.exports = build
