const md = require('markdown-it')()
const yaml = require('js-yaml')

const parse = data => {
  const split = data.split('---')
  const yamlOutput = yaml.safeLoad(split[1])
  return {
    html: md.render(split[2] || data),
    metadata: yamlOutput && typeof yamlOutput === 'object' ? yamlOutput : null
  }
}

module.exports = parse
