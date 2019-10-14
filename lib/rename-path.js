const renamePath = function (file, settings) {
  const { useCleanUrls } = settings
  return useCleanUrls
    ? file.split('.md')[0].endsWith('index')
      ? `${file.split('.md')[0].split('/index')[0]}/index.html`
      : `${file.split('.md')[0]}/index.html`
    : file.replace('.md', '.html')
}

module.exports = renamePath
