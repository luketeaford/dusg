#!/usr/bin/env node

const manchego = require('manchego').convertBooleans
const build = require('../lib/build')
const { version } = require('../package.json')

const cliSettings = manchego(process.argv)

if (cliSettings.help || cliSettings.h) {
  const fs = require('fs').promises
  fs.readFile(`${__dirname}/../man/dusg.1`, { encoding: 'utf-8' })
    .then(console.log)
} else if (cliSettings.version || cliSettings.v) {
  console.log(version)
} else {
  const {
    src, s,
    dest, d,
    template, t,
    cleanUrls,
    extension
  } = cliSettings

  const templateFunction = template || t
    ? require(`${process.cwd()}/${template || t}`)
    : undefined

  build({
    src: src || s,
    dest: dest || d,
    template: templateFunction,
    cleanUrls,
    extension
  }).catch(err => {
    console.log(err)
    process.exitCode = 1
  })
}
