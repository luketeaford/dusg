const fs = require('fs').promises
const parse = require('./parse')

const getSourceFiles = async function (aSourceDirectory) {
  const firstPass = await fs.readdir(aSourceDirectory, { withFileTypes: true })

  const filePathReducer = function (acc, cur) {
    const filePath = `${aSourceDirectory}/${cur.name}`

    return [
      ...acc,
      cur.isDirectory()
        ? getSourceFiles(filePath)
        : cur.name.endsWith('.md') && filePath
    ].filter(x => x)
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
  const { src, dest, cleanUrls, extension, template, metadataKey = 'metadata', htmlKey = 'html' } = settings

  if (!template) {
    throw Error('You must provide a template function in the settings object passed to build.')
  }

  const file = (cleanUrls !== false ? '/index' : '')
    .concat(extension || '.html')

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
      path: outputFiles[anIndex],
      template
    }
  }))

  return Promise.all(siteObj.map(async function (fileObj, anIndex, siteInfo) {
    const { path, template } = fileObj
    const foo = {
      [htmlKey]: fileObj[htmlKey],
      [metadataKey]: fileObj[metadataKey]
    }

    if (!foo[htmlKey]) return

    const outputDir = path.slice(0, path.lastIndexOf('/'))
    await fs.mkdir(outputDir, { recursive: true })

    const templateResult = template({ ...foo, siteInfo })
    return fs.writeFile(path, templateResult)
  }))
}

module.exports = build
