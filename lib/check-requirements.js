const checkRequirements = settings => {
  [
    {
      check: () => settings,
      error: 'A settings object must be provided.'
    },
    {
      check: () => settings.src,
      error: 'Settings must include a source directory.'
    },
    {
      check: () => settings.dest,
      error: 'Settings must include a destination directory.'
    },
    {
      check: () => settings.template,
      error: 'Settings must include a template function.'
    },
    {
      check: () => typeof settings.template === 'function',
      error: 'Settings must include a template that is a function.'
    }
  ].forEach(requirement => {
    if (Boolean(requirement.check()) !== true) throw Error(requirement.error)
  })

  return settings
}

module.exports = checkRequirements
