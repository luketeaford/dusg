const simpleTemplate = function (aPageObject) {
  const { metadata, html } = aPageObject
  if (metadata && metadata.private === true) return
  return `<title>${metadata && metadata.title}</title>${html}`
}

module.exports = simpleTemplate
