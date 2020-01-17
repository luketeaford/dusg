const md = require('marked')
const yaml = require('js-yaml')

md.setOptions({
  headerIds: false
})

const parse = data => {
  const split = data.split('---')
  const yamlOutput = yaml.safeLoad(split[1])
  return {
    html: md(split[2] || data),
    metadata: yamlOutput && typeof yamlOutput === 'object' ? yamlOutput : null
  }
}

module.exports = parse
