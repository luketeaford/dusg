const checkRequirements = settings => {
  [
    {
      p: () => settings,
      e: 'A settings object must be provided.'
    },
    {
      p: () => settings && settings.src,
      e: 'Settings must include a source directory.'
    },
    {
      p: () => settings && settings.dest,
      e: 'Settings must include a destination directory.'
    },
    {
      p: () => settings && settings.template,
      e: 'Settings must include a template function.'
    },
    {
      p: () => settings && typeof settings.template === 'function',
      e: 'Settings must include a template that is a function.'
    }
  ].filter(x => Boolean(x.p()) !== true)
    .map(x => x.e)
    .forEach(err => { throw Error(err) })

  return settings
}

module.exports = checkRequirements
