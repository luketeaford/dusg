const fs = require('fs').promises
const parse = require('./parse')

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

const compose = (f, g) => x => f(g(x))

const build = async function (settings) {
  const { src, dest, cleanUrls, extension, templateFn } = settings

  if (!templateFn) {
    throw Error('You must provide a template function in the settings object passed to build.')
  }

  const file = (cleanUrls !== false ? '/index' : '')
    .concat(extension || '.html')

  const mapToOutputPath = makeMapToNewPath(src, dest, file)

  const sourceFiles = await getSourceFiles(src)
  const outputFiles = sourceFiles.map(mapToOutputPath)

  const tempTemplateFn = function (x) {
    const { metadata, html } = x
    return metadata || html
      ? `<!DOCTYPE html><title>${metadata ? metadata.title : ''}</title>${html}`
      : ''
  }

  const template = compose(tempTemplateFn, parse)

  return Promise.all(sourceFiles.map(async function (aFilename, anIndex) {
    const outputPath = outputFiles[anIndex]
    const outputDir = outputPath.slice(0, outputPath.lastIndexOf('/'))

    const data = await fs.readFile(aFilename)
    const finalData = template(data.toString())
    await fs.mkdir(outputDir, { recursive: true })
    return finalData ? fs.writeFile(outputPath, finalData) : ''
  }))
}

module.exports = build
