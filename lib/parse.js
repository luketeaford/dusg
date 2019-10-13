const md = require('markdown-it')()
const yaml = require('js-yaml')

const parse = data => {
  const split = data.split('---')
  return {
    html: md.render(split[2]),
    metadata: yaml.safeLoad(split[1])
  }
}

module.exports = parse
