const fs = require('fs').promises

const getSourceFiles = async aSourceDirectory => {
  const firstPass = await fs.readdir(aSourceDirectory, { withFileTypes: true })

  const filePathReducer = (acc, cur) => {
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

module.exports = getSourceFiles
