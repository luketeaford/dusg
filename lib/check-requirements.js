const checkRequirements = settings => {
  [
    {
      p: () => settings,
      e: 'A settings object must be provided.'
    },
    {
      p: () => settings.src,
      e: 'Settings must include a source directory.'
    },
    {
      p: () => settings.dest,
      e: 'Settings must include a destination directory.'
    },
    {
      p: () => settings.template,
      e: 'Settings must include a template function.'
    },
    {
      p: () => typeof settings.template === 'function',
      e: 'Settings must include a template that is a function.'
    }
  ].forEach(x => {
    if (Boolean(x.p()) !== true) throw Error(x.e)
  })

  return settings
}

module.exports = checkRequirements
