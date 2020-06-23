const checkRequirements = settings => {
  [
    {
      check: () => settings && typeof settings === 'object',
      error: 'A settings object must be provided.'
    },
    {
      check: () => settings.src && typeof settings.src === 'string',
      error: 'Settings must include a source directory string.'
    },
    {
      check: () => settings.dest && typeof settings.dest === 'string',
      error: 'Settings must include a destination directory string.'
    },
    {
      check: () => settings && typeof settings.template === 'function',
      error: 'Settings must include a template function.'
    }
  ].forEach(requirement => {
    if (Boolean(requirement.check()) !== true) throw Error(requirement.error)
  })

  return settings
}

module.exports = checkRequirements
