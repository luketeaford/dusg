<img alt="" src="dusg-logo.png">

# DUSG
Deluxe Universal Site Generator
[![Build Status](https://app.travis-ci.com/luketeaford/dusg.svg?branch=master)](https://app.travis-ci.com/luketeaford/dusg)
[![Coverage Status](https://coveralls.io/repos/github/luketeaford/dusg/badge.svg)](https://coveralls.io/github/luketeaford/dusg)

## Design Goals
DUSG is a static site generator that uses JavaScript instead of templating languages. It uses the file system instead of a database.

## What it Does
- [x] Provides a Command Line Interface and a JavaScript API
- [x] Reads Markdown files in a source directory
- [x] Parses YAML in each file into the key `metadata`
- [x] Parses Markdown in each file into the key `html`
- [x] Includes a `path` key for the output of each file
- [x] Includes a `rootRelativeUrl` key for each file
- [x] Includes a `stats` key for each file's information
- [x] Creates an array of parsed files into the key `pageObjects`
- [x] Uses a JavaScript function instead of templating languages
- [x] Writes files to a destination directory

## Installation
```bash
npm install --save-dev dusg
```

## Formatting Source Files
Source files must end with the `.md` extension. A source file may begin with YAML which should begin and end with three hyphens (`---`). Markdown within the file will be parsed and turned into HTML.

### Example Source File
```md
---
title: An Example Source File
author: Luke Teaford
---

# Hello, World!

The metadata can contain whatever you want.
```

## Writing Template Functions
A suitable template function is a callback that will receive a page object as its only argument. The page object has an `html` key that contains the markdown parsed as HTML, a `metadata` key that contains the YAML parsed as a JavaScript object, a `path` key that contains the output path of the file, and an array called `pageObjects` which contains each `pageObject`.

### Example Template Function
```js
const exampleTemplate = function (aPageObject) {
  const { html, metadata } = aPageObject
  const { title, author } = metadata
  return `<!DOCTYPE html>
<title>${title} - ${author}</title>
${html}`
}
```

## Command Line Interface
```console
# Simplest usage
npx dusg --src='./your-source' --dest='./your-destination' --template='./your-template.js'

# Aliases are supported
npx dusg -s './your-source-directory' -d './your-destination-directory' -t './your-template.js'

# Show detailed documentation
npx dusg --help
```

## JavaScript API
```js
const dusg = require('dusg')
const aTemplateFunction = require('./your-template.js')

dusg({
  src: './your-source-directory',
  dest: './your-destination-directory',
  template: aTemplateFunction
})
```

### Other Options
  - cleanUrls means each file will be written to a directory so `./about-me.md` would become `./about-me/index.html`. This is enabled by default.
  - extension is the file extension to write. The default is `.html`.

### TODO
- Document the shape of a pageObject
- Make sure this works with ES6 modules
