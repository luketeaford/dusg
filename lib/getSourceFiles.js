const fs = require('fs').promises

const getFiles = async aSourceDirectory => {
  const pathReducer = (acc, cur) => {
    const path = `${aSourceDirectory}/${cur.name}`

    return [
      ...acc,
      cur.isDirectory() ? getFiles(path) : cur.name.endsWith('.md') && path
    ].filter(x => x)
  }

  const firstPass = await fs.readdir(aSourceDirectory, { withFileTypes: true })
  const allFiles = await Promise.all(firstPass.reduce(pathReducer, []))
  return allFiles.flat(Infinity)
}

module.exports = getFiles
