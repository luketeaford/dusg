<img alt="" src="dusg-logo.png">

# DUSG
Deluxe Universal Site Generator

[![Build Status](https://travis-ci.com/luketeaford/dusg.svg?branch=master)](https://travis-ci.com/luketeaford/dusg)
[![Coverage Status](https://coveralls.io/repos/github/luketeaford/dusg/badge.svg)](https://coveralls.io/github/luketeaford/dusg)

## Design Goals
DUSG is a static site generator that uses JavaScript instead of templating languages.

## What it Does
- [x] Provides a Command Line Interface and a JavaScript API
- [x] Reads Markdown files in a source directory
- [x] Parses YAML in each file into a configurable key (default: 'metadata')
- [x] Parses Markdown in each file into a configurable key (default: 'html')
- [x] Creates an array of parsed files into a configurable key (default: 'files')
- [x] Uses a JavaScript function instead of templating languages
- [x] Writes files to a destination directory

## Installation
```bash
npm install --save-dev dusg
```

## Formatting Source Files
Source files must end with the '.md' extension. A source file may begin with YAML which should begin and end with three hyphens ('---'). Markdown within the file will be parsed and turned into HTML.

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
A suitable template function is a callback that will receive the site object as its only argument. The site object has configurable keys for html, metadata, files, path and inputPath. The html key contains the markdown parsed as HTML. The metadata key contains the YAML parsed as a JavaScript object. The files key contains an array of all source files. The path key contains the output path of the file. The inputPath key contains the inputPath of the file.

### Example Template Function
```js
const exampleTemplate = function (siteObject) {
  const { html, metadata } = siteObject
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
  - cleanUrls means each file will be written to a directory so './about-me.md' would become './about-me/index.html'. This is enabled by default.
  - htmlKey is the name of the key in the object passed to the template function. The value is the parsed Markdown. The default is 'html'.
  - metadataKey is the name of the key in the object passed to the template function. The value is the parsed YAML. The default is 'metadata'.
  - filesKey is the name of the key in the object passed to the template function. The value is an array of the source files. The default is 'files'.
  - pathKey is the name of the key in the object passed to the template function. The value is the output path. The default is 'path'.
  - inputPathKey is the name of the key in the object passed to the template function. The value is the input path. The default is 'inputPath'.
  - destKey is the name of the key in the object passed to the template function. The value is the dest path. The default is 'dest'.
  - extension is the file extension to write. The default is '.html'.
