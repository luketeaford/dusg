# DUSG
Deluxe Universal Site Generator
[![Build Status](https://travis-ci.com/luketeaford/dusg.svg?branch=master)](https://travis-ci.com/luketeaford/dusg)
[![Coverage Status](https://coveralls.io/repos/github/luketeaford/dusg/badge.svg)](https://coveralls.io/github/luketeaford/dusg)

## Design Goals
DUSG is a tool for generating static sites. Its primary purpose is to read a directory of source files and write files using JavaScript.

## What it Does
- [x] Use either the CLI or JavaScript API
- [x] Read markdown files in a source directory
- [x] Output files to a destination directory
- [x] Use JavaScript (no templating languages)

## Usage Examples

### Command Line Interface (CLI)

### JavaScript API
```js
const dusg = require('dusg')

const aFunction = x => {
  const { metadata, html } = x
  const { title } = metadata
  return `<!DOCTYPE html>
<title>${title}</title>
${html}`
}

dusg({
  src: './your-source-directory',
  dest: './your-destination-directory',
  template: aFunction,
})
```
