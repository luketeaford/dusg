#!/usr/bin/env node

const manchego = require('manchego').convertBooleans
const build = require('../lib/build')

const cliSettings = manchego(process.argv)
const template = require(`${process.cwd()}/${cliSettings.template}`)

build({ ...cliSettings, template })
