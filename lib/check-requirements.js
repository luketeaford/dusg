const checkRequirements = function (settings) {
  const objKeys = Object.keys(settings);
  [
    { name: 'src', description: 'a source directory' },
    { name: 'dest', description: 'a destination directory' },
    { name: 'template', description: 'a template function' }
  ].filter(x => !(objKeys.includes(x.name) && settings[x.name]))
    .map(x => `Settings must include ${x.description}.`)
    .forEach(err => { throw Error(err) })

  return settings
}

module.exports = checkRequirements
