# DUSG
Deluxe Universal Site Generator

[![Build Status](https://travis-ci.com/luketeaford/dusg.svg?branch=master)](https://travis-ci.com/luketeaford/dusg)
[![Coverage Status](https://coveralls.io/repos/github/luketeaford/dusg/badge.svg)](https://coveralls.io/github/luketeaford/dusg)

## Design Goals
DUSG is a tool for generating static sites. Its primary purpose is to read a directory of source files and write files using JavaScript.

## What it Does
- [x] Provides a Command Line Interface and a JavaScript API
- [x] Reads Markdown files in a source directory
- [x] Parses YAML in each file into a configurable key (default: 'metadata')
- [x] Parses Markdown in each file into a configurable key (default: 'html')
- [x] Uses a JavaScript function instead of templating languages
- [x] Writes files to a destination directory

### Usage Guidelines
## Installation
```bash
npm install --save-dev dusg
```

### Formatting Source Files

### Writing Template Functions


### Command Line Interface (CLI)
```bash
# Simplest usage
dusg --src='./your-source-directory' --dest='./your-destination-directory' --template='./your-template.js'

# Aliases are supported
dusg -s './your-source-directory' -d './your-destination-directory' -t './your-template.js'

# Show detailed documentation
dusg --help
```

### JavaScript API
```js
const dusg = require('dusg')

const aTemplateFunction = x => {
  const { metadata, html } = x
  const { title } = metadata
  return `<!DOCTYPE html>
<title>${title}</title>
${html}`
}

dusg({
  src: './your-source-directory',
  dest: './your-destination-directory',
  template: aTemplateFunction
})
```

#### Other Options
