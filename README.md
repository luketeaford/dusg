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

This will be used to generate a static page. The metadata can contain whatever you want.
```

## Writing Template Functions
A suitable template function is a callback that will receive the site object as its only argument. The site object has configurable keys for html, metadata, and files. The html key contains the markdown parsed as HTML. The metadata key contains the YAML parsed as a JavaScript object. The files key contains an array of all source files. Each file has an html, metadata and path key. The path is the path to the output file which is useful for generating navigation.

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

## Command Line Interface (CLI)
```console
# Simplest usage
dusg --src='./your-source-directory' --dest='./your-destination-directory' --template='./your-template.js'

# Aliases are supported
dusg -s './your-source-directory' -d './your-destination-directory' -t './your-template.js'

# Show detailed documentation
dusg --help
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
  - extension is the file extension to write. The default is '.html'.
