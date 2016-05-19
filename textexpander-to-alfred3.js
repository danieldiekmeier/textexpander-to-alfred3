#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const sanitize = require('sanitize-filename')
const plist = require('plist')
const program = require('commander')

program
  .version('0.0.3')
  .usage('<file>')
  .option('<file>', '.textexpander source file')
  .parse(process.argv)

// show help by default
if (!process.argv.slice(2).length) {
  program.outputHelp()
} else {
  main()
}

function transformSnippet (snippet) {
  return {
    filename: sanitize(snippet.abbreviation.slice(0, 10)) + ' [' + snippet.uuidString + '].json',
    content: JSON.stringify({
      alfredsnippet: {
        snippet: snippet.plainText.replace(/%clipboard/g, '{clipboard}'),
        name: snippet.abbreviation.slice(0, 10),
        uid: snippet.uuidString,
        keyword: snippet.abbreviation
      }
    }, null, 2)
  }
}

function main () {
  let plistPath = program.args[0]
  if (!path.isAbsolute(plistPath)) {
    plistPath = path.join(process.cwd(), program.args[0])
  }

  fs.readFile(plistPath, 'utf-8', function (err, plistString) {
    if (err) { throw err }

    const basename = path.basename(program.args[0], '.textexpander')
    const outFile = path.join(process.cwd(), (basename + '.alfredsnippets'))

    const output = fs.createWriteStream(outFile)
    const archive = textexpander2Alfred(plistString)

    archive.pipe(output)

    output.on('close', function () {
      console.log(`Wrote file ${outFile}`)
    })
  })
}

function textexpander2Alfred (plistString) {
  const parsedPlist = plist.parse(plistString)

  const archive = archiver('zip')

  parsedPlist.snippetsTE2
    .map(transformSnippet)
    .forEach(function (snippet) {
      archive.append(snippet.content, {
        name: snippet.filename
      })
    })

  archive.finalize()

  return archive
}

module.exports = textexpander2Alfred
