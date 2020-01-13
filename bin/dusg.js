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
  const template = require(`${process.cwd()}/${cliSettings.template}`)

  build({
    src: cliSettings.src || cliSettings.s,
    dest: cliSettings.dest || cliSettings.d,
    template
  })
}
