const titleTemplate = function (aPageObject) {
  const { metadata } = aPageObject
  return metadata && metadata.title
}

module.exports = titleTemplate
