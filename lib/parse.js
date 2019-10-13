const md = require('markdown-it')()
const yaml = require('js-yaml')

const parse = function (data) {
  const split = data.toString().split('---')
  return {
    html: md.render(split[2]),
    metadata: yaml.safeLoad(split[1])
  }
}

module.exports = parse
