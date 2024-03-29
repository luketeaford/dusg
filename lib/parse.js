const marked = require('marked')
const yaml = require('js-yaml')

marked.setOptions({
  headerIds: false
})

const parse = data => {
  const split = data.split('---')
  const yamlOutput = yaml.load(split[1])
  return {
    html: marked.parse(split[2] || data),
    metadata: yamlOutput && typeof yamlOutput === 'object' ? yamlOutput : null
  }
}

module.exports = parse
