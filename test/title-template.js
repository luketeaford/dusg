const titleTemplate = aPageObject => {
  const { metadata } = aPageObject
  return metadata && metadata.title
}

module.exports = titleTemplate
