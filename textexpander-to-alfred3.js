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

function readPlist (path, callback) {
  fs.readFile(path, 'utf-8', (err, data) => {
    callback(err, plist.parse(data))
  })
}

function transformSnippet (snippet) {
  return {
    filename: sanitize(snippet.abbreviation.slice(0, 10)) + ' [' + snippet.uuidString + '].json',
    content: JSON.stringify({
      alfredsnippet: {
        snippet: snippet.plainText,
        name: snippet.abbreviation.slice(0, 10),
        uid: snippet.uuidString,
        keyword: snippet.abbreviation
      }
    }, null, 2)
  }
}

function main () {
  readPlist(path.join(process.cwd(), program.args[0]), function (err, plist) {
    if (err) { throw err }
    const outFile = path.join(process.cwd(), (plist.groupInfo.groupName + '.alfredsnippets'))

    const output = fs.createWriteStream(outFile)
    const archive = archiver('zip')

    archive.pipe(output)

    output.on('close', function () {
      console.log(`Wrote file ${outFile}`)
    })

    plist.snippetsTE2
      .map(transformSnippet)
      .forEach(function (snippet) {
        archive.append(snippet.content, {
          name: snippet.filename
        })
      })

    archive
      .finalize()
  })
}
