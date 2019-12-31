const makeMapToNewPath = (src, dest, file) => x => {
  return x.slice(0, x.indexOf('/index.', x.lastIndexOf('/')) >= 0
    ? x.indexOf('/index.', x.lastIndexOf('/'))
    : x.indexOf('.', x.lastIndexOf('/'))
  )
    .concat(file)
    .replace(src, dest)
}

module.exports = makeMapToNewPath
