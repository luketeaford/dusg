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

  const makeSiteMap = (acc, cur, i, arr) => Object.assign(acc, {
    [arr[i].slice(dest.length)]: {
      ...siteObj[i]
    }
  })

  const siteMap = outputFiles.reduce(makeSiteMap, {})

  const createFile = async (aPageObject) => {
    const templateResult = template({ ...aPageObject })
    if (!templateResult) return

    if (aPageObject === '5') return
    const path = aPageObject.path
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
