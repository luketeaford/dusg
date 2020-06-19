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
    const data = await fs.readFile(aFilename)
    return {
      ...parse(data.toString()),
      path: outputFiles[anIndex]
    }
  }

  const siteObj = await Promise.all(sourceFiles.map(parseFile))

  const makeSiteMap = (acc, cur, i, arr) => {
    const { metadata, html } = siteObj[i]
    const title = metadata && metadata.title
    const path = arr[i]

    const result = Object.assign(acc, {
      [path.slice(dest.length)]: {
        title,
        html,
        path
      }
    })

    // Debugging
    if (i === arr.length - 1 && cleanUrls) console.log(result)

    return result
  }

  const siteMap = outputFiles.reduce(makeSiteMap, {})

  const createFile = async (aFileObject) => {
    const templateResult = template({ ...aFileObject })
    if (!templateResult) return
    const path = aFileObject.path
    const outputDir = path.slice(0, path.lastIndexOf('/'))
    await fs.mkdir(outputDir, { recursive: true })
    return fs.writeFile(path, templateResult)
  }

  return Promise.all(
    siteObj
      .map(x => ({ ...x, siteMap }))
      .map(createFile)
  )
}

module.exports = async x => writeFiles(checkRequirements(x))
