const md = require('markdown-it')()
const yaml = require('yaml-js')

const parse = data => {
  const split = data.split('---')
  return {
    html: md.render(split[2]),
    metadata: yaml.load(split[1])
  }
}

module.exports = parse
